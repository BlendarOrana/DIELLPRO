import React, { useState, useEffect, useRef } from 'react';
import { DiellLogo } from 'diell-logo';
import { Rocket, Layers, ShieldCheck, Database, User, Router } from 'lucide-react';

// --- A REUSABLE HOOK FOR SCROLL ANIMATIONS --- //
const useIntersectionObserver = (options) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                observer.unobserve(entry.target);
            }
        }, options);
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, [ref, options]);
    return [ref, isIntersecting];
};

// --- NEW STYLES SPECIFIC TO THIS COMPONENT --- //
const BackendStyles = () => ( <style>{`
    .reveal-card { opacity: 0; transform: translateY(40px); transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .reveal-card.is-visible { opacity: 1; transform: translateY(0); }
    
    .grid-background-backend {
       background-image: 
        linear-gradient(to right, var(--color-grid-backend) 1px, transparent 1px), 
        linear-gradient(to bottom, var(--color-grid-backend) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(34, 197, 94, 0.04) 1px, transparent 1px);
       background-size: 80px 80px, 80px 80px, 20px 20px, 20px 20px;
    }

    /* === NEW STYLES FOR THE BACKEND SHOWCASE === */
    .showcase-node {
        transition: all 0.4s ease;
        border: 1px solid #27272a;
    }
    .showcase-node.active {
        border-color: var(--color-backend);
        box-shadow: 0 0 15px var(--color-backend);
        transform: scale(1.05);
    }
    .flow-path {
        stroke-width: 2;
        stroke-linecap: round;
        stroke: #404040;
        fill: none;
    }
    .flow-packet {
        stroke-width: 4;
        stroke-linecap: round;
        stroke: var(--color-backend);
        fill: none;
        stroke-dasharray: 20 200; /* Short dash, long gap */
        stroke-dashoffset: 220;
        opacity: 0;
        animation-duration: 1.5s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: 1; /* Was infinite */
    }
    .flow-packet.active {
       animation-name: flow;
    }

    @keyframes flow {
      0% {
        opacity: 0;
        stroke-dashoffset: 220;
      }
      20% {
        opacity: 1;
      }
      80% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        stroke-dashoffset: -220;
      }
    }

    :root {
        --color-backend: #22c55e;
        --color-grid-backend: rgba(34, 197, 94, 0.1);
    }

    .animate-fade-in {
        animation: fadeIn 1s ease-in-out forwards;
        opacity: 0;
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
`}</style>);

