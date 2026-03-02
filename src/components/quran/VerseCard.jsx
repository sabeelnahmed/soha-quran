export default function VerseCard({ verse, isSelected, onSelect }) {
  const arabicText = verse.words
    ? verse.words
        .filter(w => w.char_type_name === 'word')
        .map(w => w.text_uthmani || w.text)
        .join(' ')
    : verse.text_uthmani || '';

  return (
    <div
      onClick={() => onSelect(verse.verse_key)}
      className={`
        px-4 py-3 cursor-pointer border-b border-stone-100 transition-colors
        ${isSelected
          ? 'bg-emerald-50 border-l-4 border-l-emerald-600'
          : 'hover:bg-stone-50 border-l-4 border-l-transparent'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-semibold mt-2">
          {verse.verse_number}
        </span>
        <p
          dir="rtl"
          lang="ar"
          className="font-['Uthmani'] text-2xl leading-[2.5] text-stone-900 text-right flex-1"
        >
          {arabicText}
        </p>
      </div>
    </div>
  );
}
