import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PollForm({ onAddOption, hasVoted }) {
  const [inputValue, setInputValue] = useState('');
  const [shake, setShake] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputValue.trim()) {
      setShake((s) => s + 1);
      return;
    }
    onAddOption(inputValue);
    setInputValue('');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-[#1a1815] rounded-xl p-6 shadow-lg border border-[#3d3830]"
    >
      <h2 className="text-xs font-semibold text-[#c8b89a] mb-4 tracking-widest uppercase">
        Add a Poll Option
      </h2>
      {hasVoted && (
        <p className="text-[#6b6055] text-xs mb-3 tracking-wide">
          Options are locked after voting. Reset to make changes.
        </p>
      )}

      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3"
        key={shake}
        animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <motion.input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type an option..."
          maxLength={60}
          disabled={hasVoted}
          whileFocus={!hasVoted ? { scale: 1.01 } : {}}
          className="flex-1 bg-[#242220] border border-[#3d3830] text-[#f2ede4] placeholder-[#6b6055] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c8b89a] transition disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <motion.button
          type="submit"
          disabled={hasVoted}
          whileHover={!hasVoted ? { scale: 1.04 } : {}}
          whileTap={!hasVoted ? { scale: 0.95 } : {}}
          className="bg-[#c8b89a] text-[#0c0b0a] font-semibold px-6 py-2 rounded-lg tracking-wide text-sm transition-colors duration-150 hover:bg-[#d4c4a6] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add Option
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
