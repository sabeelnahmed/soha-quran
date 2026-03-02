import { useMemo } from 'react';
import { useQuranContext } from '../../context/QuranContext';
import { BookOpen, MessageCircle } from 'lucide-react';
import WordByWord from './WordByWord';
import LanguageToggle from './LanguageToggle';
import ChatPanel from '../chat/ChatPanel';

export default function RightPanel() {
  const { state, dispatch } = useQuranContext();
  const { activeTab, selectedVerseKey, verses } = state;

  const selectedVerse = useMemo(
    () => verses.find(v => v.verse_key === selectedVerseKey),
    [verses, selectedVerseKey]
  );

  return (
    <div className="bg-stone-50 flex flex-col h-[calc(100vh-56px)] overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-stone-200 bg-white">
        <button
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'translation' })}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'translation'
              ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white'
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Translation
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'chat' })}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white'
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          AI Tafsir
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {!selectedVerse ? (
          <div className="flex items-center justify-center h-full text-stone-400 text-sm">
            Select a verse to see its translation
          </div>
        ) : activeTab === 'translation' ? (
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-white border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Verse {selectedVerseKey}
              </span>
              <LanguageToggle />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <WordByWord verse={selectedVerse} />
            </div>
          </div>
        ) : (
          <ChatPanel verse={selectedVerse} />
        )}
      </div>
    </div>
  );
}
