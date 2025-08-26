import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './store';
import UnlockScreen from './components/UnlockScreen';
import MainContent from './components/MainContent';
import FreeTools from './components/FreeTools.jsx';

// Home page with unlock + main content
const HomePage = () => {
  const isUnlocked = useAppStore((state) => state.isUnlocked);

  return (
    <main className="h-screen w-screen">
      {/* Unlock screen always rendered when locked */}
      <AnimatePresence mode="wait">
        {!isUnlocked && <UnlockScreen key="unlock-screen" />}
      </AnimatePresence>

      {/* Main content is in DOM from start, just hidden until unlocked */}
      <motion.div
        key="main-content"
        initial={{ opacity: 0, backgroundColor: '#000000' }}
        animate={{
          opacity: isUnlocked ? 1 : 0, 
          backgroundColor: isUnlocked ? 'transparent' : '#000000'
        }}
        transition={{
          opacity: { duration: 1.5, ease: 'easeOut' },
          backgroundColor: { duration: 2.0, ease: 'easeInOut' }
        }}
        style={{
          pointerEvents: isUnlocked ? 'auto' : 'none',
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <MainContent />
      </motion.div>
    </main>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/freetools" element={<FreeTools />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
