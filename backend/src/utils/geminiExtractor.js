/**
 * Gemini AI Service for Clinical Trial Data Extraction
 * Uses Google's Gemini API to extract structured data from clinical trial documents
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Schema definition for clinical trial data
 * This helps Gemini understand what data to extract
 */
const TRIAL_DATA_SCHEMA = {
  trial_name: "string - Name of the clinical trial",
  experimental_treatment: "string - Name of experimental treatment",
  comparator_treatment: "string - Name of comparator treatment (control)",
  study_type: "string - Type of study (e.g., Phase III RCT)",
  sample_size_exp: "number - Sample size experimental arm",
  sample_size_comp: "number - Sample size comparator arm",
  baseline_characteristics: {
    median_age_exp: "number - Median age experimental arm",
    median_age_comp: "number - Median age comparator arm",
    male_percentage_exp: "number - Male percentage experimental arm",
    male_percentage_comp: "number - Male percentage comparator arm",
    ecog_0_1_exp: "number - ECOG 0-1 percentage experimental arm",
    ecog_0_1_comp: "number - ECOG 0-1 percentage comparator arm"
  },
  efficacy_outcomes: {
    primary_endpoint: "string - Primary endpoint name",
    primary_endpoint_data: {
      hazard_ratio: "number - Hazard ratio",
      ci_lower_95: "number - Lower 95% CI",
      ci_upper_95: "number - Upper 95% CI",
      p_value: "number - P-value"
    },
    median_followup_months: "number - Median follow-up in months"
  },
  safety_toxicity: {
    any_grade_3_5_ae_rate_exp: "number - Grade 3-5 AE rate experimental (%)",
    any_grade_3_5_ae_rate_comp: "number - Grade 3-5 AE rate comparator (%)",
    discontinuation_rate_exp: "number - Discontinuation rate experimental (%)",
    discontinuation_rate_comp: "number - Discontinuation rate comparator (%)"
  }
};

/**
 * Extract clinical trial data from text using Gemini
 * @param {string} trialText - Text content of the clinical trial (abstract, paper, etc.)
 * @param {string} trialIdentifier - Optional identifier (A or B) for the trial
 * @returns {Promise<Object>} - Extracted trial data with proposal
 */
