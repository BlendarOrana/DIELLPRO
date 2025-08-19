import { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added for animations
import { DiellLogo } from 'diell-logo'; // Assuming this is your logo component
import {
    Laptop,
    WandSparkles,
    MoveUpRight,
    Sun,
    Moon,
    Bell,
    Settings,
    User,
    Heart,
    MessageCircle,
    Share,
    Play,
    Pause,
    SkipForward,
    Volume2,
    Wifi,
    Battery,
    Signal
} from 'lucide-react';

// === LAZY LOADED COMPONENTS === //
const VerticalContent = lazy(() => import('./VerticalContent'));

// === STATIC DATA (moved outside components) === //
const TECH_SKILLS = [
    { text: 'React', color: '#61DAFB' },
    { text: 'Framer Motion', color: '#BB44B3' },
    { text: 'TypeScript', color: '#3178C6' },
    { text: 'Tailwind CSS', color: '#38BDF8' },
    { text: 'DaisyUI', color: '#fbbf24' },
];

const DEMO_NAMES = ['theme-toggle', 'music-player', 'social-feed', 'dashboard', 'notifications'];

const NOTIFICATION_MESSAGES = ['New message from Sarah', 'Payment received $250', 'System update available'];

// Animation variants (static)
const DEMO_VARIANTS = {
    initial: { opacity: 0, x: 50, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.98 },
};

const DEMO_TRANSITION = { type: 'spring', stiffness: 300, damping: 30, duration: 0.6 };

// === THEME CONFIGURATIONS === //
const THEMES = {
    dark: { bg: 'bg-neutral-900', cardBg: 'bg-neutral-800', text: 'text-white', subText: 'text-neutral-300' },
    light: { bg: 'bg-green-300', cardBg: 'bg-neutral-100', text: 'text-neutral-900', subText: 'text-neutral-600' }
};

// === HELPER & DECORATIVE COMPONENTS === //
const TechStackCarousel = memo(() => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % TECH_SKILLS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-8 flex flex-wrap gap-3" aria-label="Our Tech Stack">
            {TECH_SKILLS.map((skill, index) => {
                const isActive = index === currentIndex;
                return (
                    <div
                        key={skill.text}
                        className="font-mono text-sm font-bold h-10 flex items-center justify-center px-4 rounded-full border transition-all duration-500"
                        style={{
                            color: isActive ? '#0a0a0a' : skill.color,
                            backgroundColor: isActive ? skill.color : 'rgba(255, 255, 255, 0.05)',
                            borderColor: skill.color,
                            boxShadow: isActive ? `0 0 20px ${skill.color}` : 'none',
                        }}
                    >
                        <span>{skill.text}</span>
                    </div>
                );
            })}
        </div>
    );
});

