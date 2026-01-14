/**
 * Narrative Explainer - Generates user-friendly explanations of statistical results
 * Supports Spanish and English
 */

const TRANSLATIONS = {
  es: {
    // Bucher Results
    bucherTitle: 'Comparación Indirecta Ajustada (Método de Bucher)',
    hrLabel: 'Hazard Ratio Indirecto',
    ciLabel: 'Intervalo de Confianza 95%',
    pValueLabel: 'Valor p',

    // Interpretations
    favorExperimental: 'favorece al tratamiento experimental',
    favorControl: 'favorece al tratamiento control',
    noSignificantDifference: 'no muestra diferencia significativa',

    // Statistical significance
    statisticallySignificant: 'estadísticamente significativo',
    notStatisticallySignificant: 'no estadísticamente significativo',

    // Effect sizes
    largeEffect: 'grande',
    moderateEffect: 'moderado',
    smallEffect: 'pequeño',

    // Quality
    goodQuality: 'buena calidad',
    acceptableQuality: 'calidad aceptable',
    poorQuality: 'calidad limitada',

    // Homogeneity
    homogeneous: 'homogéneas',
    someDifferences: 'algunas diferencias',
    heterogeneous: 'heterogéneas',
  },

  en: {
    // Bucher Results
    bucherTitle: 'Adjusted Indirect Comparison (Bucher Method)',
    hrLabel: 'Indirect Hazard Ratio',
    ciLabel: '95% Confidence Interval',
    pValueLabel: 'p-value',

    // Interpretations
    favorExperimental: 'favors the experimental treatment',
    favorControl: 'favors the control treatment',
    noSignificantDifference: 'shows no significant difference',

    // Statistical significance
    statisticallySignificant: 'statistically significant',
    notStatisticallySignificant: 'not statistically significant',

    // Effect sizes
    largeEffect: 'large',
    moderateEffect: 'moderate',
    smallEffect: 'small',

    // Quality
    goodQuality: 'good quality',
    acceptableQuality: 'acceptable quality',
    poorQuality: 'limited quality',

    // Homogeneity
    homogeneous: 'homogeneous',
    someDifferences: 'some differences',
    heterogeneous: 'heterogeneous',
  }
};

/**
 * Generate narrative explanation of Bucher comparison results
 */
export function explainBucherResults(comparisonResult, trialA, trialB, language = 'es') {
  const t = TRANSLATIONS[language] || TRANSLATIONS.es;
  const { hr_indirect, ci_lower_95, ci_upper_95, p_value, is_significant } = comparisonResult;

  const narrative = {
    title: t.bucherTitle,
    sections: []
  };

  // 1. Main Finding - What does the HR mean?
  const hrExplanation = explainHazardRatio(hr_indirect, ci_lower_95, ci_upper_95, is_significant, trialA, trialB, language);
  narrative.sections.push({
    title: language === 'es' ? 'Hallazgo Principal' : 'Main Finding',
    content: hrExplanation
  });

  // 2. Statistical Significance
  const significanceExplanation = explainSignificance(p_value, is_significant, language);
  narrative.sections.push({
    title: language === 'es' ? 'Significancia Estadística' : 'Statistical Significance',
    content: significanceExplanation
  });

  // 3. Effect Size
  const effectSizeExplanation = explainEffectSize(hr_indirect, language);
  narrative.sections.push({
    title: language === 'es' ? 'Magnitud del Efecto' : 'Effect Size',
    content: effectSizeExplanation
  });

  // 4. Confidence Interval Interpretation
  const ciExplanation = explainConfidenceInterval(ci_lower_95, ci_upper_95, language);
  narrative.sections.push({
    title: language === 'es' ? 'Interpretación del Intervalo de Confianza' : 'Confidence Interval Interpretation',
    content: ciExplanation
  });

  return narrative;
}

/**
 * Explain what the hazard ratio means in plain language
 */
