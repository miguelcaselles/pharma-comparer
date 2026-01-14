import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ForestPlot({ trialA, trialB, result }) {
  const epA = trialA.efficacy_outcomes.primary_endpoint_data;
  const epB = trialB.efficacy_outcomes.primary_endpoint_data;

  const data = {
    datasets: [
      // Trial A Point
      {
        label: `${trialA.trial_metadata.trial_name} (Direct)`,
        data: [{ x: epA.hazard_ratio, y: 3 }],
        backgroundColor: '#2563eb',
        pointRadius: 8,
        pointHoverRadius: 10,
        showLine: false
      },
      // Trial A CI Line
      {
        label: 'CI A',
        data: [
          { x: epA.ci_lower_95, y: 3 },
          { x: epA.ci_upper_95, y: 3 }
        ],
        borderColor: '#2563eb',
        borderWidth: 3,
        showLine: true,
        pointRadius: 0
      },
      // Trial B Point
      {
        label: `${trialB.trial_metadata.trial_name} (Direct)`,
        data: [{ x: epB.hazard_ratio, y: 2 }],
        backgroundColor: '#9333ea',
        pointRadius: 8,
        pointHoverRadius: 10,
        showLine: false
      },
      // Trial B CI Line
      {
        label: 'CI B',
        data: [
          { x: epB.ci_lower_95, y: 2 },
          { x: epB.ci_upper_95, y: 2 }
        ],
        borderColor: '#9333ea',
        borderWidth: 3,
        showLine: true,
        pointRadius: 0
      },
      // Indirect Comparison Point
      {
        label: 'Indirect Comparison',
        data: [{ x: result.hr_indirect, y: 1 }],
        backgroundColor: '#ef4444',
        pointRadius: 10,
        pointHoverRadius: 12,
        showLine: false
      },
      // Indirect CI Line
      {
        label: 'CI Indirect',
        data: [
          { x: result.ci_lower_95, y: 1 },
          { x: result.ci_upper_95, y: 1 }
        ],
        borderColor: '#ef4444',
        borderWidth: 3,
        showLine: true,
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'logarithmic',
        title: {
          display: true,
          text: 'Hazard Ratio (log scale)',
          font: { size: 14, weight: 'bold' }
        },
        grid: {
          display: true,
          color: '#e5e7eb'
        },
        ticks: {
          callback: function(value) {
            return Number(value.toFixed(2));
          }
        }
      },
      y: {
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            const labels = {
              1: 'Indirect Comparison',
              2: trialB.trial_metadata.trial_name,
              3: trialA.trial_metadata.trial_name
            };
            return labels[value] || '';
          },
          font: { size: 12 }
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataset = context.dataset;
            if (dataset.label.includes('CI')) {
              return null;
            }
            const hr = context.parsed.x.toFixed(3);
            return `${dataset.label}: HR = ${hr}`;
          }
        }
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: 1,
            xMax: 1,
            borderColor: '#6b7280',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: 'No Effect (HR=1)',
              enabled: true,
              position: 'start'
            }
          }
        }
      }
    }
  };

  return (
    <div className="relative">
      <div style={{ height: '400px' }}>
        <Scatter data={data} options={options} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-gray-700">{trialA.trial_metadata.trial_name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-purple-600"></div>
          <span className="text-gray-700">{trialB.trial_metadata.trial_name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span className="text-gray-700">Indirect Comparison</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500 text-center italic">
        Figure: Forest plot showing direct comparisons and calculated indirect comparison.
        Error bars represent 95% confidence intervals. HR &lt; 1 favors experimental treatment.
      </p>
    </div>
  );
}
