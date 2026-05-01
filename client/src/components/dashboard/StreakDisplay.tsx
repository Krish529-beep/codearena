import { motion } from 'framer-motion';
import { Flame, Award } from 'lucide-react';

interface StreakDisplayProps {
  current: number;
  longest: number;
}

const StreakDisplay = ({ current, longest }: StreakDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 h-full"
    >
      <h3 className="mb-6 text-lg font-semibold text-white tracking-tight">Streak</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center flex flex-col items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex"
          >
            <Flame className="mb-2 h-8 w-8 text-white" />
          </motion.div>
          <p className="text-3xl font-bold text-white tracking-tight">{current}</p>
          <p className="mt-1 text-xs text-zinc-500 font-medium uppercase tracking-wider">Current</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center flex flex-col items-center justify-center">
          <Award className="mb-2 h-8 w-8 text-zinc-400" />
          <p className="text-3xl font-bold text-white tracking-tight">{longest}</p>
          <p className="mt-1 text-xs text-zinc-500 font-medium uppercase tracking-wider">Longest</p>
        </div>
      </div>

      {current > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-sm font-medium text-zinc-400">
            {current >= 7
              ? 'You are on fire! Keep it up.'
              : current >= 3
                ? 'Great consistency!'
                : 'Building momentum...'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StreakDisplay;
