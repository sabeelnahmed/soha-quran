import WordCard from './WordCard';

export default function WordByWord({ verse }) {
  if (!verse?.words) {
    return (
      <p className="text-stone-400 text-sm text-center py-8">
        No word data available for this verse.
      </p>
    );
  }

  const words = verse.words.filter(w => w.char_type_name === 'word');

  return (
    <div className="flex flex-wrap gap-3 justify-center" dir="rtl">
      {words.map((word) => (
        <WordCard key={word.id} word={word} />
      ))}
    </div>
  );
}
