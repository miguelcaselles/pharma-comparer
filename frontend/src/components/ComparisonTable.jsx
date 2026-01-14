import { t } from '../i18n/translations';

export default function ComparisonTable({ trialA, trialB, result, language = 'es' }) {
  const epA = trialA.efficacy_outcomes.primary_endpoint_data;
  const epB = trialB.efficacy_outcomes.primary_endpoint_data;

  const rows = [
    {
      label: t('trialName', language),
      a: trialA.trial_metadata.trial_name,
      b: trialB.trial_metadata.trial_name,
      indirect: '—'
    },
    {
      label: t('experimentalArm', language),
      a: trialA.arms_description.experimental_arm,
      b: trialB.arms_description.experimental_arm,
      indirect: '—'
    },
    {
      label: t('controlArm', language),
      a: trialA.arms_description.control_arm,
      b: trialB.arms_description.control_arm,
      indirect: '—'
    },
    {
      label: t('sampleSize', language),
      a: `${trialA.arms_description.n_experimental + trialA.arms_description.n_control}`,
      b: `${trialB.arms_description.n_experimental + trialB.arms_description.n_control}`,
      indirect: '—'
    },
    {
      label: t('primaryEndpoint', language),
      a: epA.endpoint_name,
      b: epB.endpoint_name,
      indirect: '—'
    },
    {
      label: t('hazardRatio', language),
      a: epA.hazard_ratio.toString(),
      b: epB.hazard_ratio.toString(),
      indirect: result.hr_indirect.toString()
    },
    {
      label: language === 'es' ? 'Límite Inferior IC 95%' : '95% CI Lower',
      a: epA.ci_lower_95.toString(),
      b: epB.ci_lower_95.toString(),
      indirect: result.ci_lower_95.toString()
    },
    {
      label: language === 'es' ? 'Límite Superior IC 95%' : '95% CI Upper',
      a: epA.ci_upper_95.toString(),
      b: epB.ci_upper_95.toString(),
      indirect: result.ci_upper_95.toString()
    },
    {
      label: t('pValue', language),
      a: epA.p_value?.toString() || 'N/A',
      b: epB.p_value?.toString() || 'N/A',
      indirect: result.p_value.toFixed(6)
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left p-3 font-semibold text-gray-700">{t('characteristic', language)}</th>
            <th className="text-center p-3 font-semibold text-primary-700 bg-primary-50">
              {t('trial', language)} A
            </th>
            <th className="text-center p-3 font-semibold text-secondary-700 bg-secondary-50">
              {t('trial', language)} B
            </th>
            <th className="text-center p-3 font-semibold text-red-700 bg-red-50">
              {language === 'es' ? 'Comparación Indirecta' : 'Indirect Comparison'}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={`border-b border-gray-200 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="p-3 font-medium text-gray-700">{row.label}</td>
              <td className="p-3 text-center text-gray-900">{row.a}</td>
              <td className="p-3 text-center text-gray-900">{row.b}</td>
              <td className="p-3 text-center text-gray-900 font-semibold">{row.indirect}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
