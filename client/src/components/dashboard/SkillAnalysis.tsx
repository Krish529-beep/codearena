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
  const data = [
    { name: 'Easy', value: stats.easySolved, total: stats.easyTotal, color: '#10b981' },
    { name: 'Medium', value: stats.mediumSolved, total: stats.mediumTotal, color: '#f59e0b' },
    { name: 'Hard', value: stats.hardSolved, total: stats.hardTotal, color: '#ef4444' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 h-full"
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-white tracking-tight">Mastery Analysis</h3>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Solved vs Available</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.map((item) => {
          const chartData = [
            { name: 'Solved', value: item.value },
            { name: 'Remaining', value: Math.max(0, item.total - item.value) },
          ];
          const percentage = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;

          return (
            <div key={item.name} className="flex flex-col items-center">
              <div className="relative h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={55}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={item.color} />
                      <Cell fill="#27272a" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white tracking-tight">{percentage}%</span>
                  <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Done</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-zinc-500 mt-1">{item.value} / {item.total}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-400">Overall Progress</span>
          <span className="text-sm font-bold text-white">{stats.totalSolved} / {stats.allTotal}</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(stats.totalSolved / (stats.allTotal || 1)) * 100}%` }}
            className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SkillAnalysis;
