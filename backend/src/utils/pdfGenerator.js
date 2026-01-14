/**
 * PDF Report Generator for ITC Analysis
 * Simplified version with proper layout and image embedding
 */

import PDFDocument from 'pdfkit';

const COLORS = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  gray: '#6b7280',
  darkGray: '#374151',
  lightGray: '#f3f4f6'
};

const MARGINS = { left: 50, right: 50, top: 50, bottom: 60 };
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGINS.left - MARGINS.right;

/**
 * Main PDF generation function
 */
export async function generatePDFReport(analysisData, outputStream, images = {}) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: MARGINS,
    bufferPages: true,
    autoFirstPage: false
  });

  doc.pipe(outputStream);

  try {
    // Portada
    doc.addPage();
    addCoverPage(doc, analysisData);

    // Resumen Ejecutivo
    doc.addPage();
    addExecutiveSummary(doc, analysisData);

    // Metodología
    addMethodology(doc, analysisData);

    // Resultados Principales con Forest Plot
    addBucherResults(doc, analysisData, images.forestPlot);

    // Interpretación Clínica
    addClinicalInterpretation(doc, analysisData);

    // Homogeneidad
    addHomogeneityAssessment(doc, analysisData);

    // Seguridad
    if (analysisData.trial_a.safety_toxicity || analysisData.trial_b.safety_toxicity) {
      addSafetyProfile(doc, analysisData, images.safetyChart);
    }

    // Análisis de Sensibilidad
    if (analysisData.sensitivity_analysis && analysisData.sensitivity_analysis.length > 0) {
      addSensitivityAnalysis(doc, analysisData);
    }

    // Conclusiones
    addConclusions(doc, analysisData);

    // Add page numbers
    addPageNumbers(doc);

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    doc.end();
    throw error;
  }

  return doc;
}

/**
 * PORTADA
 */
function addCoverPage(doc, data) {
  // Header banner
  doc.rect(0, 0, PAGE_WIDTH, 180).fill(COLORS.primary);

  doc.fillColor('#ffffff')
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('COMPARACIÓN INDIRECTA', MARGINS.left, 70, {
      width: CONTENT_WIDTH,
      align: 'center'
    });

  doc.fontSize(24).text('DE TRATAMIENTOS', { width: CONTENT_WIDTH, align: 'center' });

  doc.fontSize(12)
    .font('Helvetica')
    .text('Análisis Mediante el Método de Bucher', MARGINS.left, 150, {
      width: CONTENT_WIDTH,
      align: 'center'
    });

  // Trial info
  doc.fillColor('#000000');
  let y = 220;

  doc.fontSize(14)
    .font('Helvetica-Bold')
    .text('Ensayos Comparados', MARGINS.left, y, { width: CONTENT_WIDTH, align: 'center' });

  y += 30;

  // Trial A box
  doc.rect(MARGINS.left, y, CONTENT_WIDTH, 70)
    .fillAndStroke('#e0f2fe', COLORS.primary);

  doc.fillColor('#000000')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('ENSAYO A', MARGINS.left + 15, y + 12);

  doc.fontSize(9)
    .font('Helvetica')
    .text(truncate(data.trial_a.trial_metadata.trial_name, 70), MARGINS.left + 15, y + 28);

  doc.text(`Tratamiento: ${truncate(data.trial_a.arms_description.experimental_arm, 55)}`,
    MARGINS.left + 15, y + 48);

  y += 90;

  // VS
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor(COLORS.primary)
    .text('VS', MARGINS.left, y, { width: CONTENT_WIDTH, align: 'center' });

  y += 30;

  // Trial B box
  doc.rect(MARGINS.left, y, CONTENT_WIDTH, 70)
    .fillAndStroke('#f3e8ff', COLORS.secondary);

  doc.fillColor('#000000')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('ENSAYO B', MARGINS.left + 15, y + 12);

  doc.fontSize(9)
    .font('Helvetica')
    .text(truncate(data.trial_b.trial_metadata.trial_name, 70), MARGINS.left + 15, y + 28);

  doc.text(`Tratamiento: ${truncate(data.trial_b.arms_description.experimental_arm, 55)}`,
    MARGINS.left + 15, y + 48);

  // Footer
  const fecha = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  doc.fontSize(9)
    .fillColor(COLORS.gray)
    .font('Helvetica')
    .text(`Fecha del Informe: ${fecha}`, MARGINS.left, PAGE_HEIGHT - 100, {
      width: CONTENT_WIDTH,
      align: 'center'
    });

  doc.text('Generado por PharmaComparer', {
    width: CONTENT_WIDTH,
    align: 'center'
  });
}

