import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-10 h-10 text-brand-400" />
      </motion.div>
      <p className="text-gray-400 text-sm">Loading CodeArena...</p>
    </motion.div>
  </div>
);

export default LoadingScreen;
