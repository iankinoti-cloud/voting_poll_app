import { AnimatePresence } from 'framer-motion';
import PollOption from './PollOption';

export default function PollList({ options, totalVotes, hasVoted, onVote, onRemove }) {
  if (options.length === 0) {
    return (
      <p className="text-center text-[#6b6055] py-8">
        No options yet. Add one above!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold text-[#c8b89a] uppercase tracking-widest">
        Poll Options
      </h2>
      <AnimatePresence>
        {options.map((option) => (
          <PollOption
            key={option.id}
            option={option}
            totalVotes={totalVotes}
            hasVoted={hasVoted}
            onVote={onVote}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
