/**
 * API Routes for Clinical Trial Analysis
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { calculateBucher, assessHomogeneity, sensitivityAnalysis } from '../utils/statistics.js';
import {
  validateTrialData,
  validateCommonComparator,
  assessDataQuality
} from '../utils/validation.js';
import { generatePDFReport } from '../utils/pdfGenerator.js';
import { explainBucherResults, explainHomogeneity, explainSafety } from '../utils/narrativeExplainer.js';
import { extractTrialData, extractMultipleTrials } from '../utils/geminiExtractor.js';
import { extractFromPDFs } from '../utils/pdfExtractor.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'trial-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  }
});

/**
 * POST /api/analysis/compare
 * Perform indirect treatment comparison between two trials
 */
router.post('/compare', async (req, res) => {
  try {
    const { trial_a, trial_b } = req.body;

    if (!trial_a || !trial_b) {
      return res.status(400).json({
        success: false,
        error: 'Both trial_a and trial_b data are required'
      });
    }

    // Validate trial data
    const validationA = validateTrialData(trial_a);
    const validationB = validateTrialData(trial_b);

    if (!validationA.valid) {
      console.error('Trial A validation failed:', JSON.stringify(validationA.errors, null, 2));
      return res.status(400).json({
        success: false,
        error: 'Invalid trial A data',
        details: validationA.errors,
        hint: 'Please check that all required fields are present and properly formatted'
      });
    }

    if (!validationB.valid) {
      console.error('Trial B validation failed:', validationB.errors);
      return res.status(400).json({
        success: false,
        error: 'Invalid trial B data',
        details: validationB.errors,
        hint: 'Please check that all required fields are present and properly formatted'
      });
    }

    // Validate common comparator
    const comparatorCheck = validateCommonComparator(trial_a, trial_b);
    if (!comparatorCheck.valid) {
      return res.status(400).json({
        success: false,
        error: 'Trials do not share a common comparator',
        details: comparatorCheck
      });
    }

    // Assess data quality
    const qualityA = assessDataQuality(trial_a);
    const qualityB = assessDataQuality(trial_b);

    // Extract primary endpoint data
    const epA = trial_a.efficacy_outcomes.primary_endpoint_data;
    const epB = trial_b.efficacy_outcomes.primary_endpoint_data;

    // Perform Bucher indirect comparison
    const comparisonResult = calculateBucher(
      epA.hazard_ratio,
      epA.ci_lower_95,
      epA.ci_upper_95,
      epB.hazard_ratio,
      epB.ci_lower_95,
      epB.ci_upper_95
    );

    // Assess homogeneity
    const homogeneityAssessment = assessHomogeneity(
      trial_a.baseline_characteristics || {},
      trial_b.baseline_characteristics || {}
    );

    // Perform sensitivity analysis
    const sensitivityResults = sensitivityAnalysis(
      epA.hazard_ratio,
      epA.ci_lower_95,
      epA.ci_upper_95,
      epB.hazard_ratio,
      epB.ci_lower_95,
      epB.ci_upper_95
    );

    // Generate narrative explanations (default to Spanish, can be changed by query param)
    const language = req.query.lang || 'es';
    const bucherNarrative = explainBucherResults(comparisonResult, validationA.data, validationB.data, language);
    const homogeneityNarrative = explainHomogeneity(homogeneityAssessment, language);

    // Calculate safety comparison for narrative
    const safetyComparison = {
      grade_3_5_ae_difference:
        (validationA.data.safety_toxicity?.any_grade_3_5_ae_rate_exp || 0) -
        (validationB.data.safety_toxicity?.any_grade_3_5_ae_rate_exp || 0),
      discontinuation_difference:
        (validationA.data.safety_toxicity?.discontinuation_rate_exp || 0) -
        (validationB.data.safety_toxicity?.discontinuation_rate_exp || 0)
    };
    const safetyNarrative = explainSafety(safetyComparison, language);

    // Compile complete analysis
    const analysis = {
      success: true,
      timestamp: new Date().toISOString(),
      trial_a: validationA.data,
      trial_b: validationB.data,
      comparison_result: comparisonResult,
      homogeneity_assessment: homogeneityAssessment,
      sensitivity_analysis: sensitivityResults,
      data_quality: {
        trial_a: qualityA,
        trial_b: qualityB
      },
      comparator_validation: comparatorCheck,
      warnings: [
        ...(comparatorCheck.warning ? [comparatorCheck.warning] : []),
        ...(qualityA.warnings || []),
        ...(qualityB.warnings || [])
      ],
      // Add narrative explanations
      narrative_explanations: {
        language: language,
        bucher_results: bucherNarrative,
        homogeneity: homogeneityNarrative,
        safety: safetyNarrative
      }
    };

    res.json(analysis);
  } catch (error) {
    console.error('Error in analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during analysis',
      message: error.message
    });
  }
});

/**
 * POST /api/analysis/validate
 * Validate trial data without performing analysis
 */
