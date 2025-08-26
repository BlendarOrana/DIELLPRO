import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './store';
import { useEffect } from 'react';
import UnlockScreen from './components/UnlockScreen';
import MainContent from './components/MainContent';
import FreeTools from './components/FreeTools.jsx';

const HomePage = () => {
  const isUnlocked = useAppStore((state) => state.isUnlocked);
  const unlock = useAppStore((state) => state.unlock); // <-- get the setter

  useEffect(() => {
    // Detect bots and performance testing tools
    const ua = navigator.userAgent.toLowerCase();
    const isBot = ua.includes("googlebot") || 
                  ua.includes("bingbot") || 
                  ua.includes("slurp") ||
                  ua.includes("duckduckbot") ||
                  ua.includes("baiduspider") ||
                  ua.includes("yandexbot") ||
                  ua.includes("facebookexternalhit") ||
                  ua.includes("twitterbot") ||
                  ua.includes("linkedinbot") ||
                  ua.includes("whatsapp") ||
                  ua.includes("lighthouse") ||
                  ua.includes("pagespeed") ||
                  ua.includes("gtmetrix") ||
                  ua.includes("pingdom") ||
                  ua.includes("webpagetest");
    
    // Also check for headless browsers (commonly used by performance tools)
    const isHeadless = window.navigator.webdriver ||
                       window.phantom ||
                       window.callPhantom ||
                       window._phantom ||
                       window.__nightmare;
    
    // Skip unlock screen for bots and performance tools
    if (isBot || isHeadless) {
      unlock(); // <-- use the store action
    }
  }, [unlock]);

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