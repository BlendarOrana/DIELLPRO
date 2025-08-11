import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store'; // Import the real store

// Constants for styling and behavior
const PATH_WIDTH = 40;
const HANDLE_SIZE = PATH_WIDTH * 1.5;
const DRAG_SENSITIVITY = 80;
const PATH_POINTS_COUNT = 400;
const SPIRAL_TURNS = 2.5;

function UnlockScreen() {
  const unlock = useAppStore((state) => state.unlock);
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const rafRef = useRef(null);

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
  const [isDragging, setIsDragging] = useState(false);
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
      setIsDragging(false); // Stop dragging immediately
      // Adjusted timeout to match the full duration of the completion animation.
      setTimeout(() => unlock(), 2500);
    }
  }, [isComplete, isUnlocking, unlock]);

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

  const getCurrentPointIndex = useCallback(() => {
    if (!pathData.cumulativeDistances.length || !pathData.totalLength) return 0;
    const targetDistance = (progressValue / 100) * pathData.totalLength;
    // Simple linear search is fast enough here. For very large arrays, a binary search could be an optimization.
    for (let i = 0; i < pathData.cumulativeDistances.length - 1; i++) {
      if (pathData.cumulativeDistances[i] <= targetDistance &&
          pathData.cumulativeDistances[i + 1] > targetDistance) {
        return i;
      }
    }
    return pathData.cumulativeDistances.length - 1;
  }, [progressValue, pathData.cumulativeDistances, pathData.totalLength]);

  // Pointer move handler optimized with requestAnimationFrame
  const handlePointerMove = useCallback((event) => {
    if (!isDragging || !containerRef.current || isComplete || isUnlocking || !pathData.points.length) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();
      const pointer = {
        x: (event.clientX || event.touches[0].clientX) - rect.left,
        y: (event.clientY || event.touches[0].clientY) - rect.top
      };

      const startIndex = getCurrentPointIndex();
      let closestPointIndex = startIndex;
      let minDistance = Infinity;

      // More optimized search range
      const lookAheadRange = 50;
      const lookBackRange = 10;
      const searchStart = Math.max(0, startIndex - lookBackRange);
      const searchEnd = Math.min(pathData.points.length - 1, startIndex + lookAheadRange);

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

        // Prevent large jumps backward, allow small jumps forward
        const maxAllowedJump = 5;
        if (newProgressValue >= progressValue || (progressValue - newProgressValue) < maxAllowedJump) {
           setProgressValue(newProgressValue);
        }
      }
    });
  }, [isDragging, isComplete, isUnlocking, progressValue, pathData, getCurrentPointIndex]);

  const handlePointerUp = useCallback(() => {
    if (!isUnlocking) {
      setIsDragging(false);
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [isUnlocking]);

  useEffect(() => {
    const options = { passive: true };
    if (isDragging && !isUnlocking) {
      window.addEventListener('pointermove', handlePointerMove, options);
      window.addEventListener('pointerup', handlePointerUp, options);
      // touchmove and touchend are now covered by pointer events for better compatibility
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, isUnlocking, handlePointerMove, handlePointerUp]);

  const handlePointerDown = useCallback((e) => {
    if (isComplete || isUnlocking) return;
    e.preventDefault();
    setIsDragging(true);
  }, [isComplete, isUnlocking]);

  const currentPointIndex = getCurrentPointIndex();
  const currentPos = pathData.points[currentPointIndex] || { x: 0, y: 0 };
  const normalizedProgress = progressValue / 100;
const lightingIntensity = isComplete ? 2.5 : Math.min(normalizedProgress * 1.5, 1);
  return (
    <motion.div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-black select-none touch-action-none"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
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
              transition={{ duration: 0.5, ease: "easeOut" }}
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

            {/* Draggable Handle: Only render if the path points exist to prevent initial flicker */}
            {pathData.points.length > 0 && (
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
                  filter: 'brightness(5) '
                } : {
                  scale: 1,
                  filter: 'brightness(1)'
                }}
               transition={{
  x: { type: 'spring', stiffness: 3000, damping: 50 },
  y: { type: 'spring', stiffness: 3000, damping: 50 },
  scale: { duration: isComplete ? 0.2 : 0.3, ease: "easeOut" },
  filter: { 
    duration: isComplete ? (isMobile ? 2.5 : 0.2) : 0.5, 
    ease: "easeOut" 
  }
}}
                onPointerDown={handlePointerDown}
                whileHover={!isComplete ? { scale: 1.1 } : {}}
                whileTap={!isComplete ? { scale: 1.2 } : {}}
              >
                {/* Handle's visual elements */}
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ease-out"
                    style={{
                      borderColor: lightingIntensity > 0.3 ? `rgba(250, 204, 21, ${Math.min(lightingIntensity, 1)})` : 'rgba(100,100,100,0.6)',
                      transform: isComplete ? 'scale(1.2)' : 'scale(1)'
                    }}
                  >
      
                  
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
                    
                    <div
                      className="absolute rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: isComplete ? '20px' : '16px',
                        height: isComplete ? '20px' : '16px',
                        left: '50%',
                      top: isComplete ? 'calc(50% + 5px)' : 'calc(50% + 3px)',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: lightingIntensity > 0.2 ? `rgba(250, 204, 21, ${Math.min(lightingIntensity, 1)})` : 'rgba(100,100,100,0.6)',
                      }}
                    />
                  </div>
                  
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

                        {/* Mobile effects - optimized with blur instead of box-shadow */}
                        {isMobile && (
                          <>
                            {/* Main expanding effect */}
                            <motion.div
                              className="absolute inset-0 rounded-full pointer-events-none"
                              style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(250,204,21,0.9) 30%, rgba(249,115,22,0.6) 60%, transparent 100%)',
                                filter: 'blur(0.5px) ', // Subtle blur instead of heavy box-shadow
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ 
                                scale: [0, 3, 5, 8, 12], 
                                opacity: [0, 1, 0.8, 0.3, 0] ,
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