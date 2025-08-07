import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock store for demo - replace with your real store
const useAppStore = (selector) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  return selector({
    unlock: () => setIsUnlocked(true),
    isUnlocked
  });
};

// Constants for styling and behavior
const PATH_WIDTH = 40;
const HANDLE_SIZE = PATH_WIDTH * 1.5;
const DRAG_SENSITIVITY = 80;
const PATH_POINTS_COUNT = 600; // Reduced for better mobile performance
const SPIRAL_TURNS = 2.5;

function UnlockScreen() {
  const unlock = useAppStore((state) => state.unlock);
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const rafRef = useRef(null);

  // State - consolidated to prevent race conditions
  const [appState, setAppState] = useState({
    isReady: false,
    pathData: {
      points: [],
      svg: '',
      cumulativeDistances: [],
      totalLength: 0
    },
    pathLength: 0,
    progressValue: 0,
    isDragging: false,
    isUnlocking: false
  });

  const { isReady, pathData, pathLength, progressValue, isDragging, isUnlocking } = appState;
  const isComplete = progressValue >= 99.5;

  // Auto-unlock when complete
  useEffect(() => {
    if (isComplete && !isUnlocking) {
      setAppState(prev => ({ ...prev, isUnlocking: true, isDragging: false }));
      setTimeout(() => unlock(), 2500);
    }
  }, [isComplete, isUnlocking, unlock]);

  // Effect to calculate the spiral path - ATOMIC UPDATE
  useEffect(() => {
    const calculatePath = () => {
      if (!containerRef.current) return;
      
      const { offsetWidth: w, offsetHeight: h } = containerRef.current;
      const centerX = w / 2;
      const centerY = h / 2;
      const points = [];
      const cumulativeDistances = [0];
      const maxRadius = Math.min(w, h) / 2 - PATH_WIDTH;

      for (let i = 0; i <= PATH_POINTS_COUNT; i++) {
        const p = 1 - i / PATH_POINTS_COUNT;
        const angle = SPIRAL_TURNS * 2 * Math.PI * p;
        const radius = maxRadius * p;
        points.push({
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        });

        if (i > 0) {
          const prevPoint = points[i - 1];
          const currentPoint = points[i];
          const segmentDistance = Math.hypot(
            currentPoint.x - prevPoint.x,
            currentPoint.y - prevPoint.y
          );
          cumulativeDistances.push(cumulativeDistances[i - 1] + segmentDistance);
        }
      }

      let svgPath = `M ${points[0].x} ${points[0].y}`;
      points.slice(1).forEach(p => { svgPath += ` L ${p.x} ${p.y}` });

      const totalSpiralLength = cumulativeDistances[cumulativeDistances.length - 1];

      // ATOMIC UPDATE - everything at once to prevent race conditions
      setAppState(prev => ({
        ...prev,
        pathData: {
          points,
          svg: svgPath,
          cumulativeDistances,
          totalLength: totalSpiralLength
        },
        isReady: true // Only set ready when ALL data is complete
      }));
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const initPath = () => requestAnimationFrame(calculatePath);
    
    initPath();
    window.addEventListener('resize', initPath);
    return () => window.removeEventListener('resize', initPath);
  }, []);

  // Effect to measure the SVG path length
  useEffect(() => {
    if (pathRef.current && pathData.svg) {
      const measuredLength = pathRef.current.getTotalLength();
      setAppState(prev => ({ ...prev, pathLength: measuredLength }));
    }
  }, [pathData.svg]);

  // Memoized position calculation to prevent unnecessary recalculations
  const currentPos = useMemo(() => {
    if (!pathData.points.length || !pathData.cumulativeDistances.length) {
      return { x: 0, y: 0 };
    }

    const targetDistance = (progressValue / 100) * pathData.totalLength;
    let pointIndex = 0;
    
    for (let i = 0; i < pathData.cumulativeDistances.length - 1; i++) {
      if (pathData.cumulativeDistances[i] <= targetDistance &&
          pathData.cumulativeDistances[i + 1] > targetDistance) {
        pointIndex = i;
        break;
      }
    }
    
    if (pointIndex === 0 && pathData.cumulativeDistances.length > 1) {
      pointIndex = pathData.cumulativeDistances.length - 1;
    }
    
    return pathData.points[pointIndex] || pathData.points[0] || { x: 0, y: 0 };
  }, [pathData, progressValue]);

  // Optimized pointer move handler
  const handlePointerMove = useCallback((event) => {
    if (!isDragging || !containerRef.current || isComplete || isUnlocking || !pathData.points.length) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = event.clientX ?? event.touches?.[0]?.clientX;
      const clientY = event.clientY ?? event.touches?.[0]?.clientY;
      
      if (!clientX || !clientY) return;
      
      const pointer = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };

      const currentPointIndex = Math.floor((progressValue / 100) * (pathData.points.length - 1));
      let closestPointIndex = currentPointIndex;
      let minDistance = Infinity;

      const lookAheadRange = 30; // Reduced for mobile performance
      const lookBackRange = 5;

      const searchStart = Math.max(0, currentPointIndex - lookBackRange);
      const searchEnd = Math.min(pathData.points.length - 1, currentPointIndex + lookAheadRange);

      for (let i = searchStart; i <= searchEnd; i++) {
        const point = pathData.points[i];
        const distance = Math.hypot(pointer.x - point.x, pointer.y - point.y);

        if (distance < minDistance) {
          minDistance = distance;
          closestPointIndex = i;
        }
      }

      if (minDistance < DRAG_SENSITIVITY) {
        const currentDistance = pathData.cumulativeDistances[closestPointIndex];
        const totalDistance = pathData.totalLength;
        const newProgressValue = Math.min((currentDistance / totalDistance) * 100, 100);

        const maxAllowedJump = 5;
        if (newProgressValue <= progressValue + maxAllowedJump) {
          setAppState(prev => ({ ...prev, progressValue: newProgressValue }));
        }
      }
    });
  }, [isDragging, isComplete, isUnlocking, progressValue, pathData]);

  const handlePointerUp = useCallback(() => {
    if (!isUnlocking) {
      setAppState(prev => ({ ...prev, isDragging: false }));
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [isUnlocking]);

  const handlePointerDown = useCallback((e) => {
    if (isComplete || isUnlocking) return;
    e.preventDefault();
    setAppState(prev => ({ ...prev, isDragging: true }));
  }, [isComplete, isUnlocking]);

  // Event listeners
  useEffect(() => {
    const options = { passive: false }; // Changed to false for preventDefault
    if (isDragging && !isUnlocking) {
      window.addEventListener('pointermove', handlePointerMove, options);
      window.addEventListener('pointerup', handlePointerUp, options);
      window.addEventListener('touchmove', handlePointerMove, options);
      window.addEventListener('touchend', handlePointerUp, options);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, isUnlocking, handlePointerMove, handlePointerUp]);

  const normalizedProgress = progressValue / 100;
  const lightingIntensity = isComplete ? 2.5 : Math.min(normalizedProgress * 1.5, 1);
  const finalBurst = isComplete ? 1 : 0;

  // Don't render anything until we have valid path data
  if (!isReady || !pathData.points.length) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-black select-none touch-action-none"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main Spiral Container */}
        <motion.div
          className="absolute top-0 left-0 h-full w-full"
          animate={isComplete ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <svg className="absolute top-0 left-0 h-full w-full pointer-events-none">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#facc15" />
              </linearGradient>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(250,204,21,0.8)" stopOpacity={finalBurst} />
                <stop offset="50%" stopColor="rgba(249,115,22,0.4)" stopOpacity={finalBurst * 0.6} />
                <stop offset="100%" stopColor="rgba(250,204,21,0)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Path */}
            <path
              ref={pathRef}
              d={pathData.svg}
              fill="none"
              stroke="#333333"
              strokeWidth={PATH_WIDTH}
              strokeLinecap="round"
            />

            {/* Progress Trace */}
            <path
              d={pathData.svg}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth={PATH_WIDTH}
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength * (1 - normalizedProgress)}
              style={{
                transition: 'none',
                filter: isComplete ? 'brightness(1.5) drop-shadow(0 0 20px #facc15)' : 'none'
              }}
            />

            {isComplete && (
              <circle
                cx={pathData.points[pathData.points.length - 1]?.x || 0}
                cy={pathData.points[pathData.points.length - 1]?.y || 0}
                r="100"
                fill="url(#centerGlow)"
                opacity={finalBurst}
              />
            )}
          </svg>
        </motion.div>

        {/* Draggable Handle */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            x: currentPos.x - HANDLE_SIZE / 2,
            y: currentPos.y - HANDLE_SIZE / 2,
            touchAction: 'none'
          }}
          animate={isComplete ? {
            scale: 1.8,
            filter: 'brightness(5) drop-shadow(0 0 40px #facc15)'
          } : {
            scale: 1,
            filter: 'brightness(1)'
          }}
          transition={{
            x: { type: 'spring', stiffness: 3000, damping: 50 },
            y: { type: 'spring', stiffness: 3000, damping: 50 },
            scale: { duration: isComplete ? 0.2 : 0.3, ease: "easeOut" },
            filter: { duration: isComplete ? 0.2 : 0.5, ease: "easeOut" }
          }}
          onPointerDown={handlePointerDown}
          whileHover={!isComplete ? { scale: 1.1 } : {}}
          whileTap={!isComplete ? { scale: 1.2 } : {}}
        >
          <div className="relative w-full h-full">
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ease-out"
              style={{
                borderColor: lightingIntensity > 0.3 ? `rgba(250, 204, 21, ${Math.min(lightingIntensity, 1)})` : 'rgba(100,100,100,0.6)',
                transform: isComplete ? 'scale(1.2)' : 'scale(1)'
              }}
            >
              {/* Outer ring for completion */}
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
            
              {/* Rays */}
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
              
              {/* Center circle */}
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
                  {/* Main explosion burst */}
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
                      duration: 1.2, 
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
                      duration: 0.8, 
                      ease: "easeOut",
                      times: [0, 0.2, 0.8, 1]
                    }}
                  />

                  {/* Screen flash overlay */}
                  <motion.div
                    className="fixed inset-0 pointer-events-none z-50"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, rgba(250,204,21,0.1) 50%, transparent 100%)'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.6, times: [0, 0.1, 1] }}
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Particle burst effect */}
      <AnimatePresence>
        {isComplete && (
          [...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none rounded-full"
              style={{
                top: currentPos.y,
                left: currentPos.x,
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                backgroundColor: i % 2 === 0 ? 'rgba(250,204,21,0.8)' : 'rgba(249,115,22,0.6)'
              }}
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{
                scale: [1, 0],
                opacity: [1, 0],
                x: Math.cos((i * 22.5) * Math.PI / 180) * (100 + Math.random() * 100),
                y: Math.sin((i * 22.5) * Math.PI / 180) * (100 + Math.random() * 100)
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeOut", 
                delay: Math.random() * 0.3 
              }}
            />
          ))
        )}
      </AnimatePresence>

      {/* Ripple waves */}
      <AnimatePresence>
        {isComplete && (
          [...Array(3)].map((_, i) => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute border border-yellow-400 rounded-full pointer-events-none"
              style={{
                top: currentPos.y,
                left: currentPos.x,
                width: 0,
                height: 0
              }}
              initial={{ 
                width: 0, 
                height: 0, 
                opacity: 0.8,
                x: 0,
                y: 0
              }}
              animate={{ 
                width: 400, 
                height: 400, 
                opacity: 0,
                x: -200,
                y: -200
              }}
              transition={{ 
                duration: 2, 
                ease: "easeOut",
                delay: i * 0.2
              }}
            />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default UnlockScreen;