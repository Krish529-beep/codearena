import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import StatsCard from '@/components/dashboard/StatsCard';
import DifficultyBreakdown from '@/components/dashboard/DifficultyBreakdown';
import StreakDisplay from '@/components/dashboard/StreakDisplay';
import SubmissionHeatmap from '@/components/dashboard/SubmissionHeatmap';
import SkillAnalysis from '@/components/dashboard/SkillAnalysis';
import {
  Target, Zap, Hash, Trophy, RefreshCw, Loader2, Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Group } from '@/types';

const AUTO_SYNC_MS = 5 * 60 * 1000; // 5 minutes

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [fullUser, setFullUser] = useState<any>(null);
  // Countdown: seconds remaining until next auto-sync
  const [countdown, setCountdown] = useState(AUTO_SYNC_MS / 1000);

  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, groupsData] = await Promise.all([
        api.get('/users/me'),
        api.get('/groups?type=my'),
      ]);
      setFullUser(userData.data.user);
      setGroups(groupsData.data.groups);
    } catch {
      console.error('Failed to load dashboard data');
    }
  };

  const performSync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const { data } = await api.post('/users/me/sync');
      setFullUser(data.user);
      await refreshUser();
    } catch (err: any) {
      console.error('Sync failed:', err.response?.data?.message);
    } finally {
      setSyncing(false);
    }
  }, [syncing, refreshUser]);

  /** Reset both auto-sync timer and countdown display */
  const resetAutoSync = useCallback(() => {
    // Clear existing timers
    if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setCountdown(AUTO_SYNC_MS / 1000);

    // Countdown ticker — fires every second
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return AUTO_SYNC_MS / 1000; // will be reset by sync firing
        return prev - 1;
      });
    }, 1000);

    // Auto-sync ticker — fires every 5 min
    syncIntervalRef.current = setInterval(async () => {
      setCountdown(AUTO_SYNC_MS / 1000); // reset visual before sync
      await performSync();
    }, AUTO_SYNC_MS);
  }, [performSync]);

  // Start auto-sync on mount, clean up on unmount
  useEffect(() => {
    resetAutoSync();
    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [resetAutoSync]);

  const handleManualSync = async () => {
    await performSync();
    resetAutoSync(); // Reset the 5-min timer after a manual sync
  };

  const stats = fullUser?.stats || user?.stats || {
    totalSolved: 0,
    allTotal: 0,
    easySolved: 0,
    easyTotal: 0,
    mediumSolved: 0,
    mediumTotal: 0,
    hardSolved: 0,
    hardTotal: 0,
    totalPoints: 0,
  };

  const streak = fullUser?.streak || user?.streak || { current: 0, longest: 0 };
  const calendar = fullUser?.submissionCalendar || user?.submissionCalendar || '{}';

  // Format countdown as MM:SS
  const mins = Math.floor(countdown / 60).toString().padStart(2, '0');
  const secs = (countdown % 60).toString().padStart(2, '0');
  const progress = ((AUTO_SYNC_MS / 1000 - countdown) / (AUTO_SYNC_MS / 1000)) * 100;

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="page-shell space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-white sm:text-4xl tracking-tight">
              Welcome back, <span className="text-zinc-300">{user?.name}</span>
            </h1>
            <p className="mt-2 break-words text-sm text-zinc-400 sm:text-base font-light">
              {fullUser?.leetcodeUsername
                ? `@${fullUser.leetcodeUsername} · Last synced: ${fullUser.lastSyncedAt ? new Date(fullUser.lastSyncedAt).toLocaleString() : 'Never'}`
                : 'Connect your LeetCode account to track progress'}
            </p>
          </div>

          {/* Sync button with auto-sync countdown ring */}
          <button
            onClick={handleManualSync}
            disabled={syncing}
            title={syncing ? 'Syncing…' : `Auto-syncs in ${mins}:${secs}`}
            className="btn-secondary flex w-full items-center justify-center gap-2.5 sm:w-auto bg-zinc-900 border-zinc-800 hover:bg-zinc-800 relative"
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              /* Countdown ring wrapping the icon */
              <span className="relative flex h-5 w-5 items-center justify-center">
                <svg
                  className="absolute inset-0 -rotate-90"
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                >
                  {/* track */}
                  <circle cx="10" cy="10" r="8" fill="none" stroke="#3f3f46" strokeWidth="2" />
                  {/* progress */}
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 8}`}
                    strokeDashoffset={`${2 * Math.PI * 8 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <RefreshCw className="h-3 w-3 text-white relative z-10" />
              </span>
            )}
            <span>{syncing ? 'Syncing…' : `Sync Now · ${mins}:${secs}`}</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Solved"
            value={stats.totalSolved}
            icon={<Target className="h-5 w-5" />}
            color="#10b981"
          />
          <StatsCard
            title="Total Points"
            value={stats.totalPoints}
            icon={<Zap className="h-5 w-5" />}
            color="#ffffff"
            subtitle={`E:${stats.easySolved * 5} M:${stats.mediumSolved * 10} H:${stats.hardSolved * 15}`}
          />
          <StatsCard
            title="Current Streak"
            value={streak.current}
            icon={<Hash className="h-5 w-5" />}
            color="#f59e0b"
            subtitle={`Longest: ${streak.longest} days`}
          />
          <StatsCard
            title="Groups"
            value={groups.length}
            icon={<Trophy className="h-5 w-5" />}
            color="#a1a1aa"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SkillAnalysis stats={stats} />
          </div>
          <div className="xl:col-span-1">
            <StreakDisplay current={streak.current} longest={streak.longest} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <DifficultyBreakdown
              easy={stats.easySolved}
              medium={stats.mediumSolved}
              hard={stats.hardSolved}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 xl:col-span-2"
          >
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-white tracking-tight">My Groups</h3>
              <Link to="/groups" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white hover:underline">
                View All
              </Link>
            </div>
            {groups.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-10 text-center">
                <Users className="mb-3 h-12 w-12 text-zinc-600" />
                <p className="text-sm text-zinc-400 font-medium">No groups yet</p>
                <Link to="/groups" className="mt-2 text-sm text-white hover:underline">
                  Create or join a group
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {groups.slice(0, 5).map((group) => (
                  <Link
                    key={group._id}
                    to={`/groups/${group._id}`}
                    className="group flex flex-col gap-3 rounded bg-zinc-900 border border-zinc-800 p-4 transition-all hover:bg-zinc-800 hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-zinc-800 text-sm font-bold text-white">
                        {group.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white transition-colors">
                          {group.name}
                        </p>
                        <p className="text-xs text-zinc-500 font-medium mt-0.5">
                          {group.memberCount || group.members?.length || 0} members · {group.type}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Open</span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <SubmissionHeatmap submissionCalendar={calendar} />
      </div>
    </div>
  );
};

export default Dashboard;
