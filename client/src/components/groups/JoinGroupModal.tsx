import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined: () => void;
}

const JoinGroupModal = ({ isOpen, onClose, onJoined }: JoinGroupModalProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post(`/groups/join/${inviteCode}`);
      onJoined();
      onClose();
      setInviteCode('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="card p-6 w-full max-w-md relative z-10"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-zinc-500 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Join Group</h2>
            <p className="mt-1 text-sm text-zinc-400 font-light">Enter an invite code to join a private group</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Invite Code</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="input-field pl-10 uppercase"
                  placeholder="e.g. CODE-1234"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !inviteCode}
              className="btn-primary w-full py-2.5 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Joining...
                </span>
              ) : (
                'Join Group'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JoinGroupModal;
