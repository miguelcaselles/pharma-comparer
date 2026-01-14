import { useState, useRef } from 'react';
import {
  Download,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import html2canvas from 'html2canvas';
import ForestPlot from './ForestPlot';
import ComparisonTable from './ComparisonTable';
import HomogeneityTable from './HomogeneityTable';
import SafetyComparison from './SafetyComparison';
import SensitivityAnalysis from './SensitivityAnalysis';
import NarrativeExplanation from './NarrativeExplanation';
import LoadingSpinner from './LoadingSpinner';
import { downloadPDFReport } from '../services/api';
import { t } from '../i18n/translations';

// Helper component to render markdown-like text
function ExplanationText({ text }) {
  if (!text) return null;

  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <div className="space-y-3">
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <div key={idx} className="font-bold text-gray-900 mt-2">{part.slice(2, -2)}</div>;
        }
        return part.split('\n').map((line, lineIdx) =>
          line.trim() ? <p key={`${idx}-${lineIdx}`} className="text-gray-700 leading-relaxed">{line}</p> : null
        );
      })}
    </div>
  );
}

export default function Results({ data, onReset, language = 'es' }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const forestPlotRef = useRef(null);
  const safetyChartRef = useRef(null);

  const result = data.comparison_result;
  const trialA = data.trial_a;
  const trialB = data.trial_b;

  const captureChart = async (elementRef) => {
    if (!elementRef || !elementRef.current) return null;

    try {
      const canvas = await html2canvas(elementRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      // Capture charts as images
      const forestPlotImage = await captureChart(forestPlotRef);
      const safetyChartImage = await captureChart(safetyChartRef);

      // Send data with images to backend
      await downloadPDFReport(data, {
        forestPlotImage,
        safetyChartImage
      });
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('analysisResults', language)}</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="btn btn-primary flex items-center space-x-2"
          >
            {isDownloading ? (
              <>
                <LoadingSpinner size="small" />
                <span>{t('generatingPdf', language)}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('downloadPdfReport', language)}</span>
              </>
            )}
          </button>
          <button onClick={onReset} className="btn btn-outline flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>{t('newAnalysis', language)}</span>
          </button>
        </div>
      </div>

      {downloadError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-sm text-red-700">{downloadError}</p>
        </div>
      )}

      {/* Warnings */}
      {data.warnings && data.warnings.length > 0 && (
        <div className="card p-4 border-l-4 border-yellow-500 bg-yellow-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">{t('warnings', language)}</h4>
              <ul className="space-y-1">
                {data.warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm text-yellow-800">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Key Findings */}
      <div className="card p-8 bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
        <div className="flex items-start space-x-4">
          {result.is_significant ? (
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          ) : (
            <Info className="w-8 h-8 text-blue-600 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('keyFinding', language)}</h3>
            <p className="text-gray-700 mb-4">
              {t('indirectComparison', language)}{' '}
              <span className="font-semibold text-primary-700">
                {trialA.arms_description.experimental_arm}
              </span>{' '}
              {t('and', language)}{' '}
              <span className="font-semibold text-secondary-700">
                {trialB.arms_description.experimental_arm}
              </span>
              :
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">{t('hazardRatio', language)}</p>
                <p className="text-2xl font-bold text-gray-900">{result.hr_indirect}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">{t('confidenceInterval', language)}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.ci_lower_95} - {result.ci_upper_95}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">{t('pValue', language)}</p>
                <p className="text-xl font-bold text-gray-900">{result.p_value}</p>
                {result.is_significant && (
                  <span className="inline-block mt-1 badge badge-success">{t('significant', language)}</span>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">{result.interpretation}</p>
            </div>

            {result.favors && (
              <div className="mt-4 flex items-center space-x-2">
                {result.favors === 'A' ? (
                  <TrendingDown className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {t('favors', language)}: {result.favors === 'A' ? trialA.arms_description.experimental_arm : trialB.arms_description.experimental_arm}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Narrative Explanations */}
      {data.narrative_explanations && (
        <NarrativeExplanation
          narratives={data.narrative_explanations}
          language={language}
        />
      )}

      {/* Trial Overview */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('trialOverview', language)}</h3>
        <ComparisonTable trialA={trialA} trialB={trialB} result={result} language={language} />
      </div>

      {/* Forest Plot */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('forestPlot', language)}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {t('forestPlotDesc', language)}
        </p>
        <div ref={forestPlotRef}>
          <ForestPlot trialA={trialA} trialB={trialB} result={result} />
        </div>

        {/* Detailed Explanation */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
          <div className="flex items-start space-x-3 mb-4">
            <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <h4 className="text-md font-bold text-blue-900">
              {t('forestPlotExplanation', language).title}
            </h4>
          </div>
          <div className="space-y-4 ml-8">
            <ExplanationText text={t('forestPlotExplanation', language).whatIsIt} />
            <ExplanationText text={t('forestPlotExplanation', language).howToRead} />
            <ExplanationText text={t('forestPlotExplanation', language).confidenceInterval} />
            <ExplanationText text={t('forestPlotExplanation', language).clinicalImplications} />
          </div>
        </div>
      </div>

      {/* Homogeneity Assessment */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('homogeneityAssessment', language)}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {t('homogeneityDesc', language)}
        </p>
        <HomogeneityTable assessment={data.homogeneity_assessment} language={language} />

        {/* Detailed Explanation */}
        <div className="mt-6 bg-purple-50 border-l-4 border-purple-500 p-5 rounded-r-lg">
          <div className="flex items-start space-x-3 mb-4">
            <Info className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
            <h4 className="text-md font-bold text-purple-900">
              {t('homogeneityExplanation', language).title}
            </h4>
          </div>
          <div className="space-y-4 ml-8">
            <ExplanationText text={t('homogeneityExplanation', language).whatIsIt} />
            <ExplanationText text={t('homogeneityExplanation', language).howToRead} />
            <ExplanationText text={t('homogeneityExplanation', language).implications} />
          </div>
        </div>
      </div>

      {/* Safety Comparison */}
      {(trialA.safety_toxicity || trialB.safety_toxicity) && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('safetyTolerability', language)}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('safetyDesc', language)}
          </p>
          <div ref={safetyChartRef}>
            <SafetyComparison trialA={trialA} trialB={trialB} language={language} />
          </div>

          {/* Detailed Explanation */}
          <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg">
            <div className="flex items-start space-x-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
              <h4 className="text-md font-bold text-amber-900">
                {t('safetyExplanation', language).title}
              </h4>
            </div>
            <div className="space-y-4 ml-8">
              <ExplanationText text={t('safetyExplanation', language).whatIsIt} />
              <ExplanationText text={t('safetyExplanation', language).howToRead} />
              <ExplanationText text={t('safetyExplanation', language).implications} />
            </div>
          </div>
        </div>
      )}

      {/* Sensitivity Analysis */}
      {data.sensitivity_analysis && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('sensitivityAnalysis', language)}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('sensitivityDesc', language)}
          </p>
          <SensitivityAnalysis analysis={data.sensitivity_analysis} language={language} />

          {/* Detailed Explanation */}
          <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg">
            <div className="flex items-start space-x-3 mb-4">
              <Info className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <h4 className="text-md font-bold text-green-900">
                {t('sensitivityExplanation', language).title}
              </h4>
            </div>
            <div className="space-y-4 ml-8">
              <ExplanationText text={t('sensitivityExplanation', language).whatIsIt} />
              <ExplanationText text={t('sensitivityExplanation', language).howToRead} />
              <ExplanationText text={t('sensitivityExplanation', language).implications} />
            </div>
          </div>
        </div>
      )}

      {/* Data Quality */}
      {data.data_quality && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dataQualityAssessment', language)}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                {t('trial', language)} A: {trialA.trial_metadata.trial_name}
              </h4>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{t('qualityScore', language)}</span>
                  <span className="text-sm font-semibold">{data.data_quality.trial_a.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.data_quality.trial_a.score >= 80
                        ? 'bg-green-500'
                        : data.data_quality.trial_a.score >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${data.data_quality.trial_a.score}%` }}
                  />
                </div>
              </div>
              {data.data_quality.trial_a.warnings.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">{t('issues', language)}:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {data.data_quality.trial_a.warnings.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-green-600 mt-3">{t('noIssues', language)}</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                {t('trial', language)} B: {trialB.trial_metadata.trial_name}
              </h4>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{t('qualityScore', language)}</span>
                  <span className="text-sm font-semibold">{data.data_quality.trial_b.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.data_quality.trial_b.score >= 80
                        ? 'bg-green-500'
                        : data.data_quality.trial_b.score >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${data.data_quality.trial_b.score}%` }}
                  />
                </div>
              </div>
              {data.data_quality.trial_b.warnings.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">{t('issues', language)}:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {data.data_quality.trial_b.warnings.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-green-600 mt-3">{t('noIssues', language)}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
