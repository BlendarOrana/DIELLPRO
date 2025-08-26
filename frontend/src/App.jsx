import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; // 1. Import routing components
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useAppStore } from './store';
import UnlockScreen from './components/UnlockScreen';
import MainContent from './components/MainContent';
import FreeTools from './components/FreeTools.jsx'; // 2. Import your new component



// 4. It's cleaner to group your original app logic into a "Home" component.
const HomePage = () => {
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

// 5. Your main App component is now responsible for routing.
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