// === MEMOIZED DEMO COMPONENTS === //
const ThemeDemo = memo(({ theme, isDarkMode, setIsDarkMode }) => (
    <motion.div variants={DEMO_VARIANTS} initial="initial" animate="animate" exit="exit" transition={DEMO_TRANSITION} className={`w-full h-full p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 ${theme.text}`}>
        <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold">Settings</h3>
            <motion.div
                className={`relative w-12 h-6 sm:w-14 sm:h-8 rounded-full cursor-pointer flex items-center transition-colors duration-500 ${isDarkMode ? 'bg-yellow-500 justify-end' : 'bg-neutral-300 justify-start'}`}
                onClick={() => setIsDarkMode(!isDarkMode)}
            >
                <motion.div layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} className={`w-5 h-5 sm:w-6 sm:h-6 m-0.5 sm:m-1 rounded-full shadow-lg flex items-center justify-center ${isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
                    <AnimatePresence mode="wait" initial={false}>
                        {isDarkMode ?
                            <motion.div key="moon" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}><Moon size={12} className="sm:w-3.5 sm:h-3.5" /></motion.div> :
                            <motion.div key="sun" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}><Sun size={12} className="sm:w-3.5 sm:h-3.5" /></motion.div>
                        }
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
        <div className={`p-3 sm:p-4 rounded-xl transition-colors duration-500 ${theme.cardBg}`}>
            <div className="flex items-center gap-2 sm:gap-3">
                <User className={theme.subText} size={16} />
                <div>
                    <p className="font-medium text-sm sm:text-base">Dark Mode</p>
                    <p className={`text-xs sm:text-sm ${theme.subText}`}>Automatically switches themes</p>
                </div>
            </div>
        </div>
    </motion.div>
));

const MusicPlayerDemo = memo(({ isPlaying, setIsPlaying, progress }) => (
    <motion.div variants={DEMO_VARIANTS} initial="initial" animate="animate" exit="exit" transition={DEMO_TRANSITION} className="w-full h-full p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 text-white">
        <div className="text-center">
            <motion.div animate={{ scale: isPlaying ? 1.05 : 1, transition: { duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }} className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl lg:rounded-2xl mb-3 sm:mb-4 flex items-center justify-center shadow-2xl">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 bg-white/20 rounded-lg lg:rounded-xl backdrop-blur-sm"></div>
            </motion.div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold">Midnight Vibes</h3>
            <p className="text-neutral-400 text-sm sm:text-base">Lo-Fi Beats</p>
        </div>
        <div className="space-y-2 sm:space-y-3">
            <div className="w-full bg-neutral-700 rounded-full h-1 sm:h-1.5"><motion.div className="bg-yellow-500 h-1 sm:h-1.5 rounded-full" style={{ width: `${progress}%` }} /></div>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
                <SkipForward size={20} className="sm:w-6 sm:h-6 rotate-180 text-neutral-400" />
                <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-yellow-500 rounded-full flex items-center justify-center focus:outline-none" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black" /> : <Play size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black ml-0.5" />}
                </motion.button>
                <SkipForward size={20} className="sm:w-6 sm:h-6 text-neutral-400" />
            </div>
        </div>
    </motion.div>
));

const SocialFeedDemo = memo(({ isLiked, likes }) => (
    <motion.div variants={DEMO_VARIANTS} initial="initial" animate="animate" exit="exit" transition={DEMO_TRANSITION} className="w-full h-full p-6 space-y-4 text-white">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
            <div><p className="font-semibold">Alex Designer</p><p className="text-sm text-neutral-400">2 minutes ago</p></div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl"><p className="mb-3">Just shipped our new dashboard redesign! ✨ The animations turned out incredible.</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <motion.button className={`flex items-center gap-2 transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-neutral-400'}`} animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.4 }}>
                        <Heart size={18} className={isLiked ? 'fill-current' : ''} /> <span className="text-sm">{likes}</span>
                    </motion.button>
                    <button className="flex items-center gap-2 text-neutral-400"><MessageCircle size={18} /> <span className="text-sm">23</span></button>
                </div>
                <button className="text-neutral-400"><Share size={18} /></button>
            </div>
        </div>
    </motion.div>
));

const DashboardDemo = memo(({ isDarkMode }) => (
    <motion.div variants={DEMO_VARIANTS} initial="initial" animate="animate" exit="exit" transition={DEMO_TRANSITION} className="w-full h-full p-6 space-y-4 text-white">
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Analytics Dashboard</h3>
        <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : 'bg-green-100'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-neutral-300' : 'text-green-800/80'}`}>Revenue</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>$12.4k</p>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>+12%</p>
            </div>
            <div className={`p-3 rounded-xl transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20' : 'bg-blue-100'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-neutral-300' : 'text-blue-800/80'}`}>Users</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>2.1k</p>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>+8%</p>
            </div>
        </div>
        <div className={`p-4 rounded-xl transition-colors duration-500 ${isDarkMode ? 'bg-neutral-800/50' : 'bg-neutral-100'}`}>
            <motion.div variants={{ animate: { transition: { staggerChildren: 0.07 } } }} className="flex items-end gap-1.5 h-20">
                {[40, 65, 30, 80, 55, 90, 45, 75].map((height, i) => (
                    <motion.div 
                      key={i} 
                      variants={{ initial: { height: '0%' }, animate: { height: `${height}%` } }} 
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }} 
                      className={`rounded-t-sm flex-1 transition-colors duration-500 ${isDarkMode ? 'bg-yellow-500/60' : 'bg-yellow-400'}`} 
                    />
                ))}
            </motion.div>
        </div>
    </motion.div>
));

