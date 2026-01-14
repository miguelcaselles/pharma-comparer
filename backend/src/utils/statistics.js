/**
 * Statistical utilities for Indirect Treatment Comparison (ITC)
 * Implements rigorous Bucher method for adjusted indirect comparison
 */

import jStat from 'jstat';

/**
 * Calculate the standard normal cumulative distribution function
 */
function normCDF(z) {
  return jStat.normal.cdf(z, 0, 1);
}

/**
 * Bucher Method for Adjusted Indirect Comparison
 *
 * Performs an indirect comparison between two treatments (A and B)
 * that have both been compared to a common comparator (e.g., placebo).
 *
 * Mathematical Foundation:
 * - Uses logarithmic transformation of hazard ratios
 * - Derives standard errors from confidence intervals
 * - Combines estimates using variance pooling
 * - Applies Wald test for statistical significance
 *
 * @param {number} hr_a - Hazard ratio for treatment A vs comparator
 * @param {number} low_a - Lower 95% CI for treatment A
 * @param {number} up_a - Upper 95% CI for treatment A
 * @param {number} hr_b - Hazard ratio for treatment B vs comparator
 * @param {number} low_b - Lower 95% CI for treatment B
 * @param {number} up_b - Upper 95% CI for treatment B
 *
 * @returns {Object} Results containing HR, CI, p-value, and interpretation
 */
export function calculateBucher(hr_a, low_a, up_a, hr_b, low_b, up_b) {
  // Step 1: Natural logarithms of hazard ratios
  const ln_hr_a = Math.log(hr_a);
  const ln_hr_b = Math.log(hr_b);

  // Step 2: Standard Errors (SE) derived from 95% confidence intervals
  // Formula: SE = (ln(upper) - ln(lower)) / 3.92
  // where 3.92 = 2 * 1.96 (z-score for 95% CI)
  const se_a = (Math.log(up_a) - Math.log(low_a)) / 3.92;
  const se_b = (Math.log(up_b) - Math.log(low_b)) / 3.92;

  // Step 3: Logarithmic difference (indirect comparison)
  const diff_ln_hr = ln_hr_a - ln_hr_b;

  // Step 4: Combined Standard Error (variance pooling)
  // SE_diff = sqrt(SE_A^2 + SE_B^2)
  const se_diff = Math.sqrt(se_a ** 2 + se_b ** 2);

  // Step 5: Recalculate HR and 95% CI for indirect comparison
  const hr_indirect = Math.exp(diff_ln_hr);
  const ci_low_indirect = Math.exp(diff_ln_hr - 1.96 * se_diff);
  const ci_up_indirect = Math.exp(diff_ln_hr + 1.96 * se_diff);

  // Step 6: Statistical significance (Two-sided Wald test)
  const z_score = diff_ln_hr / se_diff;
  const p_value = 2 * (1 - normCDF(Math.abs(z_score)));

  // Step 7: Interpretation
  const is_significant = p_value < 0.05;
  const favors = hr_indirect < 1 ? 'A' : 'B';
  const effect_size = Math.abs(1 - hr_indirect);

  return {
    hr_indirect: parseFloat(hr_indirect.toFixed(4)),
    ci_lower_95: parseFloat(ci_low_indirect.toFixed(4)),
    ci_upper_95: parseFloat(ci_up_indirect.toFixed(4)),
    z_score: parseFloat(z_score.toFixed(4)),
    p_value: parseFloat(p_value.toFixed(6)),
    is_significant,
    favors,
    effect_size: parseFloat(effect_size.toFixed(4)),
    interpretation: interpretResults(hr_indirect, ci_low_indirect, ci_up_indirect, p_value)
  };
}

/**
 * Interpret the statistical results in clinical terms
 */
function interpretResults(hr, ci_low, ci_up, p_value) {
  let interpretation = '';

  // Check if CI crosses 1 (null hypothesis)
  const crosses_null = ci_low < 1 && ci_up > 1;

  if (crosses_null) {
    interpretation = 'No statistically significant difference detected. The confidence interval crosses 1.0, indicating uncertainty in the direction of effect.';
  } else if (hr < 1) {
    const reduction = ((1 - hr) * 100).toFixed(1);
    interpretation = `Treatment A shows a ${reduction}% relative risk reduction compared to Treatment B. `;
    interpretation += p_value < 0.05
      ? 'This difference is statistically significant (p < 0.05).'
      : 'However, this difference is not statistically significant.';
  } else {
    const increase = ((hr - 1) * 100).toFixed(1);
    interpretation = `Treatment B shows a ${increase}% relative benefit compared to Treatment A. `;
    interpretation += p_value < 0.05
      ? 'This difference is statistically significant (p < 0.05).'
      : 'However, this difference is not statistically significant.';
  }

  return interpretation;
}