function explainHazardRatio(hr, ci_lower, ci_upper, is_significant, trialA, trialB, language) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.es;
  const expA = trialA.arms_description.experimental_arm;
  const expB = trialB.arms_description.experimental_arm;

  if (language === 'es') {
    let explanation = `La comparación indirecta entre ${expA} y ${expB} resulta en un hazard ratio (HR) de ${hr.toFixed(3)}. `;

    if (hr < 1) {
      const reduction = ((1 - hr) * 100).toFixed(1);
      explanation += `Esto significa que ${expA} está asociado con una **reducción del ${reduction}%** en el riesgo de muerte (o progresión) comparado con ${expB}. `;
      explanation += `En otras palabras, los pacientes tratados con ${expA} tienen aproximadamente ${reduction}% menos probabilidad de experimentar el evento comparado con aquellos tratados con ${expB}.`;
    } else if (hr > 1) {
      const increase = ((hr - 1) * 100).toFixed(1);
      explanation += `Esto significa que ${expA} está asociado con un **aumento del ${increase}%** en el riesgo comparado con ${expB}. `;
      explanation += `Los pacientes con ${expA} tienen ${increase}% más probabilidad de experimentar el evento que aquellos con ${expB}.`;
    } else {
      explanation += `Esto sugiere que no hay diferencia sustancial entre ambos tratamientos en términos de eficacia.`;
    }

    return explanation;
  } else {
    let explanation = `The indirect comparison between ${expA} and ${expB} yields a hazard ratio (HR) of ${hr.toFixed(3)}. `;

    if (hr < 1) {
      const reduction = ((1 - hr) * 100).toFixed(1);
      explanation += `This means ${expA} is associated with a **${reduction}% reduction** in the risk of death (or progression) compared to ${expB}. `;
      explanation += `In other words, patients treated with ${expA} are approximately ${reduction}% less likely to experience the event compared to those treated with ${expB}.`;
    } else if (hr > 1) {
      const increase = ((hr - 1) * 100).toFixed(1);
      explanation += `This means ${expA} is associated with a **${increase}% increase** in risk compared to ${expB}. `;
      explanation += `Patients with ${expA} are ${increase}% more likely to experience the event than those with ${expB}.`;
    } else {
      explanation += `This suggests no substantial difference between the two treatments in terms of efficacy.`;
    }

    return explanation;
  }
}

/**
 * Explain statistical significance
 */
function explainSignificance(pValue, isSignificant, language) {
  if (language === 'es') {
    let explanation = `El valor p de esta comparación es ${pValue < 0.0001 ? '<0.0001' : pValue.toFixed(4)}. `;

    if (isSignificant) {
      explanation += `Como este valor es **menor que 0.05**, el resultado es **estadísticamente significativo**. `;
      explanation += `Esto significa que es muy poco probable (menos del 5%) que la diferencia observada sea simplemente debido al azar. `;
      explanation += `Tenemos evidencia estadística suficiente para concluir que existe una diferencia real entre los tratamientos.`;
    } else {
      explanation += `Como este valor es **mayor que 0.05**, el resultado **no es estadísticamente significativo**. `;
      explanation += `Esto significa que no podemos descartar que la diferencia observada sea simplemente debido al azar. `;
      explanation += `No tenemos evidencia estadística suficiente para concluir que existe una diferencia real entre los tratamientos.`;
    }

    return explanation;
  } else {
    let explanation = `The p-value for this comparison is ${pValue < 0.0001 ? '<0.0001' : pValue.toFixed(4)}. `;

    if (isSignificant) {
      explanation += `Since this value is **less than 0.05**, the result is **statistically significant**. `;
      explanation += `This means it's very unlikely (less than 5% chance) that the observed difference is simply due to chance. `;
      explanation += `We have sufficient statistical evidence to conclude there is a real difference between treatments.`;
    } else {
      explanation += `Since this value is **greater than 0.05**, the result is **not statistically significant**. `;
      explanation += `This means we cannot rule out that the observed difference is simply due to chance. `;
      explanation += `We do not have sufficient statistical evidence to conclude there is a real difference between treatments.`;
    }

    return explanation;
  }
}

/**
 * Explain effect size magnitude
 */
