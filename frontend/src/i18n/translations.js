/**
 * Translations for the PharmaComparer application
 */

export const translations = {
  es: {
    // Header
    appName: 'PharmaComparer',
    tagline: 'Análisis Profesional de Comparación Indirecta de Tratamientos',

    // Hero Section
    heroTitle: 'Análisis ITC de Ensayos Clínicos',
    heroSubtitle: 'Comparación indirecta profesional de tratamientos usando el método de Bucher. Carga tus datos de ensayos y genera análisis estadísticos completos con informes listos para publicación.',

    // Data Input
    instructions: 'Instrucciones',
    instructionsList: [
      'Pega datos JSON de ensayos clínicos (incluyendo de la API de Google Gem)',
      'Las etiquetas de citación como [cite_start] y [cite: XX] se limpiarán automáticamente',
      'Ambos ensayos deben comparar su brazo experimental con un comparador común (ej. placebo)',
      'El JSON se validará y normalizará automáticamente mientras escribes',
      'Haz clic en "Cargar Ejemplo" para ver el formato requerido'
    ],
    trialA: 'Ensayo A',
    trialB: 'Ensayo B',
    invalidJson: 'JSON inválido',
    trialInfo: 'Información del Ensayo',
    autoCleaned: 'Auto-limpiado',
    unknownTrial: 'Ensayo Desconocido',
    unknownArm: 'Brazo Desconocido',
    loadExampleData: 'Cargar Datos de Ejemplo',
    runAnalysis: 'Ejecutar Análisis',
    validating: 'Validando...',
    pasteTrialJson: 'Pega el JSON del Ensayo {letter} aquí...',

    // Loading
    performingAnalysis: 'Realizando análisis estadístico...',
    mayTakeMoments: 'Esto puede tomar unos momentos',

    // Results
    analysisResults: 'Resultados del Análisis',
    downloadPdfReport: 'Descargar Informe PDF',
    downloading: 'Descargando...',
    newAnalysis: 'Nuevo Análisis',
    keyFinding: 'Hallazgo Principal',
    indirectComparison: 'Comparación indirecta entre',
    and: 'y',
    hazardRatio: 'Hazard Ratio',
    confidenceInterval: 'Intervalo de Confianza 95%',
    pValue: 'Valor p',
    statisticallySignificant: 'Estadísticamente Significativo',
    notStatisticallySignificant: 'No Estadísticamente Significativo',
    favors: 'Favorece',

    // Warnings
    warnings: 'Advertencias',

    // Sections
    trialOverview: 'Resumen de Ensayos',
    forestPlot: 'Gráfico de Bosque (Forest Plot)',
    forestPlotDesc: 'Representación visual de hazard ratios con intervalos de confianza del 95%',
    homogeneityAssessment: 'Evaluación de Homogeneidad',
    homogeneityDesc: 'Evaluación de la similitud de características basales entre ensayos',
    safetyTolerability: 'Seguridad y Tolerabilidad',
    safetyDesc: 'Perfil de seguridad comparativo (solo análisis descriptivo)',
    sensitivityAnalysis: 'Análisis de Sensibilidad',
    sensitivityDesc: 'Pruebas de robustez bajo diferentes supuestos',
    dataQuality: 'Calidad de Datos',

    // Comparison Table
    characteristic: 'Característica',
    trial: 'Ensayo',
    trialName: 'Nombre del Ensayo',
    nctId: 'ID NCT',
    phase: 'Fase',
    indication: 'Indicación',
    experimentalArm: 'Brazo Experimental',
    controlArm: 'Brazo Control',
    sampleSize: 'Tamaño de Muestra',
    primaryEndpoint: 'Endpoint Primario',
    medianSurvival: 'Supervivencia Mediana',
    months: 'meses',

    // Homogeneity Table
    baselineChar: 'Característica Basal',
    difference: 'Diferencia',
    assessment: 'Evaluación',
    medianAge: 'Edad Mediana',
    maleSex: 'Sexo Masculino %',
    ecogStatus: 'Estado ECOG 0 %',
    similar: 'Similar',
    acceptable: 'Aceptable',
    different: 'Diferente',
    overallSimilarity: 'Similitud General',
    good: 'Buena',
    acceptableQuality: 'Aceptable',
    poor: 'Limitada',

    // Safety Comparison
    adverseEvent: 'Evento Adverso',
    experimental: 'Experimental',
    control: 'Control',
    grade35AE: 'EA Grado 3-5 (%)',
    discontinuationRate: 'Tasa de Discontinuación (%)',
    seriousAE: 'EA Serios (%)',

    // Sensitivity Analysis
    scenario: 'Escenario',
    baseCase: 'Caso Base',
    lowerBoundCI: 'Límite Inferior IC',
    upperBoundCI: 'Límite Superior IC',

    // Data Quality
    qualityScore: 'Puntuación de Calidad',
    issues: 'Problemas',
    noIssues: 'Sin problemas identificados',
    dataQualityAssessment: 'Evaluación de Calidad de Datos',
    generatingPdf: 'Generando PDF...',
    significant: 'Significativo',

    // Detailed Explanations
    forestPlotExplanation: {
      title: '¿Cómo interpretar este gráfico?',
      whatIsIt: '**¿Qué muestra este gráfico?**\n\nEl gráfico de bosque muestra visualmente los Hazard Ratios (HR) de cada ensayo y la comparación indirecta entre los tratamientos experimentales. Cada línea horizontal representa un intervalo de confianza del 95%.',
      howToRead: '**¿Cómo leer el Hazard Ratio?**\n\n• HR < 1.0: Favorece al primer tratamiento (menor riesgo de evento)\n• HR = 1.0: No hay diferencia entre tratamientos\n• HR > 1.0: Favorece al segundo tratamiento\n\nPor ejemplo, un HR de 0.70 significa que el riesgo de evento es 30% menor con el primer tratamiento.',
      confidenceInterval: '**¿Qué significa el Intervalo de Confianza?**\n\nEl intervalo de confianza del 95% representa el rango donde probablemente se encuentra el verdadero HR. Si el intervalo cruza 1.0, la diferencia no es estadísticamente significativa.\n\n• IC que NO cruza 1.0: Diferencia estadísticamente significativa\n• IC que SÍ cruza 1.0: Diferencia no significativa',
      clinicalImplications: '**Implicaciones Clínicas**\n\nUn resultado estadísticamente significativo sugiere una diferencia real entre tratamientos. Sin embargo, la relevancia clínica debe considerar:\n\n• Magnitud del efecto (qué tan grande es la diferencia)\n• Perfil de seguridad de cada tratamiento\n• Características de los pacientes\n• Contexto clínico específico'
    },
    homogeneityExplanation: {
      title: '¿Por qué es importante la similitud entre ensayos?',
      whatIsIt: '**¿Qué evalúa esta sección?**\n\nLa comparación indirecta asume que los ensayos son suficientemente similares para hacer una comparación válida. Esta tabla evalúa las características basales de los pacientes en ambos ensayos.',
      howToRead: '**¿Cómo interpretar las diferencias?**\n\n• **Similar**: Las poblaciones son muy comparables (diferencia < 5%)\n• **Aceptable**: Hay diferencias menores pero la comparación sigue siendo válida (5-15%)\n• **Diferente**: Diferencias importantes que pueden afectar la validez (> 15%)',
      implications: '**Implicaciones para la Validez**\n\nMayor similitud entre ensayos = Mayor confianza en los resultados\n\nSi los ensayos son muy diferentes en características basales, los resultados de la comparación indirecta deben interpretarse con cautela, ya que las diferencias podrían deberse a las poblaciones estudiadas en lugar del tratamiento.'
    },
    safetyExplanation: {
      title: '¿Cómo interpretar los datos de seguridad?',
      whatIsIt: '**¿Qué muestra esta comparación?**\n\nEsta sección presenta un análisis descriptivo de los eventos adversos reportados en cada ensayo. IMPORTANTE: No se aplica estadística de comparación indirecta a los datos de seguridad.',
      howToRead: '**¿Cómo leer las tasas de eventos?**\n\n• **EA Grado 3-5**: Eventos adversos moderados a severos (más graves)\n• **Tasa de Discontinuación**: Porcentaje de pacientes que dejaron el tratamiento debido a efectos secundarios\n• **EA Serios**: Eventos adversos que requieren hospitalización o ponen en riesgo la vida',
      implications: '**Consideraciones Importantes**\n\nLas diferencias en seguridad entre ensayos pueden deberse a:\n\n• Diferencias reales en el perfil de seguridad de los tratamientos\n• Métodos diferentes de reporte de eventos\n• Poblaciones de pacientes diferentes\n• Duración diferente del seguimiento\n\nEsta comparación es solo descriptiva y debe interpretarse con precaución.'
    },
    sensitivityExplanation: {
      title: '¿Qué es el análisis de sensibilidad?',
      whatIsIt: '**¿Para qué sirve este análisis?**\n\nEl análisis de sensibilidad prueba qué tan robustos son los resultados bajo diferentes supuestos estadísticos. Si los resultados son consistentes en diferentes escenarios, aumenta nuestra confianza en las conclusiones.',
      howToRead: '**¿Cómo interpretar los escenarios?**\n\n• **Caso Base**: Análisis principal con supuestos estándar\n• **Límite Inferior IC**: Escenario conservador (peor caso)\n• **Límite Superior IC**: Escenario optimista (mejor caso)\n\nSi todos los escenarios muestran resultados similares, los hallazgos son robustos.',
      implications: '**Implicaciones de Consistencia**\n\n• Resultados consistentes = Mayor confianza en las conclusiones\n• Resultados variables = Interpretación más cautelosa necesaria\n• Si el intervalo de confianza cambia de significativo a no significativo entre escenarios, indica incertidumbre'
    },

    // Footer
    allRightsReserved: 'Todos los derechos reservados',
    forResearchPurposes: 'Para fines de investigación y educación',

    // Errors
    errorOccurred: 'Ocurrió un error durante el análisis',
    close: 'Cerrar',
    error: 'Error',

    // AI Extractor
    extractorTitle: 'Extractor IA - Ensayo',
    extractorSubtitle: 'Pega el texto del ensayo clínico y la IA extraerá automáticamente los datos estructurados',
    extractorInputLabel: 'Texto del Ensayo Clínico',
    extractorInputPlaceholder: 'Pega aquí el abstract, paper o descripción del ensayo clínico...\n\nEjemplo:\n"El estudio KEYNOTE-189 fue un ensayo de fase III que evaluó pembrolizumab + quimioterapia vs placebo + quimioterapia en NSCLC no escamoso. El hazard ratio para supervivencia global fue 0.49 (IC 95%: 0.38-0.64, p<0.001)..."',
    extractorExtracting: 'Extrayendo datos...',
    extractorExtractButton: 'Extraer con IA',
    extractorClearButton: 'Limpiar',
    extractorProposalTitle: 'Propuesta de Extracción',
    extractorConfidenceScores: 'Puntuaciones de Confianza',
    extractorConfidence_overall: 'General',
    extractorConfidence_basic_info: 'Info Básica',
    extractorConfidence_baseline: 'Basal',
    extractorConfidence_efficacy: 'Eficacia',
    extractorConfidence_safety: 'Seguridad',
    extractorWarnings: 'Advertencias',
    extractorDataPreview: 'Vista Previa de Datos',
    extractorViewFullData: 'Ver datos completos',
    extractorApproveButton: 'Aprobar y Usar Datos',
    extractorRejectButton: 'Rechazar y Modificar',
    extractorErrorEmptyText: 'Por favor ingresa el texto del ensayo clínico',
    extractorErrorGeneric: 'Error al extraer los datos. Por favor intenta de nuevo.',
    extractorErrorNoFiles: 'Por favor selecciona al menos un archivo PDF',
    extractorFileMode: 'Subir PDF',
    extractorTextMode: 'Texto',
    extractorUploadLabel: 'Subir Documentos del Ensayo (PDF)',
    extractorClickToUpload: 'Haz clic para seleccionar archivos PDF',
    extractorPDFSupport: 'Soporta múltiples archivos (paper principal + apéndices)',
    extractorSelectedFiles: 'Archivos Seleccionados',
    studyType: 'Tipo de Estudio',
    experimentalTreatment: 'Tratamiento Experimental',
    comparatorTreatment: 'Tratamiento Comparador'
  },

  en: {
    // Header
    appName: 'PharmaComparer',
    tagline: 'Professional Indirect Treatment Comparison Analysis',

    // Hero Section
    heroTitle: 'Clinical Trial ITC Analysis',
    heroSubtitle: 'Professional indirect treatment comparison using the Bucher method. Upload your trial data and generate comprehensive statistical analysis with publication-ready reports.',

    // Data Input
    instructions: 'Instructions',
    instructionsList: [
      'Paste JSON data from clinical trials (including from Google Gem API)',
      'Citation tags like [cite_start] and [cite: XX] will be automatically cleaned',
      'Both trials must compare their experimental arm to a common comparator (e.g., placebo)',
      'JSON will be validated and normalized automatically as you type',
      'Click "Load Example" to see the required format'
    ],
    trialA: 'Trial A',
    trialB: 'Trial B',
    invalidJson: 'Invalid JSON',
    trialInfo: 'Trial Info',
    autoCleaned: 'Auto-cleaned',
    unknownTrial: 'Unknown Trial',
    unknownArm: 'Unknown Arm',
    loadExampleData: 'Load Example Data',
    runAnalysis: 'Run Analysis',
    validating: 'Validating...',
    pasteTrialJson: 'Paste Trial {letter} JSON here...',

    // Loading
    performingAnalysis: 'Performing statistical analysis...',
    mayTakeMoments: 'This may take a few moments',

    // Results
    analysisResults: 'Analysis Results',
    downloadPdfReport: 'Download PDF Report',
    downloading: 'Downloading...',
    newAnalysis: 'New Analysis',
    keyFinding: 'Key Finding',
    indirectComparison: 'Indirect comparison between',
    and: 'and',
    hazardRatio: 'Hazard Ratio',
    confidenceInterval: '95% Confidence Interval',
    pValue: 'p-value',
    statisticallySignificant: 'Statistically Significant',
    notStatisticallySignificant: 'Not Statistically Significant',
    favors: 'Favors',

    // Warnings
    warnings: 'Warnings',

    // Sections
    trialOverview: 'Trial Overview',
    forestPlot: 'Forest Plot',
    forestPlotDesc: 'Visual representation of hazard ratios with 95% confidence intervals',
    homogeneityAssessment: 'Homogeneity Assessment',
    homogeneityDesc: 'Evaluation of baseline characteristic similarity between trials',
    safetyTolerability: 'Safety & Tolerability',
    safetyDesc: 'Comparative safety profile (descriptive analysis only)',
    sensitivityAnalysis: 'Sensitivity Analysis',
    sensitivityDesc: 'Robustness testing under different assumptions',
    dataQuality: 'Data Quality',

    // Comparison Table
    characteristic: 'Characteristic',
    trial: 'Trial',
    trialName: 'Trial Name',
    nctId: 'NCT ID',
    phase: 'Phase',
    indication: 'Indication',
    experimentalArm: 'Experimental Arm',
    controlArm: 'Control Arm',
    sampleSize: 'Sample Size',
    primaryEndpoint: 'Primary Endpoint',
    medianSurvival: 'Median Survival',
    months: 'months',

    // Homogeneity Table
    baselineChar: 'Baseline Characteristic',
    difference: 'Difference',
    assessment: 'Assessment',
    medianAge: 'Median Age',
    maleSex: 'Male Sex %',
    ecogStatus: 'ECOG Status 0 %',
    similar: 'Similar',
    acceptable: 'Acceptable',
    different: 'Different',
    overallSimilarity: 'Overall Similarity',
    good: 'Good',
    acceptableQuality: 'Acceptable',
    poor: 'Poor',

    // Safety Comparison
    adverseEvent: 'Adverse Event',
    experimental: 'Experimental',
    control: 'Control',
    grade35AE: 'Grade 3-5 AE (%)',
    discontinuationRate: 'Discontinuation Rate (%)',
    seriousAE: 'Serious AE (%)',

    // Sensitivity Analysis
    scenario: 'Scenario',
    baseCase: 'Base Case',
    lowerBoundCI: 'Lower Bound CI',
    upperBoundCI: 'Upper Bound CI',

    // Data Quality
    qualityScore: 'Quality Score',
    issues: 'Issues',
    noIssues: 'No issues identified',
    dataQualityAssessment: 'Data Quality Assessment',
    generatingPdf: 'Generating PDF...',
    significant: 'Significant',

    // Detailed Explanations
    forestPlotExplanation: {
      title: 'How to interpret this plot?',
      whatIsIt: '**What does this plot show?**\n\nThe forest plot visually displays the Hazard Ratios (HR) from each trial and the indirect comparison between experimental treatments. Each horizontal line represents a 95% confidence interval.',
      howToRead: '**How to read the Hazard Ratio?**\n\n• HR < 1.0: Favors the first treatment (lower risk of event)\n• HR = 1.0: No difference between treatments\n• HR > 1.0: Favors the second treatment\n\nFor example, an HR of 0.70 means the risk of event is 30% lower with the first treatment.',
      confidenceInterval: '**What does the Confidence Interval mean?**\n\nThe 95% confidence interval represents the range where the true HR likely lies. If the interval crosses 1.0, the difference is not statistically significant.\n\n• CI that does NOT cross 1.0: Statistically significant difference\n• CI that DOES cross 1.0: Not statistically significant',
      clinicalImplications: '**Clinical Implications**\n\nA statistically significant result suggests a real difference between treatments. However, clinical relevance should consider:\n\n• Effect magnitude (how large is the difference)\n• Safety profile of each treatment\n• Patient characteristics\n• Specific clinical context'
    },
    homogeneityExplanation: {
      title: 'Why is similarity between trials important?',
      whatIsIt: '**What does this section evaluate?**\n\nIndirect comparison assumes that trials are sufficiently similar to make a valid comparison. This table evaluates baseline patient characteristics across both trials.',
      howToRead: '**How to interpret differences?**\n\n• **Similar**: Populations are highly comparable (difference < 5%)\n• **Acceptable**: Minor differences but comparison remains valid (5-15%)\n• **Different**: Important differences that may affect validity (> 15%)',
      implications: '**Implications for Validity**\n\nGreater similarity between trials = Greater confidence in results\n\nIf trials are very different in baseline characteristics, indirect comparison results should be interpreted cautiously, as differences could be due to the studied populations rather than treatment.'
    },
    safetyExplanation: {
      title: 'How to interpret safety data?',
      whatIsIt: '**What does this comparison show?**\n\nThis section presents a descriptive analysis of adverse events reported in each trial. IMPORTANT: Indirect comparison statistics are not applied to safety data.',
      howToRead: '**How to read event rates?**\n\n• **Grade 3-5 AE**: Moderate to severe adverse events (more serious)\n• **Discontinuation Rate**: Percentage of patients who left treatment due to side effects\n• **Serious AE**: Adverse events requiring hospitalization or life-threatening',
      implications: '**Important Considerations**\n\nSafety differences between trials may be due to:\n\n• Real differences in treatment safety profiles\n• Different event reporting methods\n• Different patient populations\n• Different follow-up duration\n\nThis comparison is descriptive only and should be interpreted with caution.'
    },
    sensitivityExplanation: {
      title: 'What is sensitivity analysis?',
      whatIsIt: '**What is this analysis for?**\n\nSensitivity analysis tests how robust the results are under different statistical assumptions. If results are consistent across different scenarios, it increases our confidence in the conclusions.',
      howToRead: '**How to interpret scenarios?**\n\n• **Base Case**: Main analysis with standard assumptions\n• **Lower Bound CI**: Conservative scenario (worst case)\n• **Upper Bound CI**: Optimistic scenario (best case)\n\nIf all scenarios show similar results, the findings are robust.',
      implications: '**Consistency Implications**\n\n• Consistent results = Greater confidence in conclusions\n• Variable results = More cautious interpretation needed\n• If confidence interval changes from significant to non-significant between scenarios, it indicates uncertainty'
    },

    // Footer
    allRightsReserved: 'All rights reserved',
    forResearchPurposes: 'For research and educational purposes',

    // Errors
    errorOccurred: 'An error occurred during analysis',
    close: 'Close',
    error: 'Error',

    // AI Extractor
    extractorTitle: 'AI Extractor - Trial',
    extractorSubtitle: 'Paste the clinical trial text and AI will automatically extract structured data',
    extractorInputLabel: 'Clinical Trial Text',
    extractorInputPlaceholder: 'Paste the abstract, paper, or clinical trial description here...\n\nExample:\n"The KEYNOTE-189 study was a phase III trial evaluating pembrolizumab + chemotherapy vs placebo + chemotherapy in non-squamous NSCLC. The hazard ratio for overall survival was 0.49 (95% CI: 0.38-0.64, p<0.001)..."',
    extractorExtracting: 'Extracting data...',
    extractorExtractButton: 'Extract with AI',
    extractorClearButton: 'Clear',
    extractorProposalTitle: 'Extraction Proposal',
    extractorConfidenceScores: 'Confidence Scores',
    extractorConfidence_overall: 'Overall',
    extractorConfidence_basic_info: 'Basic Info',
    extractorConfidence_baseline: 'Baseline',
    extractorConfidence_efficacy: 'Efficacy',
    extractorConfidence_safety: 'Safety',
    extractorWarnings: 'Warnings',
    extractorDataPreview: 'Data Preview',
    extractorViewFullData: 'View full data',
    extractorApproveButton: 'Approve and Use Data',
    extractorRejectButton: 'Reject and Modify',
    extractorErrorEmptyText: 'Please enter the clinical trial text',
    extractorErrorGeneric: 'Error extracting data. Please try again.',
    extractorErrorNoFiles: 'Please select at least one PDF file',
    extractorFileMode: 'Upload PDF',
    extractorTextMode: 'Text',
    extractorUploadLabel: 'Upload Trial Documents (PDF)',
    extractorClickToUpload: 'Click to select PDF files',
    extractorPDFSupport: 'Supports multiple files (main paper + appendices)',
    extractorSelectedFiles: 'Selected Files',
    studyType: 'Study Type',
    experimentalTreatment: 'Experimental Treatment',
    comparatorTreatment: 'Comparator Treatment'
  }
};

/**
 * Get translation for a key in the specified language
 */
export function t(key, language = 'es', params = {}) {
  const lang = translations[language] || translations.es;
  let text = lang[key] || translations.en[key] || key;

  // Replace parameters like {letter} with actual values
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });

  return text;
}
