/**
 * API Service for PharmaComparer
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8547';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

/**
 * Analyze two clinical trials using indirect treatment comparison
 */
export async function analyzeTrials(trialA, trialB, language = 'es') {
  try {
    const response = await api.post(`/api/analysis/compare?lang=${language}`, {
      trial_a: trialA,
      trial_b: trialB
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      'Failed to analyze trials'
    );
  }
}

/**
 * Validate trial data
 */
export async function validateTrial(trialData) {
  try {
    const response = await api.post('/api/analysis/validate', {
      trial_data: trialData
    });
    return response.data;
  } catch (error) {
    console.error('Validation Error:', error);
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      'Failed to validate trial data'
    );
  }
}

/**
 * Generate and download PDF report
 */
export async function downloadPDFReport(analysisData, images = {}) {
  try {
    const payload = {
      ...analysisData,
      images: {
        forestPlot: images.forestPlotImage || null,
        safetyChart: images.safetyChartImage || null
      }
    };

    const response = await api.post('/api/analysis/report', payload, {
      responseType: 'blob'
    });

    // Create download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ITC_Analysis_Report_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      'Failed to generate PDF report'
    );
  }
}

/**
 * Extract clinical trial data from text using AI
 */
export async function extractTrialData(trialText, trialIdentifier = 'A') {
  try {
    const response = await api.post('/api/analysis/extract', {
      trial_text: trialText,
      trial_identifier: trialIdentifier
    }, {
      timeout: 60000 // 60 seconds for AI processing
    });
    return response.data;
  } catch (error) {
    console.error('Extraction Error:', error);
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      'Failed to extract trial data'
    );
  }
}

/**
 * Extract data from multiple trials at once
 */
export async function extractMultipleTrials(trials) {
  try {
    const response = await api.post('/api/analysis/extract-batch', {
      trials: trials
    }, {
      timeout: 120000 // 2 minutes for batch processing
    });
    return response.data;
  } catch (error) {
    console.error('Batch Extraction Error:', error);
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      'Failed to extract trial data'
    );
  }
}

/**
 * Extract clinical trial data from PDF file(s) using AI
 */
export async function extractTrialDataFromPDF(files, trialIdentifier = 'A') {
  try {
    const formData = new FormData();

    // Add all PDF files
    files.forEach((file) => {
      formData.append('pdfs', file);
    });

    // Add trial identifier
    formData.append('trial_identifier', trialIdentifier);

    const response = await api.post('/api/analysis/extract-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 180000 // 3 minutes for PDF processing
    });

    return response.data;
  } catch (error) {
    console.error('PDF Extraction Error:', error);
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      'Failed to extract data from PDF'
    );
  }
}

/**
 * Check API health
 */
export async function checkHealth() {
  try {
    const response = await api.get('/api/analysis/health');
    return response.data;
  } catch (error) {
    console.error('Health Check Error:', error);
    return { success: false, status: 'unhealthy' };
  }
}

export default api;
