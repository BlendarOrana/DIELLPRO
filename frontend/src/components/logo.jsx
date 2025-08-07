import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DiellLogo = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [lightingIntensity, setLightingIntensity] = useState(0.8);
  
  const PATH_WIDTH = 40;

  const handleClick = () => {
    setIsComplete(true);
    setLightingIntensity(1);
    
    setTimeout(() => {
      setIsComplete(false);
      setLightingIntensity(0.8);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      <div 
        className="relative cursor-pointer mb-4"
        style={{ width: 80, height: 80 }}
        onClick={handleClick}
      >
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ease-out"
            style={{
              borderColor: lightingIntensity > 0.3 ? `rgba(250, 204, 21, ${Math.min(lightingIntensity, 1)})` : 'rgba(100,100,100,0.6)',
              transform: isComplete ? 'scale(1.2)' : 'scale(1)'
            }}
          >
            {/* Outer ring that appears when completed */}
            {isComplete && (
              <div
                className="absolute rounded-full transition-all duration-500 ease-out"
                style={{
                  width: '120%',
                  height: '120%',
                  borderColor: `rgba(250, 204, 21, 0.6)`,
                  background: 'transparent',
                  animation: 'pulse 1s ease-in-out infinite alternate'
                }}
              />
            )}
          
            {/* Keep the original perfect rays */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 origin-bottom"
                style={{
                  height: isComplete ? '12px' : '8px',
                  transform: `rotate(${i * 45}deg) translateY(-${PATH_WIDTH * 0.4}px)`,
                  backgroundColor: lightingIntensity > 0.3 ? `rgba(250, 204, 21, ${Math.min(lightingIntensity, 1)})` : 'rgba(100,100,100,0.6)',
                  boxShadow: isComplete ? `0 0 15px rgba(250, 204, 21, ${lightingIntensity})` : lightingIntensity > 0.5 ? `0 0 10px rgba(250, 204, 21, ${lightingIntensity})` : 'none',
                  transition: 'all 0.3s ease-out'
                }}
              />
            ))}
            
            {/* Center circle - perfectly centered */}
            <div
              className="absolute rounded-full transition-all duration-300 ease-out"
              style={{
                width: isComplete ? '20px' : '16px',
                height: isComplete ? '20px' : '16px',
                left: '50%',
                top: isComplete ? 'calc(50% + 5px)' : 'calc(50% + 3px)',
                transform: 'translate(-50%, -50%)',
                backgroundColor: lightingIntensity > 0.2 ? `rgba(250, 204, 21, ${Math.min(lightingIntensity, 1)})` : 'rgba(100,100,100,0.6)',
                boxShadow: isComplete ? `0 0 25px rgba(250, 204, 21, 0.9), 0 0 50px rgba(249, 115, 22, 0.7)` : lightingIntensity > 0.4 ? `0 0 15px rgba(250, 204, 21, ${Math.min(lightingIntensity, 0.8)})` : 'none'
              }}
            />
          </div>
          
          {/* SUN FLASH EXPLOSION EFFECT */}
          <AnimatePresence>
            {isComplete && (
              <>
                {/* Intense center flash */}
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(250,204,21,0.9) 30%, rgba(249,115,22,0.6) 60%, transparent 100%)',
                    boxShadow: '0 0 100px rgba(255,255,255,0.8), 0 0 200px rgba(250,204,21,0.6)'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 3, 5, 8, 12], 
                    opacity: [0, 1, 0.8, 0.3, 0] 
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeOut",
                    times: [0, 0.1, 0.3, 0.7, 1]
                  }}
                />
                
                {/* Blinding center core */}
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'rgba(255,255,255,1)',
                    boxShadow: '0 0 150px rgba(255,255,255,1), 0 0 300px rgba(250,204,21,0.8)'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 2, 0], 
                    opacity: [0, 1, 1, 0] 
                  }}
                  transition={{ 
                    duration: 0.4, 
                    ease: "easeOut",
                    times: [0, 0.2, 0.8, 1]
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <h1 
        className="text-4xl font-bold tracking-widest transition-all duration-300"
        style={{
          color: lightingIntensity > 0.7 ? '#fbbf24' : '#d1d5db',
          textShadow: isComplete ? '0 0 20px rgba(251, 191, 36, 0.8)' : 'none'
        }}
      >
        DIELL
      </h1>
      
      <p className="text-gray-400 text-sm mt-2">Click the sun to activate</p>
    </div>
  );
};

export default DiellLogo;