/**
 * Calculate heterogeneity assessment
 * Evaluates similarity between baseline characteristics
 */
export function assessHomogeneity(baseline_a, baseline_b) {
  const checks = [];

  // Age difference
  if (baseline_a.median_age_exp && baseline_b.median_age_exp) {
    const age_diff = Math.abs(baseline_a.median_age_exp - baseline_b.median_age_exp);
    checks.push({
      characteristic: 'Median Age',
      value_a: baseline_a.median_age_exp,
      value_b: baseline_b.median_age_exp,
      difference: age_diff,
      acceptable: age_diff < 5,
      comment: age_diff < 5 ? 'Similar' : 'Notable difference (>5 years)'
    });
  }

  // Sex distribution
  if (baseline_a.sex_male_percentage_exp && baseline_b.sex_male_percentage_exp) {
    const sex_diff = Math.abs(baseline_a.sex_male_percentage_exp - baseline_b.sex_male_percentage_exp);
    checks.push({
      characteristic: 'Male %',
      value_a: baseline_a.sex_male_percentage_exp,
      value_b: baseline_b.sex_male_percentage_exp,
      difference: sex_diff,
      acceptable: sex_diff < 10,
      comment: sex_diff < 10 ? 'Similar' : 'Notable difference (>10%)'
    });
  }

  // ECOG performance status
  if (baseline_a.ecog_0_percentage_exp && baseline_b.ecog_0_percentage_exp) {
    const ecog_diff = Math.abs(baseline_a.ecog_0_percentage_exp - baseline_b.ecog_0_percentage_exp);
    checks.push({
      characteristic: 'ECOG 0 %',
      value_a: baseline_a.ecog_0_percentage_exp,
      value_b: baseline_b.ecog_0_percentage_exp,
      difference: ecog_diff,
      acceptable: ecog_diff < 15,
      comment: ecog_diff < 15 ? 'Similar' : 'Notable difference (>15%)'
    });
  }

  const all_acceptable = checks.every(c => c.acceptable);

  return {
    checks,
    overall_assessment: all_acceptable ? 'ACCEPTABLE' : 'CAUTION',
    recommendation: all_acceptable
      ? 'Populations are sufficiently similar for indirect comparison.'
      : 'Notable differences exist. Results should be interpreted with caution.'
  };
}

/**
 * Calculate Number Needed to Treat (NNT) from hazard ratios
 * Provides clinically meaningful interpretation
 */
export function calculateNNT(hr, median_survival_months, timeframe_months = 12) {
  // Convert HR to approximate risk reduction at specific timeframe
  // Using exponential survival model: S(t) = exp(-λt)
  const lambda_control = -Math.log(0.5) / median_survival_months;
  const lambda_treatment = lambda_control * hr;

  const survival_control = Math.exp(-lambda_control * timeframe_months);
  const survival_treatment = Math.exp(-lambda_treatment * timeframe_months);

  const absolute_risk_reduction = (1 - survival_control) - (1 - survival_treatment);

  if (absolute_risk_reduction <= 0) {
    return null; // No benefit or harm
  }

  const nnt = 1 / absolute_risk_reduction;

  return {
    nnt: Math.round(nnt),
    arr: (absolute_risk_reduction * 100).toFixed(2),
    timeframe: timeframe_months,
    interpretation: `Approximately ${Math.round(nnt)} patients need to be treated for ${timeframe_months} months to prevent one additional event.`
  };
}

/**
 * Perform sensitivity analysis by varying confidence intervals
 */
export function sensitivityAnalysis(hr_a, low_a, up_a, hr_b, low_b, up_b) {
  const scenarios = [
    { name: 'Base Case', multiplier: 1.0 },
    { name: 'Narrow CI (Conservative)', multiplier: 0.8 },
    { name: 'Wide CI (Liberal)', multiplier: 1.2 }
  ];

  return scenarios.map(scenario => {
    const adjusted_low_a = hr_a - (hr_a - low_a) * scenario.multiplier;
    const adjusted_up_a = hr_a + (up_a - hr_a) * scenario.multiplier;
    const adjusted_low_b = hr_b - (hr_b - low_b) * scenario.multiplier;
    const adjusted_up_b = hr_b + (up_b - hr_b) * scenario.multiplier;

    const results = calculateBucher(
      hr_a, adjusted_low_a, adjusted_up_a,
      hr_b, adjusted_low_b, adjusted_up_b
    );

    return {
      scenario: scenario.name,
      ...results
    };
  });
}
