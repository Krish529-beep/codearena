import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Lock, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateGroupModal = ({ isOpen, onClose, onCreated }: CreateGroupModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'public' | 'private'>('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      await api.post('/groups', { name: name.trim(), description: description.trim(), type });
      setName('');
      setDescription('');
      setType('public');
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create group');
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
            <h2 className="text-xl font-bold text-white tracking-tight">Create Group</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Group Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Enter group name"
                maxLength={60}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field resize-none"
                placeholder="What's this group about?"
                rows={3}
                maxLength={500}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Group Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('public')}
                  className={`flex items-center gap-2 p-3 rounded border transition-all ${
                    type === 'public'
                      ? 'border-zinc-500 bg-zinc-800 text-white'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium">Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('private')}
                  className={`flex items-center gap-2 p-3 rounded border transition-all ${
                    type === 'private'
                      ? 'border-zinc-500 bg-zinc-800 text-white'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium">Private</span>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="btn-primary w-full py-2.5 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                </span>
              ) : (
                'Create Group'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateGroupModal;
