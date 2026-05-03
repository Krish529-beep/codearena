import { motion } from 'framer-motion';
import { Crown, Medal } from 'lucide-react';
import type { LeaderboardEntry } from '@/types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  sortBy: 'points' | 'solved';
}

const LeaderboardTable = ({ entries, currentUserId, sortBy }: LeaderboardTableProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-sm text-zinc-500 w-5 text-center">{rank}</span>;
    }
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1: return 'rank-gold';
      case 2: return 'rank-silver';
      case 3: return 'rank-bronze';
      default: return 'card';
    }
  };

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => {
        const isCurrentUser = entry.userId === currentUserId;

        return (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 transition-all ${getRankClass(entry.rank)} ${
              isCurrentUser ? 'ring-2 ring-purple-400/50' : ''
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Left: rank + avatar + name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex w-8 shrink-0 items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                  {entry.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-white sm:text-base">
                      {entry.name}
                    </p>
                    {isCurrentUser && <span className="text-xs text-purple-300 font-medium">(You)</span>}
                  </div>
                  <p className="text-xs text-zinc-500">@{entry.leetcodeUsername || 'N/A'}</p>
                </div>
              </div>

              {/* Right: stats — stacks on mobile, inline on sm+ */}
              <div className="grid grid-cols-3 gap-3 sm:ml-auto sm:min-w-[260px]">
                <div className="text-left sm:text-right">
                  <p className={`text-sm font-bold ${sortBy === 'solved' ? 'text-cyan-400' : 'text-zinc-300'}`}>
                    +{entry.solvedInGroup}
                  </p>
                  <p className="text-xs text-zinc-500">Solved ({entry.totalSolved} total)</p>
                </div>
                <div className="text-left sm:text-right">
                  {entry.progress > 0 ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-emerald-400">{entry.progress}%</p>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${entry.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={`text-sm font-bold ${sortBy === 'points' ? 'text-purple-300' : 'text-zinc-300'}`}>
                        +{entry.pointsInGroup}
                      </p>
                      <p className="text-xs text-zinc-500">Points ({entry.totalPoints} total)</p>
                    </>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-bold text-orange-400">{entry.currentStreak}</p>
                  <p className="text-xs text-zinc-500">Streak</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LeaderboardTable;
