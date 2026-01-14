import { useState, useRef } from 'react';
import { Sparkles, CheckCircle, AlertTriangle, FileText, Loader2, ThumbsUp, ThumbsDown, Upload, X } from 'lucide-react';
import { extractTrialData, extractTrialDataFromPDF } from '../services/api';
import { t } from '../i18n/translations';

/**
 * TrialDataExtractor Component
 * AI-powered clinical trial data extraction with proposal/approval workflow
 * Supports both text input and PDF upload (with appendices)
 */
export default function TrialDataExtractor({ onDataExtracted, trialIdentifier, language }) {
  const [trialText, setTrialText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState(null);
  const [useFileUpload, setUseFileUpload] = useState(true); // Default to file upload
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setError(null);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleExtract = async () => {
    if (useFileUpload) {
      // Extract from PDF files
      if (selectedFiles.length === 0) {
        setError(t('extractorErrorNoFiles', language));
        return;
      }

      setExtracting(true);
      setError(null);
      setProposal(null);

      try {
        const result = await extractTrialDataFromPDF(selectedFiles, trialIdentifier);

        if (!result.success) {
          throw new Error(result.error || 'PDF extraction failed');
        }

        setProposal(result.proposal);
      } catch (err) {
        console.error('PDF extraction error:', err);
        setError(err.message || t('extractorErrorGeneric', language));
      } finally {
        setExtracting(false);
      }
    } else {
      // Extract from text
      if (!trialText.trim()) {
        setError(t('extractorErrorEmptyText', language));
        return;
      }

      setExtracting(true);
      setError(null);
      setProposal(null);

      try {
        const result = await extractTrialData(trialText, trialIdentifier);

        if (!result.success) {
          throw new Error(result.error || 'Extraction failed');
        }

        setProposal(result.proposal);
      } catch (err) {
        console.error('Extraction error:', err);
        setError(err.message || t('extractorErrorGeneric', language));
      } finally {
        setExtracting(false);
      }
    }
  };

  const handleApprove = () => {
    if (proposal && proposal.extracted_data) {
      onDataExtracted(proposal.extracted_data);
      setProposal(null);
      setTrialText('');
    }
  };

  const handleReject = () => {
    setProposal(null);
    setSelectedFiles([]);
    setTrialText('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('extractorTitle', language)} {trialIdentifier}
          </h3>
          <p className="text-sm text-gray-600">
            {t('extractorSubtitle', language)}
          </p>
        </div>

        {/* Toggle between File Upload and Text Input */}
        {!proposal && (
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setUseFileUpload(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                useFileUpload
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              {t('extractorFileMode', language)}
            </button>
            <button
              onClick={() => setUseFileUpload(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                !useFileUpload
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              {t('extractorTextMode', language)}
            </button>
          </div>
        )}
      </div>

      {/* Input Area */}
      {!proposal && (
        <div className="space-y-3">
          {useFileUpload ? (
            /* File Upload Mode */
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('extractorUploadLabel', language)}
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {t('extractorClickToUpload', language)}
                </p>
                <p className="text-xs text-gray-500">
                  {t('extractorPDFSupport', language)}
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('extractorSelectedFiles', language)} ({selectedFiles.length})
                  </label>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={extracting}
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Text Input Mode */
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('extractorInputLabel', language)}
              </label>
              <textarea
                value={trialText}
                onChange={(e) => setTrialText(e.target.value)}
                placeholder={t('extractorInputPlaceholder', language)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                disabled={extracting}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleExtract}
              disabled={extracting || (useFileUpload ? selectedFiles.length === 0 : !trialText.trim())}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {extracting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('extractorExtracting', language)}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t('extractorExtractButton', language)}
                </>
              )}
            </button>

            <button
              onClick={() => {
                setTrialText('');
                setSelectedFiles([]);
                setError(null);
              }}
              disabled={extracting}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t('extractorClearButton', language)}
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-900">{t('error', language)}</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Proposal Display */}
      {proposal && (
        <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-600" />
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  {t('extractorProposalTitle', language)}
                </h4>
                <p className="text-sm text-gray-600">
                  {proposal.summary[language]}
                </p>
              </div>
            </div>
          </div>

          {/* Confidence Scores */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h5 className="font-semibold text-gray-900 mb-3">
              {t('extractorConfidenceScores', language)}
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(proposal.confidence_scores).map(([key, score]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{score}%</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {t(`extractorConfidence_${key}`, language)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {proposal.warnings && proposal.warnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold text-amber-900 mb-2">
                    {t('extractorWarnings', language)}
                  </h5>
                  <ul className="space-y-1">
                    {proposal.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-amber-800">
                        • <span className="font-medium">{warning.field}:</span> {warning.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Data Preview */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h5 className="font-semibold text-gray-900 mb-3">
              {t('extractorDataPreview', language)}
            </h5>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-gray-700">{t('trialName', language)}:</span>
                  <span className="ml-2 text-gray-900">{proposal.extracted_data.trial_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t('studyType', language)}:</span>
                  <span className="ml-2 text-gray-900">{proposal.extracted_data.study_type || 'N/A'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-gray-700">{t('experimentalTreatment', language)}:</span>
                  <span className="ml-2 text-gray-900">{proposal.extracted_data.experimental_treatment || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t('comparatorTreatment', language)}:</span>
                  <span className="ml-2 text-gray-900">{proposal.extracted_data.comparator_treatment || 'N/A'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-gray-700">Hazard Ratio:</span>
                  <span className="ml-2 text-gray-900">
                    {proposal.extracted_data.efficacy_outcomes?.primary_endpoint_data?.hazard_ratio?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">95% CI:</span>
                  <span className="ml-2 text-gray-900">
                    {proposal.extracted_data.efficacy_outcomes?.primary_endpoint_data?.ci_lower_95 &&
                     proposal.extracted_data.efficacy_outcomes?.primary_endpoint_data?.ci_upper_95
                      ? `${proposal.extracted_data.efficacy_outcomes.primary_endpoint_data.ci_lower_95.toFixed(2)} - ${proposal.extracted_data.efficacy_outcomes.primary_endpoint_data.ci_upper_95.toFixed(2)}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Data Accordion */}
            <details className="mt-4">
              <summary className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium text-sm">
                {t('extractorViewFullData', language)}
              </summary>
              <pre className="mt-3 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                {JSON.stringify(proposal.extracted_data, null, 2)}
              </pre>
            </details>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              <ThumbsUp className="w-5 h-5" />
              {t('extractorApproveButton', language)}
            </button>

            <button
              onClick={handleReject}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
            >
              <ThumbsDown className="w-5 h-5" />
              {t('extractorRejectButton', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