router.post('/validate', (req, res) => {
  try {
    const { trial_data } = req.body;

    if (!trial_data) {
      return res.status(400).json({
        success: false,
        error: 'trial_data is required'
      });
    }

    const validation = validateTrialData(trial_data);
    const quality = validation.valid ? assessDataQuality(trial_data) : null;

    res.json({
      success: true,
      validation,
      data_quality: quality
    });
  } catch (error) {
    console.error('Error in validation:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during validation',
      message: error.message
    });
  }
});

/**
 * POST /api/analysis/report
 * Generate PDF report from analysis results
 */
router.post('/report', async (req, res) => {
  try {
    const { images, ...analysisData } = req.body;

    if (!analysisData || !analysisData.comparison_result) {
      return res.status(400).json({
        success: false,
        error: 'Complete analysis data is required'
      });
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="ITC_Analysis_Report_${Date.now()}.pdf"`
    );

    // Generate PDF and stream to response with images
    await generatePDFReport(analysisData, res, images || {});
  } catch (error) {
    console.error('Error generating PDF:', error);

    // If headers haven't been sent yet, send error response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Error generating PDF report',
        message: error.message
      });
    }
  }
});

/**
 * POST /api/analysis/extract
 * Extract clinical trial data from text using Gemini AI
 * Returns a proposal that the user can review and approve
 */
router.post('/extract', async (req, res) => {
  try {
    const { trial_text, trial_identifier } = req.body;

    if (!trial_text) {
      return res.status(400).json({
        success: false,
        error: 'trial_text is required'
      });
    }

    // Extract data using Gemini
    const extractionResult = await extractTrialData(
      trial_text,
      trial_identifier || 'A'
    );

    if (!extractionResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Data extraction failed',
        details: extractionResult.error
      });
    }

    // Return proposal for user review
    res.json({
      success: true,
      message: 'Data extraction proposal generated',
      proposal: {
        trial_identifier: extractionResult.trial_identifier,
        extracted_data: extractionResult.extracted_data,
        confidence_scores: extractionResult.confidence_scores,
        summary: extractionResult.summary,
        warnings: extractionResult.warnings,
        original_text_preview: extractionResult.original_text_preview
      },
      status: 'pending_approval'
    });
  } catch (error) {
    console.error('Error in extraction:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during extraction',
      message: error.message
    });
  }
});

/**
 * POST /api/analysis/extract-batch
 * Extract data from multiple trials at once
 */
router.post('/extract-batch', async (req, res) => {
  try {
    const { trials } = req.body;

    if (!trials || !Array.isArray(trials) || trials.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'trials array is required'
      });
    }

    if (trials.length > 5) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 5 trials per batch request'
      });
    }

    // Extract all trials
    const results = await extractMultipleTrials(trials);

    res.json({
      success: true,
      message: `Extracted data from ${results.length} trials`,
      results: results,
      status: 'pending_approval'
    });
  } catch (error) {
    console.error('Error in batch extraction:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during batch extraction',
      message: error.message
    });
  }
});

/**
 * POST /api/analysis/extract-pdf
 * Extract clinical trial data from uploaded PDF file(s)
 * Supports multiple files (main paper + appendices)
 */
router.post('/extract-pdf', upload.array('pdfs', 10), async (req, res) => {
  const uploadedFiles = req.files || [];

  try {
    const { trial_identifier } = req.body;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one PDF file is required'
      });
    }

    console.log(`📄 Received ${uploadedFiles.length} PDF file(s) for trial ${trial_identifier || 'A'}`);

    // Get file paths
    const pdfPaths = uploadedFiles.map(file => file.path);

    // Extract data using Gemini
    const extractionResult = await extractFromPDFs(
      pdfPaths,
      trial_identifier || 'A'
    );

    // Clean up uploaded files
    for (const file of uploadedFiles) {
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkError) {
        console.warn(`Warning: Could not delete uploaded file ${file.path}`);
      }
    }

    if (!extractionResult.success) {
      return res.status(500).json({
        success: false,
        error: 'PDF extraction failed',
        details: extractionResult.error
      });
    }

    // Return proposal for user review
    res.json({
      success: true,
      message: 'PDF extraction proposal generated',
      proposal: {
        trial_identifier: extractionResult.trial_identifier,
        extracted_data: extractionResult.extracted_data,
        confidence_scores: extractionResult.confidence_scores,
        summary: extractionResult.summary,
        warnings: extractionResult.warnings,
        files_processed: extractionResult.files_processed,
        file_names: extractionResult.file_names
      },
      status: 'pending_approval'
    });
  } catch (error) {
    console.error('Error in PDF extraction:', error);

    // Clean up uploaded files in case of error
    for (const file of uploadedFiles) {
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkError) {
        // Ignore cleanup errors
      }
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error during PDF extraction',
      message: error.message
    });
  }
});

/**
 * GET /api/analysis/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
