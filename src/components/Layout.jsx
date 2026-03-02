import { useChapters } from '../hooks/useChapters';
import { useVerses } from '../hooks/useVerses';
import JuzSelector from './navigation/JuzSelector';
import SurahList from './navigation/SurahList';
import LeftPanel from './quran/LeftPanel';
import RightPanel from './translation/RightPanel';

export default function Layout() {
  useChapters();
  useVerses();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-emerald-800 text-white px-4 py-3 shadow-lg">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-4 flex-wrap">
          <h1 className="text-lg font-semibold tracking-wide mr-4">
            Quran Learning
          </h1>
          <JuzSelector />
          <SurahList />
        </div>
      </nav>

      {/* Main Content - Split Panel */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-screen-2xl mx-auto w-full">
        <LeftPanel />
        <RightPanel />
      </main>
    </div>
  );
}