function explainEffectSize(hr, language) {
  const magnitude = hr < 0.7 || hr > 1.43 ? 'large' : hr < 0.85 || hr > 1.18 ? 'moderate' : 'small';

  if (language === 'es') {
    let explanation = '';

    if (magnitude === 'large') {
      explanation = `La magnitud del efecto es **grande**. Un HR de ${hr.toFixed(3)} representa una diferencia clínicamente sustancial entre los tratamientos. `;
      explanation += `Esta magnitud de efecto generalmente se considera relevante desde el punto de vista clínico y podría tener un impacto importante en la práctica médica.`;
    } else if (magnitude === 'moderate') {
      explanation = `La magnitud del efecto es **moderada**. Un HR de ${hr.toFixed(3)} representa una diferencia clínica apreciable entre los tratamientos. `;
      explanation += `Esta magnitud de efecto puede ser relevante en la toma de decisiones clínicas, aunque otros factores como la toxicidad y el coste también deben considerarse.`;
    } else {
      explanation = `La magnitud del efecto es **pequeña**. Un HR de ${hr.toFixed(3)} representa una diferencia clínica modesta entre los tratamientos. `;
      explanation += `Aunque puede ser estadísticamente significativa, su relevancia clínica debe evaluarse cuidadosamente considerando otros factores como el perfil de seguridad y el coste.`;
    }

    return explanation;
  } else {
    let explanation = '';

    if (magnitude === 'large') {
      explanation = `The effect size is **large**. An HR of ${hr.toFixed(3)} represents a clinically substantial difference between treatments. `;
      explanation += `This magnitude of effect is generally considered clinically relevant and could have an important impact on medical practice.`;
    } else if (magnitude === 'moderate') {
      explanation = `The effect size is **moderate**. An HR of ${hr.toFixed(3)} represents an appreciable clinical difference between treatments. `;
      explanation += `This magnitude of effect may be relevant in clinical decision-making, though other factors like toxicity and cost should also be considered.`;
    } else {
      explanation = `The effect size is **small**. An HR of ${hr.toFixed(3)} represents a modest clinical difference between treatments. `;
      explanation += `While it may be statistically significant, its clinical relevance should be carefully evaluated considering other factors like safety profile and cost.`;
    }

    return explanation;
  }
}

/**
 * Explain confidence interval
 */
function explainConfidenceInterval(ci_lower, ci_upper, language) {
  const crossesNull = ci_lower < 1 && ci_upper > 1;

  if (language === 'es') {
    let explanation = `El intervalo de confianza del 95% va desde ${ci_lower.toFixed(3)} hasta ${ci_upper.toFixed(3)}. `;

    if (crossesNull) {
      explanation += `**Importante**: Este intervalo cruza el valor 1.0, lo que significa que el verdadero efecto podría favorecer a cualquiera de los dos tratamientos. `;
      explanation += `Esto indica incertidumbre sobre cuál tratamiento es superior y sugiere que los resultados deben interpretarse con precaución.`;
    } else if (ci_upper < 1) {
      explanation += `Este intervalo está completamente por debajo de 1.0, lo que indica que **con 95% de confianza**, el primer tratamiento es superior al segundo. `;
      explanation += `La amplitud del intervalo (${(ci_upper - ci_lower).toFixed(3)}) refleja el nivel de precisión de nuestra estimación.`;
    } else {
      explanation += `Este intervalo está completamente por encima de 1.0, lo que indica que **con 95% de confianza**, el segundo tratamiento es superior al primero. `;
      explanation += `La amplitud del intervalo (${(ci_upper - ci_lower).toFixed(3)}) refleja el nivel de precisión de nuestra estimación.`;
    }

    // Add explanation of what 95% CI means
    explanation += `\n\nRecuerde: Un intervalo de confianza del 95% significa que si repitiéramos este análisis muchas veces con diferentes muestras, esperaríamos que el 95% de los intervalos calculados contengan el verdadero valor del efecto.`;

    return explanation;
  } else {
    let explanation = `The 95% confidence interval ranges from ${ci_lower.toFixed(3)} to ${ci_upper.toFixed(3)}. `;

    if (crossesNull) {
      explanation += `**Important**: This interval crosses 1.0, meaning the true effect could favor either treatment. `;
      explanation += `This indicates uncertainty about which treatment is superior and suggests results should be interpreted cautiously.`;
    } else if (ci_upper < 1) {
      explanation += `This interval is entirely below 1.0, indicating that **with 95% confidence**, the first treatment is superior to the second. `;
      explanation += `The width of the interval (${(ci_upper - ci_lower).toFixed(3)}) reflects the precision of our estimate.`;
    } else {
      explanation += `This interval is entirely above 1.0, indicating that **with 95% confidence**, the second treatment is superior to the first. `;
      explanation += `The width of the interval (${(ci_upper - ci_lower).toFixed(3)}) reflects the precision of our estimate.`;
    }

    // Add explanation of what 95% CI means
    explanation += `\n\nRemember: A 95% confidence interval means that if we repeated this analysis many times with different samples, we would expect 95% of the calculated intervals to contain the true effect value.`;

    return explanation;
  }
}

