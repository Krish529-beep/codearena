import { motion } from 'framer-motion';
import { Trophy, Crown, Medal } from 'lucide-react';
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
      default: return <span className="text-sm text-gray-500 w-5 text-center">{rank}</span>;
    }
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1: return 'rank-gold';
      case 2: return 'rank-silver';
      case 3: return 'rank-bronze';
      default: return 'glass';
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
            className={`rounded-xl p-4 transition-all ${getRankClass(entry.rank)} ${
              isCurrentUser ? 'ring-2 ring-brand-400/50' : ''
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex w-8 items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-cyan text-sm font-bold text-white">
                  {entry.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-white sm:text-base">
                      {entry.name}
                    </p>
                    {isCurrentUser && <span className="text-sm text-brand-300">(You)</span>}
                  </div>
                  <p className="text-xs text-gray-500">@{entry.leetcodeUsername || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:ml-auto sm:min-w-[280px]">
                <div className="text-left sm:text-right">
                  <p className={`text-sm font-bold ${sortBy === 'solved' ? 'text-accent-cyan' : 'text-gray-300'}`}>
                    {entry.solvedInGroup > 0 ? `+${entry.solvedInGroup}` : entry.totalSolved}
                  </p>
                  <p className="text-xs text-gray-500">{entry.solvedInGroup > 0 ? 'In Group' : 'Solved'}</p>
                </div>
                <div className="text-left sm:text-right min-w-[80px]">
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
                      <p className={`text-sm font-bold ${sortBy === 'points' ? 'text-brand-300' : 'text-gray-300'}`}>
                        {entry.totalPoints}
                      </p>
                      <p className="text-xs text-gray-500">Points</p>
                    </>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-bold text-orange-400">{entry.currentStreak}</p>
                  <p className="text-xs text-gray-500">Streak</p>
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
