import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store';
import UnlockScreen from './components/UnlockScreen';
import MainContent from './components/MainContent';

function App() {
  const isUnlocked = useAppStore((state) => state.isUnlocked);

  return (
    <main className="h-screen w-screen">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <UnlockScreen key="unlock-screen" />
        ) : (
          <MainContent key="main-content" />
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;