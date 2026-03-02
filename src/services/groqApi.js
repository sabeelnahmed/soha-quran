import { GROQ_API_URL, GROQ_API_KEY, GROQ_MODEL } from '../utils/constants';

const SYSTEM_PROMPT = `You are a knowledgeable Islamic scholar providing comprehensive, accessible tafsir (interpretation) of Quranic passages. You will be given ALL the verses of a Surah (or a passage from it). Provide a COMPLETE interpretation covering EVERY verse together as a unified passage. Structure your response as follows:

1. **Overview of the Surah/Passage**: What is this Surah about? What are the main themes?
2. **Historical Context (Asbab al-Nuzul)**: When and why were these verses revealed? What was happening at the time?
3. **Verse-by-Verse Explanation**: Go through the verses and explain what Allah is conveying. Group related verses together where appropriate. Reference classical scholars (Ibn Kathir, Al-Qurtubi, Al-Tabari, etc.) where relevant.
4. **Key Themes & Connections**: How do the verses connect to each other? What is the overall message and flow?
5. **Practical Application**: How should a Muslim apply these teachings in daily life? What are the actionable lessons?

Be respectful, thorough yet accessible. Explain in plain English that anyone can understand. This should be a complete tafsir-level explanation.`;

export function buildSystemPrompt(surahName, arabicText, translation) {
  return `${SYSTEM_PROMPT}

You are currently discussing: ${surahName}

Full Arabic text:
${arabicText}

Full Translation:
${translation}

Answer follow-up questions about these verses clearly and comprehensively.`;
}

export async function getInterpretation(surahName, arabicText, translation) {
  const userPrompt = `Please provide a complete, detailed tafsir (interpretation) of the following Quranic passage from ${surahName}. Explain ALL the verses together as a unified passage — their meaning, context, themes, and how to apply them.

Arabic text:
${arabicText}

Translation:
${translation}`;

  return sendChatMessage([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ]);
}

export async function sendChatMessage(messages) {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
