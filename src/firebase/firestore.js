import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
} from 'firebase/firestore';
import { db } from './config';

const POLLS = 'polls';

/**
 * Create a new poll.
 * options: [{ id, text }] — votes field added automatically
 */
export async function createPoll(title, options, user) {
  return addDoc(collection(db, POLLS), {
    title,
    options: options.map((o) => ({ ...o, votes: 0 })),
    createdBy: user.uid,
    createdByName: user.displayName || user.email,
    createdAt: serverTimestamp(),
    voters: {},      // { [uid]: optionId }
    totalVotes: 0,
  });
}

/**
 * Cast a vote. Enforces one vote per user per poll.
 * Returns true if vote was cast, false if already voted.
 */
export async function castVote(pollId, optionId, uid) {
  const ref = doc(db, POLLS, pollId);
  // Read-then-write inside a Firestore transaction to prevent race conditions.
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('Poll not found');
    const data = snap.data();
    if (data.voters?.[uid]) return false; // already voted

    const updatedOptions = data.options.map((o) =>
      o.id === optionId ? { ...o, votes: o.votes + 1 } : o
    );
    tx.update(ref, {
      options: updatedOptions,
      [`voters.${uid}`]: optionId,
      totalVotes: (data.totalVotes || 0) + 1,
    });
    return true;
  });
}

/**
 * Delete a poll (admin or owner only — enforce in UI/rules).
 */
export async function deletePoll(pollId) {
  return deleteDoc(doc(db, POLLS, pollId));
}

/**
 * Add an option to an existing poll (only if no votes yet).
 */
export async function addOptionToPoll(pollId, option) {
  return updateDoc(doc(db, POLLS, pollId), {
    options: arrayUnion({ ...option, votes: 0 }),
  });
}

/**
 * Remove an option from a poll (only if no votes yet).
 */
export async function removeOptionFromPoll(pollId, updatedOptions) {
  return updateDoc(doc(db, POLLS, pollId), { options: updatedOptions });
}

/**
 * Subscribe to all polls in real time, ordered newest first.
 * Returns an unsubscribe function.
 */
export function subscribeToPollsRealtime(callback) {
  const q = query(collection(db, POLLS), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const polls = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(polls);
  });
}
