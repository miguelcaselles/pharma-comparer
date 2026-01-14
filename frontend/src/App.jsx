import { useState } from 'react';
import Header from './components/Header';
import DataInput from './components/DataInput';
import Results from './components/Results';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import LanguageToggle from './components/LanguageToggle';
import { analyzeTrials } from './services/api';
import { t } from './i18n/translations';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('es'); // Default to Spanish

  const handleAnalyze = async (trialA, trialB) => {
    setLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      const result = await analyzeTrials(trialA, trialB, language);

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      setAnalysisData(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Language Toggle */}
        <div className="flex justify-end mb-6 animate-fade-in">
          <LanguageToggle language={language} onLanguageChange={setLanguage} />
        </div>
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('heroTitle', language)}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('heroSubtitle', language)}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 animate-fade-in">
            <ErrorAlert message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <LoadingSpinner size="large" />
            <p className="mt-6 text-lg text-gray-600 font-medium">
              {t('performingAnalysis', language)}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {t('mayTakeMoments', language)}
            </p>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            {!analysisData ? (
              <DataInput onAnalyze={handleAnalyze} language={language} />
            ) : (
              <Results data={analysisData} onReset={handleReset} language={language} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-4 md:mb-0">
              <p className="font-semibold text-primary-600">{t('appName', language)}</p>
              <p className="mt-1">{t('tagline', language)}</p>
            </div>
            <div className="text-center md:text-right">
              <p>© {new Date().getFullYear()} - {t('allRightsReserved', language)}</p>
              <p className="mt-1 text-xs text-gray-500">
                {t('forResearchPurposes', language)}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
