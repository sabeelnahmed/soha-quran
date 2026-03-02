import { useMemo } from 'react';
import { useQuranContext } from '../../context/QuranContext';

export default function SurahList() {
  const { state } = useQuranContext();
  const { juzList, chapters, selectedJuz } = state;

  const surahsInJuz = useMemo(() => {
    const juz = juzList.find(j => j.juz_number === selectedJuz);
    if (!juz || !juz.verse_mapping) return [];

    return Object.entries(juz.verse_mapping).map(([surahId, verseRange]) => {
      const chapter = chapters.find(c => c.id === Number(surahId));
      return {
        id: Number(surahId),
        name: chapter?.name_simple || `Surah ${surahId}`,
        nameArabic: chapter?.name_arabic || '',
        verseRange,
      };
    });
  }, [juzList, chapters, selectedJuz]);

  if (surahsInJuz.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-emerald-200 text-sm">Surahs:</span>
      <div className="flex gap-1 flex-wrap">
        {surahsInJuz.map((surah) => (
          <span
            key={surah.id}
            className="bg-emerald-700/50 text-emerald-100 text-xs px-2 py-1 rounded-md"
          >
            {surah.name} ({surah.verseRange})
          </span>
        ))}
      </div>
    </div>
  );
}
