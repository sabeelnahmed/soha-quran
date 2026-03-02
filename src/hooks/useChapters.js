import { useEffect } from 'react';
import { useQuranContext } from '../context/QuranContext';
import { getChapters, getJuzList } from '../services/quranApi';

export function useChapters() {
  const { state, dispatch } = useQuranContext();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [chapters, juzList] = await Promise.all([
          getChapters(),
          getJuzList(),
        ]);
        if (!cancelled) {
          dispatch({ type: 'SET_CHAPTERS', payload: chapters });
          dispatch({ type: 'SET_JUZ_LIST', payload: juzList });
        }
      } catch (err) {
        if (!cancelled) {
          dispatch({ type: 'SET_ERROR', payload: err.message });
        }
      }
    }

    if (state.chapters.length === 0) {
      load();
    }

    return () => { cancelled = true; };
  }, []);

  return {
    chapters: state.chapters,
    juzList: state.juzList,
  };
}
