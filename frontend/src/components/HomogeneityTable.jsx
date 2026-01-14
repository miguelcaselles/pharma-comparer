import { CheckCircle, AlertTriangle } from 'lucide-react';
import { t } from '../i18n/translations';

export default function HomogeneityTable({ assessment, language = 'es' }) {
  return (
    <div>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-700">{t('baselineChar', language)}</th>
              <th className="text-center p-3 font-semibold text-gray-700">{t('trial', language)} A</th>
              <th className="text-center p-3 font-semibold text-gray-700">{t('trial', language)} B</th>
              <th className="text-center p-3 font-semibold text-gray-700">{t('difference', language)}</th>
              <th className="text-center p-3 font-semibold text-gray-700">{t('assessment', language)}</th>
            </tr>
          </thead>
          <tbody>
            {assessment.checks.map((check, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-200 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="p-3 font-medium text-gray-700">{check.characteristic}</td>
                <td className="p-3 text-center text-gray-900">
                  {check.value_a !== null && check.value_a !== undefined ? check.value_a : 'N/A'}
                </td>
                <td className="p-3 text-center text-gray-900">
                  {check.value_b !== null && check.value_b !== undefined ? check.value_b : 'N/A'}
                </td>
                <td className="p-3 text-center text-gray-900">
                  {check.difference !== null && check.difference !== undefined
                    ? check.difference.toFixed(2)
                    : 'N/A'}
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {check.acceptable ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                    <span
                      className={`text-xs ${
                        check.acceptable ? 'text-green-700' : 'text-yellow-700'
                      }`}
                    >
                      {check.comment}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={`p-4 rounded-lg border-l-4 ${
          assessment.overall_assessment === 'ACCEPTABLE'
            ? 'bg-green-50 border-green-500'
            : 'bg-yellow-50 border-yellow-500'
        }`}
      >
        <div className="flex items-start space-x-3">
          {assessment.overall_assessment === 'ACCEPTABLE' ? (
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <h4
              className={`font-semibold mb-1 ${
                assessment.overall_assessment === 'ACCEPTABLE'
                  ? 'text-green-900'
                  : 'text-yellow-900'
              }`}
            >
              {t('overallSimilarity', language)}: {assessment.overall_assessment}
            </h4>
            <p
              className={`text-sm ${
                assessment.overall_assessment === 'ACCEPTABLE'
                  ? 'text-green-800'
                  : 'text-yellow-800'
              }`}
            >
              {assessment.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
