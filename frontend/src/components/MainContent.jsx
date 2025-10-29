import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Laptop, WandSparkles, Sun, Moon, Bell, Settings, User, Heart,
    MessageCircle, Share, Play, Pause, SkipForward, Volume2,
    ExternalLink, Rocket, Layers, ShieldCheck, Database, Router,
    Loader2, Send, Calendar, ChevronDown
} from 'lucide-react';

// Import your actual DiellLogo
import { DiellLogo } from 'diell-logo';

// Import client logos
// Create a folder named 'logos' in your 'public' directory
// and add your client logos there.
// Example: public/logos/company-a.svg
const clientLogos = [
      {src:'/logos/zemra.png', alt:'lbgroup'},
    { src: '/logos/Kosovamed.webp', alt: 'Kosovamed' },
    { src: '/logos/Logowhite.webp', alt: 'Microsoft' },
    { src: '/logos/hunters.webp', alt: 'hunters' },


];


// Global Styles
const GlobalStyles = () => (
    <style>{`
    :root { 
      --color-frontend: #fbbf24; 
      --color-backend: #22c55e; 
      --color-grid-frontend: rgba(251, 191, 36, 0.08); 
      --color-grid-backend: rgba(34, 197, 94, 0.08); 
      --color-text-main: #EAEAEA; 
      --color-text-subtle: #A0A0A0; 
    } 
    
    html, body { 
      margin: 0; 
      padding: 0; 
      background-color: #000; 
      color: var(--color-text-main); 
      font-family: 'Inter', sans-serif; 
      -webkit-font-smoothing: antialiased; 
      -moz-osx-font-smoothing: grayscale; 
    } 
    
    .grid-background-frontend {
      background-image: 
        linear-gradient(to right, var(--color-grid-frontend) 1px, transparent 1px), 
        linear-gradient(to bottom, var(--color-grid-frontend) 1px, transparent 1px);
      background-size: 80px 80px;
    }
    
    .grid-background-backend {
      background-image: 
        linear-gradient(to right, var(--color-grid-backend) 1px, transparent 1px), 
        linear-gradient(to bottom, var(--color-grid-backend) 1px, transparent 1px);
      background-size: 80px 80px;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .reveal-on-scroll {
      opacity: 0;
      transform: translateY(40px);
      transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .reveal-on-scroll.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #1a1a1a;
    }
    
    ::-webkit-scrollbar-thumb {
      background: var(--color-frontend);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #e5a900;
    }
  `}</style>
);

// Free Tools Navigation Button
const FreeToolsButton = () => (
    <motion.button
onClick={() => window.location.href = '/freeqr'}
        className="fixed top-6 right-6 z-50 bg-yellow-500/20 hover:bg-yellow-500/30 backdrop-blur-md border border-yellow-500/30 rounded-full px-4 py-2 flex items-center gap-2 text-yellow-500 font-medium text-sm transition-all duration-300 hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <span>QR Generator</span>
        <ExternalLink size={16} />
    </motion.button>
);

// Intersection Observer Hook
const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, { threshold: 0.1, ...options });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, isIntersecting];
};

// Wave Text Animation
const WaveText = ({ text, delay = 0 }) => {
    const words = text.split(' ');

    return (
        <div className="inline-block">
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-3">
                    {word.split('').map((letter, letterIndex) => (
                        <motion.span
                            key={letterIndex}
                            className="inline-block"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                delay: delay + (wordIndex * word.length + letterIndex) * 0.05,
                                duration: 0.4,
                                type: "spring",
                                stiffness: 200,
                                damping: 10
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </span>
            ))}
        </div>
    );
};

