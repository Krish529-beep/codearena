import { motion } from 'framer-motion';

interface DifficultyBreakdownProps {
  easy: number;
  medium: number;
  hard: number;
}

const DifficultyBreakdown = ({ easy, medium, hard }: DifficultyBreakdownProps) => {
  const total = easy + medium + hard || 1;
  const items = [
    { label: 'Easy', count: easy, color: '#10b981', percent: (easy / total) * 100 }, // Zinc Emerald
    { label: 'Medium', count: medium, color: '#f59e0b', percent: (medium / total) * 100 }, // Zinc Amber
    { label: 'Hard', count: hard, color: '#ef4444', percent: (hard / total) * 100 }, // Zinc Red
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card h-full p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6 tracking-tight">Difficulty Breakdown</h3>

      <div className="flex items-center justify-center mb-8">
        <div className="relative h-40 w-40 sm:h-44 sm:w-44">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#27272a" // zinc-800
              strokeWidth="10"
            />
            {items.reduce((acc: React.ReactNode[], item, i) => {
              if (item.percent === 0) return acc;
              const offset = items.slice(0, i).reduce((s, it) => s + it.percent, 0);
              const dashArray = (item.percent / 100) * 339.292;
              const dashOffset = -(offset / 100) * 339.292;

              acc.push(
                <circle
                  key={item.label}
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="10"
                  strokeDasharray={`${dashArray} ${339.292 - dashArray}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              );
              return acc;
            }, [])}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white tracking-tight">{easy + medium + hard}</span>
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Solved</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-sm font-medium text-zinc-300">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-white">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DifficultyBreakdown;
