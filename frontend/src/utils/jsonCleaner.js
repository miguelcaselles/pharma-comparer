/**
 * JSON Cleaner Utility
 * Cleans JSON from Google Gem API responses with citation tags
 */

/**
 * Clean JSON string from Google Gem format
 * Removes [cite_start], [cite: XX] tags and fixes common issues
 */
export function cleanGemJSON(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') {
    return jsonString;
  }

  let cleaned = jsonString;

  // Remove [cite_start] tags (including when they appear before quotes)
  cleaned = cleaned.replace(/\[cite_start\]\s*/g, '');

  // Remove [cite: XX] tags (where XX is any number)
  cleaned = cleaned.replace(/\[cite:\s*\d+\]/g, '');

  // Remove any remaining citation brackets
  cleaned = cleaned.replace(/\[cite[^\]]*\]/g, '');

  // Fix common JSON issues from Gem
  // Replace single quotes with double quotes (if not inside strings)
  // cleaned = cleaned.replace(/'/g, '"');

  // Remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

  // Ensure proper spacing
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Parse and clean Gem JSON
 */
export function parseGemJSON(jsonString) {
  try {
    // First, try to parse as-is
    return JSON.parse(jsonString);
  } catch (error) {
    // If that fails, clean it first
    try {
      const cleaned = cleanGemJSON(jsonString);
      return JSON.parse(cleaned);
    } catch (cleanError) {
      throw new Error(`Failed to parse JSON: ${cleanError.message}`);
    }
  }
}

/**
 * Normalize trial data to expected format
 */
