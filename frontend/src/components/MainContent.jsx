import React, { useState, useEffect, useRef } from 'react';
import {
    Laptop, Settings, Send, Calendar, ChevronDown,
    ExternalLink, Layers, ShieldCheck, Database, Router, Loader2,
    Cloud, Code2, Cpu, Smartphone, Activity, Terminal, 
    Bell, CreditCard, ShoppingCart, User
} from 'lucide-react';

import { useAppStore } from '../store'; // Adjust path as needed
import { DiellLogo } from 'diell-logo'; // Your exact imported logo

// ==============================
// 1. HIGH-PERFORMANCE GLOBAL CSS
// ==============================
const GlobalStyles = () => (
    <style>{`
    :root { 
      --color-primary: #fbbf24; /* Yellow */
      --color-secondary: #22c55e; /* Green */
      --color-text-main: #FAFAFA; 
      --color-text-subtle: #888888; 
    } 
    
    html, body { 
      margin: 0; 
      padding: 0; 
      background-color: #000; 
      color: var(--color-text-main); 
      font-family: 'Inter', -apple-system, sans-serif; 
      -webkit-font-smoothing: antialiased; 
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden; 
    } 

    /* Subtle background glow effect using pure CSS */
    .bg-grid-mesh {
        background-size: 50px 50px;
        background-image: 
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
    }

    /* ---------------------------------
       PURE CSS HARDWARE ANIMATIONS 
       (Replacing Framer Motion)
    --------------------------------- */

    .scroller {
        width: 100%;
        overflow: hidden;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
        mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
    }
    
    .scroller__inner {
        display: flex;
        flex-wrap: nowrap;
        animation: scroll 20s forwards linear infinite;
    }

    .scroller:hover .scroller__inner {
        animation-play-state: paused;
    }

    @keyframes scroll {
        to { transform: translate(calc(-50% - 0.5rem)); }
    }

    /* Reusable Base CSS Scroll Reveal (IntersectionObserver triggered) */
    .reveal-base {
        opacity: 0;
        transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .reveal-base.in-view { opacity: 1; transform: translate(0, 0) scale(1); }

    /* Origin States for Revealing */
    .start-y-50 { transform: translateY(50px); }
    .start-y-30 { transform: translateY(30px); }
    .start-y-10 { transform: translateY(10px); }
    .start-scale-90 { transform: scale(0.9); }

    /* Hover interactions replacing motion elements */
    .btn-scale-interactive {
        transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.2s, color 0.2s;
    }
    .btn-scale-interactive:hover { transform: scale(1.05); }
    .btn-scale-interactive:active { transform: scale(0.95); }

    /* Realistic Spring Keyframes for Text Bouncing */
    @keyframes springBounce {
        0% { opacity: 0; transform: translateY(50px); }
        60% { transform: translateY(-5px); opacity: 1; }
        80% { transform: translateY(2px); opacity: 1; }
        100% { opacity: 1; transform: translateY(0); }
    }
    .spring-letter {
        display: inline-block;
        opacity: 0;
        transform: translateY(50px);
        animation: springBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    
    @keyframes simpleFadeInScale {
        to { opacity: 1; transform: scale(1); }
    }

    /* ---------------------------------
       SMOOTH PURE CSS MOCKUPS
    --------------------------------- */

    .iphone-frame {
        box-shadow: inset 0 0 0 4px #e5e5e5, inset 0 0 10px rgba(0,0,0,0.1), 0 20px 50px rgba(0,0,0,0.5);
    }

    .dynamic-island {
        position: absolute;
        top: 14px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 32px;
        background-color: #000;
        border-radius: 20px;
        z-index: 50;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 12px;
    }
    .island-cam {
        width: 12px; height: 12px;
        background: #111; border-radius: 50%;
        box-shadow: inset 0 0 3px rgba(255,255,255,0.1);
    }

    /* CSS iPhone Interactive Notification Pill Animation */
    @keyframes slideDropNotif {
        0% { transform: translate(-50%, -150%) scale(0.9); opacity: 0; }
        8% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        15% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        85% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        92% { transform: translate(-50%, -150%) scale(0.9); opacity: 0; }
        100% { transform: translate(-50%, -150%) scale(0.9); opacity: 0; }
    }

    .cool-notification {
        position: absolute;
        top: 55px; /* Sits exactly below island */
        left: 50%;
        width: 250px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        padding: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1);
        z-index: 45;
        animation: slideDropNotif 7s cubic-bezier(0.3, 0.8, 0.1, 1.2) infinite;
        will-change: transform, opacity;
    }

    /* Seamless Web Pan Engine (No Javascript mapping needed) */
    @keyframes autoScrollWeb {
        0%, 15% { transform: translateY(0); }
        45%, 65% { transform: translateY(calc(-100% + 300px)); /* Pan to bottom of specific container */ }
        90%, 100% { transform: translateY(0); }
    }
    .web-auto-scroll-viewport {
        animation: autoScrollWeb 15s ease-in-out infinite alternate;
        will-change: transform;
    }

    /* Glass Panels */
    .glass-card {
        background: linear-gradient(145deg, rgba(25, 25, 25, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%);
        border: 1px solid rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(12px);
    }

    /* Scrollbars */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #000; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 6px; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }
  `}</style>
);

