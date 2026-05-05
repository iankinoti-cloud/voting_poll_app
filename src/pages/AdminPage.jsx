import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { deletePoll, subscribeToPollsRealtime } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminPage() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [tab, setTab] = useState(0); // 0=polls, 1=users

  // If role check passes via ProtectedRoute but just in case
  useEffect(() => {
    if (userRole && userRole !== 'admin') navigate('/dashboard');
  }, [userRole, navigate]);

  // Polls real-time
  useEffect(() => {
    const unsub = subscribeToPollsRealtime(setPolls);
    return unsub;
  }, []);

  // Users one-time fetch (no PII is stored beyond what Firebase Auth already exposes)
  useEffect(() => {
    async function fetchUsers() {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingUsers(false);
    }
    fetchUsers();
  }, []);

  async function toggleRole(user) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await updateDoc(doc(db, 'users', user.id), { role: newRole });
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0c0b0a' }}>
      <header
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(12,11,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #3d3830' }}
      >
        <h1 className="font-bold text-lg" style={{ color: '#c8b89a' }}>Admin Panel</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm px-3 py-1.5 rounded-lg"
          style={{ background: '#242220', color: '#f2ede4' }}
        >
          ← Dashboard
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: '#1a1815' }}>
          {['All Polls', 'All Users'].map((label, i) => (
            <motion.button
              key={label}
              onClick={() => setTab(i)}
              className="flex-1 py-2 text-sm font-semibold rounded-lg"
              style={{ background: tab === i ? '#c8b89a' : 'transparent', color: tab === i ? '#0c0b0a' : '#8a7a6a' }}
              whileTap={{ scale: 0.97 }}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {tab === 0 && (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {polls.map((poll) => (
                <motion.div
                  key={poll.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl"
                  style={{ background: '#1a1815', border: '1px solid #3d3830' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#f2ede4' }}>{poll.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6a5a4a' }}>
                      by {poll.createdByName} · {poll.totalVotes || 0} votes · {poll.options?.length || 0} options
                    </p>
                  </div>
                  <motion.button
                    onClick={() => deletePoll(poll.id)}
                    className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0"
                    style={{ background: '#2a1a1a', color: '#f28b82', border: '1px solid #5a2a2a' }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    Delete
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
            {polls.length === 0 && (
              <p className="text-center py-12 text-sm" style={{ color: '#6a5a4a' }}>No polls found.</p>
            )}
          </div>
        )}

        {tab === 1 && (
          loadingUsers ? (
            <div className="flex justify-center py-16"><LoadingSpinner size={40} /></div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl"
                  style={{ background: '#1a1815', border: '1px solid #3d3830' }}
                  layout
                >
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#f2ede4' }}>{user.displayName || 'Unnamed'}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6a5a4a' }}>{user.email}</p>
                  </div>
                  <motion.button
                    onClick={() => toggleRole(user)}
                    className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0 font-semibold"
                    style={{
                      background: user.role === 'admin' ? 'rgba(200,184,154,0.15)' : '#242220',
                      color: user.role === 'admin' ? '#c8b89a' : '#8a7a6a',
                      border: `1px solid ${user.role === 'admin' ? '#c8b89a' : '#3d3830'}`,
                    }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    {user.role === 'admin' ? 'Admin' : 'User'} · Toggle
                  </motion.button>
                </motion.div>
              ))}
              {users.length === 0 && (
                <p className="text-center py-12 text-sm" style={{ color: '#6a5a4a' }}>No users found.</p>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
}
