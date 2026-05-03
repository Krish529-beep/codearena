import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface SkillAnalysisProps {
  stats: {
    easySolved: number;
    easyTotal: number;
    mediumSolved: number;
    mediumTotal: number;
    hardSolved: number;
    hardTotal: number;
    totalSolved: number;
    allTotal: number;
  };
}

const SkillAnalysis = ({ stats }: SkillAnalysisProps) => {
  // Use user's own total as the denominator — always available, always accurate
  const total = stats.totalSolved || 1;

  const data = [
    { name: 'Easy',   value: stats.easySolved,  color: '#10b981' },
    { name: 'Medium', value: stats.mediumSolved, color: '#f59e0b' },
    { name: 'Hard',   value: stats.hardSolved,   color: '#ef4444' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 h-full"
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-white tracking-tight">Mastery Analysis</h3>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Difficulty Distribution</p>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:gap-8">
        {data.map((item) => {
          const percentage = stats.totalSolved > 0
            ? Math.round((item.value / total) * 100)
            : 0;

          // Ring: filled slice = this difficulty's solved, rest = other difficulties
          const chartData = [
            { name: item.name, value: item.value },
            { name: 'Other',   value: Math.max(0, total - item.value) },
          ];

          return (
            <div key={item.name} className="flex flex-col items-center">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={50}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={item.color} />
                      <Cell fill="#27272a" />
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(val: number, name: string) =>
                        name === item.name ? [`${val} solved`, item.name] : [`${val}`, 'Other']
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold text-white tracking-tight">{percentage}%</span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 font-medium uppercase tracking-wider">of total</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs mt-0.5 font-bold" style={{ color: item.color }}>
                  {item.value} solved
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stacked difficulty progress bar */}
      <div className="mt-8 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-400">Total Solved</span>
          <span className="text-sm font-bold text-white">{stats.totalSolved}</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stats.easySolved / total) * 100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full bg-emerald-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stats.mediumSolved / total) * 100}%` }}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-full bg-amber-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stats.hardSolved / total) * 100}%` }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-full bg-red-500"
          />
        </div>
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-xs text-zinc-500">
                {item.name}{' '}
                <span className="text-zinc-300 font-medium">{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillAnalysis;
