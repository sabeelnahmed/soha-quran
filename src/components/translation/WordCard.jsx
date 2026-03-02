export default function WordCard({ word }) {
  const arabicText = word.text_uthmani || word.text || '';
  const translationText = word.translation?.text || '';
  const transliterationText = word.transliteration?.text || '';

  return (
    <div className="flex flex-col items-center bg-white rounded-lg border border-stone-200 px-3 py-2 min-w-[80px] hover:shadow-md transition-shadow">
      {/* Arabic word */}
      <p
        dir="rtl"
        lang="ar"
        className="font-['Uthmani'] text-xl text-stone-900 leading-relaxed"
      >
        {arabicText}
      </p>

      {/* Transliteration */}
      {transliterationText && (
        <p className="text-xs text-stone-400 italic mt-1" dir="ltr">
          {transliterationText}
        </p>
      )}

      {/* Translation */}
      <p className="text-xs text-emerald-700 font-medium mt-1 text-center" dir="ltr">
        {translationText}
      </p>
    </div>
  );
}
