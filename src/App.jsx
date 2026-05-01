import { useState, useEffect } from 'react';
import PollForm from './components/PollForm';
import PollList from './components/PollList';
import './index.css';

const DEFAULT_OPTIONS = [
  { id: 1, text: 'Pizza', votes: 0 },
  { id: 2, text: 'Burgers', votes: 0 },
  { id: 3, text: 'Tacos', votes: 0 },
];

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [options, setOptions] = useState(() =>
    loadFromStorage('poll_options', DEFAULT_OPTIONS)
  );
  const [hasVoted, setHasVoted] = useState(() =>
    loadFromStorage('poll_hasVoted', false)
  );

  useEffect(() => {
    localStorage.setItem('poll_options', JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    localStorage.setItem('poll_hasVoted', JSON.stringify(hasVoted));
  }, [hasVoted]);

  function handleAddOption(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setOptions((prev) => [...prev, { id: Date.now(), text: trimmed, votes: 0 }]);
  }

  function handleVote(id) {
    if (hasVoted) return;
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt))
    );
    setHasVoted(true);
  }

  function handleRemoveOption(id) {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  }

  function handleReset() {
    setOptions((prev) => prev.map((opt) => ({ ...opt, votes: 0 })));
    setHasVoted(false);
  }

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-[#f2ede4]">
      {/* Header */}
      <header className="bg-[#1a1815] border-b border-[#3d3830] shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-widest uppercase text-[#f2ede4]">
              VotePoll
            </h1>
            <p className="text-[#c8b89a] text-sm mt-1 tracking-wide">
              Cast your vote | every voice counts
            </p>
          </div>
          <button
            onClick={handleReset}
            className="border border-[#c8b89a] text-[#c8b89a] hover:bg-[#c8b89a] hover:text-[#0c0b0a] font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-sm tracking-wide"
          >
            Reset Votes
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <PollForm onAddOption={handleAddOption} />
        <PollList
          options={options}
          totalVotes={totalVotes}
          hasVoted={hasVoted}
          onVote={handleVote}
          onRemove={handleRemoveOption}
        />
        {totalVotes > 0 && (
          <p className="text-center text-[#6b6055] text-sm">
            Total votes cast:{' '}
            <span className="text-[#c8b89a] font-semibold">{totalVotes}</span>
          </p>
        )}
      </main>
    </div>
  );
}
