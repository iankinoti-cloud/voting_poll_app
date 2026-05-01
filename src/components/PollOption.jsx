import { motion } from 'framer-motion';

export default function PollOption({ option, totalVotes, hasVoted, onVote, onRemove }) {
  const percentage =
    totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="bg-[#1a1815] rounded-xl p-5 shadow-md border border-[#3d3830]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-[#f2ede4] text-base truncate">{option.text}</span>
          {!hasVoted && (
            <motion.button
              onClick={() => onRemove(option.id)}
              whileHover={{ scale: 1.2, color: '#f2ede4' }}
              whileTap={{ scale: 0.85 }}
              className="text-[#6b6055] hover:text-[#f2ede4] text-lg leading-none flex-shrink-0 transition-colors duration-150"
              aria-label="Remove option"
            >
              ×
            </motion.button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#8c8070] text-sm">
            {option.votes} vote{option.votes !== 1 ? 's' : ''}
          </span>
          <motion.button
            onClick={() => onVote(option.id)}
            disabled={hasVoted}
            whileHover={!hasVoted ? { scale: 1.07 } : {}}
            whileTap={!hasVoted ? { scale: 0.93 } : {}}
            className="bg-[#c8b89a] disabled:opacity-40 disabled:cursor-not-allowed text-[#0c0b0a] font-semibold px-4 py-1.5 rounded-lg text-sm tracking-wide transition-colors duration-150 hover:bg-[#d4c4a6]"
          >
            {hasVoted ? 'Voted' : 'Vote'}
          </motion.button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#242220] rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="bg-[#c8b89a] h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <p className="text-right text-[#6b6055] text-xs mt-1">{percentage}%</p>
    </motion.div>
  );
}
