import { BookOpen, AlertCircle } from 'lucide-react';

export default function NarrativeExplanation({ narratives, language }) {
  if (!narratives) return null;

  const { bucher_results, homogeneity, safety } = narratives;

  return (
    <div className="space-y-6">
      {/* Bucher Results Explanation */}
      {bucher_results && (
        <div className="card p-6 bg-gradient-to-br from-primary-50 to-white border-l-4 border-primary-600">
          <div className="flex items-start space-x-3 mb-4">
            <BookOpen className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{bucher_results.title}</h3>
              <p className="text-sm text-gray-500">
                {language === 'es' ? 'Explicación de los resultados en lenguaje claro' : 'Plain language explanation of results'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {bucher_results.sections.map((section, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">{section.title}</h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {renderMarkdown(section.content)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Homogeneity Explanation */}
      {homogeneity && (
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-600">
          <div className="flex items-start space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {language === 'es' ? 'Comparabilidad de los Ensayos' : 'Trial Comparability'}
              </h3>
            </div>
          </div>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {renderMarkdown(homogeneity)}
          </div>
        </div>
      )}

      {/* Safety Explanation */}
      {safety && (
        <div className="card p-6 bg-gradient-to-br from-amber-50 to-white border-l-4 border-amber-600">
          <div className="flex items-start space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {language === 'es' ? 'Interpretación de Seguridad' : 'Safety Interpretation'}
              </h3>
            </div>
          </div>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {renderMarkdown(safety)}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple markdown renderer for bold text
function renderMarkdown(text) {
  if (!text) return null;

  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}
