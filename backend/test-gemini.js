/**
 * Test script to verify Gemini API connection
 */

import 'dotenv/config';
import { extractTrialData } from './src/utils/geminiExtractor.js';

const testText = `
El estudio KEYNOTE-189 fue un ensayo clínico de fase III que evaluó pembrolizumab
en combinación con quimioterapia versus placebo más quimioterapia en pacientes con
cáncer de pulmón de células no pequeñas (NSCLC) metastásico no escamoso.

Se incluyeron 616 pacientes: 410 en el brazo experimental y 206 en el control.
La mediana de edad fue de 64 años, con 60% de varones y 35% con ECOG 0.

El hazard ratio para supervivencia global fue de 0.49 (IC 95%: 0.38-0.64, p < 0.00001).
La mediana de supervivencia fue de 22.0 meses en el brazo experimental versus 10.7 meses
en el control.

Eventos adversos de grado 3-5 ocurrieron en el 67.2% vs 65.8%. La tasa de discontinuación
fue del 13.4% vs 10.2%.
`;

console.log('🧪 Testing Gemini API connection...\n');
console.log('📝 Input text preview:');
console.log(testText.substring(0, 200) + '...\n');

try {
  console.log('⏳ Extracting data with Gemini...');
  const result = await extractTrialData(testText, 'TEST');

  if (result.success) {
    console.log('✅ SUCCESS! Gemini extraction working!\n');
    console.log('📊 Confidence Scores:');
    console.log(JSON.stringify(result.confidence_scores, null, 2));
    console.log('\n📋 Summary:');
    console.log(result.summary.es);
    console.log('\n⚠️ Warnings:', result.warnings.length, 'found');
    console.log('\n✨ Extracted trial name:', result.extracted_data.trial_name);
    console.log('💊 Experimental treatment:', result.extracted_data.experimental_treatment);
    console.log('📈 Hazard Ratio:', result.extracted_data.efficacy_outcomes?.primary_endpoint_data?.hazard_ratio);
  } else {
    console.error('❌ FAILED:', result.error);
  }
} catch (error) {
  console.error('❌ ERROR:', error.message);
  console.error('\nPlease check:');
  console.error('1. GEMINI_API_KEY is set in .env file');
  console.error('2. API key is valid and has access to Gemini API');
  console.error('3. You have internet connection');
}