const TransitionTunnel = () => (
    <section className="w-full flex flex-col items-center justify-center relative overflow-hidden " style={{ height: '600vh' }}>
        {/* Multiple gradient lines for tunnel effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full" 
             style={{ 
                 background: 'linear-gradient(to bottom, var(--color-frontend) 0%, var(--color-backend) 100%)', 
                 boxShadow: '0 0 5px var(--color-backend)' 
             }}/>
    </section>
);

const IconInfoCard = ({ Icon, iconColor, title, children, delay = 0 }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });
    return (
        <div ref={ref} className={`reveal-card ${isVisible ? 'is-visible' : ''} bg-black/40 backdrop-blur-md border border-green-900/50 rounded-2xl p-6 flex items-start gap-5 shadow-2xl shadow-green-900/10`} style={{ transitionDelay: `${delay}ms`}}>
            <div className="flex-shrink-0 rounded-full p-4 mt-1 bg-green-900/20" style={{ border: `2px solid ${iconColor}`, boxShadow: `0 0 20px -5px ${iconColor}` }}>
                <Icon size={28} color={iconColor} />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-neutral-300 text-lg leading-relaxed">{children}</p>
            </div>
        </div>
    );
};

// --- THE NEW DYNAMIC BACKEND SHOWCASE --- //
const BackendShowcase = () => {
    const [step, setStep] = useState(0);
    const numSteps = 6;

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prevStep) => (prevStep + 1) % numSteps);
        }, 1500); // Duration of one step of the animation
        return () => clearInterval(interval);
    }, []);

    const getNodeClass = (nodeStep) => (step === nodeStep ? 'active' : '');
    const getPacketClass = (packetStep) => (step === packetStep ? 'active' : '');

    const Node = ({ icon: Icon, title, gridClass, nodeStep }) => (
        <div className={`showcase-node ${getNodeClass(nodeStep)} ${gridClass} bg-neutral-900/70 p-4 rounded-lg flex flex-col items-center justify-center gap-2 font-mono text-sm text-neutral-400`}>
            <Icon size={24} className={getNodeClass(nodeStep) ? "text-[var(--color-backend)]" : "text-neutral-500"} />
            <span>{title}</span>
        </div>
    );

    return (
        <div className="relative w-full max-w-2xl mx-auto p-4 md:p-8 aspect-[4/3] bg-neutral-900/30 border border-neutral-800 rounded-2xl">
            {/* SVG Layer for lines - sits underneath the nodes */}
            <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute top-0 left-0">
                <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#404040" /></marker></defs>
                <path className="flow-path" d="M 70 150 Q 150 150, 150 80" markerEnd="url(#arrow)" />
                <path className="flow-path" d="M 180 60 L 250 60" markerEnd="url(#arrow)" />
                <path className="flow-path" d="M 280 80 Q 280 150, 200 150" markerEnd="url(#arrow)" />
                <path className="flow-path" d="M 170 180 L 170 230" markerEnd="url(#arrow)" />
                <path className="flow-path" d="M 170 270 L 170 190" /> {/* Response Path */}
                <path className="flow-path" d="M 200 150 Q 280 150, 280 220" />
                
                {/* Animated Packets */}
                <path className={`flow-packet ${getPacketClass(0)}`} d="M 70 150 Q 150 150, 150 80" />
                <path className={`flow-packet ${getPacketClass(1)}`} d="M 180 60 L 250 60" />
                <path className={`flow-packet ${getPacketClass(2)}`} d="M 280 80 Q 280 150, 200 150" />
                <path className={`flow-packet ${getPacketClass(3)}`} d="M 170 180 L 170 230" />
                {/* Response Flow */}
                <path className={`flow-packet ${getPacketClass(4)}`} style={{ animationDirection: 'reverse' }} d="M 170 180 L 170 230" /> 
                <path className={`flow-packet ${getPacketClass(5)}`} style={{ animationDirection: 'reverse' }} d="M 70 150 Q 150 150, 150 80" />
            </svg>
             {/* Node Grid - sits on top of the SVG */}
            <div className="relative z-10 grid grid-cols-4 grid-rows-3 h-full gap-4">
                 <Node icon={User} title="Client" gridClass="col-start-1 row-start-2" nodeStep={0} />
                 <Node icon={Router} title="API Gateway" gridClass="col-start-2 row-start-1" nodeStep={1} />
                 <Node icon={ShieldCheck} title="Auth Service" gridClass="col-start-3 row-start-1" nodeStep={2} />
                 <Node icon={Layers} title="App Server" gridClass="col-start-2 row-start-2 col-span-2" nodeStep={3}/>
                 <Node icon={Database} title="Database" gridClass="col-start-2 row-start-3 col-span-2" nodeStep={4}/>
            </div>
        </div>
    );
};

// --- MAIN VERTICAL CONTENT COMPONENT --- //
const VerticalContent = () => { 
    return (
        <div className="grid-background-backend text-white font-sans">
            <BackendStyles />
            <TransitionTunnel />

            <main className="relative px-6 md:px-8 min-h-screen ">
                 <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20 md:mb-28">
                         <div style={{ filter: 'drop-shadow(0 0 30px var(--color-backend))' }} className="inline-block animate-fade-in"><DiellLogo size={250} text='' primaryColor="var(--color-backend)" /></div>
                         <p className="text-xl md:text-2xl text-neutral-400 font-mono animate-fade-in" style={{ animationDelay: '200ms' }}><span className='text-[#22c55e]'>//</span>  The Power Behind Performance.</p>
                    </div>
                    
                    <div className="space-y-6">
                        <IconInfoCard Icon={Layers} iconColor="var(--color-backend)" title="Robust Architecture.">We design and build the foundational engine that powers your application. Clean, efficient, and relentlessly scalable code is our blueprint for success.</IconInfoCard>
                        <IconInfoCard Icon={Rocket} iconColor="var(--color-backend)" title="Peak Performance." delay={100}>Blazing-fast APIs and hyper-optimized database interactions are our standard. We engineer for speed, ensuring a fluid and seamless user experience.</IconInfoCard>
                        <IconInfoCard Icon={ShieldCheck} iconColor="var(--color-backend)" title="Secure & Scalable." delay={200}>We build digital fortresses by design. Our backends are architected for exponential growth and hardened against emerging threats, protecting your data and users.</IconInfoCard>
                    </div>

                    <div className="text-center mt-28">
                        <BackendShowcase />
                    </div>

                    <div className="text-center mt-32">
                        <h3 className="text-4xl font-bold text-white mb-8">Ready to Build Something Powerful?</h3>
                        <button className="bg-[var(--color-backend)] text-black px-10 py-4 rounded-full font-bold text-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-green-400 shadow-2xl shadow-green-500/30 hover:shadow-green-400/50">Let's Talk</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VerticalContent;