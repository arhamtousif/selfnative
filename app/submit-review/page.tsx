'use client';
import { useState } from 'react';

export default function SubmitReview() {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [institute, setInstitute] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!name.trim() || !comment.trim() || !rating) {
      setError('Please fill in your name, a rating, and your opinion.');
      return;
    }
    setError('');
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, profession, institute, rating, comment }),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="max-w-md mx-auto mt-24 px-6 text-center">
        <div className="card p-8">
          <p className="text-2xl mb-3">🎉</p>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Thank you!</h1>
          <p className="text-slate-500 text-sm">Your review has been submitted and will appear on our reviews page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto mt-16 px-6">
      <div className="card p-8">
        <h1 className="text-xl font-bold text-slate-800 mb-1">Share Your Review</h1>
        <p className="text-sm text-slate-500 mb-6">
          Watched the SelfNative demo? Let us know what you think — as a teacher, instructor, or anyone reviewing the app.
        </p>

        <label className="text-xs font-medium text-slate-500 mb-1 block">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ayesha Rahman"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 mb-4"
        />

        <label className="text-xs font-medium text-slate-500 mb-1 block">Profession</label>
        <input
          type="text"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          placeholder="e.g. IELTS Instructor"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 mb-4"
        />

        <label className="text-xs font-medium text-slate-500 mb-1 block">Institute / Workplace</label>
        <input
          type="text"
          value={institute}
          onChange={(e) => setInstitute(e.target.value)}
          placeholder="e.g. British Council Dhaka"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 mb-4"
        />

        <label className="text-xs font-medium text-slate-500 mb-1 block">Rating</label>
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className="text-2xl"
              style={{ color: n <= rating ? '#f59e0b' : '#e2e8f0' }}
            >
              ★
            </button>
          ))}
        </div>

        <label className="text-xs font-medium text-slate-500 mb-1 block">Your Opinion</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of SelfNative?"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 mb-3 resize-none"
          rows={4}
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button onClick={submit} className="w-full gradient-btn rounded-xl py-3">
          Submit Review
        </button>
      </div>
    </main>
  );
}