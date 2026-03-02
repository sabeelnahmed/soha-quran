import { useQuranContext } from '../../context/QuranContext';

export default function LanguageToggle() {
  const { state, dispatch } = useQuranContext();
  const { wordLanguage } = state;

  return (
    <div className="flex rounded-md overflow-hidden border border-stone-300">
      <button
        onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'en' })}
        className={`px-3 py-1 text-xs font-medium transition-colors ${
          wordLanguage === 'en'
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-stone-600 hover:bg-stone-50'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'ur' })}
        className={`px-3 py-1 text-xs font-medium transition-colors ${
          wordLanguage === 'ur'
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-stone-600 hover:bg-stone-50'
        }`}
      >
        UR
      </button>
    </div>
  );
}
