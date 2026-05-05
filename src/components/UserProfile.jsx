import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = (currentUser.displayName || currentUser.email || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  async function handleLogout() {
    setOpen(false);
    await logout();
  }

  return (
    <div className="relative" ref={ref}>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
        style={{ background: '#c8b89a', color: '#0c0b0a' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        title={currentUser.displayName || currentUser.email}
      >
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          initials
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl z-50 py-2"
            style={{ background: '#1a1815', border: '1px solid #3d3830' }}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: '#3d3830' }}>
              <p className="text-sm font-semibold truncate" style={{ color: '#f2ede4' }}>
                {currentUser.displayName || 'User'}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: '#6a5a4a' }}>
                {currentUser.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors"
              style={{ color: '#f28b82' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