/**
 * RESUMEN EJECUTIVO
 */
function addExecutiveSummary(doc, data) {
  addSectionHeader(doc, 'RESUMEN EJECUTIVO');

  const result = data.comparison_result;

  doc.fontSize(10)
    .font('Helvetica')
    .text(`Este informe presenta una comparación indirecta ajustada entre ${truncate(data.trial_a.arms_description.experimental_arm, 40)} y ${truncate(data.trial_b.arms_description.experimental_arm, 40)}, utilizando el método de Bucher.`, {
      width: CONTENT_WIDTH,
      align: 'justify'
    });

  checkPageBreak(doc, 180);

  // Results box
  const boxY = doc.y + 20;
  doc.rect(MARGINS.left, boxY, CONTENT_WIDTH, 140)
    .fillAndStroke('#fef3c7', '#f59e0b');

  doc.fillColor('#000000')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Hazard Ratio Indirecto:', MARGINS.left + 15, boxY + 15);

  doc.fontSize(18)
    .font('Helvetica')
    .text(result.hr_indirect.toFixed(3), MARGINS.left + 15, boxY + 35);

  doc.fontSize(10)
    .font('Helvetica-Bold')
    .text('Intervalo de Confianza 95%:', MARGINS.left + 15, boxY + 65);

  doc.fontSize(14)
    .font('Helvetica')
    .text(`${result.ci_lower_95.toFixed(3)} - ${result.ci_upper_95.toFixed(3)}`,
      MARGINS.left + 15, boxY + 85);

  doc.fontSize(10)
    .font('Helvetica-Bold')
    .text(`Valor p: `, MARGINS.left + 15, boxY + 110, { continued: true });

  doc.font('Helvetica')
    .text(result.p_value < 0.0001 ? '<0.0001' : result.p_value.toFixed(4), { continued: true });

  doc.font('Helvetica-Bold')
    .fillColor(result.is_significant ? COLORS.success : COLORS.danger)
    .text(result.is_significant ? ' (Significativo)' : ' (No Significativo)');

  doc.y = boxY + 150;
  doc.fillColor('#000000');

  // Interpretation
  checkPageBreak(doc, 100);

  doc.fontSize(11)
    .font('Helvetica-Bold')
    .text('Interpretación', MARGINS.left, doc.y + 10);

  doc.fontSize(10)
    .font('Helvetica')
    .text(result.interpretation || 'Ver sección de resultados para interpretación detallada.',
      MARGINS.left, doc.y + 5, {
        width: CONTENT_WIDTH,
        align: 'justify'
      });
}

/**
 * METODOLOGÍA
 */
