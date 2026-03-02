import { useState, useEffect, useRef, useCallback } from 'react';
import { getInterpretation, sendChatMessage, buildSystemPrompt } from '../services/groqApi';

export function useChat(chatKey, arabicText, translation, surahName) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const historyRef = useRef(new Map());

  useEffect(() => {
    if (!chatKey || !arabicText || !translation) return;

    if (historyRef.current.has(chatKey)) {
      setMessages(historyRef.current.get(chatKey));
      return;
    }

    // Auto-generate interpretation for the whole Surah passage
    let cancelled = false;
    setIsLoading(true);
    setMessages([]);

    getInterpretation(surahName || chatKey, arabicText, translation)
      .then((content) => {
        if (!cancelled) {
          const newMessages = [{ role: 'assistant', content }];
          setMessages(newMessages);
          historyRef.current.set(chatKey, newMessages);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setMessages([{ role: 'error', content: err.message }]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [chatKey, arabicText, translation]);

  const sendMessage = useCallback(async (userMessage) => {
    if (!chatKey) return;

    const updated = [...messages, { role: 'user', content: userMessage }];
    setMessages(updated);
    setIsLoading(true);

    try {
      const groqMessages = [
        { role: 'system', content: buildSystemPrompt(surahName || chatKey, arabicText, translation) },
        ...updated.filter(m => m.role !== 'error').map(m => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const response = await sendChatMessage(groqMessages);
      const withResponse = [...updated, { role: 'assistant', content: response }];
      setMessages(withResponse);
      historyRef.current.set(chatKey, withResponse);
    } catch (err) {
      setMessages([...updated, { role: 'error', content: err.message }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatKey, arabicText, translation, surahName, messages]);

  return { messages, isLoading, sendMessage };
}
