import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import {
  Users, Globe, Lock, Copy, Check, LogOut, Trash2, Loader2, ArrowLeft, Trophy,
} from 'lucide-react';
import type { Group, LeaderboardEntry } from '@/types';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [group, setGroup] = useState<Group | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'points' | 'solved'>('points');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadGroupData();
  }, [id, sortBy]);

  useEffect(() => {
    if (!socket || !id) return;

    socket.emit('join:group', id);

    socket.on('leaderboard:update', () => {
      loadLeaderboard();
    });

    socket.on('group:updated', () => {
      loadGroupData();
    });

    socket.on('user:synced', () => {
      loadLeaderboard();
    });

    return () => {
      socket.emit('leave:group', id);
      socket.off('leaderboard:update');
      socket.off('group:updated');
      socket.off('user:synced');
    };
  }, [socket, id]);

  const loadGroupData = async () => {
    try {
      const [groupRes, lbRes] = await Promise.all([
        api.get(`/groups/${id}`),
        api.get(`/leaderboards/group/${id}?sortBy=${sortBy}`),
      ]);
      setGroup(groupRes.data.group);
      setLeaderboard(lbRes.data.leaderboard);
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 404) {
        navigate('/groups');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const { data } = await api.get(`/leaderboards/group/${id}?sortBy=${sortBy}`);
      setLeaderboard(data.leaderboard);
    } catch {}
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    try {
      await api.post(`/groups/${id}/leave`);
      navigate('/groups');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to leave');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this group? This cannot be undone.')) return;
    try {
      await api.delete(`/groups/${id}`);
      navigate('/groups');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const copyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20 bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!group) return null;

  const isAdmin = group.admin._id === user?.id;
  const isMember = group.members.some((m) => m.user._id === user?.id);

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="page-shell-narrow space-y-8">
        <button
          onClick={() => navigate('/groups')}
          className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Groups
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-zinc-800 text-2xl font-bold text-white">
                {group.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h1 className="break-words text-2xl font-bold text-white sm:text-3xl tracking-tight">{group.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                  {group.type === 'public' ? (
                    <span className="flex items-center gap-1 text-xs uppercase tracking-wider font-medium text-emerald-400">
                      <Globe className="h-3 w-3" /> Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs uppercase tracking-wider font-medium text-amber-400">
                      <Lock className="h-3 w-3" /> Private
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                    <Users className="h-3 w-3" /> {group.members.length} members
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">Admin: {group.admin.name}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {group.type === 'private' && group.inviteCode && isMember && (
                <button
                  onClick={copyInviteCode}
                  className="btn-secondary flex items-center gap-2 text-sm bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : group.inviteCode}
                </button>
              )}

              {isMember && !isAdmin && (
                <button
                  onClick={handleLeave}
                  className="rounded p-2 text-zinc-500 transition-all hover:bg-red-400/10 hover:text-red-400"
                  title="Leave Group"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="rounded p-2 text-zinc-500 transition-all hover:bg-red-400/10 hover:text-red-400"
                  title="Delete Group"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {group.description && (
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 font-light">{group.description}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-white" />
              <h2 className="text-xl font-bold text-white tracking-tight">Arena Leaderboard</h2>
            </div>

            <div className="flex flex-wrap gap-2 rounded border border-zinc-800 bg-zinc-900 p-1">
              <button
                onClick={() => setSortBy('points')}
                className={`rounded px-4 py-1.5 text-sm font-medium transition-all ${
                  sortBy === 'points' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Points
              </button>
              <button
                onClick={() => setSortBy('solved')}
                className={`rounded px-4 py-1.5 text-sm font-medium transition-all ${
                  sortBy === 'solved' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Solved
              </button>
            </div>
          </div>

          {leaderboard.length === 0 ? (
            <div className="card p-12 text-center">
              <Trophy className="mx-auto mb-3 h-12 w-12 text-zinc-600" />
              <p className="text-zinc-400 font-medium">No data yet. Members need to sync their LeetCode data.</p>
            </div>
          ) : (
            <LeaderboardTable
              entries={leaderboard}
              currentUserId={user?.id}
              sortBy={sortBy}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GroupDetail;
