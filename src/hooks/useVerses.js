import { useEffect, useCallback } from 'react';
import { useQuranContext } from '../context/QuranContext';
import { getVersesByJuz } from '../services/quranApi';

export function useVerses() {
  const { state, dispatch } = useQuranContext();
  const { selectedJuz, wordLanguage, currentPage } = state;

  useEffect(() => {
    let cancelled = false;

    async function fetchVerses() {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const { verses, pagination } = await getVersesByJuz(selectedJuz, {
          language: wordLanguage,
          page: currentPage,
          perPage: 50,
        });

        if (!cancelled) {
          if (currentPage === 1) {
            dispatch({ type: 'SET_VERSES', payload: verses });
          } else {
            dispatch({ type: 'APPEND_VERSES', payload: verses });
          }
          dispatch({ type: 'SET_PAGINATION', payload: pagination });

          // Auto-select first verse if none selected
          if (!state.selectedVerseKey && verses.length > 0) {
            dispatch({ type: 'SELECT_VERSE', payload: verses[0].verse_key });
          }
        }
      } catch (err) {
        if (!cancelled) {
          dispatch({ type: 'SET_ERROR', payload: err.message });
        }
      } finally {
        if (!cancelled) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    }

    fetchVerses();
    return () => { cancelled = true; };
  }, [selectedJuz, wordLanguage, currentPage]);

  const loadMore = useCallback(() => {
    if (state.pagination?.next_page) {
      dispatch({ type: 'SET_PAGE', payload: state.pagination.next_page });
    }
  }, [state.pagination, dispatch]);

  return {
    verses: state.verses,
    pagination: state.pagination,
    loading: state.loading,
    error: state.error,
    loadMore,
    hasMore: !!state.pagination?.next_page,
  };
}
