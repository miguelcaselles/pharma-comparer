import { useEffect, useRef } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { t } from '../i18n/translations';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function SafetyComparison({ trialA, trialB, language = 'es' }) {
  const safetyA = trialA.safety_toxicity || {};
  const safetyB = trialB.safety_toxicity || {};

  const hasData =
    safetyA.any_grade_3_5_ae_rate_exp ||
    safetyB.any_grade_3_5_ae_rate_exp ||
    safetyA.discontinuation_rate_exp ||
    safetyB.discontinuation_rate_exp;

  if (!hasData) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{language === 'es' ? 'No hay datos de seguridad disponibles para comparar' : 'No safety data available for comparison'}</p>
      </div>
    );
  }

  const chartData = {
    labels: [
      t('grade35AE', language),
      t('discontinuationRate', language),
      t('seriousAE', language)
    ],
    datasets: [
      {
        label: trialA.arms_description.experimental_arm,
        data: [
          safetyA.any_grade_3_5_ae_rate_exp || 0,
          safetyA.discontinuation_rate_exp || 0,
          safetyA.serious_ae_rate_exp || 0
        ],
        backgroundColor: '#2563eb',
        borderRadius: 6
      },
      {
        label: trialB.arms_description.experimental_arm,
        data: [
          safetyB.any_grade_3_5_ae_rate_exp || 0,
          safetyB.discontinuation_rate_exp || 0,
          safetyB.serious_ae_rate_exp || 0
        ],
        backgroundColor: '#9333ea',
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: language === 'es' ? 'Porcentaje (%)' : 'Percentage (%)',
          font: { size: 13, weight: 'bold' }
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div>
      <div style={{ height: '350px' }} className="mb-6">
        <Bar data={chartData} options={options} />
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>{language === 'es' ? 'Nota:' : 'Note:'}</strong>{' '}
          {language === 'es'
            ? 'Los resultados de seguridad se presentan únicamente con fines descriptivos. La comparación estadística directa de datos de seguridad requiere datos individuales de pacientes o métodos más sofisticados de meta-análisis en red. Interprete las diferencias con cautela.'
            : 'Safety outcomes are presented for descriptive purposes only. Direct statistical comparison of safety data requires individual patient data or more sophisticated network meta-analysis methods. Interpret differences cautiously.'}
        </p>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h5 className="font-semibold text-gray-700 mb-2">
            {trialA.arms_description.experimental_arm}
          </h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>{t('grade35AE', language)}: {safetyA.any_grade_3_5_ae_rate_exp || 'N/A'}%</li>
            <li>{t('discontinuationRate', language)}: {safetyA.discontinuation_rate_exp || 'N/A'}%</li>
            <li>{t('seriousAE', language)}: {safetyA.serious_ae_rate_exp || 'N/A'}%</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h5 className="font-semibold text-gray-700 mb-2">
            {trialB.arms_description.experimental_arm}
          </h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>{t('grade35AE', language)}: {safetyB.any_grade_3_5_ae_rate_exp || 'N/A'}%</li>
            <li>{t('discontinuationRate', language)}: {safetyB.discontinuation_rate_exp || 'N/A'}%</li>
            <li>{t('seriousAE', language)}: {safetyB.serious_ae_rate_exp || 'N/A'}%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
