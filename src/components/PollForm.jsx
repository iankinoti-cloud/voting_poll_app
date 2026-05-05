import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createPoll } from '../firebase/firestore';

const generateId = () => Math.random().toString(36).slice(2, 10);

export default function PollForm({ onCreated }) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [optionInput, setOptionInput] = useState('');
  const [options, setOptions] = useState([]);
  const [shake, setShake] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleAddOption(e) {
    e.preventDefault();
    if (!optionInput.trim()) {
      setShake((s) => s + 1);
      return;
    }
    setOptions((prev) => [...prev, { id: generateId(), text: optionInput.trim() }]);
    setOptionInput('');
  }

  function handleRemoveOption(id) {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return setError('Please enter a poll title.');
    if (options.length < 2) return setError('Add at least 2 options.');
    setError('');
    setLoading(true);
    try {
      await createPoll(title.trim(), options, currentUser);
      onCreated?.();
    } catch (err) {
      setError('Failed to create poll. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: '#1a1815', border: '1px solid #3d3830' }}
    >
      <h2 className="text-xs font-semibold mb-5 tracking-widest uppercase" style={{ color: '#c8b89a' }}>
        Create New Poll
      </h2>

      {error && (
        <p className="text-xs mb-3" style={{ color: '#f28b82' }}>{error}</p>
      )}

      {/* Poll title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Poll question or title"
        maxLength={120}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4"
        style={{ background: '#242220', color: '#f2ede4', border: '1px solid #3d3830' }}
      />

      {/* Option input */}
      <motion.form
        onSubmit={handleAddOption}
        className="flex gap-2 mb-3"
        key={shake}
        animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.35 }}
      >
        <input
          type="text"
          value={optionInput}
          onChange={(e) => setOptionInput(e.target.value)}
          placeholder="Add an option…"
          maxLength={80}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: '#242220', color: '#f2ede4', border: '1px solid #3d3830' }}
        />
        <motion.button
          type="submit"
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: '#3d3830', color: '#c8b89a' }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Add
        </motion.button>
      </motion.form>

      {/* Options list */}
      <AnimatePresence>
        {options.map((opt, i) => (
          <motion.div
            key={opt.id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2"
            style={{ background: '#242220', border: '1px solid #3d3830' }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <span className="text-xs w-5 text-center font-bold" style={{ color: '#6a5a4a' }}>{i + 1}</span>
            <span className="flex-1 text-sm" style={{ color: '#f2ede4' }}>{opt.text}</span>
            <motion.button
              onClick={() => handleRemoveOption(opt.id)}
              className="w-5 h-5 flex items-center justify-center rounded-full text-xs"
              style={{ background: '#3d3830', color: '#8a7a6a' }}
              whileHover={{ scale: 1.2, color: '#f28b82' }}
            >
              ×
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {options.length < 2 && (
        <p className="text-xs mt-1 mb-3" style={{ color: '#6a5a4a' }}>
          Add at least 2 options to create the poll.
        </p>
      )}

      {/* Create button */}
      <motion.button
        onClick={handleCreate}
        disabled={loading || options.length < 2 || !title.trim()}
        className="w-full mt-3 py-3 rounded-xl font-semibold text-sm tracking-wide"
        style={{
          background: '#c8b89a',
          color: '#0c0b0a',
          opacity: loading || options.length < 2 || !title.trim() ? 0.45 : 1,
        }}
        whileHover={{ scale: (loading || options.length < 2 || !title.trim()) ? 1 : 1.02 }}
        whileTap={{ scale: (loading || options.length < 2 || !title.trim()) ? 1 : 0.98 }}
      >
        {loading ? 'Creating…' : 'Create Poll'}
      </motion.button>
    </motion.div>
  );
}