function addMethodology(doc, data) {
  checkPageBreak(doc, 300);

  addSectionHeader(doc, 'METODOLOGÍA: MÉTODO DE BUCHER');

  doc.fontSize(10)
    .font('Helvetica')
    .text('El método de Bucher es el enfoque estándar para realizar comparaciones indirectas ajustadas cuando dos tratamientos no han sido comparados directamente pero comparten un comparador común.', {
      width: CONTENT_WIDTH,
      align: 'justify'
    });

  checkPageBreak(doc, 150);

  // Formula box
  const formulaY = doc.y + 15;
  doc.rect(MARGINS.left, formulaY, CONTENT_WIDTH, 80)
    .fillAndStroke(COLORS.lightGray, COLORS.darkGray);

  doc.fillColor('#000000')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Fórmula:', MARGINS.left + 15, formulaY + 12);

  doc.fontSize(9)
    .font('Courier')
    .text('ln(HR_AB) = ln(HR_AC) - ln(HR_BC)', MARGINS.left + 15, formulaY + 32);

  doc.text('SE_AB = √(SE_AC² + SE_BC²)', MARGINS.left + 15, formulaY + 50);

  doc.y = formulaY + 90;

  // Trial descriptions
  checkPageBreak(doc, 200);

  const trialAData = [
    ['Ensayo A', data.trial_a.trial_metadata.trial_name],
    ['Tratamiento Experimental', data.trial_a.arms_description.experimental_arm],
    ['Comparador', data.trial_a.arms_description.control_arm],
    ['Tamaño Muestral', `${data.trial_a.arms_description.n_experimental + data.trial_a.arms_description.n_control}`]
  ];

  const trialBData = [
    ['Ensayo B', data.trial_b.trial_metadata.trial_name],
    ['Tratamiento Experimental', data.trial_b.arms_description.experimental_arm],
    ['Comparador', data.trial_b.arms_description.control_arm],
    ['Tamaño Muestral', `${data.trial_b.arms_description.n_experimental + data.trial_b.arms_description.n_control}`]
  ];

  doc.fontSize(11)
    .font('Helvetica-Bold')
    .text('Descripción de Ensayos', MARGINS.left, doc.y + 15);

  doc.fontSize(9)
    .font('Helvetica');

  const startY = doc.y + 10;
  trialAData.forEach(([label, value]) => {
    doc.font('Helvetica-Bold').text(`${label}: `, MARGINS.left, doc.y + 5, {
      width: 150,
      continued: true
    });
    doc.font('Helvetica').text(truncate(value, 50));
  });

  doc.y += 15;

  trialBData.forEach(([label, value]) => {
    doc.font('Helvetica-Bold').text(`${label}: `, MARGINS.left, doc.y + 5, {
      width: 150,
      continued: true
    });
    doc.font('Helvetica').text(truncate(value, 50));
  });
}

/**
 * RESULTADOS DE BUCHER CON FOREST PLOT
 */
