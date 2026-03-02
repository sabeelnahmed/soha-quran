import Markdown from 'react-markdown';

export default function ChatMessage({ message }) {
  const { role, content } = message;

  if (role === 'error') {
    return (
      <div className="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">
        Error: {content}
      </div>
    );
  }

  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-emerald-600 text-white'
            : 'bg-white border border-stone-200 text-stone-800'
        }`}
      >
        {isUser ? (
          <p>{content}</p>
        ) : (
          <div className="prose prose-sm prose-stone max-w-none prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-emerald-700">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
