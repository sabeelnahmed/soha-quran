import { useQuranContext } from '../../context/QuranContext';
import { TOTAL_JUZ } from '../../utils/constants';

export default function JuzSelector() {
  const { state, dispatch } = useQuranContext();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="juz-select" className="text-emerald-200 text-sm">
        Juz
      </label>
      <select
        id="juz-select"
        value={state.selectedJuz}
        onChange={(e) => dispatch({ type: 'SET_JUZ', payload: Number(e.target.value) })}
        className="bg-emerald-700 text-white border border-emerald-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {Array.from({ length: TOTAL_JUZ }, (_, i) => i + 1).map((juz) => (
          <option key={juz} value={juz}>
            {juz}
          </option>
        ))}
      </select>
    </div>
  );
}