function addBucherResults(doc, data, forestPlotImage) {
  checkPageBreak(doc, 400);

  addSectionHeader(doc, 'RESULTADOS DEL ANÁLISIS');

  const result = data.comparison_result;
  const epA = data.trial_a.efficacy_outcomes.primary_endpoint_data;
  const epB = data.trial_b.efficacy_outcomes.primary_endpoint_data;

  // Results table
  doc.fontSize(11)
    .font('Helvetica-Bold')
    .text('Resultados Estadísticos');

  const tableY = doc.y + 10;
  const rows = [
    ['Parámetro', 'Valor', 'Interpretación'],
    ['HR Indirecto',
     result.hr_indirect.toFixed(3),
     result.hr_indirect < 1 ? 'Favorece A' : 'Favorece B'],
    ['IC 95%',
     `${result.ci_lower_95.toFixed(3)} - ${result.ci_upper_95.toFixed(3)}`,
     result.ci_lower_95 > 1 || result.ci_upper_95 < 1 ? 'Significativo' : 'No cruza 1.0'],
    ['Valor p',
     result.p_value < 0.0001 ? '<0.0001' : result.p_value.toFixed(4),
     result.is_significant ? 'p < 0.05' : 'p ≥ 0.05']
  ];

  drawTable(doc, rows, [180, 120, 200], tableY);

  checkPageBreak(doc, 300);

  // Forest Plot - use image if available
  doc.fontSize(11)
    .font('Helvetica-Bold')
    .text('Gráfico de Bosque (Forest Plot)', MARGINS.left, doc.y + 20);

  if (forestPlotImage) {
    try {
      const imageBuffer = Buffer.from(forestPlotImage.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const imgY = doc.y + 10;
      const imgWidth = CONTENT_WIDTH;
      const imgHeight = 200;

      doc.image(imageBuffer, MARGINS.left, imgY, {
        width: imgWidth,
        height: imgHeight,
        fit: [imgWidth, imgHeight],
        align: 'center'
      });

      doc.y = imgY + imgHeight + 10;
    } catch (error) {
      console.error('Error embedding forest plot image:', error);
      // Fallback to text representation
      addForestPlotText(doc, epA, epB, result);
    }
  } else {
    // Text representation fallback
    addForestPlotText(doc, epA, epB, result);
  }
}

function addForestPlotText(doc, epA, epB, result) {
  const plotY = doc.y + 10;
  const plotHeight = 160;

  doc.rect(MARGINS.left, plotY, CONTENT_WIDTH, plotHeight)
    .stroke(COLORS.darkGray);

  const midX = MARGINS.left + (CONTENT_WIDTH / 2);
  doc.moveTo(midX, plotY + 10)
    .lineTo(midX, plotY + plotHeight - 10)
    .dash(3, { space: 3 })
    .stroke(COLORS.gray);
  doc.undash();

  doc.fontSize(8)
    .font('Helvetica')
    .text('HR = 1.0', midX - 15, plotY + 5);

  doc.fontSize(9);

  const line1Y = plotY + 40;
  doc.font('Helvetica-Bold')
    .text(`Ensayo A vs Control:`, MARGINS.left + 10, line1Y);
  doc.font('Helvetica')
    .text(`HR = ${epA.hazard_ratio.toFixed(2)} (IC: ${epA.ci_lower_95.toFixed(2)} - ${epA.ci_upper_95.toFixed(2)})`,
      MARGINS.left + 10, line1Y + 12);

  const line2Y = plotY + 80;
  doc.font('Helvetica-Bold')
    .text(`Ensayo B vs Control:`, MARGINS.left + 10, line2Y);
  doc.font('Helvetica')
    .text(`HR = ${epB.hazard_ratio.toFixed(2)} (IC: ${epB.ci_lower_95.toFixed(2)} - ${epB.ci_upper_95.toFixed(2)})`,
      MARGINS.left + 10, line2Y + 12);

  const line3Y = plotY + 120;
  doc.font('Helvetica-Bold')
    .fillColor(COLORS.primary)
    .text(`Comparación Indirecta (A vs B):`, MARGINS.left + 10, line3Y);
  doc.fillColor('#000000')
    .font('Helvetica')
    .text(`HR = ${result.hr_indirect.toFixed(2)} (IC: ${result.ci_lower_95.toFixed(2)} - ${result.ci_upper_95.toFixed(2)})`,
      MARGINS.left + 10, line3Y + 12);

  doc.y = plotY + plotHeight + 10;
}

/**
 * INTERPRETACIÓN CLÍNICA
 */
function addClinicalInterpretation(doc, data) {
  checkPageBreak(doc, 300);

  addSectionHeader(doc, 'INTERPRETACIÓN CLÍNICA');

  const result = data.comparison_result;
  const hr = result.hr_indirect;

  doc.fontSize(11)
    .font('Helvetica-Bold')
    .text('Magnitud del Efecto');

  doc.fontSize(10)
    .font('Helvetica');

  let magnitudeText = '';
  if (hr < 0.80) {
    magnitudeText = `El HR de ${hr.toFixed(3)} representa una reducción SUSTANCIAL del riesgo (>20%). Diferencia clínicamente relevante.`;
  } else if (hr < 0.90) {
    magnitudeText = `El HR de ${hr.toFixed(3)} representa una reducción MODERADA del riesgo (10-20%).`;
  } else if (hr < 1.10) {
    magnitudeText = `El HR de ${hr.toFixed(3)} sugiere diferencia PEQUEÑA entre tratamientos (<10%).`;
  } else {
    magnitudeText = `El HR de ${hr.toFixed(3)} sugiere incremento del riesgo con el tratamiento A.`;
  }

  doc.text(magnitudeText, MARGINS.left, doc.y + 8, {
    width: CONTENT_WIDTH,
    align: 'justify'
  });

  checkPageBreak(doc, 150);

  doc.fontSize(11)
    .font('Helvetica-Bold')
    .text('Significancia Estadística', MARGINS.left, doc.y + 15);

  doc.fontSize(10)
    .font('Helvetica');

  if (result.is_significant) {
    doc.text(`El valor p (${result.p_value < 0.0001 ? '<0.0001' : result.p_value.toFixed(4)}) indica diferencia estadísticamente significativa. El IC 95% NO cruza 1.0.`,
      MARGINS.left, doc.y + 8, {
        width: CONTENT_WIDTH,
        align: 'justify'
      });
  } else {
    doc.text(`El valor p (${result.p_value.toFixed(4)}) indica que la diferencia NO es estadísticamente significativa. El IC 95% cruza 1.0.`,
      MARGINS.left, doc.y + 8, {
        width: CONTENT_WIDTH,
        align: 'justify'
      });
  }
}

/**
 * EVALUACIÓN DE HOMOGENEIDAD
 */
function addHomogeneityAssessment(doc, data) {
  checkPageBreak(doc, 300);

  addSectionHeader(doc, 'EVALUACIÓN DE HOMOGENEIDAD');

  doc.fontSize(10)
    .font('Helvetica')
    .text('Evaluación de la similitud de características basales entre ensayos:', {
      width: CONTENT_WIDTH,
      align: 'justify'
    });

  if (!data.homogeneity_assessment || !data.homogeneity_assessment.checks) {
    doc.text('No hay datos de homogeneidad disponibles.', MARGINS.left, doc.y + 10);
    return;
  }

  const assessment = data.homogeneity_assessment;

  checkPageBreak(doc, 200);

  const rows = [['Característica', 'Ensayo A', 'Ensayo B', 'Diferencia', 'Evaluación']];

  assessment.checks.forEach(check => {
    rows.push([
      truncate(check.characteristic || 'N/A', 20),
      check.value_a != null ? check.value_a.toFixed(1) : 'N/A',
      check.value_b != null ? check.value_b.toFixed(1) : 'N/A',
      check.difference != null ? check.difference.toFixed(1) + '%' : 'N/A',
      check.acceptable ? 'Aceptable' : 'Diferente'
    ]);
  });

  drawTable(doc, rows, [120, 70, 70, 70, 90], doc.y + 15);

  checkPageBreak(doc, 80);

  // Overall assessment
  doc.fontSize(10)
    .font('Helvetica-Bold')
    .fillColor(assessment.overall_assessment === 'ACCEPTABLE' ? COLORS.success : COLORS.warning)
    .text(`Evaluación General: ${assessment.overall_assessment}`, MARGINS.left, doc.y + 15);

  doc.fillColor('#000000')
    .fontSize(9)
    .font('Helvetica')
    .text(assessment.recommendation || '', MARGINS.left, doc.y + 5, {
      width: CONTENT_WIDTH,
      align: 'justify'
    });
}

/**
 * PERFIL DE SEGURIDAD
 */
function addSafetyProfile(doc, data, safetyChartImage) {
  checkPageBreak(doc, 300);

  addSectionHeader(doc, 'PERFIL DE SEGURIDAD');

  doc.fontSize(9)
    .font('Helvetica-Oblique')
    .text('NOTA: Datos presentados únicamente con fines descriptivos. No se aplican métodos de comparación indirecta.', {
      width: CONTENT_WIDTH,
      align: 'justify'
    });

  const safetyA = data.trial_a.safety_toxicity || {};
  const safetyB = data.trial_b.safety_toxicity || {};

  checkPageBreak(doc, 250);

  // Safety Chart - use image if available
  if (safetyChartImage) {
    try {
      const imageBuffer = Buffer.from(safetyChartImage.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const imgY = doc.y + 15;
      const imgWidth = CONTENT_WIDTH;
      const imgHeight = 180;

      doc.image(imageBuffer, MARGINS.left, imgY, {
        width: imgWidth,
        height: imgHeight,
        fit: [imgWidth, imgHeight],
        align: 'center'
      });

      doc.y = imgY + imgHeight + 15;
    } catch (error) {
      console.error('Error embedding safety chart image:', error);
      // Fallback to table
      addSafetyTable(doc, safetyA, safetyB);
    }
  } else {
    // Table fallback
    addSafetyTable(doc, safetyA, safetyB);
  }
}

function addSafetyTable(doc, safetyA, safetyB) {
  const rows = [
    ['Evento Adverso', 'Ensayo A (%)', 'Ensayo B (%)'],
    ['EA Grado 3-5',
     safetyA.any_grade_3_5_ae_rate_exp != null ? safetyA.any_grade_3_5_ae_rate_exp.toFixed(1) : 'N/A',
     safetyB.any_grade_3_5_ae_rate_exp != null ? safetyB.any_grade_3_5_ae_rate_exp.toFixed(1) : 'N/A'],
    ['Discontinuación',
     safetyA.discontinuation_rate_exp != null ? safetyA.discontinuation_rate_exp.toFixed(1) : 'N/A',
     safetyB.discontinuation_rate_exp != null ? safetyB.discontinuation_rate_exp.toFixed(1) : 'N/A'],
    ['EA Serios',
     safetyA.serious_ae_rate_exp != null ? safetyA.serious_ae_rate_exp.toFixed(1) : 'N/A',
     safetyB.serious_ae_rate_exp != null ? safetyB.serious_ae_rate_exp.toFixed(1) : 'N/A']
  ];

  drawTable(doc, rows, [180, 150, 150], doc.y + 15);
}

/**
 * ANÁLISIS DE SENSIBILIDAD
 */
function addSensitivityAnalysis(doc, data) {
  checkPageBreak(doc, 300);

  addSectionHeader(doc, 'ANÁLISIS DE SENSIBILIDAD');

  doc.fontSize(10)
    .font('Helvetica')
    .text('Evaluación de robustez de resultados bajo diferentes escenarios:', {
      width: CONTENT_WIDTH,
      align: 'justify'
    });

  checkPageBreak(doc, 200);

  const rows = [['Escenario', 'HR', 'IC Inferior', 'IC Superior', 'Valor p', 'Sig.']];

  data.sensitivity_analysis.forEach(scenario => {
    rows.push([
      truncate(scenario.scenario, 20),
      scenario.hr_indirect.toFixed(3),
      scenario.ci_lower_95.toFixed(3),
      scenario.ci_upper_95.toFixed(3),
      scenario.p_value < 0.0001 ? '<0.0001' : scenario.p_value.toFixed(4),
      scenario.is_significant ? 'Sí' : 'No'
    ]);
  });

  drawTable(doc, rows, [100, 60, 70, 70, 70, 50], doc.y + 15);
}

/**
 * CONCLUSIONES
 */
function addConclusions(doc, data) {
  checkPageBreak(doc, 300);

  addSectionHeader(doc, 'CONCLUSIONES');

  const result = data.comparison_result;

  doc.fontSize(11)
    .font('Helvetica-Bold')
    .text('Conclusión Principal');

  doc.fontSize(10)
    .font('Helvetica');

  let mainConclusion = '';
  if (result.is_significant) {
    if (result.hr_indirect < 1) {
      mainConclusion = `Existe evidencia estadísticamente significativa (p ${result.p_value < 0.0001 ? '<0.0001' : '= ' + result.p_value.toFixed(4)}) de que ${truncate(data.trial_a.arms_description.experimental_arm, 40)} muestra mayor eficacia comparado con ${truncate(data.trial_b.arms_description.experimental_arm, 40)}.`;
    } else {
      mainConclusion = `Existe evidencia estadísticamente significativa (p ${result.p_value < 0.0001 ? '<0.0001' : '= ' + result.p_value.toFixed(4)}) de que ${truncate(data.trial_b.arms_description.experimental_arm, 40)} muestra mayor eficacia comparado con ${truncate(data.trial_a.arms_description.experimental_arm, 40)}.`;
    }
  } else {
    mainConclusion = `No se encontró evidencia estadísticamente significativa de diferencia en eficacia entre los tratamientos (p = ${result.p_value.toFixed(4)}).`;
  }

  doc.text(mainConclusion, MARGINS.left, doc.y + 8, {
    width: CONTENT_WIDTH,
    align: 'justify'
  });

  checkPageBreak(doc, 150);

  doc.fontSize(11)
    .font('Helvetica-Bold')
    .text('Consideraciones Importantes', MARGINS.left, doc.y + 20);

  doc.fontSize(9)
    .font('Helvetica');

  const points = [
    'Esta comparación indirecta es una aproximación estadística en ausencia de comparación directa.',
    data.homogeneity_assessment?.overall_assessment === 'ACCEPTABLE'
      ? 'Las poblaciones son suficientemente similares para apoyar la validez de la comparación.'
      : 'Existen diferencias en las poblaciones que deben considerarse.',
    'Los datos de seguridad son descriptivos y requieren evaluación adicional.',
    'Estos resultados deben interpretarse junto con toda la evidencia disponible.'
  ];

  points.forEach((point, idx) => {
    doc.text(`${idx + 1}. ${point}`, MARGINS.left, doc.y + 8, {
      width: CONTENT_WIDTH,
      align: 'justify'
    });
  });

  // Final note
  checkPageBreak(doc, 100);

  const noteY = doc.y + 20;
  doc.rect(MARGINS.left, noteY, CONTENT_WIDTH, 60)
    .fillAndStroke('#fef3c7', '#f59e0b');

  doc.fillColor('#000000')
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('NOTA FINAL:', MARGINS.left + 15, noteY + 10);

  doc.fontSize(8)
    .font('Helvetica')
    .text('Este informe es para fines de investigación y educación. Las decisiones clínicas deben tomarse por profesionales calificados.',
      MARGINS.left + 15, noteY + 25, {
        width: CONTENT_WIDTH - 30,
        align: 'justify'
      });

  doc.y = noteY + 70;
}

/**
 * HELPERS
 */
function addSectionHeader(doc, title) {
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .fillColor(COLORS.primary)
    .text(title, MARGINS.left, doc.y);

  doc.moveTo(MARGINS.left, doc.y + 5)
    .lineTo(PAGE_WIDTH - MARGINS.right, doc.y + 5)
    .lineWidth(2)
    .stroke(COLORS.primary);

  doc.fillColor('#000000');
  doc.y += 15;
}

function checkPageBreak(doc, requiredSpace) {
  if (doc.y + requiredSpace > PAGE_HEIGHT - MARGINS.bottom) {
    doc.addPage();
  }
}

function drawTable(doc, rows, columnWidths, startY) {
  const rowHeight = 20;
  let currentY = startY;

  rows.forEach((row, rowIndex) => {
    checkPageBreak(doc, rowHeight + 20);

    if (doc.y > PAGE_HEIGHT - MARGINS.bottom - rowHeight - 20) {
      currentY = MARGINS.top;
    } else {
      currentY = doc.y;
    }

    let currentX = MARGINS.left;

    row.forEach((cell, colIndex) => {
      const colWidth = columnWidths[colIndex];

      // Draw cell
      if (rowIndex === 0) {
        doc.rect(currentX, currentY, colWidth, rowHeight)
          .fillAndStroke(COLORS.lightGray, COLORS.darkGray);
      } else {
        doc.rect(currentX, currentY, colWidth, rowHeight)
          .stroke(COLORS.gray);
      }

      // Draw text
      doc.fillColor('#000000');
      doc.fontSize(rowIndex === 0 ? 9 : 8)
        .font(rowIndex === 0 ? 'Helvetica-Bold' : 'Helvetica')
        .text(
          cell || '',
          currentX + 4,
          currentY + 5,
          {
            width: colWidth - 8,
            height: rowHeight - 10,
            align: colIndex === 0 ? 'left' : 'center',
            ellipsis: true,
            lineBreak: false
          }
        );

      currentX += colWidth;
    });

    currentY += rowHeight;
  });

  doc.y = currentY + 10;
}

function addPageNumbers(doc) {
  const range = doc.bufferedPageRange();

  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);

    if (i === 0) continue; // Skip cover page

    // Footer line
    doc.moveTo(MARGINS.left, PAGE_HEIGHT - 40)
      .lineTo(PAGE_WIDTH - MARGINS.right, PAGE_HEIGHT - 40)
      .lineWidth(0.5)
      .stroke(COLORS.lightGray);

    // Page number
    doc.fontSize(8)
      .font('Helvetica')
      .fillColor(COLORS.gray)
      .text(
        `Página ${i} de ${range.count - 1}`,
        MARGINS.left,
        PAGE_HEIGHT - 30,
        { width: CONTENT_WIDTH, align: 'center' }
      );
  }
}

function truncate(text, maxLength) {
  if (!text) return 'N/A';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
