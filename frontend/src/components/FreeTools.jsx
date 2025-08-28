import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";


// This is your actual tool.
import QRCodeGenerator from './QRCodeGenerator';


// Animation variants for the feature list
const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};


const FreeTools = () => {
      const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Back Button */}
      <motion.button
      onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-lg text-neutral-300 hover:text-white hover:border-yellow-400/50 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 md:mb-28"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-[#fbbf24] bg-clip-text text-transparent" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.3)'}} >
            Just a Free QR Code Generator
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto">
            Honestly, we wanted custom QR codes for our business cards and got annoyed that every good tool was behind a paywall. So we built our own. Here it is—no strings attached. Hope you find it useful!
          </p>
        </motion.div>

        {/* --- Showcase Section --- */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Left Side: Text and Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-100">Simple, Custom, and Completely Free.</h2>
            
            {/* NEW: Replaced the paragraph with a clear, scannable list */}
            <motion.ul 
              className="space-y-4 text-lg text-neutral-300"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.li className="flex items-center gap-3" variants={itemVariants}>
                <CheckCircle className="text-yellow-400" size={20} />
                <span>Custom Colors & Styles</span>
              </motion.li>
              <motion.li className="flex items-center gap-3" variants={itemVariants}>
                <CheckCircle className="text-yellow-400" size={20} />
                <span>Add Your Own Logo</span>
              </motion.li>
              <motion.li className="flex items-center gap-3" variants={itemVariants}>
                <CheckCircle className="text-yellow-400" size={20} />
                <span>High-Resolution Download (SVG)</span>
              </motion.li>
              <motion.li className="flex items-center gap-3" variants={itemVariants}>
                <CheckCircle className="text-yellow-400" size={20} />
                <span>No Sign-Up Required, Ever.</span>
              </motion.li>
            </motion.ul>

          </motion.div>

          {/* Right Side: 3D SVG Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
            style={{ perspective: '1000px' }}
            className="flex items-center justify-center min-h-[350px]"
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                rotateY: -10,
                rotateX: 5,
                boxShadow: '0px 20px 40px rgba(251, 191, 36, 0.3)'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="w-full max-w-sm  bg-neutral-800/40 backdrop-blur-md rounded-2xl  "
            >
              <img
                src="/diell-qr-code.svg"
                alt="Custom QR Code Showcase"
                className="w-full h-auto rounded-lg "
                style={{ transform: 'translateZ(20px)' }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* --- QR Code Generator Tool Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-28 md:mt-36"
        >
  


          <div className="max-w-4xl mx-auto    backdrop-blur-lg  ">
            <QRCodeGenerator />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FreeTools;