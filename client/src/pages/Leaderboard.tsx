import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import EmptyState from '@/components/common/EmptyState';
import { Trophy, Loader2, Users } from 'lucide-react';
import type { Group, LeaderboardEntry } from '@/types';

const Leaderboard = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'points' | 'solved'>('points');
  const [loading, setLoading] = useState(true);
  const [lbLoading, setLbLoading] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadLeaderboard();
    }
  }, [selectedGroup, sortBy]);

  const loadGroups = async () => {
    try {
      const { data } = await api.get('/groups?type=my');
      setGroups(data.groups);
      if (data.groups.length > 0) {
        setSelectedGroup(data.groups[0]._id);
      }
    } catch {
      console.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    setLbLoading(true);
    try {
      const { data } = await api.get(`/leaderboards/group/${selectedGroup}?sortBy=${sortBy}`);
      setLeaderboard(data.leaderboard);
    } catch {
      console.error('Failed to load leaderboard');
    } finally {
      setLbLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-20 bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="page-shell space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white sm:text-4xl tracking-tight">
            <Trophy className="h-8 w-8 text-white" />
            Leaderboard
          </h1>
          <p className="text-sm text-zinc-400 sm:text-base font-light">
            See how you stack up against your group members
          </p>
        </motion.div>

        {groups.length === 0 ? (
          <EmptyState
            icon={<Users className="h-10 w-10 text-zinc-600" />}
            title="No groups joined"
            description="Join a group to see leaderboard rankings."
            action={
              <Link to="/groups" className="btn-primary mt-4">
                Browse Groups
              </Link>
            }
          />
        ) : (
          <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="input-field w-full lg:max-w-sm"
              >
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <div className="inline-flex w-fit flex-wrap gap-2 rounded border border-zinc-800 bg-zinc-900 p-1">
                <button
                  onClick={() => setSortBy('points')}
                  className={`rounded px-4 py-1.5 text-sm font-medium transition-all ${
                    sortBy === 'points' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  By Points
                </button>
                <button
                  onClick={() => setSortBy('solved')}
                  className={`rounded px-4 py-1.5 text-sm font-medium transition-all ${
                    sortBy === 'solved' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  By Solved
                </button>
              </div>
            </div>

            {lbLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              </div>
            ) : (
              <LeaderboardTable
                entries={leaderboard}
                currentUserId={user?.id}
                sortBy={sortBy}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
