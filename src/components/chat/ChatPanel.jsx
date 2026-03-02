import { useEffect, useRef, useMemo, useState } from 'react';
import { useQuranContext } from '../../context/QuranContext';
import { useChat } from '../../hooks/useChat';
import { getVerseTranslation } from '../../services/quranApi';
import { TRANSLATION_IDS } from '../../utils/constants';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Loader2 } from 'lucide-react';

export default function ChatPanel({ verse }) {
  const messagesEndRef = useRef(null);
  const { state } = useQuranContext();
  const [surahData, setSurahData] = useState(null);

  // Get the surah number from the selected verse
  const surahId = verse?.verse_key ? parseInt(verse.verse_key.split(':')[0]) : null;

  // Collect all loaded verses belonging to the same Surah
  const surahVerses = useMemo(() => {
    if (!surahId) return [];
    return state.verses.filter(
      (v) => parseInt(v.verse_key.split(':')[0]) === surahId
    );
  }, [state.verses, surahId]);

  const surahName = useMemo(() => {
    const ch = state.chapters.find((c) => c.id === surahId);
    return ch ? `${ch.name_simple} (${ch.name_arabic})` : `Surah ${surahId}`;
  }, [state.chapters, surahId]);

  // Build full Arabic text from all Surah verses
  const fullArabicText = useMemo(() => {
    return surahVerses
      .map((v) => {
        const text = v.words
          ? v.words
              .filter((w) => w.char_type_name === 'word')
              .map((w) => w.text_uthmani || w.text)
              .join(' ')
          : '';
        return `[${v.verse_key}] ${text}`;
      })
      .join('\n');
  }, [surahVerses]);

  // Fetch full translations for all Surah verses
  useEffect(() => {
    if (!surahId || surahVerses.length === 0) return;
    let cancelled = false;

    Promise.all(
      surahVerses.map((v) =>
        getVerseTranslation(v.verse_key, TRANSLATION_IDS.en)
          .then((data) => ({
            key: v.verse_key,
            text: data?.translations?.[0]?.text?.replace(/<[^>]*>/g, '') || '',
          }))
          .catch(() => ({
            key: v.verse_key,
            text: v.words
              ? v.words
                  .filter((w) => w.char_type_name === 'word')
                  .map((w) => w.translation?.text || '')
                  .join(' ')
              : '',
          }))
      )
    ).then((translations) => {
      if (!cancelled) {
        const fullTranslation = translations
          .map((t) => `[${t.key}] ${t.text}`)
          .join('\n');
        setSurahData({
          surahId,
          surahName,
          arabicText: fullArabicText,
          translation: fullTranslation,
          verseCount: surahVerses.length,
        });
      }
    });

    return () => { cancelled = true; };
  }, [surahId, surahVerses.length]);

  // Use surahId as the chat key so the conversation is per-Surah
  const chatKey = surahData ? `surah-${surahData.surahId}` : null;

  const { messages, isLoading, sendMessage } = useChat(
    chatKey,
    surahData?.arabicText || '',
    surahData?.translation || '',
    surahData?.surahName || ''
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="h-full flex flex-col">
      {/* Surah context bar */}
      <div className="px-4 py-2 bg-white border-b border-stone-200">
        <p className="text-xs text-stone-500">
          Tafsir for{' '}
          <span className="font-semibold text-emerald-700">{surahName}</span>
          <span className="text-stone-400 ml-1">
            ({surahVerses.length} verses loaded)
          </span>
        </p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!surahData && !isLoading && (
          <div className="text-center text-stone-400 text-sm py-8">
            Loading verse data...
          </div>
        )}

        {messages.length === 0 && surahData && !isLoading && (
          <div className="text-center text-stone-400 text-sm py-8">
            Preparing tafsir...
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-stone-400 text-sm py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating tafsir for {surahName}...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
