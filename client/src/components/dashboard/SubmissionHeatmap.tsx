import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface HeatmapProps {
  submissionCalendar: string | Record<string, number>;
}

const SubmissionHeatmap = ({ submissionCalendar }: HeatmapProps) => {
  const heatmapData = useMemo(() => {
    // Handle both JSON string and already-parsed object
    let calendar: Record<string, number> = {};
    try {
      if (typeof submissionCalendar === 'string') {
        calendar = JSON.parse(submissionCalendar || '{}');
      } else if (typeof submissionCalendar === 'object' && submissionCalendar !== null) {
        calendar = submissionCalendar;
      }
    } catch {
      calendar = {};
    }

    const today = new Date();
    const cells: { date: Date; count: number }[] = [];

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // LeetCode calendar keys use UTC midnight timestamps.
      // Use UTC methods so the lookup works regardless of local timezone.
      const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
      const timestamp = Math.floor(utcMidnight / 1000).toString();

      cells.push({
        date: new Date(date),
        count: calendar[timestamp] || 0,
      });
    }

    return cells;
  }, [submissionCalendar]);

  const getColor = (count: number) => {
    if (count === 0) return '#27272a'; // zinc-800
    if (count <= 2)  return 'rgba(255,255,255,0.2)';
    if (count <= 5)  return 'rgba(255,255,255,0.4)';
    if (count <= 10) return 'rgba(255,255,255,0.7)';
    return '#ffffff';
  };

  const weeks: { date: Date; count: number }[][] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  const totalSubmissions = heatmapData.reduce((sum, d) => sum + d.count, 0);
  const activeDays = heatmapData.filter(d => d.count > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight">Submission Activity</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            <span className="text-white font-medium">{totalSubmissions}</span> submissions ·{' '}
            <span className="text-white font-medium">{activeDays}</span> active days
          </p>
        </div>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Last 365 Days</p>
      </div>

      <div className="heatmap-scroll -mx-2 px-2 pb-2">
        <div className="flex min-w-[640px] gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="h-3 w-3 rounded-sm transition-transform hover:scale-125 cursor-default"
                  style={{ background: getColor(day.count) }}
                  title={`${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${day.count} submission${day.count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Less</span>
        {[0, 2, 5, 10, 15].map((level) => (
          <div
            key={level}
            className="h-3 w-3 rounded-sm"
            style={{ background: getColor(level) }}
          />
        ))}
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">More</span>
      </div>
    </motion.div>
  );
};

export default SubmissionHeatmap;
