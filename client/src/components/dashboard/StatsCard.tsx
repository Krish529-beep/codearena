import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatsCard = ({ title, value, icon, color, subtitle }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card p-6 h-full min-h-40 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded border border-zinc-800 bg-zinc-900 flex items-center justify-center"
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <div className="mt-auto">
        <p className="break-words text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">{value.toLocaleString()}</p>
        <p className="text-sm sm:text-base text-zinc-400 font-medium">{title}</p>
        {subtitle && <p className="mt-2 text-xs sm:text-sm break-words font-medium" style={{ color }}>{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default StatsCard;
