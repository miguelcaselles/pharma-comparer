import { Globe } from 'lucide-react';

export default function LanguageToggle({ language, onLanguageChange }) {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm px-3 py-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <button
        onClick={() => onLanguageChange('es')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'es'
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Español
      </button>
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        English
      </button>
    </div>
  );
}