export async function extractTrialData(trialText, trialIdentifier = 'A') {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured in environment variables');
    }

    // Use Gemini Pro model - using gemini-pro for text extraction
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create detailed prompt for extraction
    const prompt = `You are a medical data extraction specialist. Extract structured data from the following clinical trial information.

CLINICAL TRIAL TEXT:
${trialText}

REQUIRED DATA SCHEMA:
${JSON.stringify(TRIAL_DATA_SCHEMA, null, 2)}

INSTRUCTIONS:
1. Extract all available data that matches the schema
2. For missing data, use null (not 0 or empty string)
3. Be precise with numerical values (hazard ratios, confidence intervals, percentages)
4. Identify the primary endpoint clearly
5. Extract safety data carefully
6. If percentages are not explicitly stated, calculate them from raw numbers if available
7. Return ONLY valid JSON, no additional text or markdown

IMPORTANT:
- Use decimal format for percentages (e.g., 45.2 for 45.2%, not 0.452)
- Hazard ratios are typically between 0.1 and 10
- Confidence intervals: ci_lower < hazard_ratio < ci_upper
- P-values are between 0 and 1

Return the extracted data as a JSON object matching the schema exactly.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const extractedText = response.text();

    // Parse JSON response
    let extractedData;
    try {
      // Remove markdown code blocks if present
      const cleanedText = extractedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      extractedData = JSON.parse(cleanedText);
    } catch (parseError) {
      throw new Error(`Failed to parse Gemini response as JSON: ${parseError.message}`);
    }

    // Generate confidence scores for extracted data
    const confidenceScores = assessExtractionConfidence(extractedData);

    // Generate extraction summary
    const summary = generateExtractionSummary(extractedData, trialIdentifier);

    return {
      success: true,
      trial_identifier: trialIdentifier,
      extracted_data: extractedData,
      confidence_scores: confidenceScores,
      summary: summary,
      warnings: identifyDataWarnings(extractedData),
      original_text_preview: trialText.substring(0, 500) + '...'
    };

  } catch (error) {
    console.error('Gemini extraction error:', error);
    return {
      success: false,
      error: error.message,
      trial_identifier: trialIdentifier
    };
  }
}

/**
 * Assess confidence in extracted data
 * @param {Object} data - Extracted trial data
 * @returns {Object} - Confidence scores for different sections
 */
function assessExtractionConfidence(data) {
  const scores = {
    overall: 0,
    basic_info: 0,
    baseline: 0,
    efficacy: 0,
    safety: 0
  };

  // Basic info confidence
  let basicFields = 0;
  let basicFilled = 0;
  const basicChecks = [
    'trial_name', 'experimental_treatment', 'comparator_treatment',
    'study_type', 'sample_size_exp', 'sample_size_comp'
  ];
  basicChecks.forEach(field => {
    basicFields++;
    if (data[field] !== null && data[field] !== undefined && data[field] !== '') {
      basicFilled++;
    }
  });
  scores.basic_info = Math.round((basicFilled / basicFields) * 100);

  // Baseline confidence
  if (data.baseline_characteristics) {
    const baselineFields = Object.keys(data.baseline_characteristics).length;
    const baselineFilled = Object.values(data.baseline_characteristics)
      .filter(v => v !== null && v !== undefined).length;
    scores.baseline = Math.round((baselineFilled / baselineFields) * 100);
  }

  // Efficacy confidence
  if (data.efficacy_outcomes?.primary_endpoint_data) {
    const efficacyData = data.efficacy_outcomes.primary_endpoint_data;
    const efficacyFields = Object.keys(efficacyData).length;
    const efficacyFilled = Object.values(efficacyData)
      .filter(v => v !== null && v !== undefined).length;
    scores.efficacy = Math.round((efficacyFilled / efficacyFields) * 100);
  }

  // Safety confidence
  if (data.safety_toxicity) {
    const safetyFields = Object.keys(data.safety_toxicity).length;
    const safetyFilled = Object.values(data.safety_toxicity)
      .filter(v => v !== null && v !== undefined).length;
    scores.safety = Math.round((safetyFilled / safetyFields) * 100);
  }

  // Overall confidence
  scores.overall = Math.round(
    (scores.basic_info + scores.baseline + scores.efficacy + scores.safety) / 4
  );

  return scores;
}

/**
 * Generate human-readable summary of extraction
 * @param {Object} data - Extracted trial data
 * @param {string} identifier - Trial identifier
 * @returns {Object} - Summary in multiple languages
 */
function generateExtractionSummary(data, identifier) {
  const summary = {
    en: '',
    es: ''
  };

  // English summary
  summary.en = `Trial ${identifier}: "${data.trial_name || 'Unknown'}" comparing ${data.experimental_treatment || 'experimental'} vs ${data.comparator_treatment || 'comparator'}. `;

  if (data.efficacy_outcomes?.primary_endpoint_data?.hazard_ratio) {
    const hr = data.efficacy_outcomes.primary_endpoint_data.hazard_ratio;
    summary.en += `Hazard ratio: ${hr.toFixed(2)} (${data.efficacy_outcomes.primary_endpoint_data.ci_lower_95?.toFixed(2)}-${data.efficacy_outcomes.primary_endpoint_data.ci_upper_95?.toFixed(2)}). `;
  }

  summary.en += `Sample size: ${data.sample_size_exp || '?'} (exp) vs ${data.sample_size_comp || '?'} (comp).`;

  // Spanish summary
  summary.es = `Ensayo ${identifier}: "${data.trial_name || 'Desconocido'}" comparando ${data.experimental_treatment || 'experimental'} vs ${data.comparator_treatment || 'comparador'}. `;

  if (data.efficacy_outcomes?.primary_endpoint_data?.hazard_ratio) {
    const hr = data.efficacy_outcomes.primary_endpoint_data.hazard_ratio;
    summary.es += `Hazard ratio: ${hr.toFixed(2)} (${data.efficacy_outcomes.primary_endpoint_data.ci_lower_95?.toFixed(2)}-${data.efficacy_outcomes.primary_endpoint_data.ci_upper_95?.toFixed(2)}). `;
  }

  summary.es += `Tamaño muestral: ${data.sample_size_exp || '?'} (exp) vs ${data.sample_size_comp || '?'} (comp).`;

  return summary;
}

/**
 * Identify potential warnings in extracted data
 * @param {Object} data - Extracted trial data
 * @returns {Array} - Array of warning messages
 */
function identifyDataWarnings(data) {
  const warnings = [];

  // Check for missing critical data
  if (!data.trial_name) {
    warnings.push({ type: 'missing', field: 'trial_name', message: 'Trial name not found' });
  }

  if (!data.experimental_treatment || !data.comparator_treatment) {
    warnings.push({ type: 'missing', field: 'treatments', message: 'Treatment names incomplete' });
  }

  // Check efficacy data
  if (!data.efficacy_outcomes?.primary_endpoint_data?.hazard_ratio) {
    warnings.push({ type: 'critical', field: 'hazard_ratio', message: 'Hazard ratio not found - required for analysis' });
  }

  // Check confidence intervals
  const ep = data.efficacy_outcomes?.primary_endpoint_data;
  if (ep) {
    if (ep.hazard_ratio && (!ep.ci_lower_95 || !ep.ci_upper_95)) {
      warnings.push({ type: 'missing', field: 'confidence_intervals', message: 'Confidence intervals incomplete' });
    }

    // Validate CI logic
    if (ep.ci_lower_95 && ep.ci_upper_95 && ep.hazard_ratio) {
      if (ep.ci_lower_95 > ep.hazard_ratio || ep.hazard_ratio > ep.ci_upper_95) {
        warnings.push({ type: 'validation', field: 'confidence_intervals', message: 'Confidence intervals may be incorrect (HR not between CI bounds)' });
      }
    }

    // Check for unrealistic values
    if (ep.hazard_ratio && (ep.hazard_ratio < 0.01 || ep.hazard_ratio > 100)) {
      warnings.push({ type: 'validation', field: 'hazard_ratio', message: 'Hazard ratio value seems unrealistic' });
    }
  }

  // Check sample sizes
  if (!data.sample_size_exp || !data.sample_size_comp) {
    warnings.push({ type: 'missing', field: 'sample_sizes', message: 'Sample sizes incomplete' });
  }

  return warnings;
}

/**
 * Batch extract data from multiple trials
 * @param {Array} trials - Array of {text, identifier} objects
 * @returns {Promise<Array>} - Array of extraction results
 */
export async function extractMultipleTrials(trials) {
  const results = [];

  for (const trial of trials) {
    const result = await extractTrialData(trial.text, trial.identifier);
    results.push(result);

    // Add small delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

export default {
  extractTrialData,
  extractMultipleTrials
};