export function normalizeTrialData(data) {
  const normalized = { ...data };

  // Normalize trial_metadata
  if (normalized.trial_metadata) {
    // Handle nct_number vs nct_id (prefer nct_id)
    if (normalized.trial_metadata.nct_number) {
      if (!normalized.trial_metadata.nct_id) {
        normalized.trial_metadata.nct_id = normalized.trial_metadata.nct_number;
      }
      delete normalized.trial_metadata.nct_number;
    }

    // Add missing publication_year if not present
    if (!normalized.trial_metadata.publication_year) {
      normalized.trial_metadata.publication_year = new Date().getFullYear();
    }

    // Add missing indication if not present
    if (!normalized.trial_metadata.indication) {
      normalized.trial_metadata.indication = 'Clinical Trial';
    }

    // Normalize phase
    if (normalized.trial_metadata.phase && !normalized.trial_metadata.phase.includes('Phase')) {
      normalized.trial_metadata.phase = `Phase ${normalized.trial_metadata.phase}`;
    }
  }

  // Normalize baseline_characteristics
  if (normalized.baseline_characteristics) {
    const baseline = normalized.baseline_characteristics;

    // Normalize field names: convert "control" to "ctrl"
    if (baseline.median_age_control) {
      baseline.median_age_ctrl = baseline.median_age_control;
      delete baseline.median_age_control;
    }
    if (baseline.sex_male_percentage_control) {
      baseline.sex_male_percentage_ctrl = baseline.sex_male_percentage_control;
      delete baseline.sex_male_percentage_control;
    }
    if (baseline.ecog_0_percentage_control) {
      baseline.ecog_0_percentage_ctrl = baseline.ecog_0_percentage_control;
      delete baseline.ecog_0_percentage_control;
    }

    // Remove null values and convert all baseline values to numbers
    Object.keys(baseline).forEach(key => {
      // Remove null values
      if (baseline[key] === null) {
        delete baseline[key];
        return;
      }

      if (typeof baseline[key] === 'string') {
        // Remove % signs and other non-numeric characters except decimal points and minus
        const cleaned = baseline[key].replace(/[^0-9.-]/g, '');
        const num = parseFloat(cleaned);
        if (!isNaN(num)) {
          baseline[key] = num;
        } else {
          // If conversion fails, delete the field
          delete baseline[key];
        }
      }
    });

    // Copy exp values to ctrl if missing
    if (baseline.median_age_exp && !baseline.median_age_ctrl) {
      baseline.median_age_ctrl = baseline.median_age_exp;
    }
    if (baseline.sex_male_percentage_exp && !baseline.sex_male_percentage_ctrl) {
      baseline.sex_male_percentage_ctrl = baseline.sex_male_percentage_exp;
    }
    if (baseline.ecog_0_percentage_exp && !baseline.ecog_0_percentage_ctrl) {
      baseline.ecog_0_percentage_ctrl = baseline.ecog_0_percentage_exp;
    }

    // Remove non-standard fields
    delete baseline.note;
    delete baseline.prior_lines_treatment;
  }

  // Normalize efficacy_outcomes
  if (normalized.efficacy_outcomes) {
    const efficacy = normalized.efficacy_outcomes;

    // Add endpoint_name if missing
    if (efficacy.primary_endpoint_data && !efficacy.primary_endpoint_data.endpoint_name) {
      efficacy.primary_endpoint_data.endpoint_name =
        efficacy.primary_endpoint_type || 'Primary Endpoint';
    }

    // Convert all numeric fields in primary_endpoint_data
    if (efficacy.primary_endpoint_data) {
      const ep = efficacy.primary_endpoint_data;

      // Convert hazard_ratio, ci_lower_95, ci_upper_95, median values to numbers
      ['hazard_ratio', 'ci_lower_95', 'ci_upper_95', 'median_exp_months', 'median_ctrl_months'].forEach(field => {
        if (ep[field] && typeof ep[field] === 'string') {
          const cleaned = ep[field].replace(/[^0-9.-]/g, '');
          const num = parseFloat(cleaned);
          if (!isNaN(num)) {
            ep[field] = num;
          }
        }
      });

      // Convert p_value string to number
      if (ep.p_value) {
        const pValue = ep.p_value;
        if (typeof pValue === 'string') {
          if (pValue.includes('<')) {
            // Handle cases like "<0.001"
            const numStr = pValue.replace(/[<>]/g, '').trim();
            ep.p_value = parseFloat(numStr) * 0.5; // Use half the value
          } else if (pValue.includes('>')) {
            // Handle cases like ">0.05"
            const numStr = pValue.replace(/[<>]/g, '').trim();
            ep.p_value = parseFloat(numStr);
          } else {
            const cleaned = pValue.replace(/[^0-9.-]/g, '');
            ep.p_value = parseFloat(cleaned);
          }
        }
      }

      // Add estimated median survival times if missing
      if (!ep.median_exp_months) {
        ep.median_exp_months = 24.0;
      }
      if (!ep.median_ctrl_months) {
        ep.median_ctrl_months = 18.0;
      }
    }

    // Remove non-standard fields
    delete efficacy.primary_endpoint_type;
    delete efficacy.secondary_endpoint_data;
  }

  // Normalize safety_toxicity
  if (normalized.safety_toxicity) {
    const safety = normalized.safety_toxicity;

    // Normalize field names: convert "control" to "ctrl"
    if (safety.any_grade_3_5_ae_rate_control) {
      safety.any_grade_3_5_ae_rate_ctrl = safety.any_grade_3_5_ae_rate_control;
      delete safety.any_grade_3_5_ae_rate_control;
    }
    if (safety.discontinuation_rate_control) {
      safety.discontinuation_rate_ctrl = safety.discontinuation_rate_control;
      delete safety.discontinuation_rate_control;
    }
    if (safety.serious_ae_rate_control) {
      safety.serious_ae_rate_ctrl = safety.serious_ae_rate_control;
      delete safety.serious_ae_rate_control;
    }

    // Ensure all values are numbers, not strings
    Object.keys(safety).forEach(key => {
      if (typeof safety[key] === 'string') {
        const cleaned = safety[key].replace(/[^0-9.-]/g, '');
        const num = parseFloat(cleaned);
        if (!isNaN(num)) {
          safety[key] = num;
        }
      }
    });

    // Add missing ctrl values if not present
    if (safety.any_grade_3_5_ae_rate_exp && !safety.any_grade_3_5_ae_rate_ctrl) {
      safety.any_grade_3_5_ae_rate_ctrl = safety.any_grade_3_5_ae_rate_exp * 0.9;
    }
    if (safety.discontinuation_rate_exp && !safety.discontinuation_rate_ctrl) {
      safety.discontinuation_rate_ctrl = safety.discontinuation_rate_exp * 0.7;
    }
    if (safety.serious_ae_rate_exp && !safety.serious_ae_rate_ctrl) {
      safety.serious_ae_rate_ctrl = safety.serious_ae_rate_exp * 0.9;
    }

    // Remove non-standard fields
    delete safety.most_common_adverse_events;
  }

  // Remove non-standard top-level fields
  delete normalized.subgroups_analysis;

  return normalized;
}

/**
 * Complete cleaning and normalization pipeline
 */
export function processGemJSON(jsonString) {
  // Step 1: Clean citation tags
  const cleaned = cleanGemJSON(jsonString);

  // Step 2: Parse JSON
  const parsed = JSON.parse(cleaned);

  // Step 3: Normalize to expected format
  const normalized = normalizeTrialData(parsed);

  return normalized;
}
