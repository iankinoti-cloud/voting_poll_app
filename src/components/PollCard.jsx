import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { castVote, removeOptionFromPoll } from '../firebase/firestore';

/**
 * PollCard — shows a single poll with voting, results, and ownership actions.
 * Real-time data comes from Dashboard's Firestore subscription.
 */
export default function PollCard({ poll, currentUser, userRole, onDelete }) {
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');

  const hasVoted = Boolean(poll.voters?.[currentUser.uid]);
  const myVote = poll.voters?.[currentUser.uid];
  const totalVotes = poll.totalVotes || 0;
  const isOwner = poll.createdBy === currentUser.uid;
  const canDelete = isOwner || userRole === 'admin';
  const canRemoveOption = isOwner && !hasVoted && totalVotes === 0;

  async function handleVote(optionId) {
    if (hasVoted || voting) return;
    setVoting(true);
    setError('');
    try {
      await castVote(poll.id, optionId, currentUser.uid);
    } catch (err) {
      setError('Vote failed. Please try again.');
    } finally {
      setVoting(false);
    }
  }

  async function handleRemoveOption(optionId) {
    const updated = poll.options.filter((o) => o.id !== optionId);
    await removeOptionFromPoll(poll.id, updated);
  }

  return (
    <motion.div
      className="rounded-2xl p-5"
      style={{ background: '#1a1815', border: '1px solid #3d3830' }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      layout
      transition={{ duration: 0.3 }}
    >
      {/* Poll header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-bold text-base leading-snug" style={{ color: '#f2ede4' }}>
            {poll.title}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#6a5a4a' }}>
            by {poll.createdByName} · {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
          </p>
        </div>
        {canDelete && (
          <motion.button
            onClick={() => onDelete(poll.id)}
            className="text-xs px-2.5 py-1 rounded-lg flex-shrink-0"
            style={{ background: '#2a1a1a', color: '#f28b82', border: '1px solid #5a2a2a' }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            title="Delete poll"
          >
            Delete
          </motion.button>
        )}
      </div>

      {error && (
        <p className="text-xs mb-3" style={{ color: '#f28b82' }}>{error}</p>
      )}

      {/* Options */}
      <div className="space-y-2">
        <AnimatePresence>
          {poll.options.map((option) => {
            const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const isMyPick = myVote === option.id;

            return (
              <motion.div
                key={option.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="rounded-xl overflow-hidden relative"
                style={{ background: '#242220', border: `1px solid ${isMyPick ? '#c8b89a' : '#3d3830'}` }}
              >
                {/* Progress bar */}
                {hasVoted && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ background: isMyPick ? 'rgba(200,184,154,0.15)' : 'rgba(61,56,48,0.4)', transformOrigin: 'left' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: pct / 100 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                )}

                <div className="relative flex items-center gap-2 px-4 py-3">
                  {/* Vote button / voted indicator */}
                  {!hasVoted ? (
                    <motion.button
                      onClick={() => handleVote(option.id)}
                      disabled={voting}
                      className="w-5 h-5 rounded-full flex-shrink-0 border-2 transition-colors"
                      style={{ borderColor: '#c8b89a', background: 'transparent' }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Vote for ${option.text}`}
                    />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: isMyPick ? '#c8b89a' : '#3d3830' }}
                    >
                      {isMyPick && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#0c0b0a" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                  )}

                  <span className="flex-1 text-sm" style={{ color: '#f2ede4' }}>
                    {option.text}
                  </span>

                  {hasVoted && (
                    <span className="text-xs font-semibold" style={{ color: '#c8b89a' }}>
                      {pct}%
                    </span>
                  )}

                  {canRemoveOption && (
                    <motion.button
                      onClick={() => handleRemoveOption(option.id)}
                      className="text-xs ml-1 w-5 h-5 flex items-center justify-center rounded-full"
                      style={{ color: '#6a5a4a', background: '#3d3830' }}
                      whileHover={{ scale: 1.2, color: '#f28b82' }}
                      whileTap={{ scale: 0.9 }}
                      title="Remove option"
                    >
                      ×
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
