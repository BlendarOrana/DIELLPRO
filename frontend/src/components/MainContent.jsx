import { useState, useEffect } from 'react';
import { useAppStore } from '../store'; // Adjust path as needed

const SuccessDisplay = ({ message, onClose }) => (
  <div className="flex flex-col items-center justify-center text-center py-4 space-y-5 opacity-0 animate-[successFadeIn_0.8s_ease-out_forwards]">
    
    <div className="relative h-20 w-20 sm:h-28 sm:w-28">
      {/* Genesis energy ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-spin-slow blur-sm"></div>
      
      <svg className="w-full h-full relative z-10" viewBox="0 0 100 100">
        {/* Glowing circle that draws in */}
        <circle 
          className="success-circle" 
          cx="50" cy="50" r="48"
        />
        {/* Checkmark path that draws in after the circle */}
        <path 
          className="success-checkmark" 
          d="M30 52l14 14 26-26"
        />
      </svg>
    </div>

    <h3 className="text-lg sm:text-xl font-bold text-green-400 font-mono tracking-wider pt-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
      Message sent
    </h3>

    <p className="text-slate-300 font-mono text-xs sm:text-sm max-w-sm px-4">
     Thanks for reaching out!
    </p>

    <div className="pt-4 w-full">
      <button
        onClick={onClose}
        className="btn-form btn-confirm w-full max-w-xs mx-auto font-bold text-xs sm:text-sm tracking-wider !border-green-500/50 !text-green-300 !bg-green-500/20 hover:!bg-green-500/30 hover:!shadow-[0_0_20px_rgba(74,222,128,0.4)]"
      >
        _ACKNOWLEDGE & CLOSE
      </button>
    </div>
  </div>
);

