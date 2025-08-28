import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Suspense, lazy, useEffect } from 'react'; // Import useEffect too
import { useAppStore } from './store';
import UnlockScreen from './components/UnlockScreen';
import MainContent from './components/MainContent';

// Lazy load the FreeTools component
const FreeTools = lazy(() => import('./components/FreeTools.jsx'));

// Preload the component immediately
const preloadFreeTools = () => {
  import('./components/FreeTools.jsx');
};

// Loading component for fallback
const LoadingSpinner = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-black">
    <motion.div
      className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

// It's cleaner to group your original app logic into a "Home" component.
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

// Your main App component is now responsible for routing.
function App() {
  // Preload FreeTools component when the app starts
  useEffect(() => {
    preloadFreeTools();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/freeqr" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <FreeTools />
            </Suspense>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;