// ==============================
// 2. HELPER COMPONENTS & LOGIC
// ==============================

// NATIVE Intersection Observer wrapper to replace Framer Motion `whileInView`
const RevealOnScroll = ({ children, className = "", startClass = "start-y-30" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Triggers only once equivalent
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.disconnect(); };
    }, []);

    return (
        <div ref={ref} className={`reveal-base ${startClass} ${isVisible ? 'in-view' : ''} ${className}`}>
            {children}
        </div>
    );
};


// Native WaveText matching strictly exact UI 
const WaveText = ({ text, delay = 0 }) => {
    const words = text.split(' ');

    return (
        <div className="inline-block">
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-3 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                    {word.split('').map((letter, letterIndex) => {
                        const animationDelay = `${delay + (wordIndex * word.length + letterIndex) * 0.05}s`;
                        return (
                            <span key={letterIndex} className="spring-letter" style={{ animationDelay }}>
                                {letter}
                            </span>
                        );
                    })}
                </span>
            ))}
        </div>
    );
};


const InfiniteTechMarquee = () => {
    const techStack = [
        "React", "React Native", "TypeScript",  "Python",
        "AWS Cloud", "Node.js", "Docker", "Kubernetes", "Java"
    ];
    const doubledStack = [...techStack, ...techStack];

    return (
        <div className="scroller mt-10">
            <ul className="scroller__inner gap-4 m-0 p-0 list-none">
                {doubledStack.map((tech, idx) => (
                    <li key={idx} className="flex-shrink-0 text-neutral-400 bg-neutral-900/50 border border-neutral-800 rounded-full px-5 py-2 font-mono text-sm tracking-wide shadow-sm whitespace-nowrap hover:border-yellow-500 hover:text-white transition-colors duration-300">
                        {tech}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Top Floating Tools Button Rebuilt With Pure CSS Classes 
const FreeToolsButton = () => (
    <button
        onClick={() => window.location.href = '/freeqr'}
        className="fixed top-6 right-6 z-50 glass-card btn-scale-interactive rounded-full px-5 py-2.5 flex items-center gap-2 text-yellow-500 font-medium text-xs uppercase tracking-widest hover:bg-yellow-500 hover:text-black shadow-[0_0_15px_rgba(251,191,36,0.15)]"
    >
        <span>QR Tool</span>
        <ExternalLink size={14} />
    </button>
);


// ==============================
// 3. MAIN CONTENT SECTIONS
// ==============================

// 1. STATS SECTION
const StatsSection = () => {
    const stats = [
        { title: "15+", label: "Finished Projects" },
        { title: "5+", label: "Years Experience" },
        { title: "99.9%", label: "Uptime & Reliability" },
        { title: "100%", label: "Client Satisfaction" }
    ];

    return (
        <div className="w-full border-t border-b border-neutral-800/60 bg-black py-16 px-6 relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center group flex flex-col justify-center items-center">
                        <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent mb-2 tracking-tight">
                            {stat.title}
                        </div>
                        <div className="text-sm font-semibold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300 transition-colors">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// 2. MOCKUP SECTION (REVOLUTIONIZED DEVICE ACCURACY USING HTML/CSS)
const ProductsShowcase = () => {
    return (
        <section className="py-24 px-6 relative bg-neutral-950 overflow-hidden">
            <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
                <RevealOnScroll>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Omnichannel Architecture.</h2>
              
                </RevealOnScroll>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-center relative z-10">
                
                {/* 1. REALISTIC SAFARI WEB MOCKUP ENGINE */}
                <RevealOnScroll startClass="start-y-50" className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                    {/* Fake Browser Navbar (Chrome/Safari structure) */}
                    <div className="h-12 bg-gray-100 border-b border-gray-300 flex items-center px-4 flex-shrink-0 z-20">
                        <div className="flex gap-1.5 w-16">
                            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500"></div>
                        </div>
                        <div className="mx-auto w-1/2 max-w-[300px] bg-white border border-gray-300 rounded-lg h-7 shadow-inner text-center flex items-center justify-center">
                            <span className="text-[10px] text-gray-500 font-medium">diell.pro / ecommerce / platform</span>
                        </div>
                        <div className="w-16"></div> {/* Offset spacing align */}
                    </div>
                    
                    {/* Simulated Highly Real Web App Layout with CSS Pan Animation Engine */}
                    <div className="h-[300px] relative overflow-hidden bg-gray-50 flex">
                        
                        {/* Static Web App Sidebar */}
                        <div className="w-48 bg-white border-r border-gray-200 hidden md:flex flex-col p-4 shadow-[4px_0_10px_rgba(0,0,0,0.02)] z-10">
                           <div className="font-black text-gray-900 tracking-tight text-xl mb-6">Store.</div>
                           <div className="space-y-4">
                                <div className="h-4 bg-gray-100 rounded-md w-full mb-8"></div>
                                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                                <div className="h-3 bg-yellow-400/20 text-yellow-600 rounded font-semibold text-[8px] pl-2 flex items-center w-full shadow-sm">Dashboard Analytics</div>
                                <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                                <div className="h-3 bg-gray-100 rounded w-full"></div>
                                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                           </div>
                           <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100">
                               <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0"></div>
                               <div className="w-16 h-2 bg-gray-200 rounded"></div>
                           </div>
                        </div>

                        {/* Scrolling Container area inside Webpage Viewport */}
                        <div className="flex-1 relative overflow-hidden">
                             {/* Applying CSS Auto Scroll logic class */}
                             <div className="p-6 md:p-8 space-y-6 web-auto-scroll-viewport absolute w-full top-0 left-0">
                                 {/* E-Comm Hero Panel Replica */}
                                 <div className="w-full flex justify-between items-center pb-6">
                                     <div>
                                         <h3 className="text-xl font-bold text-gray-800">Administrator</h3>
                                         <p className="text-xs text-gray-500">System overview showing steady engagement.</p>
                                     </div>
                                     <button className="px-4 py-2 bg-black text-white text-[10px] font-bold rounded-lg shadow-md">Create Sale</button>
                                 </div>
                                 
                                 {/* Realistic Metric Dashboard Replica Elements */}
                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col justify-center">
                                           <div className="w-6 h-6 bg-yellow-50 text-yellow-600 rounded-md flex items-center justify-center mb-3">
                                               <CreditCard size={12}/>
                                           </div>
                                           <span className="text-[10px] font-semibold text-gray-500 uppercase">Gross Total</span>
                                           <span className="font-bold text-gray-900 text-lg">$210,042</span>
                                      </div>
                                      <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col justify-center">
                                           <div className="w-6 h-6 bg-green-50 text-green-600 rounded-md flex items-center justify-center mb-3">
                                               <ShoppingCart size={12}/>
                                           </div>
                                           <span className="text-[10px] font-semibold text-gray-500 uppercase">Orders / Hr</span>
                                           <span className="font-bold text-gray-900 text-lg">+4,212</span>
                                      </div>
                                      <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col justify-center hidden md:flex">
                                           <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center mb-3">
                                               <User size={12}/>
                                           </div>
                                           <span className="text-[10px] font-semibold text-gray-500 uppercase">Active Logins</span>
                                           <span className="font-bold text-gray-900 text-lg">94,302</span>
                                      </div>
                                 </div>

                                 {/* Real content replica */}
                                 <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-4">
                                     <span className="text-[10px] font-semibold text-gray-500 uppercase block mb-4">Traffic Mapping Source Nodes</span>
                                     <div className="space-y-3">
                                         {[1,2,3,4].map((i)=>(
                                            <div key={i} className="flex justify-between items-center w-full">
                                                <div className="flex gap-2 items-center w-1/3">
                                                   <div className="w-5 h-5 bg-gray-100 rounded-full flex-shrink-0"></div>
                                                   <div className="w-full h-2 bg-gray-200 rounded"></div>
                                                </div>
                                                <div className="w-1/2 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                                                   <div className="h-full bg-gray-900" style={{width: `${80 - (i*12)}%`}}></div>
                                                </div>
                                                <div className="text-[9px] font-bold text-gray-800">${(i*122).toFixed(2)}</div>
                                            </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </RevealOnScroll>


                {/* 2. REALISTIC IPHONE 14 PRO MAX PURE CSS DEVICE BODY AND UI */}
                <RevealOnScroll startClass="start-scale-90" className="relative">
                    <div className="iphone-frame relative w-[280px] h-[580px] rounded-[45px] bg-[#f9fafb] border-[14px] border-[#252525] flex flex-col overflow-hidden ring-2 ring-gray-600 shadow-2xl flex-shrink-0 relative">
                        
                        {/* Iconic Hardware - Dynamic Island Block */}
                        <div className="dynamic-island">
                            <div className="island-cam"></div>
                        </div>
                        
                        {/* Inner Software CSS Mock Notification */}
                        <div className="cool-notification flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0 text-white shadow-inner">
                                <Bell size={18} fill="currentColor"/>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-gray-800 leading-tight">Infrastructure Alert</span>
                                <span className="text-[11px] text-gray-500 font-medium">Auto-scaling Node activated successfully.</span>
                            </div>
                        </div>

                        {/* Interactive Mobile Device Application State Background Center */}
                        <div className="flex-1 w-full h-full flex items-center justify-center relative flex-col pb-10">
                            
                            {/* Precise Mobile Native Logo Injection with Dark Mode override color fix inside white mobile env */}
                            <div className="mb-4 drop-shadow-[0_20px_20px_rgba(251,191,36,0.1)] hover:scale-105 transition-transform cursor-default">
                                {/* Adjusted primary color for visibility against the very clean white device mock! */}
                                <DiellLogo size={140} primaryColor="#000" halfColor="var(--color-secondary)" />
                            </div>

                            <p className="text-gray-800 text-lg font-bold mt-1 tracking-tight">Diell React native App</p>
                        </div>
                        
                        {/* Device App Environment Indicator Line - Very Real Mobile Element*/}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-black rounded-full"></div>
                    </div>
                </RevealOnScroll>
            </div>
            
            {/* Soft decorative background blurs (Pure styling, no DOM lag) */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-green-500/5 blur-[120px] rounded-full pointer-events-none transform -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none transform -translate-y-1/2 z-0"></div>
        </section>
    );
};

// 3. CORE EXPERTISE SECTION
const CoreExpertise = () => {
    const expertiseList = [
        {
            title: "Web Engineering",
            desc: "High-performance Single Page Applications and robust Server-Side websites via frameworks structured closely specifically to distinct system logic scale limits.",
            icon: Laptop,
            color: "text-blue-400",
            bgHover: "hover:border-blue-400/50 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(96,165,250,0.1)]"
        },
        {
            title: "Mobile App Development",
            desc: "Pristine Native iOS and Android device platform experiences uniquely customized implementing deeply structured hardware layer operating designs flawlessly.",
            icon: Smartphone,
            color: "text-purple-400",
            bgHover: "hover:border-purple-400/50 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(192,132,252,0.1)]"
        },
        {
            title: "Data Engineering",
            desc: "Rapid analytical pipelines, optimized cloud warehousing structures, robust ETL deployments securing analytics natively strictly leveraging complex computing sets raw bytes.",
            icon: Database,
            color: "text-yellow-400",
            bgHover: "hover:border-yellow-400/50 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(251,191,36,0.1)]"
        },
        {
            title: "Cloud Ops & Architecture",
            desc: "Enterprise robust node clusters hitting 99.9% fault-resistant resilient metrics mapped fully leveraging scalable Docker instances mapped around specific logic loops.",
            icon: Cloud,
            color: "text-green-400",
            bgHover: "hover:border-green-400/50 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(34,197,94,0.1)]"
        },
        {
            title: "AI Integrations & Deployments",
            desc: "Fine-tuned business workflow systems dynamically generating context-secure retrieval generation specifically isolating high-end neural logic layers precisely locally and cloud native deployments models.",
            icon: Activity, 
            color: "text-red-400",
            bgHover: "hover:border-red-400/50 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(248,113,113,0.1)]"
        },
        {
            title: "API Platform Buildouts",
            desc: "Lightning logic maps utilizing scalable python, fully strongly mapped typed systems securing all data in robust transfer points strictly operating through fast isolated structures environments networks nodes containers platforms APIs.",
            icon: Terminal,
            color: "text-neutral-300",
            bgHover: "hover:border-white/40 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
        }
    ];

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
            <RevealOnScroll className="mb-16">
                 <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Full-Stack </h2>
                 <p className="text-neutral-500 mt-4 text-xl max-w-3xl">Delivering extensive digital ecosystem builds with expertise strictly covering all foundational, analytical, and external technology tiers.</p>
            </RevealOnScroll>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expertiseList.map((skill, index) => {
                    const Icon = skill.icon;
                    return (
                        <RevealOnScroll key={index} startClass="start-y-30">
                            <div className={`glass-card p-8 rounded-2xl transition-all duration-300 transform block h-full ${skill.bgHover}`}>
                                 <div className={`h-12 w-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6`}>
                                      <Icon className={`w-6 h-6 ${skill.color}`} />
                                 </div>
                                 <h3 className="text-xl font-bold mb-3">{skill.title}</h3>
                                 <p className="text-neutral-400 text-sm leading-relaxed">{skill.desc}</p>
                            </div>
                        </RevealOnScroll>
                    );
                })}
            </div>
        </section>
    );
};

// 4. CONTACT SECTION 
const ContactFormBlock = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const { sendEmail, isLoading, error, successMessage, resetFormStatus } = useAppStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
        await sendEmail(formData);
        setFormData({ name: '', email: '', message: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => resetFormStatus(), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error, resetFormStatus]);

    return (
        <RevealOnScroll className="w-full max-w-3xl mx-auto z-10 relative">
            <div className="bg-black/60 backdrop-blur-xl border border-neutral-800/80 rounded-[30px] shadow-2xl w-full overflow-hidden ring-1 ring-white/5 relative z-10">
                <div className="p-12 text-center border-b border-neutral-800/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-yellow-500/5"></div>
                    <h3 className="text-4xl font-bold text-white tracking-tight relative z-10 mb-3">Email us.</h3>
                </div>

                <div className="p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-neutral-400 text-xs font-mono uppercase tracking-widest mb-3">Name </label>
                                <input
                                    type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" disabled={isLoading}
                                    className="w-full bg-neutral-900/60 border border-neutral-700/80 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-yellow-500 focus:bg-neutral-800 transition-all duration-300 placeholder-neutral-600 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-neutral-400 text-xs font-mono uppercase tracking-widest mb-3"> E-Mail </label>
                                <input
                                    type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="director@organization.dev" disabled={isLoading}
                                    className="w-full bg-neutral-900/60 border border-neutral-700/80 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-green-500 focus:bg-neutral-800 transition-all duration-300 placeholder-neutral-600 disabled:opacity-50"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-neutral-400 text-xs font-mono uppercase tracking-widest mb-3">Project Directive </label>
                            <textarea
                                name="message" rows="5" value={formData.message} onChange={handleChange} required placeholder="" disabled={isLoading}
                                className="w-full bg-neutral-900/60 border border-neutral-700/80 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 focus:bg-neutral-800 transition-all duration-300 placeholder-neutral-600 resize-y disabled:opacity-50"
                            ></textarea>
                        </div>
                        
                        <button type="submit" disabled={isLoading}
                            className="group btn-scale-interactive w-full relative flex items-center justify-center bg-white text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all overflow-hidden disabled:opacity-60 disabled:pointer-events-none"
                        >
                            {isLoading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Send className="mr-3 h-4 w-4" />}
                            <span>{isLoading ? 'is Sending...' : 'Send'}</span>
                        </button>
                        
                        {/* Status Alerts */}
                        {successMessage && <div className="text-xs tracking-widest text-green-400 font-mono text-center pt-2">{successMessage}</div>}
                        {error && <div className="text-xs tracking-widest text-red-400 font-mono text-center pt-2">{error}</div>}
                    </form>
                </div>
            </div>
        </RevealOnScroll>
    );
};

// ==============================
// 4. MAIN EXPORT LAYOUT
// ==============================

const DiellPortfolio = () => {
    // Basic startup animation sequence triggered globally strictly matching original layout flows via CSS.
    const [pageLoaded, setPageLoaded] = useState(false);
    useEffect(() => { setPageLoaded(true) }, []);

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-yellow-500/30 selection:text-white pb-0 m-0 relative">
            <GlobalStyles />
            <FreeToolsButton />

            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-screen bg-grid-mesh pointer-events-none opacity-40 -z-0"></div>

            {/* HERO SECTION - Refined CSS Pure Transitions Layer Engine Mapped directly avoiding JS mapping constraints mapping scopes sets bounds lines goals */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-6 overflow-hidden">
                 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60vh] bg-gradient-radial from-neutral-800/20 via-transparent to-transparent -z-10 blur-xl pointer-events-none"></div>
                 
                 <div 
                     className="mb-8"
                     style={{ 
                         opacity: pageLoaded ? 1 : 0, transform: `scale(${pageLoaded ? 1 : 0.90})`,
                         transition: 'all 1s cubic-bezier(0.165, 0.84, 0.44, 1)' 
                     }}
                 >
                     <DiellLogo size={280} primaryColor="var(--color-primary)" halfColor="var(--color-secondary)" text='' />
                 </div>
                 
              <div className="text-center z-10 max-w-4xl mx-auto space-y-8 mt-2 px-4">
              
              <div 
                  className="flex flex-col items-center"
                  style={{ 
                      opacity: pageLoaded ? 1 : 0, transform: `translateY(${pageLoaded ? 0 : '30px'})`,
                      transition: 'all 0.8s ease 0.2s' 
                  }}
              >
                 <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-yellow-400 mb-4 leading-tight">
                      {/* Perfectly replicated native wave drop bouncing! */}
                      {pageLoaded && <WaveText text="Diell" delay={0.4} />}
                 </h1>
                 <p className="text-lg sm:text-xl md:text-4xl text-white font-bold tracking-tight mt-2 md:mt-0 px-2">
                      <span className="text-yellow-500 mr-2 sm:mr-3 md:mr-4 opacity-80">//</span> 
                      Building The Exceptional.
                 </p>
              </div>
              
              {/* Skills highlight under header */}
              <p 
                  style={{ 
                     opacity: pageLoaded ? 1 : 0, transform: `translateY(${pageLoaded ? 0 : '10px'})`,
                     transition: 'all 0.8s ease 1s' 
                 }}
                  className="text-sm sm:text-base md:text-xl text-neutral-400 max-w-3xl mx-auto font-light tracking-tight leading-relaxed px-2 sm:px-4 md:px-0 pt-4"
              >
                   Mobile & Web Applications. Expert-level <span className="text-white font-medium text-green-400 border-b border-green-400/30 pb-0.5 hover:text-green-300 transition-colors">Data Engineering</span>. Highly scalable <span className="text-white font-medium text-yellow-400 border-b border-yellow-400/30 pb-0.5 hover:text-yellow-300 transition-colors">Cloud Architecture</span> & AI Integrations.
              </p>
              
              <div 
                  style={{ opacity: pageLoaded ? 1 : 0, transition: 'all 0.5s ease 1.2s' }}
                  className="pt-6 w-full overflow-hidden"
              >
                  <InfiniteTechMarquee />
              </div>
          </div>

                 {/* Bouncing scroll arrow */}
                 <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-10">
                    <ChevronDown size={32} strokeWidth={1} className="text-neutral-500 animate-bounce"/>
                 </div>
            </section>

            <StatsSection />

            <ProductsShowcase />

            <CoreExpertise />

            <section className="py-24 px-6 bg-gradient-to-b from-transparent to-[#0a0a0a] flex items-center justify-center relative z-10">
                <ContactFormBlock />
            </section>

            <footer className="relative border-t border-neutral-900 bg-[#000] pt-16 pb-8 px-6 text-sm z-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-neutral-500">
                    <div className="md:col-span-2">
                            <DiellLogo size={60}  />
              
                    </div>
                    <div>
                         <h5 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Reach Control Unit</h5>
                         <ul className="space-y-3 font-mono">
                             <li><a href="mailto:info@diell.pro" className="hover:text-yellow-400 transition-colors block">E: info@diell.pro</a></li>
                             <li><a href="tel:+38343877724" className="hover:text-yellow-400 transition-colors block">T: +383 43 877 724</a></li>
                             <li className="pt-2"><a href="https://instagram.com/diell.pro" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors flex items-center gap-2"><ExternalLink size={12}/> Network Instalog</a></li>
                         </ul>
                    </div>
                    <div>
                         <h5 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Global Location Area</h5>
                         <address className="font-mono space-y-3 not-italic">
                            PRISHTINË 10000<br/>
                            REPUBLIC OF KOSOVO<br/>
                            SYSTEM RUN STATUS: <span className="text-green-500 font-bold ml-2">OK.</span>
                         </address>
                    </div>
                </div>
                <div className="mt-16 text-center font-mono tracking-widest text-[10px] md:text-xs border-t border-neutral-900/50 pt-8 text-neutral-600 uppercase">
                    © 2024 Diell Infrastructure Network & Data Groups. All Rights Strictly Reserved.
                </div>
            </footer>
        </div>
    );
};

export default DiellPortfolio;