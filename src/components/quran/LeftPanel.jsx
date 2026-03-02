import { useQuranContext } from '../../context/QuranContext';
import { useVerses } from '../../hooks/useVerses';
import VerseList from './VerseList';
import { Loader2 } from 'lucide-react';

export default function LeftPanel() {
  const { state } = useQuranContext();
  const { loading, error, hasMore, loadMore } = useVerses();

  return (
    <div className="bg-white border-r border-stone-200 flex flex-col h-[calc(100vh-56px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 m-4 bg-red-50 text-red-700 rounded-lg text-sm">
            <p>Failed to load verses: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-red-600 underline text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {state.verses.length > 0 && (
          <VerseList verses={state.verses} />
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="ml-2 text-stone-500 text-sm">Loading verses...</span>
          </div>
        )}

        {!loading && hasMore && (
          <div className="p-4 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
            >
              Load More Verses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
