import { motion } from 'framer-motion';
import { ArrowLeft, Wrench, Palette, Code, Zap } from 'lucide-react';

const FreeTools = ({ onBack }) => {

  const tools = [
    {
      id: 1,
      title: 'Color Palette Generator',
      description: 'Generate beautiful color palettes for your projects',
      icon: Palette,
      color: '#f59e0b',
      comingSoon: true
    },
    {
      id: 2,
      title: 'CSS Grid Generator',
      description: 'Create responsive CSS Grid layouts visually',
      icon: Code,
      color: '#10b981',
      comingSoon: true
    },
    {
      id: 3,
      title: 'Animation Helper',
      description: 'Generate CSS animations and transitions',
      icon: Zap,
      color: '#8b5cf6',
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-auto">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-10">
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
        onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-lg text-neutral-300 hover:text-white hover:border-neutral-600 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            <Wrench size={32} className="text-yellow-400" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Free Tools
          </h1>
          
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Powerful, free web development tools to accelerate your workflow and enhance your projects.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              className="group relative p-6 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: `0 10px 40px ${tool.color}20` }}
            >
              {tool.comingSoon && (
                <div className="absolute top-4 right-4 px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                  Coming Soon
                </div>
              )}
              
              <div 
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${tool.color}20`, border: `1px solid ${tool.color}30` }}
              >
                <tool.icon size={24} color={tool.color} />
              </div>
              
              <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
                {tool.title}
              </h3>
              
              <p className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
                {tool.description}
              </p>

              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ 
                  background: `linear-gradient(135deg, ${tool.color}05, transparent)`,
                  border: `1px solid ${tool.color}20`
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-neutral-500">
            More tools coming soon! Follow our progress and suggest new tools.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FreeTools;