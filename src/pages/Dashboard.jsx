import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { subscribeToPollsRealtime, deletePoll } from '../firebase/firestore';
import PollCard from '../components/PollCard';
import PollForm from '../components/PollForm';
import UserProfile from '../components/UserProfile';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedTitle from '../components/AnimatedTitle';

const TABS = ['All Polls', 'My Polls'];

export default function Dashboard() {
  const { currentUser, userRole } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [wiggleTrigger, setWiggleTrigger] = useState(0);

  useEffect(() => {
    const unsub = subscribeToPollsRealtime((data) => {
      setPolls(data);
      setLoadingPolls(false);
    });
    return unsub;
  }, []);

  const displayedPolls = activeTab === 0
    ? polls
    : polls.filter((p) => p.createdBy === currentUser.uid);

  async function handleDelete(pollId) {
    await deletePoll(pollId);
  }

  return (
    <div className="min-h-screen" style={{ background: '#0c0b0a' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between gap-4"
        style={{
          background: 'rgba(12,11,10,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #3d3830',
        }}
      >
        <AnimatedTitle wiggleTrigger={wiggleTrigger} />
        <div className="flex items-center gap-3">
          {userRole === 'admin' && (
            <a
              href="/voting_poll_app/admin"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg"
              style={{ background: '#3d3830', color: '#c8b89a' }}
            >
              Admin
            </a>
          )}
          <motion.button
            onClick={() => { setShowForm((v) => !v); setWiggleTrigger((n) => n + 1); }}
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: '#c8b89a', color: '#0c0b0a' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {showForm ? '✕ Cancel' : '+ New Poll'}
          </motion.button>
          <UserProfile />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* New Poll Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <PollForm onCreated={() => setShowForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: '#1a1815' }}>
          {TABS.map((tab, i) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="flex-1 py-2 text-sm font-semibold rounded-lg transition-colors"
              style={{
                background: activeTab === i ? '#c8b89a' : 'transparent',
                color: activeTab === i ? '#0c0b0a' : '#8a7a6a',
              }}
              whileTap={{ scale: 0.97 }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Poll list */}
        {loadingPolls ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size={48} />
          </div>
        ) : displayedPolls.length === 0 ? (
          <motion.p
            className="text-center py-16 text-sm"
            style={{ color: '#6a5a4a' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {activeTab === 0
              ? 'No polls yet. Create the first one!'
              : "You haven't created any polls yet."}
          </motion.p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {displayedPolls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  currentUser={currentUser}
                  userRole={userRole}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
