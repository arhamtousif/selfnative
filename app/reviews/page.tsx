'use client';
import { useEffect, useState } from 'react';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/reviews').then(r => r.json()).then((data) => setReviews([...data].reverse()));
  }, []);

  return (
    <main className="max-w-5xl mx-auto mt-12 px-6 pb-16">
      <h1 className="display text-3xl font-bold text-slate-800 mb-1">Student Reviews</h1>
      <p className="text-slate-500 text-sm mb-8">{reviews.length} review{reviews.length !== 1 ? 's' : ''} from SelfNative testers</p>

      {reviews.length === 0 ? (
        <div className="card p-8 text-center text-slate-400">
          No reviews yet. Be the first to leave one after a practice session.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="card p-6">
              <div className="text-amber-400 mb-3">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <p className="font-semibold text-slate-800 mb-3">"{r.comment}"</p>
              <p className="text-sm text-slate-500">{r.name}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}