/**
 * Validation schemas and functions for clinical trial data
 */

import Joi from 'joi';

/**
 * Schema for clinical trial JSON data
 */
export const trialDataSchema = Joi.object({
  trial_metadata: Joi.object({
    trial_name: Joi.string().required(),
    nct_id: Joi.string().optional(),
    publication_year: Joi.number().optional(),
    indication: Joi.string().optional(),
    phase: Joi.string().optional()
  }).required(),

  arms_description: Joi.object({
    experimental_arm: Joi.string().required(),
    control_arm: Joi.string().required(),
    n_experimental: Joi.number().integer().positive().required(),
    n_control: Joi.number().integer().positive().required()
  }).required(),

  baseline_characteristics: Joi.object({
    median_age_exp: Joi.number().min(0).max(120).optional(),
    median_age_ctrl: Joi.number().min(0).max(120).optional(),
    sex_male_percentage_exp: Joi.number().min(0).max(100).optional(),
    sex_male_percentage_ctrl: Joi.number().min(0).max(100).optional(),
    ecog_0_percentage_exp: Joi.number().min(0).max(100).optional(),
    ecog_0_percentage_ctrl: Joi.number().min(0).max(100).optional()
  }).optional(),

  efficacy_outcomes: Joi.object({
    primary_endpoint_data: Joi.object({
      endpoint_name: Joi.string().allow('').optional().default('Primary Endpoint'),
      hazard_ratio: Joi.number().positive().required(),
      ci_lower_95: Joi.number().positive().required(),
      ci_upper_95: Joi.number().positive().required(),
      p_value: Joi.alternatives().try(
        Joi.number().min(0).max(1),
        Joi.string()
      ).optional().default(0.05),
      median_exp_months: Joi.number().positive().optional().default(24.0),
      median_ctrl_months: Joi.number().positive().optional().default(18.0)
    }).required(),
    secondary_endpoints: Joi.array().optional(),
    primary_endpoint_type: Joi.string().optional()
  }).required(),

  safety_toxicity: Joi.object({
    any_grade_3_5_ae_rate_exp: Joi.number().min(0).max(100).optional(),
    any_grade_3_5_ae_rate_ctrl: Joi.number().min(0).max(100).optional(),
    discontinuation_rate_exp: Joi.number().min(0).max(100).optional(),
    discontinuation_rate_ctrl: Joi.number().min(0).max(100).optional(),
    serious_ae_rate_exp: Joi.number().min(0).max(100).optional(),
    serious_ae_rate_ctrl: Joi.number().min(0).max(100).optional()
  }).optional()
});

/**
 * Validate trial data
 */
export function validateTrialData(data) {
  const { error, value } = trialDataSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,  // Ignore unknown fields
    convert: true        // Convert types automatically
  });

  if (error) {
    const details = error.details.map(d => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return { valid: false, errors: details };
  }

  return { valid: true, data: value };
}

/**
 * Validate that two trials share a common comparator
 */
export function validateCommonComparator(trial_a, trial_b) {
  const control_a = trial_a.arms_description.control_arm.toLowerCase();
  const control_b = trial_b.arms_description.control_arm.toLowerCase();

  // Check for common keywords
  const commonTerms = ['placebo', 'standard of care', 'soc', 'best supportive care', 'bsc'];

  const hasCommonTerm = commonTerms.some(term =>
    control_a.includes(term) && control_b.includes(term)
  );

  return {
    valid: hasCommonTerm || control_a === control_b,
    control_a: trial_a.arms_description.control_arm,
    control_b: trial_b.arms_description.control_arm,
    warning: !hasCommonTerm && control_a !== control_b
      ? 'Comparators may not be identical. Results should be interpreted with caution.'
      : null
  };
}

/**
 * Check data quality and completeness
 */
export function assessDataQuality(trial) {
  const quality = {
    score: 100,
    issues: [],
    warnings: []
  };

  // Check for missing baseline characteristics
  const baseline = trial.baseline_characteristics || {};
  const requiredBaseline = ['median_age_exp', 'sex_male_percentage_exp', 'ecog_0_percentage_exp'];
  const missingBaseline = requiredBaseline.filter(field => !baseline[field]);

  if (missingBaseline.length > 0) {
    quality.score -= 10 * missingBaseline.length;
    quality.warnings.push(`Missing baseline characteristics: ${missingBaseline.join(', ')}`);
  }

  // Check for confidence interval validity
  const ep = trial.efficacy_outcomes.primary_endpoint_data;
  if (ep.ci_lower_95 >= ep.hazard_ratio || ep.ci_upper_95 <= ep.hazard_ratio) {
    quality.score -= 30;
    quality.issues.push('Invalid confidence interval: HR not within CI bounds');
  }

  // Check for implausibly narrow or wide CIs
  const ci_width = ep.ci_upper_95 - ep.ci_lower_95;
  if (ci_width < 0.1) {
    quality.warnings.push('Unusually narrow confidence interval detected');
  } else if (ci_width > 10) {
    quality.warnings.push('Very wide confidence interval suggests high uncertainty');
  }

  // Check sample size
  const n_total = trial.arms_description.n_experimental + trial.arms_description.n_control;
  if (n_total < 50) {
    quality.score -= 20;
    quality.warnings.push('Small sample size (n < 50) may limit reliability');
  }

  return quality;
}
