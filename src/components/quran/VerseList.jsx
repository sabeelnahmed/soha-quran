import { useQuranContext } from '../../context/QuranContext';
import VerseCard from './VerseCard';

export default function VerseList({ verses }) {
  const { state, dispatch } = useQuranContext();

  let lastSurahId = null;

  return (
    <div>
      {verses.map((verse) => {
        const surahId = parseInt(verse.verse_key.split(':')[0]);
        const showHeader = surahId !== lastSurahId;
        lastSurahId = surahId;

        const chapter = state.chapters.find(c => c.id === surahId);

        return (
          <div key={verse.id}>
            {showHeader && (
              <div className="bg-emerald-50 border-y border-emerald-200 px-4 py-3 text-center">
                <h2 className="text-emerald-800 font-semibold text-base">
                  {chapter?.name_simple || `Surah ${surahId}`}
                </h2>
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-['Uthmani'] text-emerald-700 text-xl mt-1"
                >
                  {chapter?.name_arabic}
                </p>
                {chapter?.translated_name && (
                  <p className="text-emerald-600 text-xs mt-0.5">
                    {chapter.translated_name.name} &middot; {chapter.verses_count} verses
                  </p>
                )}
                {/* Bismillah - skip for Surah 9 (At-Tawbah) and Surah 1 (Al-Fatiha has it in verse 1) */}
                {surahId !== 9 && surahId !== 1 && (
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-['Uthmani'] text-stone-700 text-xl mt-3"
                  >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                  </p>
                )}
              </div>
            )}
            <VerseCard
              verse={verse}
              isSelected={state.selectedVerseKey === verse.verse_key}
              onSelect={(key) => dispatch({ type: 'SELECT_VERSE', payload: key })}
            />
          </div>
        );
      })}
    </div>
  );
}