function MainContent() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile detection
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Get store functions and state
  const { sendEmail, isLoading, error, successMessage, resetFormStatus } = useAppStore();

  // High-tech Genesis typewriter sequence
  const typewriterSteps = [
    { 
      text: '> Diell.', 
      delay: 1200,
      color: '#f59e0b',
      effect: 'genesis-glow'
    },
    { 
      text: ' We engineer digital solutions.', 
      delay: 1200,
      color: '#e2e8f0',
      append: true,
      effect: 'data-stream'
    },
    { 
      text: '\n> From high-performance backends to intuitive user interfaces.', 
      delay: 1400,
      color: '#e2e8f0',
      append: true,
    },
    { 
      text: '\n\n> What can we build for you?', 
      delay: 2000,
      color: '#f59e0b',
      append: true,
    }
  ];

  // New effect to check for mobile device on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768); // Using 768px as a threshold for mobile
    }
  }, []);

  useEffect(() => {
    // A little bugfix to ensure success doesn't prevent future form clears
    if(successMessage && !isLoading) {
        setFormData({ name: '', email: '', message: '' });
    }
  }, [successMessage, isLoading])

  // Modified typewriter effect with mobile detection
  useEffect(() => {
    // Add delay before starting the first typewriter step
    const startDelay = currentStep === 0 ? 3000 : 0; // 3 second delay for first step
    
    const startTyping = () => {
      // ** NEW LOGIC: Mobile device detection **
      // If on a mobile device and we've reached the part to be skipped,
      // display the text instantly instead of typing it.
      if (isMobile && currentStep === 2) {
        const instantText = '\n> From high-performance backends to intuitive user interfaces.' + '\n\n> What can we build for you?';
        
        setDisplayedText(prev => prev + instantText);
        setIsTyping(false); // Stop the cursor
        
        // After a delay to allow reading the text, show the button
        setTimeout(() => setShowButton(true), 2000); 
        return; // End the sequence here for mobile
      }

      // ** ORIGINAL LOGIC **
      if (currentStep >= typewriterSteps.length) {
        setIsTyping(false);
        setTimeout(() => setShowButton(true), 500);
        return;
      }

      const step = typewriterSteps[currentStep];
      let currentText = step.append ? displayedText : '';
      let i = 0;
      
      const typeInterval = setInterval(() => {
        if (i < step.text.length) {
          currentText += step.text[i];
          setDisplayedText(currentText);
          i++;
        } else {
          clearInterval(typeInterval);
          // Only set isTyping to false if this is the last step AND we're done typing
          if (currentStep === typewriterSteps.length - 1) {
            setTimeout(() => {
              setIsTyping(false);
            }, step.delay);
          }
          setTimeout(() => {
            setCurrentStep(prev => prev + 1);
          }, step.delay);
        }
      }, 35); // Slightly faster for more fluid typing

      return () => clearInterval(typeInterval);
    };

    const timeoutId = setTimeout(startTyping, startDelay);
    return () => clearTimeout(timeoutId);
  }, [currentStep, isMobile]); // Added isMobile to dependency array

  // Enhanced cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    await sendEmail(formData);
  };

  // Handle closing the contact form & success message
  const handleCloseForm = () => {
    setShowContactForm(false);
    resetFormStatus(); // This will clear successMessage and error
  };

  const formatText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Enhanced styling for "Diell" with genesis glow
      if (line.includes('> Diell.')) {
        return (
          <span key={index} className="relative inline-block">
            <span className="text-amber-400 text-lg sm:text-xl font-bold tracking-widest">
              {line}
            </span>
            <span className="absolute -inset-2 bg-gradient-to-r from-amber-400/30 to-orange-400/30 blur-lg -z-10 animate-[genesisRing_4s_linear_infinite]"></span>
            {index < lines.length - 1 ? '\n' : ''}
          </span>
        );
      }
      // Enhanced styling for "What can we build for you?" with gradual transition and intense pulse
      if (line.includes('What can we build for you?')) {
        return (
          <span key={index} className="relative inline-block">
            <span className="text-slate-300 animate-[gradualGoldenTransition_4s_ease-in-out_forwards] text-base sm:text-lg  tracking-wide">
              {line}
            </span>
          </span>
        );
      }
      // Data stream effect for technical lines
      if (line.includes('high-performance') || line.includes('digital solutions')) {
        return (
          <span key={index} className="relative">
            <span className="text-slate-300  ">
              {line}
            </span>
            {index < lines.length - 1 ? '\n' : ''}
          </span>
        );
      }
      return (
        <span key={index} className="text-slate-300">
          {line}{index < lines.length - 1 ? '\n' : ''}
        </span>
      );
    });
  };

  return (
    <>
      {/* Enhanced Custom animations with high-tech genesis effects */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scanline {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        @keyframes fadeFromWhite {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes revealBackground {
          from {
            opacity: 0;
            transform: scale(1.1);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Genesis High-Tech Effects */
        @keyframes genesisGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 12px rgba(251, 191, 36, 1)) drop-shadow(0 0 24px rgba(251, 191, 36, 0.5));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 20px rgba(251, 191, 36, 1)) drop-shadow(0 0 40px rgba(251, 191, 36, 0.8));
            transform: scale(1.02);
          }
        }
        
        @keyframes gradualGoldenTransition {
          0% { 
            color: #e2e8f0;
            filter: drop-shadow(0 0 4px rgba(148, 163, 184, 0.6));
          }
          50% { 
            color: #fbbf24;
            filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.8));
          }
          100% { 
            color: #f59e0b;
            filter: drop-shadow(0 0 16px rgba(251, 191, 36, 1));
          }
        }
        
  
          50% { 
            filter: drop-shadow(0 0 32px rgba(251, 191, 36, 1)) drop-shadow(0 0 64px rgba(251, 191, 36, 0.6));
            transform: scale(1.05);
          }
        }
        
        @keyframes dataStream {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(148, 163, 184, 0.8)); }
        }
        
        @keyframes matrixRain {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        
        /* Success animations */
        .success-circle {
          stroke: #4ade80;
          stroke-width: 3;
          fill: none;
          stroke-dasharray: 302;
          stroke-dashoffset: 302;
          animation: drawCircle 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          filter: drop-shadow(0 0 15px rgba(74, 222, 128, 0.8));
        }
        .success-checkmark {
          stroke: #4ade80;
          stroke-width: 4;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: drawCheckmark 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.7s forwards;
        }
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheckmark {
          to { stroke-dashoffset: 0; }
        }
        @keyframes successFadeIn {
          to { opacity: 1; }
        }
        
        /* Spinning animation for energy ring */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>

      <div className="relative h-screen w-screen overflow-hidden bg-gray-900">
        {/* WARP ARRIVAL - Black Screen Fade Out */}
        <div 
          className="absolute inset-0 z-50 pointer-events-none"
          style={{
            backgroundColor: 'black',
            animation: 'fadeFromWhite 1.8s ease-out 0.2s forwards',
            opacity: 1
          }}
        />

        {/* Video background & warm overlay with reveal animation */}
        <div 
          className="absolute top-0 left-0 h-full w-full z-0"
          style={{
            animation: 'revealBackground 2.2s ease-out 0.5s both'
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 h-full w-full object-cover"
            poster="/path-to-your-poster-image.jpg"
          >
            <source src="/bg.webm" type="video/webm" />
            <source src="/bg.mp4" type="video/mp4" /> 
          </video>
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black/85 via-black/65 to-orange-950/25" />
          
          {/* Genesis particle overlay */}
          <div className="absolute top-0 left-0 h-full w-full opacity-30">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400 rounded-full animate-[matrixRain_3s_linear_infinite]"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-400 rounded-full animate-[matrixRain_4s_linear_infinite_1s]"></div>
            <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-amber-400 rounded-full animate-[matrixRain_5s_linear_infinite_2s]"></div>
          </div>
        </div>

        <div className="relative z-20 flex h-full w-full items-center justify-center p-3 sm:p-4">

          {/* Main Terminal Modal with enhanced entrance delay */}
          {!showContactForm && (
            <div
              className="w-full max-w-xs sm:max-w-4xl transform transition-all duration-700 ease-out opacity-0 translate-y-8"
              style={{
                animation: 'slideInUp 1.2s ease-out 2.5s forwards'
              }}
            >
              <div className="rounded-lg border border-amber-400/30 bg-black/60 shadow-2xl shadow-orange-500/20 backdrop-blur-lg overflow-hidden relative">
                {/* Genesis energy border */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 animate-[genesisRing_6s_linear_infinite] pointer-events-none"></div>
                
                {/* Modal Header */}
                <div className="flex items-center gap-2 border-b border-amber-400/30 bg-black/40 p-2 sm:p-3 relative z-10">
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]" style={{animationDelay: '0.3s'}}></div>
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" style={{animationDelay: '0.6s'}}></div>
                  <p className="ml-auto text-xs text-slate-400 font-mono tracking-wider hidden sm:block">/genesis/core/identity.sys</p>
                </div>

                {/* Modal Content with Genesis Typewriter */}
                <div className="p-4 sm:p-8 font-mono text-xs sm:text-base leading-relaxed relative">
                  {/* Enhanced scanline effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div 
                      className="w-full h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent animate-[scanline_3s_linear_infinite]"
                    />
                  </div>

                  {/* Genesis energy field */}
                  <div className="absolute inset-2 sm:inset-4 bg-gradient-to-br from-amber-400/5 to-orange-400/5 rounded blur-xl pointer-events-none"></div>

                  <pre className="whitespace-pre-wrap relative z-20 min-h-[180px] sm:min-h-[240px] leading-6 sm:leading-8">
                    {formatText(displayedText)}
                    {isTyping && showCursor && (
                      <span className="text-amber-400 text-lg sm:text-xl font-bold">█</span>
                    )}
                  </pre>

                  {/* Contact Button with Genesis styling */}
                  {showButton && (
                    <div className="mt-6 sm:mt-8 opacity-0 translate-y-4 animate-[fadeInUp_0.8s_ease-out_forwards] relative z-20">
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="btn-form btn-confirm px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm tracking-widest hover:scale-105 relative overflow-hidden group shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] w-full sm:w-auto"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                        <span className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                          _INITIATE_CONNECTION
                          <span className="group-hover:translate-x-2 transition-transform duration-300 text-base sm:text-lg">→</span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showContactForm && (
            <div className="w-full max-w-sm sm:max-w-xl mx-auto transform transition-all duration-500 ease-out opacity-0 translate-x-1 animate-[slideInFromRight_0.6s_ease-out_forwards]">
              <div className="rounded-lg border border-amber-400/30 bg-black/60 shadow-2xl shadow-orange-500/20 backdrop-blur-lg overflow-hidden relative">
                {/* Genesis energy border */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 animate-[genesisRing_8s_linear_infinite] pointer-events-none"></div>
                
                {/* Modal Header */}
                <div className="flex items-center gap-2 border-b border-amber-400/30 bg-black/40 p-2 sm:p-3 relative z-10">
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                  <p className="ml-auto text-xs text-slate-400 font-mono tracking-wider hidden sm:block">/genesis/comms/secure_channel</p>
                </div>

                <div className="p-3 sm:p-8 relative z-10">
                  {successMessage ? (
                    <SuccessDisplay 
                      message={successMessage} 
                      onClose={handleCloseForm}
                    />
                  ) : (
                    <form className="space-y-3 sm:space-y-5" onSubmit={handleSubmit} noValidate>
                      <InputField 
                        label="[Your name]" 
                        type="text" 
                        name="name"
                        placeholder="Your designation..." 
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      
                      <InputField 
                        label="[Email]" 
                        type="email" 
                        name="email"
                        placeholder="contact@domain.com" 
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      
                      <TextareaField 
                        label="[Message]" 
                        name="message"
                        placeholder="Transmit your vision. What digital reality shall we engineer?" 
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      
                      <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-4 pt-3 sm:pt-6">
                        <button 
                          type="submit"
                          disabled={isLoading || !formData.name || !formData.email || !formData.message}
                          className="btn-form btn-confirm w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-3 font-bold text-xs sm:text-sm tracking-wider hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(251,191,36,0.5)]"
                        >
                          {isLoading ? 'TRANSMITTING_SIGNAL...' : 'Contact Us '}
                        </button>
                        <button 
                          type="button"
                          onClick={handleCloseForm}
                          disabled={isLoading}
                          className="btn-form btn-abort w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-3 font-bold text-xs sm:text-sm tracking-wider hover:scale-105 disabled:opacity-50"
                        >
                          TERMINATE_LINK
                        </button>
                      </div>
                      {error && (
                         <p className="text-red-400 font-mono text-xs pt-3 text-center animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">{error}</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Enhanced Input Components with Genesis styling
const InputField = ({ label, type, name, placeholder, value, onChange, disabled }) => (
  <div className="group relative">
    <label className="block text-amber-400 font-mono text-xs mb-2 sm:mb-3 group-focus-within:text-orange-400 transition-colors duration-300 tracking-wider drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]">
      {label}
    </label>
    <div className="relative">
      <input 
        type={type} 
        name={name}
        className="form-input relative z-10 bg-black/40 border border-amber-400/30 focus:border-amber-400/60 focus:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-300 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
      />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-orange-400/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none rounded"></div>
    </div>
  </div>
);

const TextareaField = ({ label, name, placeholder, value, onChange, disabled }) => (
  <div className="group relative">
    <label className="block text-amber-400 font-mono text-xs mb-2 sm:mb-3 group-focus-within:text-orange-400 transition-colors duration-300 tracking-wider drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]">
      {label}
    </label>
    <div className="relative">
      <textarea 
        rows={4}
        name={name}
        className="form-input resize-none relative z-10 bg-black/40 border border-amber-400/30 focus:border-amber-400/60 focus:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-300 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
      />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-orange-400/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none rounded"></div>
    </div>
  </div>
);

export default MainContent;