const NotificationsDemo = memo(({ notifications }) => (
    <motion.div variants={DEMO_VARIANTS} initial="initial" animate="animate" exit="exit" transition={DEMO_TRANSITION} className="w-full h-full p-6 space-y-3 text-white">
        <div className="flex items-center gap-2 mb-4"><Bell size={20} className="text-yellow-500" /><h3 className="text-lg font-semibold">Notifications</h3></div>
        <motion.div variants={{ animate: { transition: { staggerChildren: 0.2 } } }} className="space-y-2 max-h-64 overflow-hidden">
            {notifications.map((notif) => (
                <motion.div key={notif.id} variants={{ initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } }} transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="bg-neutral-800/70 p-3 rounded-lg border-l-4 border-yellow-500">
                    <p className="text-sm">{notif.message}</p><p className="text-xs text-neutral-400">Just now</p>
                </motion.div>
            ))}
        </motion.div>
    </motion.div>
));

// === LAZY LOADED SHOWCASE NODE === //
const ShowcaseNode = memo(({ isVisible }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [likes, setLikes] = useState(665);
    const [isLiked, setIsLiked] = useState(false);
    const [batteryLevel, setBatteryLevel] = useState(85);
    const [signalStrength, setSignalStrength] = useState(4);
    
    const currentDemo = DEMO_NAMES[currentDemoIndex];

    // Memoized theme object
    const theme = useMemo(() => 
        isDarkMode ? THEMES.dark : THEMES.light, 
        [isDarkMode]
    );

    // Memoized demo components object
    const demoComponents = useMemo(() => ({
        'theme-toggle': <ThemeDemo theme={theme} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />,
        'music-player': <MusicPlayerDemo isPlaying={isPlaying} setIsPlaying={setIsPlaying} progress={progress} />,
        'social-feed': <SocialFeedDemo isLiked={isLiked} likes={likes} />,
        'dashboard': <DashboardDemo isDarkMode={isDarkMode} />,
        'notifications': <NotificationsDemo notifications={notifications} />,
    }), [theme, isDarkMode, isPlaying, progress, isLiked, likes, notifications]);

    // Auto-cycle through demos
    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setCurrentDemoIndex(prev => (prev + 1) % DEMO_NAMES.length);
        }, 5500);
        return () => clearInterval(interval);
    }, [isVisible]);
    
    // Demo state management
    useEffect(() => {
        const resetAll = () => {
            setIsPlaying(false);
            setProgress(0);
            setIsLiked(false);
            setLikes(665);
            setNotifications([]);
        };
        
        resetAll();
        
        switch (currentDemo) {
            case 'theme-toggle':
                setTimeout(() => setIsDarkMode(prev => !prev), 2500);
                break;
            case 'music-player':
                setTimeout(() => setIsPlaying(true), 1000);
                break;
            case 'social-feed':
                setTimeout(() => { setIsLiked(true); setLikes(666); }, 2500);
                break;
            case 'notifications':
                NOTIFICATION_MESSAGES.forEach((message, index) => {
                    setTimeout(() => {
                        setNotifications(prev => [...prev, { id: Date.now() + index, message }]);
                    }, (index + 1) * 900);
                });
                break;
            default: break;
        }
    }, [currentDemo]);
    
    // Music player progress animation
    useEffect(() => {
        if (!isPlaying || currentDemo !== 'music-player') return;
        const interval = setInterval(() => setProgress(p => (p >= 100 ? 0 : p + 1.5)), 100);
        return () => clearInterval(interval);
    }, [isPlaying, currentDemo]);

    // Battery and signal simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setBatteryLevel(prev => (prev <= 20 ? 95 : prev - 1));
            setSignalStrength(prev => Math.max(1, Math.min(4, prev + (Math.random() > 0.5 ? 1 : -1))));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="w-full h-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[300px] sm:max-h-[350px] lg:max-h-[450px] bg-black/30 backdrop-blur-md rounded-xl border border-neutral-800 shadow-2xl overflow-hidden transition-all duration-1000 mx-auto"
            style={{
                boxShadow: isVisible ? `0 0 40px -10px var(--color-frontend)` : '0 0 20px -10px var(--color-frontend)',
                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                opacity: isVisible ? 1 : 0.8,
            }}
        >
            {/* Phone Header */}
            <div className="h-8 sm:h-9 bg-neutral-900/90 flex items-center justify-between px-3 sm:px-4 border-b border-neutral-700">
                <div className="flex gap-1.5 sm:gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/70 hover:bg-red-500"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/70 hover:bg-green-500"></div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-neutral-400">
                    <div className="flex items-end gap-0.5">
                        {[...Array(4)].map((_, i) => (
                           <div key={i} className={`w-0.5 sm:w-1 rounded-sm transition-all ${ i < signalStrength ? 'bg-yellow-500' : 'bg-neutral-600'}`} style={{ height: `${(i + 1) * 1.5 + 2}px` }} />
                        ))}
                    </div>
                    <Wifi size={10} className="sm:w-3 sm:h-3" />
                    <div className="flex items-center gap-1"><Battery size={10} className="sm:w-3 sm:h-3" /> <span className="text-xs">{batteryLevel}%</span></div>
                </div>
            </div>

            {/* Demo Content */}
            <div className={`h-full transition-colors duration-700 ${theme.bg}`}>
                <AnimatePresence mode="wait">
                    {demoComponents[currentDemo]}
                </AnimatePresence>
            </div>
            
            {/* Demo indicator dots */}
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                {DEMO_NAMES.map((_, index) => (
                    <div key={index} className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${currentDemoIndex === index ? 'bg-yellow-500 w-4 sm:w-6' : 'bg-neutral-600 w-1.5 sm:w-2'}`} />
                ))}
            </div>
        </div>
    );
});

// === STYLING & PAGE HELPERS === //
const GlobalStyles = memo(() => ( 
    <style>{`:root { --color-frontend: #fbbf24; --color-backend: #22c55e; --color-grid-frontend: rgba(251, 191, 36, 0.08); --color-grid-backend: rgba(34, 197, 94, 0.08); --color-text-main: #EAEAEA; --color-text-subtle: #A0A0A0; } html, body { margin: 0; padding: 0; overflow: hidden; background-color: #000; color: var(--color-text-main); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } .scroll-container { height: 100vh; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; } .scroll-container::-webkit-scrollbar { display: none; } @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 1s ease-out forwards; }`}
    </style> 
));

const AnimatedContent = memo(({ scrollX, trigger, children, className = '' }) => { 
    const isVisible = scrollX >= trigger; 
    return ( 
        <div className={`transition-all duration-700 ease-out ${className}`} style={{ opacity: isVisible ? 1 : 0, transform: `translateY(${isVisible ? 0 : '20px'})` }} > 
            {children} 
        </div> 
    ); 
});

const InfoNode = memo(({ scrollX, trigger, Icon, title, text, color }) => { 
    const screenW = window.innerWidth; 
    const isVisible = scrollX >= trigger; 
    const nodeCenter = trigger + screenW / 2; 
    const distanceFromCenter = nodeCenter - scrollX; 
    const parallax = -distanceFromCenter * 0.1; 
    const scale = 1 - Math.min(Math.abs(distanceFromCenter) / screenW, 0.2); 
    
    return ( 
        <div className="w-screen h-screen flex items-center justify-center font-sans px-8"> 
            <div className="text-center transition-all duration-700 ease-out flex flex-col items-center gap-4" style={{ opacity: isVisible ? 1 : 0, transform: `translateY(${parallax}px) scale(${scale})` }} > 
                <div className="rounded-full p-4 border-2" style={{ borderColor: color, boxShadow: `0 0 30px ${color}` }}> 
                    <Icon size={40} color={color} /> 
                </div> 
                <h2 className="text-5xl font-bold tracking-tight mt-4" style={{ color: color }}>{title}</h2> 
                <p className="text-xl text-neutral-400 max-w-lg mt-2">{text}</p> 
            </div> 
        </div> 
    ); 
});

// === PROGRESS BAR === //
const ProgressBar = memo(({ isHorizontalMode, progress }) => {
    const targetColor = isHorizontalMode ? 'var(--color-frontend)' : 'var(--color-backend)';
    const safeProgress = Math.max(0, Math.min(progress, 1));

    return (
        <div className="fixed bottom-0 left-0 w-full h-1 bg-neutral-900 z-50">
            <motion.div
                className="h-full origin-left w-full"
                initial={false}
                animate={{
                    scaleX: safeProgress,
                    backgroundColor: targetColor,
                    boxShadow: `0 0 10px ${targetColor}, 0 0 20px ${targetColor}`,
                }}
                transition={{
                    scaleX: {
                        type: 'spring',
                        stiffness: 100,
                        damping: 25,
                        restDelta: 0.001,
                    },
                    backgroundColor: { type: 'tween', duration: 0.5, ease: 'easeIn' },
                    boxShadow: { type: 'tween', duration: 0.5, ease: 'easeIn' },
                }}
            />
        </div>
    );
});

// === LAZY LOADED SHOWCASE WRAPPER === //
const LazyShowcaseNode = memo(({ isVisible }) => {
    // Only render when visible
    if (!isVisible) {
        return (
            <div className="flex items-center justify-center min-h-[220px] sm:min-h-[280px] lg:min-h-0">
                <div className="w-full h-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[300px] sm:max-h-[350px] lg:max-h-[450px] bg-black/20 backdrop-blur-md rounded-xl border border-neutral-800 shadow-xl overflow-hidden mx-auto flex items-center justify-center">
                    <div className="text-neutral-500">Loading...</div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex items-center justify-center min-h-[220px] sm:min-h-[280px] lg:min-h-0">
            <Suspense fallback={
                <div className="w-full h-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[300px] sm:max-h-[350px] lg:max-h-[450px] bg-black/20 backdrop-blur-md rounded-xl border border-neutral-800 shadow-xl overflow-hidden mx-auto flex items-center justify-center">
                    <div className="text-neutral-500">Loading showcase...</div>
                </div>
            }>
                <ShowcaseNode isVisible={isVisible} />
            </Suspense>
        </div>
    );
});

// --- MAIN PAGE COMPONENT --- //
const DiellPage = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [verticalScrollProgress, setVerticalScrollProgress] = useState(0);
    const [isHorizontalMode, setIsHorizontalMode] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const pageContainerRef = useRef(null);
    const horizontalContentRef = useRef(null);
    const verticalContentRef = useRef(null);
    const animationFrameId = useRef(null);
    const currentScrollX = useRef(0);
    const targetScrollX = useRef(0);
    
    // Memoized calculations
    const screenW = useMemo(() => window.innerWidth, []);
    const numHorizontalSections = useMemo(() => 3, []);
    const totalHorizontalWidth = useMemo(() => screenW * (numHorizontalSections - 1), [screenW, numHorizontalSections]);
    
    const horizontalProgress = useMemo(() => scrollPosition / totalHorizontalWidth, [scrollPosition, totalHorizontalWidth]);
    const currentProgress = isHorizontalMode ? horizontalProgress : verticalScrollProgress;
    const isShowcaseVisible = useMemo(() => 
        scrollPosition > screenW * 0.4 && scrollPosition < screenW * 1.6, 
        [scrollPosition, screenW]
    );

    // Smooth scroll animation loop
    useEffect(() => {
        const smoothScrollLoop = () => {
            const easing = 0.1;
            currentScrollX.current += (targetScrollX.current - currentScrollX.current) * easing;
            if (Math.abs(targetScrollX.current - currentScrollX.current) < 0.5) {
                currentScrollX.current = targetScrollX.current;
            }
            setScrollPosition(currentScrollX.current);
            if (horizontalContentRef.current) {
                horizontalContentRef.current.style.transform = `translateX(-${currentScrollX.current}px)`;
            }
            animationFrameId.current = requestAnimationFrame(smoothScrollLoop);
        };
        animationFrameId.current = requestAnimationFrame(smoothScrollLoop);
        return () => cancelAnimationFrame(animationFrameId.current);
    }, []);

    // Memoized wheel handler
    const handleWheel = useCallback((e) => {
        if (isHorizontalMode) e.preventDefault();
        if (isTransitioning) return;
        const delta = e.deltaY;
        
        if (isHorizontalMode) {
            targetScrollX.current = Math.max(0, Math.min(targetScrollX.current + delta, totalHorizontalWidth));
            
            if (targetScrollX.current >= totalHorizontalWidth && delta > 0) {
                targetScrollX.current = totalHorizontalWidth;
                setIsTransitioning(true);
                
                setTimeout(() => setIsHorizontalMode(false), 200);
                
                setTimeout(() => {
                    const container = verticalContentRef.current;
                    if (!container) return;
                    
                    container.scrollTo({ top: 0, behavior: 'auto' });
                    
                    const fallDuration = 1200;
                    const fallDistance = window.innerHeight * 5.5;
                    const startTime = Date.now();
                    
                    const animateFall = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / fallDuration, 1);
                        
                        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                        const currentScrollTop = easeOutCubic * fallDistance;
                        
                        container.scrollTop = currentScrollTop;
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateFall);
                        } else {
                            setIsTransitioning(false);
                        }
                    };
                    
                    requestAnimationFrame(animateFall);
                }, 400);
            }
        } else {
            const container = verticalContentRef.current;
            if (!container) return;
            
            if (delta < 0 && container.scrollTop <= 0) {
                e.preventDefault();
                container.scrollTo({ top: 0, behavior: 'auto' });
                setIsTransitioning(true);
                setIsHorizontalMode(true);
                setTimeout(() => setIsTransitioning(false), 1200);
            }
        }
    }, [isHorizontalMode, isTransitioning, totalHorizontalWidth]);

    // Memoized touch handlers
    const handleTouchStart = useCallback((e) => {
        if (isTransitioning) return;
        
        const touch = e.touches[0];
        const touchStartY = touch.clientY;
        
        e.target.touchStartY = touchStartY;
        e.target.lastTouchY = touchStartY;
        e.target.isTrackingTouch = true;
    }, [isTransitioning]);
    
    const handleTouchMove = useCallback((e) => {
        if (!e.target.isTrackingTouch || isTransitioning) return;
        
        const touch = e.touches[0];
        const currentY = touch.clientY;
        const deltaY = currentY - e.target.lastTouchY;
        
        if (isHorizontalMode) {
            e.preventDefault();
            
            const scrollSensitivity = 2.0;
            targetScrollX.current = Math.max(0, 
                Math.min(targetScrollX.current - deltaY * scrollSensitivity, totalHorizontalWidth)
            );
        } else {
            const container = verticalContentRef.current;
            if (container && container.scrollTop <= 0 && deltaY > 0) {
                e.preventDefault();
            }
        }
        
        e.target.lastTouchY = currentY;
    }, [isHorizontalMode, isTransitioning, totalHorizontalWidth]);
    
    const handleTouchEnd = useCallback((e) => {
        if (!e.target.isTrackingTouch || isTransitioning) return;
        
        const touch = e.changedTouches[0];
        const endY = touch.clientY;
        const totalDeltaY = endY - e.target.touchStartY;
        
        if (isHorizontalMode) {
            if (targetScrollX.current >= totalHorizontalWidth && totalDeltaY < -10) {
                targetScrollX.current = totalHorizontalWidth;
                setIsTransitioning(true);
                
                setTimeout(() => setIsHorizontalMode(false), 200);
                
                setTimeout(() => {
                    const container = verticalContentRef.current;
                    if (!container) return;
                    
                    container.scrollTo({ top: 0, behavior: 'auto' });
                    
                    const fallDuration = 1200;
                    const fallDistance = window.innerHeight * 5.5;
                    const startTime = Date.now();
                    
                    const animateFall = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / fallDuration, 1);
                        
                        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                        const currentScrollTop = easeOutCubic * fallDistance;
                        
                        container.scrollTop = currentScrollTop;
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateFall);
                        } else {
                            setIsTransitioning(false);
                        }
                    };
                    
                    requestAnimationFrame(animateFall);
                }, 400);
            }
        } else {
            const container = verticalContentRef.current;
            if (!container) return;
            
            if (container.scrollTop <= 0 && totalDeltaY > 10) {
                container.scrollTo({ top: 0, behavior: 'auto' });
                setIsTransitioning(true);
                setIsHorizontalMode(true);
                setTimeout(() => setIsTransitioning(false), 1200);
            }
        }
        
        e.target.isTrackingTouch = false;
    }, [isHorizontalMode, isTransitioning, totalHorizontalWidth]);

    // Memoized vertical scroll handler
    const handleVerticalScroll = useCallback(() => {
        const container = verticalContentRef.current;
        if (!container) return;
        
        const firstChild = container.firstChild; 
        if(!firstChild) return;
        
        const totalContentHeight = firstChild.scrollHeight;
        const totalScrollableHeight = totalContentHeight - container.offsetHeight;
        const effectiveScrollTop = Math.max(0, container.scrollTop - window.innerHeight);
        const effectiveScrollableHeight = totalScrollableHeight - window.innerHeight;
        
        setVerticalScrollProgress(effectiveScrollableHeight > 0 ? Math.min(effectiveScrollTop / effectiveScrollableHeight, 1) : 1);
    }, []);

    // Event listeners with memoized handlers
    useEffect(() => {
        const node = pageContainerRef.current;
        if (!node) return;
        node.addEventListener('wheel', handleWheel, { passive: false });
        return () => node.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    useEffect(() => {
        const node = pageContainerRef.current;
        if (!node) return;
        
        node.addEventListener('touchstart', handleTouchStart, { passive: true });
        node.addEventListener('touchmove', handleTouchMove, { passive: false });
        node.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        return () => {
            node.removeEventListener('touchstart', handleTouchStart);
            node.removeEventListener('touchmove', handleTouchMove);
            node.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    // Vertical scroll progress tracker
    useEffect(() => {
        const container = verticalContentRef.current;
        if (isHorizontalMode || !container) return;
        
        container.addEventListener('scroll', handleVerticalScroll);
        return () => container.removeEventListener('scroll', handleVerticalScroll);
    }, [isHorizontalMode, handleVerticalScroll]);

    return (
        <>
            <GlobalStyles />
            <div ref={pageContainerRef} className="fixed top-0 left-0 w-full h-full overflow-hidden">
                <div className='absolute top-0 left-0 w-full h-full grid-background-frontend transition-transform duration-1000' style={{ transform: isHorizontalMode ? 'translateY(0%)' : 'translateY(-100%)', transitionTimingFunction: 'cubic-bezier(0.7, 0, 0.3, 1)' }}>
                    <div ref={horizontalContentRef} className="flex absolute top-0 left-0" style={{ width: `${numHorizontalSections * 100}vw`, height: '100vh' }}>
                        
                        {/* Section 1: Hero */}
                        <section className="w-screen h-screen flex flex-col items-center justify-center text-center font-sans p-8">
                            <div style={{ filter: 'drop-shadow(0 0 35px var(--color-frontend))' }}> 
                                <DiellLogo size={250} text='' PrimaryColor="var(--color-frontend)" /> 
                            </div>
                            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <h1 className="text-7xl font-bold tracking-tighter mt-8 text-[var(--color-frontend)]" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.3)'}} > 
                                    Diell 
                                </h1>
                                <p className="text-2xl mt-3 text-neutral-400"> 
                                    <span className='text-[#fbbf24]'>//</span> Building The Exceptional.
                                </p>
                            </div>
                        </section>
            
                        {/* Section 2: Showcase */}
                        <section className="w-screen h-screen flex items-center justify-center p-4 sm:p-8 lg:p-16" style={{ minHeight: '100dvh' }}>
                            <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center w-full max-w-7xl mx-auto py-8 sm:py-0">
                                <AnimatedContent scrollX={scrollPosition} trigger={screenW * 0.7} className="font-sans order-2 lg:order-1">
                                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                                        We Craft. We Engineer.
                                    </h2>
                                    <p className="text-base sm:text-lg lg:text-xl text-neutral-400 mt-3 sm:mt-4 max-w-lg leading-relaxed"> 
                                        We specialize in creating bespoke, high-performance web applications. From interactive UIs to complex data-driven platforms, we transform ambitious ideas into flawless digital realities. 
                                    </p>
                                    <div className="mt-4 sm:mt-6">
                                        <TechStackCarousel />
                                    </div>
                                </AnimatedContent>
                                <LazyShowcaseNode isVisible={isShowcaseVisible} />
                            </div>
                        </section>

                        {/* Section 3: Design Info */}
                        <InfoNode 
                            scrollX={scrollPosition} 
                            trigger={screenW * 1.5} 
                            Icon={WandSparkles} 
                            title="Design-Driven Engineering." 
                            text="Our process lives at the intersection of creative design and technical precision. We build interfaces that are not only beautiful and intuitive but also robust, scalable, and a pleasure to use." 
                            color="var(--color-frontend)" 
                        />
                    </div>
                </div>

                {/* Vertical Content - Lazy Loaded */}
                <div 
                    ref={verticalContentRef} 
                    className="absolute top-0 left-0 w-full h-full scroll-container" 
                    style={{ 
                        transform: isHorizontalMode ? 'translateY(100%)' : 'translateY(0%)', 
                        transition: 'transform 1.0s cubic-bezier(0.7, 0, 0.3, 1)'
                    }}
                >
                    {!isHorizontalMode && (
                        <Suspense fallback={
                            <div className="w-full h-screen flex items-center justify-center">
                                <div className="text-neutral-400">Loading vertical content...</div>
                            </div>
                        }>
                            <VerticalContent />
                        </Suspense>
                    )}
                </div>
            </div>
            <ProgressBar isHorizontalMode={isHorizontalMode} progress={currentProgress} />
        </>
    );
};

export default DiellPage;