/**
 * Explain homogeneity assessment
 */
export function explainHomogeneity(homogeneityAssessment, language = 'es') {
  const { overall_similarity, differences } = homogeneityAssessment;

  if (language === 'es') {
    let explanation = '';

    if (overall_similarity === 'good') {
      explanation = `Las características basales de los dos ensayos son **muy similares**. `;
      explanation += `Esto fortalece la validez de la comparación indirecta, ya que estamos comparando poblaciones de pacientes parecidas. `;
      explanation += `La similitud en edad, sexo y estado funcional (ECOG) sugiere que los resultados son comparables entre estudios.`;
    } else if (overall_similarity === 'acceptable') {
      explanation = `Las características basales muestran **similitud aceptable** entre los ensayos, aunque existen algunas diferencias. `;

      if (differences && differences.length > 0) {
        explanation += `\n\nDiferencias notables:\n`;
        differences.forEach(diff => {
          explanation += `- ${diff.characteristic}: diferencia de ${Math.abs(diff.difference).toFixed(1)} unidades. `;
          if (diff.magnitude === 'large') {
            explanation += `Esta es una diferencia **sustancial** que debe considerarse al interpretar los resultados.\n`;
          }
        });
      }

      explanation += `\nEstas diferencias deben tenerse en cuenta al interpretar la comparación, ya que pueden afectar la aplicabilidad de los resultados.`;
    } else {
      explanation = `Existen **diferencias importantes** en las características basales entre los ensayos. `;
      explanation += `Esto debilita la validez de la comparación indirecta, ya que estamos comparando poblaciones potencialmente diferentes. `;

      if (differences && differences.length > 0) {
        explanation += `\n\nDiferencias importantes:\n`;
        differences.forEach(diff => {
          explanation += `- ${diff.characteristic}: diferencia de ${Math.abs(diff.difference).toFixed(1)} unidades\n`;
        });
      }

      explanation += `\n**Los resultados deben interpretarse con mucha precaución** debido a estas diferencias en las poblaciones de estudio.`;
    }

    return explanation;
  } else {
    let explanation = '';

    if (overall_similarity === 'good') {
      explanation = `The baseline characteristics of the two trials are **very similar**. `;
      explanation += `This strengthens the validity of the indirect comparison, as we are comparing similar patient populations. `;
      explanation += `The similarity in age, sex, and functional status (ECOG) suggests that results are comparable across studies.`;
    } else if (overall_similarity === 'acceptable') {
      explanation = `The baseline characteristics show **acceptable similarity** between trials, though some differences exist. `;

      if (differences && differences.length > 0) {
        explanation += `\n\nNotable differences:\n`;
        differences.forEach(diff => {
          explanation += `- ${diff.characteristic}: difference of ${Math.abs(diff.difference).toFixed(1)} units. `;
          if (diff.magnitude === 'large') {
            explanation += `This is a **substantial** difference that should be considered when interpreting results.\n`;
          }
        });
      }

      explanation += `\nThese differences should be taken into account when interpreting the comparison, as they may affect the applicability of results.`;
    } else {
      explanation = `There are **important differences** in baseline characteristics between trials. `;
      explanation += `This weakens the validity of the indirect comparison, as we are comparing potentially different populations. `;

      if (differences && differences.length > 0) {
        explanation += `\n\nImportant differences:\n`;
        differences.forEach(diff => {
          explanation += `- ${diff.characteristic}: difference of ${Math.abs(diff.difference).toFixed(1)} units\n`;
        });
      }

      explanation += `\n**Results should be interpreted with great caution** due to these differences in study populations.`;
    }

    return explanation;
  }
}

