import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Code2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const Onboarding = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const handleValidate = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setValidated(false);

    try {
      const { data } = await api.post('/users/me/leetcode', { username: username.trim() });
      setValidated(true);
      setStats(data.user.stats);
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid LeetCode username');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (user?.onboarded) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden items-center justify-center px-4">
      {/* Subtle background dot pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded border border-zinc-800 bg-zinc-900"
          >
            <Code2 className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="mb-2 text-3xl font-bold text-white tracking-tight">Connect LeetCode</h1>
          <p className="text-zinc-400 font-light">
            Enter your LeetCode username to start tracking your progress
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">LeetCode Username</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  {/* <Code2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" /> */}
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setValidated(false);
                      setError('');
                    }}
                    className="input-field"
                    placeholder="Your LeetCode username"
                    disabled={loading || validated}
                  />
                </div>
                {!validated && (
                  <button
                    onClick={handleValidate}
                    disabled={loading || !username.trim()}
                    className="btn-primary flex items-center justify-center gap-2 px-6 sm:shrink-0 py-2.5"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Verify'
                    )}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {validated && stats && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 rounded border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Username verified successfully!
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded border border-zinc-800 bg-zinc-900 p-4 text-center">
                    <p className="text-2xl font-bold text-white tracking-tight">{stats.totalSolved}</p>
                    <p className="mt-1 text-xs text-zinc-500 font-medium uppercase tracking-wider">Total Solved</p>
                  </div>
                  <div className="rounded border border-zinc-800 bg-zinc-900 p-4 text-center">
                    <p className="text-2xl font-bold text-white tracking-tight">{stats.totalPoints}</p>
                    <p className="mt-1 text-xs text-zinc-500 font-medium uppercase tracking-wider">Total Points</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
                    <p className="text-lg font-bold text-emerald-400 tracking-tight">{stats.easySolved}</p>
                    <p className="mt-1 text-xs text-zinc-500 font-medium uppercase tracking-wider">Easy</p>
                  </div>
                  <div className="rounded border border-amber-500/20 bg-amber-500/10 p-3 text-center">
                    <p className="text-lg font-bold text-amber-400 tracking-tight">{stats.mediumSolved}</p>
                    <p className="mt-1 text-xs text-zinc-500 font-medium uppercase tracking-wider">Medium</p>
                  </div>
                  <div className="rounded border border-red-500/20 bg-red-500/10 p-3 text-center">
                    <p className="text-lg font-bold text-red-400 tracking-tight">{stats.hardSolved}</p>
                    <p className="mt-1 text-xs text-zinc-500 font-medium uppercase tracking-wider">Hard</p>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="btn-primary w-full py-2.5 mt-4"
                >
                  Continue to Dashboard
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
