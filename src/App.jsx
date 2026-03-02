import { QuranProvider } from './context/QuranContext';
import Layout from './components/Layout';

function App() {
  return (
    <QuranProvider>
      <Layout />
    </QuranProvider>
  );
}

export default App;