/**
 * Explain safety comparison
 */
export function explainSafety(safetyComparison, language = 'es') {
  const { grade_3_5_ae_difference, discontinuation_difference } = safetyComparison;

  if (language === 'es') {
    let explanation = 'Comparación de Seguridad:\n\n';

    if (Math.abs(grade_3_5_ae_difference) < 5) {
      explanation += `Los perfiles de seguridad son **similares** entre ambos tratamientos. `;
      explanation += `La diferencia en eventos adversos de grado 3-5 es pequeña (${Math.abs(grade_3_5_ae_difference).toFixed(1)}%), `;
      explanation += `lo que sugiere que ambos tratamientos tienen toxicidades comparables.`;
    } else if (Math.abs(grade_3_5_ae_difference) < 15) {
      explanation += `Existe una **diferencia moderada** en el perfil de seguridad. `;
      const safer = grade_3_5_ae_difference > 0 ? 'el segundo tratamiento' : 'el primer tratamiento';
      explanation += `${safer} presenta aproximadamente ${Math.abs(grade_3_5_ae_difference).toFixed(1)}% menos eventos adversos graves. `;
      explanation += `Esta diferencia debe considerarse junto con la eficacia al tomar decisiones de tratamiento.`;
    } else {
      explanation += `Existe una **diferencia significativa** en el perfil de seguridad. `;
      const safer = grade_3_5_ae_difference > 0 ? 'el segundo tratamiento' : 'el primer tratamiento';
      explanation += `${safer} presenta ${Math.abs(grade_3_5_ae_difference).toFixed(1)}% menos eventos adversos graves. `;
      explanation += `Esta diferencia sustancial en toxicidad es un factor importante a considerar en la selección del tratamiento.`;
    }

    explanation += `\n\nLa tasa de discontinuación difiere en ${Math.abs(discontinuation_difference).toFixed(1)}%, `;
    explanation += discontinuation_difference < -5 ?
      'sugiriendo que el primer tratamiento puede ser más difícil de tolerar a largo plazo.' :
      discontinuation_difference > 5 ?
      'sugiriendo que el segundo tratamiento puede ser más difícil de tolerar a largo plazo.' :
      'lo cual es una diferencia pequeña y probablemente no clínicamente relevante.';

    return explanation;
  } else {
    let explanation = 'Safety Comparison:\n\n';

    if (Math.abs(grade_3_5_ae_difference) < 5) {
      explanation += `The safety profiles are **similar** between both treatments. `;
      explanation += `The difference in grade 3-5 adverse events is small (${Math.abs(grade_3_5_ae_difference).toFixed(1)}%), `;
      explanation += `suggesting both treatments have comparable toxicities.`;
    } else if (Math.abs(grade_3_5_ae_difference) < 15) {
      explanation += `There is a **moderate difference** in the safety profile. `;
      const safer = grade_3_5_ae_difference > 0 ? 'the second treatment' : 'the first treatment';
      explanation += `${safer} shows approximately ${Math.abs(grade_3_5_ae_difference).toFixed(1)}% fewer serious adverse events. `;
      explanation += `This difference should be considered alongside efficacy when making treatment decisions.`;
    } else {
      explanation += `There is a **significant difference** in the safety profile. `;
      const safer = grade_3_5_ae_difference > 0 ? 'the second treatment' : 'the first treatment';
      explanation += `${safer} shows ${Math.abs(grade_3_5_ae_difference).toFixed(1)}% fewer serious adverse events. `;
      explanation += `This substantial difference in toxicity is an important factor to consider in treatment selection.`;
    }

    explanation += `\n\nThe discontinuation rate differs by ${Math.abs(discontinuation_difference).toFixed(1)}%, `;
    explanation += discontinuation_difference < -5 ?
      'suggesting the first treatment may be harder to tolerate long-term.' :
      discontinuation_difference > 5 ?
      'suggesting the second treatment may be harder to tolerate long-term.' :
      'which is a small difference and likely not clinically relevant.';

    return explanation;
  }
}
