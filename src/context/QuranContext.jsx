import { createContext, useContext, useReducer } from 'react';

const QuranContext = createContext(null);

const initialState = {
  selectedJuz: 1,
  currentPage: 1,

  juzList: [],
  chapters: [],

  verses: [],
  pagination: null,

  selectedVerseKey: null,

  wordLanguage: 'en',
  activeTab: 'translation',

  loading: false,
  error: null,
};

function quranReducer(state, action) {
  switch (action.type) {
    case 'SET_JUZ':
      return {
        ...state,
        selectedJuz: action.payload,
        currentPage: 1,
        verses: [],
        selectedVerseKey: null,
        pagination: null,
      };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_JUZ_LIST':
      return { ...state, juzList: action.payload };
    case 'SET_CHAPTERS':
      return { ...state, chapters: action.payload };
    case 'SET_VERSES':
      return { ...state, verses: action.payload };
    case 'APPEND_VERSES':
      return { ...state, verses: [...state.verses, ...action.payload] };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    case 'SELECT_VERSE':
      return { ...state, selectedVerseKey: action.payload };
    case 'SET_LANGUAGE':
      return {
        ...state,
        wordLanguage: action.payload,
        currentPage: 1,
        verses: [],
        pagination: null,
      };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function QuranProvider({ children }) {
  const [state, dispatch] = useReducer(quranReducer, initialState);
  return (
    <QuranContext.Provider value={{ state, dispatch }}>
      {children}
    </QuranContext.Provider>
  );
}

export function useQuranContext() {
  const context = useContext(QuranContext);
  if (!context) {
    throw new Error('useQuranContext must be used within a QuranProvider');
  }
  return context;
}
