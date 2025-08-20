import { AnimatePresence, motion } from 'framer-motion';
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
          <motion.div
            key="main-content"
            initial={{ opacity: 0, backgroundColor: '#000000' }}
            animate={{ opacity: 1, backgroundColor: 'transparent' }}
            transition={{ 
              opacity: { duration: 1.5, ease: 'easeOut' },
              backgroundColor: { duration: 2.0, ease: 'easeInOut' }
            }}
          >
            <MainContent />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;