// Tech Stack Carousel
const TechStackCarousel = () => {
    const skills = [
        { text: 'React', color: '#61DAFB' },
        { text: 'Framer Motion', color: '#BB44B3' },
        { text: 'TypeScript', color: '#3178C6' },
        { text: 'Tailwind CSS', color: '#38BDF8' },
        { text: 'DaisyUI', color: '#fbbf24' },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % skills.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [skills.length]);

    return (
        <div className="mt-8 flex flex-wrap gap-3">
            {skills.map((skill, index) => {
                const isActive = index === currentIndex;
                return (
                    <motion.div
                        key={skill.text}
                        className="font-mono text-sm font-bold h-10 flex items-center justify-center px-4 rounded-full border transition-all duration-500"
                        style={{
                            color: isActive ? '#0a0a0a' : skill.color,
                            backgroundColor: isActive ? skill.color : 'rgba(255, 255, 255, 0.05)',
                            borderColor: skill.color,
                            boxShadow: isActive ? `0 0 20px ${skill.color}` : 'none',
                        }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <span>{skill.text}</span>
                    </motion.div>
                );
            })}
        </div>
    );
};

// Demo Components
const ShowcaseDemo = ({ isVisible }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [likes, setLikes] = useState(665);
    const [isLiked, setIsLiked] = useState(false);
    const [currentDemo, setCurrentDemo] = useState(0);

    const demos = ['settings', 'music', 'social'];

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setCurrentDemo(prev => (prev + 1) % demos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isVisible, demos.length]);

    useEffect(() => {
        if (currentDemo === 0) {
            setTimeout(() => setIsDarkMode(prev => !prev), 1500);
        } else if (currentDemo === 1) {
            setIsPlaying(true);
            setTimeout(() => setIsPlaying(false), 3000);
        } else if (currentDemo === 2) {
            setTimeout(() => {
                setIsLiked(true);
                setLikes(666);
            }, 1500);
        }
    }, [currentDemo]);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setProgress(p => p >= 100 ? 0 : p + 2);
        }, 100);
        return () => clearInterval(interval);
    }, [isPlaying]);

    const theme = isDarkMode ?
        { bg: 'bg-neutral-900', text: 'text-white', subText: 'text-neutral-300' } :
        { bg: 'bg-neutral-100', text: 'text-neutral-900', subText: 'text-neutral-600' };

    return (
        <motion.div
            className={`w-full max-w-sm mx-auto h-80 ${theme.bg} backdrop-blur-md rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden transition-all duration-700`}
            style={{
                boxShadow: isVisible ? `0 0 40px -10px var(--color-frontend)` : 'none',
            }}
            animate={{ scale: isVisible ? 1 : 0.95 }}
        >
            {/* Phone Header */}
            <div className="h-8 bg-neutral-900/90 flex items-center justify-between px-4 border-b border-neutral-700">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                </div>
            </div>

            <div className="p-6 h-full">
                <AnimatePresence mode="wait">
                    {currentDemo === 0 && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`${theme.text} space-y-4`}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Settings</h3>
                                <motion.div
                                    className={`relative w-14 h-8 rounded-full cursor-pointer flex items-center transition-colors duration-500 ${isDarkMode ? 'bg-yellow-500 justify-end' : 'bg-neutral-300 justify-start'
                                        }`}
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                >
                                    <motion.div
                                        layout
                                        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                                        className={`w-6 h-6 m-1 rounded-full shadow-lg flex items-center justify-center ${isDarkMode ? 'bg-neutral-900' : 'bg-white'
                                            }`}
                                    >
                                        <AnimatePresence mode="wait">
                                            {isDarkMode ? (
                                                <motion.div key="moon" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
                                                    <Moon size={14} />
                                                </motion.div>
                                            ) : (
                                                <motion.div key="sun" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                                                    <Sun size={14} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.div>
                            </div>
                            <div className="bg-neutral-800/50 p-4 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <User className={theme.subText} size={16} />
                                    <div>
                                        <p className="font-medium">Dark Mode</p>
                                        <p className={`text-sm ${theme.subText}`}>Automatically switches themes</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentDemo === 1 && (
                        <motion.div
                            key="music"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-white space-y-4"
                        >
                            <div className="text-center">
                                <motion.div
                                    animate={{ scale: isPlaying ? 1.05 : 1 }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                                    className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 flex items-center justify-center shadow-2xl"
                                >
                                    <div className="w-16 h-16 bg-white/20 rounded-xl backdrop-blur-sm"></div>
                                </motion.div>
                                <h3 className="text-lg font-bold">Midnight Vibes</h3>
                                <p className="text-neutral-400">Lo-Fi Beats</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-full bg-neutral-700 rounded-full h-1.5">
                                    <motion.div
                                        className="bg-yellow-500 h-1.5 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-6">
                                    <SkipForward size={20} className="rotate-180 text-neutral-400" />
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                    >
                                        {isPlaying ? <Pause size={18} className="text-black" /> : <Play size={18} className="text-black ml-0.5" />}
                                    </motion.button>
                                    <SkipForward size={20} className="text-neutral-400" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentDemo === 2 && (
                        <motion.div
                            key="social"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-white space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                                <div>
                                    <p className="font-semibold">Alex Designer</p>
                                    <p className="text-sm text-neutral-400">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-xl">
                                <p className="mb-3">Just shipped our new dashboard redesign! The animations turned out incredible.</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <motion.button
                                            className={`flex items-center gap-2 transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-neutral-400'
                                                }`}
                                            animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
                                            transition={{ duration: 0.4 }}
                                            onClick={() => {
                                                setIsLiked(!isLiked);
                                                setLikes(isLiked ? 665 : 666);
                                            }}
                                        >
                                            <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                                            <span className="text-sm">{likes}</span>
                                        </motion.button>
                                        <button className="flex items-center gap-2 text-neutral-400">
                                            <MessageCircle size={18} />
                                            <span className="text-sm">23</span>
                                        </button>
                                    </div>
                                    <button className="text-neutral-400">
                                        <Share size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Demo indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {demos.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-500 ${currentDemo === index ? 'bg-yellow-500 w-6' : 'bg-neutral-600 w-2'
                            }`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

// Backend Showcase
const BackendShowcase = () => {
    const [step, setStep] = useState(0);
    const numSteps = 6;

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prev => (prev + 1) % numSteps);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const Node = ({ icon: Icon, title, gridClass, nodeStep }) => (
        <div
            className={`${gridClass} bg-neutral-900/70 p-4 rounded-lg flex flex-col items-center justify-center gap-2 font-mono text-sm text-neutral-400 border transition-all duration-500 ${step === nodeStep ? 'border-green-500 bg-green-500/10 text-green-400 scale-105' : 'border-neutral-700'
                }`}
        >
            <Icon size={24} />
            <span className="text-center">{title}</span>
        </div>
    );

    return (
        <div className="relative w-full max-w-2xl mx-auto p-8 aspect-[4/3] bg-neutral-900/30 border border-neutral-800 rounded-2xl">
            <svg width="100%" height="100%" viewBox="0 0 400 300" className="absolute top-0 left-0">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#404040" />
                    </marker>
                </defs>

                {/* Static paths */}
                <path className="stroke-neutral-600 stroke-2 fill-none" d="M 70 150 Q 150 150, 150 80" markerEnd="url(#arrow)" />
                <path className="stroke-neutral-600 stroke-2 fill-none" d="M 180 60 L 250 60" markerEnd="url(#arrow)" />
                <path className="stroke-neutral-600 stroke-2 fill-none" d="M 280 80 Q 280 150, 200 150" markerEnd="url(#arrow)" />
                <path className="stroke-neutral-600 stroke-2 fill-none" d="M 170 180 L 170 230" markerEnd="url(#arrow)" />

                {/* Animated data flow */}
                {step === 0 && (
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="stroke-green-500 stroke-4 fill-none"
                        d="M 70 150 Q 150 150, 150 80"
                    />
                )}
            </svg>

            <div className="relative z-10 grid grid-cols-4 grid-rows-3 h-full gap-4">
                <Node icon={User} title="Client" gridClass="col-start-1 row-start-2" nodeStep={0} />
                <Node icon={Router} title="API Gateway" gridClass="col-start-2 row-start-1" nodeStep={1} />
                <Node icon={ShieldCheck} title="Auth Service" gridClass="col-start-3 row-start-1" nodeStep={2} />
                <Node icon={Layers} title="App Server" gridClass="col-start-2 row-start-2 col-span-2" nodeStep={3} />
                <Node icon={Database} title="Database" gridClass="col-start-2 row-start-3 col-span-2" nodeStep={4} />
            </div>
        </div>
    );
};

// Client Logos Section
const ClientLogos = () => {
    return (
        <section className="py-20 px-8 bg-black">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Trusted by Leading Companies
                    </h2>
                    <p className="text-lg text-neutral-400">
                        We are proud to have collaborated with these innovative brands.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center"
                >
                    {clientLogos.map((logo, index) => (
                        <motion.div
                            key={index}
                            className="flex justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                className="h-12 w-auto object-contain transition-all duration-300 filter grayscale hover:grayscale-0"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};


// Contact Section
const ContactSection = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setMessage('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', message: '' });
        }, 2000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black/40 backdrop-blur-md border border-green-900/50 rounded-2xl shadow-2xl max-w-2xl mx-auto overflow-hidden"
        >
            <div className="p-10 text-center border-b border-green-900/30">
                <h3 className="text-4xl font-bold text-white mb-2">Ready to Build?</h3>
                <p className="text-neutral-400 text-lg">Let's discuss your project and bring your vision to life.</p>
            </div>

            <div className="p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-neutral-300 text-sm font-bold mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your Name"
                                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-neutral-300 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your.email@example.com"
                                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-neutral-300 text-sm font-bold mb-2">
                            Message
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Tell us about your project..."
                            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        ></textarea>
                    </div>
                    <div>
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center bg-green-500 text-black px-10 py-4 rounded-full font-bold text-xl transition-all duration-300 hover:bg-green-400 shadow-2xl shadow-green-500/30 disabled:opacity-60"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            ) : (
                                <Send className="mr-2 h-5 w-5" />
                            )}
                            {isLoading ? 'Sending...' : 'Send Message'}
                        </motion.button>
                    </div>
                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-400 text-center"
                        >
                            {message}
                        </motion.p>
                    )}
                </form>
            </div>
        </motion.div>
    );
};

// Main Portfolio Component
const DiellPortfolio = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    const [heroRef, heroInView] = useIntersectionObserver();
    const [showcaseRef, showcaseInView] = useIntersectionObserver();
    const [backendRef, backendInView] = useIntersectionObserver();

    return (
        <>
            <GlobalStyles />
            <FreeToolsButton />

            <div ref={containerRef} className="h-screen overflow-y-auto">
                {/* Hero Section */}
                <section ref={heroRef} className="min-h-screen grid-background-frontend flex flex-col items-center justify-center text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ filter: 'drop-shadow(0 0 35px var(--color-frontend))' }}
                    >
                        <DiellLogo size={300} primaryColor="var(--color-frontend)" text='' />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-8"
                    >
                        <h1 className="text-7xl font-bold tracking-tighter text-yellow-400 mb-4">
                            <WaveText text="Diell" delay={0.5} />
                        </h1>
                        <p className="text-2xl text-neutral-400">
                            <span className="text-yellow-400">//</span> Building The Exceptional.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="absolute bottom-10"
                    >
                        <ChevronDown size={32} className="text-yellow-400 animate-bounce" />
                    </motion.div>
                </section>

                {/* Frontend Showcase Section */}
                <section ref={showcaseRef} className="min-h-screen grid-background-frontend py-20 px-8">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">
                                We Craft. We Engineer.
                            </h2>
                            <p className="text-xl text-neutral-400 leading-relaxed">
                                We specialize in creating bespoke, high-performance web applications.
                                From interactive UIs to complex data-driven platforms, we transform
                                ambitious ideas into flawless digital realities.
                            </p>
                            <TechStackCarousel />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex justify-center"
                        >
                            <ShowcaseDemo isVisible={showcaseInView} />
                        </motion.div>
                    </div>
                </section>

                {/* Design Philosophy Section */}
                <section className="min-h-screen grid-background-frontend py-20 px-8 flex items-center">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <h2 className="text-5xl font-bold text-white mb-6">
                                Design-Driven Engineering.
                            </h2>
                            <p className="text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
                                Our process lives at the intersection of creative design and technical precision.
                                We build interfaces that are not only beautiful and intuitive but also robust,
                                scalable, and a pleasure to use.
                            </p>
                        </motion.div>
                    </div>
                </section>


                {/* NEW: Client Logos Section */}
                <ClientLogos />

                <section className="min-h-screen grid-background-backend py-20 px-8 flex items-center">
                    <div className="max-w-4xl mx-auto w-full">
                        <ContactSection />
                    </div>
                </section>

                {/* Footer */}
           {/* Footer */}
                <footer className="relative bg-black border-t border-neutral-800 py-16 px-8 overflow-hidden">
                    {/* Gradient background effects */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="max-w-6xl mx-auto relative z-10">
                        {/* Logo and Tagline */}
                        <div className="text-center mb-12">
                            <div className="mb-6 inline-block hover:scale-105 transition-transform duration-300">
                                <DiellLogo size={180} primaryColor="#fbbf24" halfColor='#22c55e' />
                            </div>
                            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                                Building exceptional digital experiences, one project at a time.
                            </p>
                        </div>
                        
                        {/* Contact Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                            {/* Email Card */}
                            <div className="group relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-green-500 font-semibold mb-2 text-sm uppercase tracking-wider">Email</h4>
                                    <a href="mailto:info@diell.pro" className="text-neutral-300 hover:text-green-400 transition-colors text-sm break-all">
                                        info@diell.pro
                                    </a>
                                </div>
                            </div>

                            {/* Phone Card */}
                            <div className="group relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition-colors">
                                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-yellow-400 font-semibold mb-2 text-sm uppercase tracking-wider">Phone</h4>
                                    <a href="tel:+38343877724" className="text-neutral-300 hover:text-yellow-300 transition-colors text-sm">
                                        +383 43 877 724
                                    </a>
                                </div>
                            </div>

                            {/* Social Card */}
                            <div className="group relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </div>
                                    <h4 className="text-green-500 font-semibold mb-2 text-sm uppercase tracking-wider">Social</h4>
                                    <a href="https://www.instagram.com/diell.pro/" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-green-400 transition-colors text-sm">
                                        @diell.pro
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Bottom Bar */}
                        <div className="text-center pt-8 border-t border-neutral-800">
                            <p className="text-neutral-500 text-sm">
                                © 2024 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-yellow-400 font-semibold">Diell</span>. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default DiellPortfolio;