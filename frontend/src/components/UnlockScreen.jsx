import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store'; // Import the real store
import { DiellLogo } from 'diell-logo';

// Constants for styling and behavior
const PATH_WIDTH = 40;
const PATH_POINTS_COUNT = 400;
const SPIRAL_TURNS = 2.5;
const AUTO_COMPLETE_DURATION = 3000; // 3 seconds to complete

function UnlockScreen() {
  const unlock = useAppStore((state) => state.unlock);
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const animationRef = useRef(null);

  // State
  const [isReady, setIsReady] = useState(false);
  const [pathData, setPathData] = useState({
    points: [],
    svg: '',
    cumulativeDistances: [],
    totalLength: 0,
  });
  const [pathLength, setPathLength] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isMobileUA || (isSmallScreen && hasTouchSupport));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isComplete = progressValue >= 99.5;

  // Auto-unlock when complete
  useEffect(() => {
    if (isComplete && !isUnlocking) {
      setIsUnlocking(true);
      setTimeout(() => unlock(), 2500);
    }
  }, [isComplete, isUnlocking, unlock]);

  // Auto-progress animation
  useEffect(() => {
    if (!isReady || isComplete) return;

    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / AUTO_COMPLETE_DURATION, 1);
      
      // Smooth easing function for natural progression
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      
      setProgressValue(easedProgress * 100);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReady, isComplete]);

  // Effect to calculate the spiral path
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

      setPathData({
        points,
        svg: svgPath,
        cumulativeDistances,
        totalLength: totalSpiralLength
      });
      setIsReady(true);
    };

    calculatePath();
    window.addEventListener('resize', calculatePath);
    return () => window.removeEventListener('resize', calculatePath);
  }, []);

  // Effect to measure the SVG path length
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [pathData.svg]);

  const getCurrentPointIndex = () => {
    if (!pathData.cumulativeDistances.length || !pathData.totalLength) return 0;
    const targetDistance = (progressValue / 100) * pathData.totalLength;
    for (let i = 0; i < pathData.cumulativeDistances.length - 1; i++) {
      if (pathData.cumulativeDistances[i] <= targetDistance &&
          pathData.cumulativeDistances[i + 1] > targetDistance) {
        return i;
      }
    }
    return pathData.cumulativeDistances.length - 1;
  };

  const currentPointIndex = getCurrentPointIndex();
  const currentPos = pathData.points[currentPointIndex] || { x: 0, y: 0 };
  const normalizedProgress = progressValue / 100;
  const lightingIntensity = isComplete ? 2.5 : Math.min(normalizedProgress * 1.5, 1);

  // Calculate dynamic color for DiellLogo based on progress
  const getLogoColor = () => {
    if (isComplete) return '#fbbf24'; // Keep the yellow color when complete
    if (lightingIntensity > 0.3) {
      // Interpolate between gray and yellow based on lighting intensity
      const intensity = Math.min(lightingIntensity, 1);
      const red = Math.floor(100 + (250 - 100) * intensity);
      const green = Math.floor(100 + (204 - 100) * intensity);
      const blue = Math.floor(100 + (21 - 100) * intensity);
      return `rgb(${red}, ${green}, ${blue})`;
    }
    return '#646464'; // Gray when inactive
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-black select-none"
    >
      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Spiral Container */}
            <motion.div
              className="absolute top-0 left-0 h-full w-full"
              animate={isComplete ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <svg className="absolute top-0 left-0 h-full w-full pointer-events-none">
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#facc15" />
                  </linearGradient>
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
                {isComplete && pathData.points.length > 0 && (
                  <circle
                    cx={pathData.points[pathData.points.length - 1].x}
                    cy={pathData.points[pathData.points.length - 1].y}
                    r="100"
                  />
                )}
              </svg>
            </motion.div>

            {/* Auto-moving Logo Handle: Only render if the path points exist */}
            {pathData.points.length > 0 && (
              <motion.div
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  width: 80,
                  height: 80,
                  x: currentPos.x - 40,
                  y: currentPos.y - 40,
                }}
                animate={isComplete ? {
                  scale: 1.8,
                  filter: ['brightness(1)', 'brightness(3)', 'brightness(1)']
                } : {
                  scale: 1,
                  filter: 'brightness(1)'
                }}
                transition={{
                  x: { type: 'tween', duration: 0.1, ease: "easeOut" },
                  y: { type: 'tween', duration: 0.1, ease: "easeOut" },
                  scale: { duration: isComplete ? 0.2 : 0.3, ease: "easeOut" },
                  filter: { 
                    duration: isComplete ? 2.0 : 0.5, 
                    ease: "easeOut",
                    times: isComplete ? [0, 0.1, 1] : undefined
                  }
                }}
              >
                {/* DiellLogo as the handle */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <DiellLogo
                    size={80}
                    primaryColor={getLogoColor()}
                    text=""
                    showText={false}
                  />
                  
                  <AnimatePresence>
                    {isComplete && (
                      <>
                        {/* Desktop effects - heavy box-shadow */}
                        {!isMobile && (
                          <>
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
                            
                            <motion.div
                              className="absolute inset-0 rounded-full pointer-events-none"
                              style={{
                                background: 'rgba(255,255,255,1)',
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

                        {isMobile && (
                          <>
                            {/* Main expanding effect */}
                            <motion.div
                              className="absolute inset-0 rounded-full pointer-events-none"
                              style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(250,204,21,0.9) 30%, rgba(249,115,22,0.6) 60%, transparent 100%)',
                                filter: 'blur(0.5px)', // Subtle blur instead of heavy box-shadow
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ 
                                scale: [0, 3, 5, 8, 12], 
                                opacity: [0, 1, 0.8, 0.3, 0],
                              }}
                              transition={{ 
                                duration: 0.6, 
                                ease: "easeOut",
                                times: [0, 0.1, 0.3, 0.7, 1]
                              }}
                            />
                          </>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isComplete && pathData.points.length > 0 && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute pointer-events-none rounded-full"
                style={{
                  top: currentPos.y,
                  left: currentPos.x,
                  width: 4,
                  height: 4,
                  backgroundColor: 'rgba(250,204,21,0.8)'
                }}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{
                  scale: [1, 0],
                  opacity: [1, 0],
                  x: Math.cos((i * 30) * Math.PI / 180) * 150,
                  y: Math.sin((i * 30) * Math.PI / 180) * 150
                }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.1 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default UnlockScreen;