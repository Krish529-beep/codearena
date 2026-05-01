import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import CreateGroupModal from '@/components/groups/CreateGroupModal';
import JoinGroupModal from '@/components/groups/JoinGroupModal';
import EmptyState from '@/components/common/EmptyState';
import { Plus, Link as LinkIcon, Users, Globe, Lock, Search, Loader2 } from 'lucide-react';
import type { Group } from '@/types';

const Groups = () => {
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [publicGroups, setPublicGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'my' | 'discover'>('my');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const [myRes, publicRes] = await Promise.all([
        api.get('/groups?type=my'),
        api.get(`/groups?type=public${search ? `&search=${search}` : ''}`),
      ]);
      setMyGroups(myRes.data.groups);
      setPublicGroups(publicRes.data.groups);
    } catch {
      console.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleJoinPublic = async (groupId: string) => {
    try {
      await api.post(`/groups/${groupId}/join`);
      loadGroups();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to join');
    }
  };

  const displayGroups = tab === 'my' ? myGroups : publicGroups;

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="page-shell space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl tracking-tight">Groups</h1>
            <p className="mt-1 text-sm text-zinc-400 sm:text-base font-light">
              Create, join, and compete with your peers
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setShowJoinModal(true)}
              className="btn-secondary flex items-center justify-center gap-2 text-sm bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
            >
              <LinkIcon className="h-4 w-4" />
              Join via Code
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Create Group
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-fit flex-wrap gap-2 rounded border border-zinc-800 bg-zinc-900 p-1">
            <button
              onClick={() => setTab('my')}
              className={`rounded px-4 py-2 text-sm font-medium transition-all ${
                tab === 'my' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              My Groups ({myGroups.length})
            </button>
            <button
              onClick={() => setTab('discover')}
              className={`rounded px-4 py-2 text-sm font-medium transition-all ${
                tab === 'discover' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Discover
            </button>
          </div>

          {tab === 'discover' && (
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
                placeholder="Search public groups..."
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        ) : displayGroups.length === 0 ? (
          <EmptyState
            icon={<Users className="h-10 w-10 text-zinc-600" />}
            title={tab === 'my' ? 'No groups yet' : 'No groups found'}
            description={
              tab === 'my'
                ? 'Create a group or join one to start competing.'
                : 'Try a different search term or create a new group.'
            }
            action={
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center gap-2 mt-4"
              >
                <Plus className="h-4 w-4" />
                Create Group
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {displayGroups.map((group, index) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/groups/${group._id}`}
                  className="group block card p-6 transition-all hover:border-zinc-700"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-zinc-800 text-lg font-bold text-white">
                        {group.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-white transition-colors group-hover:text-zinc-300">
                          {group.name}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-2">
                          {group.type === 'public' ? (
                            <Globe className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Lock className="h-3 w-3 text-amber-400" />
                          )}
                          <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">{group.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {group.description && (
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-400 font-light">{group.description}</p>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                      <Users className="h-3.5 w-3.5" />
                      {group.memberCount || group.members?.length || 0} members
                    </div>
                    {tab === 'discover' && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleJoinPublic(group._id);
                        }}
                        className="btn-primary px-3 py-1.5 text-xs"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={loadGroups}
      />
      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoined={loadGroups}
      />
    </div>
  );
};

export default Groups;
