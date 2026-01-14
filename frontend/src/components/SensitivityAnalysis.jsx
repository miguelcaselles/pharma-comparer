import { t } from '../i18n/translations';

export default function SensitivityAnalysis({ analysis, language = 'es' }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-700">{t('scenario', language)}</th>
              <th className="text-center p-3 font-semibold text-gray-700">HR</th>
              <th className="text-center p-3 font-semibold text-gray-700">{t('lowerBoundCI', language)}</th>
              <th className="text-center p-3 font-semibold text-gray-700">{t('upperBoundCI', language)}</th>
              <th className="text-center p-3 font-semibold text-gray-700">{t('pValue', language)}</th>
              <th className="text-center p-3 font-semibold text-gray-700">{language === 'es' ? 'Significativo' : 'Significant'}</th>
            </tr>
          </thead>
          <tbody>
            {analysis.map((scenario, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-200 ${
                  idx === 0 ? 'bg-blue-50 font-semibold' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="p-3 text-gray-900">{scenario.scenario}</td>
                <td className="p-3 text-center text-gray-900">{scenario.hr_indirect}</td>
                <td className="p-3 text-center text-gray-900">{scenario.ci_lower_95}</td>
                <td className="p-3 text-center text-gray-900">{scenario.ci_upper_95}</td>
                <td className="p-3 text-center text-gray-900">{scenario.p_value.toFixed(6)}</td>
                <td className="p-3 text-center">
                  {scenario.is_significant ? (
                    <span className="badge badge-success">{language === 'es' ? 'Sí' : 'Yes'}</span>
                  ) : (
                    <span className="badge badge-warning">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <strong>{language === 'es' ? 'Interpretación:' : 'Interpretation:'}</strong>{' '}
          {language === 'es'
            ? 'El análisis de sensibilidad prueba la robustez de los resultados variando los anchos de los intervalos de confianza. El "Caso Base" representa el análisis original. Resultados consistentes en todos los escenarios fortalecen la confianza en los hallazgos.'
            : 'Sensitivity analysis tests the robustness of results by varying the confidence interval widths. The "Base Case" represents the original analysis. Consistent results across scenarios strengthen confidence in the findings.'}
        </p>
      </div>
    </div>
  );
}
