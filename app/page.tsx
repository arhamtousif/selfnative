'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ sessionCount: 0, reviewCount: 0, avgRating: 0 });

  useEffect(() => {
    fetch('/api/reviews').then(r => r.json()).then((data) => setReviews([...data].reverse().slice(0, 3)));
    fetch('/api/stats').then(r => r.json()).then(setStats);
  }, []);

  return (
    <main>
      <section className="max-w-3xl mx-auto px-6 pt-12 text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Trusted by learners worldwide</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-2xl md:text-3xl font-bold gradient-text">{stats.sessionCount}</p>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Practice Sessions</p>
          </div>
          <div className="card p-5">
            <p className="text-2xl md:text-3xl font-bold gradient-text">{stats.reviewCount}</p>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Reviews Given</p>
          </div>
          <div className="card p-5">
            <p className="text-2xl md:text-3xl font-bold gradient-text">{stats.avgRating || '—'}</p>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Average Rating</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-10 md:pt-16 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="display text-3xl md:text-5xl font-bold leading-tight text-slate-800 mb-5">
            Master IELTS Speaking with <span className="gradient-text">AI-Powered Practice</span>
          </h1>
          <p className="text-slate-500 text-lg mb-8 max-w-md">
            Practice real IELTS Cue Cards, receive instant AI feedback, improve fluency, and achieve your target IELTS band score faster.
          </p>
          <a href="/practice" className="gradient-btn inline-block px-6 py-3 rounded-full">
            Start Practicing →
          </a>
        </div>

        <div className="card p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">IELTS CUE CARD</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">● Live Session</span>
          </div>
          <h3 className="font-bold text-slate-800 mb-3">Describe a memorable journey you have taken.</h3>
          <ul className="text-sm text-slate-500 space-y-1 mb-4">
            <li>Where you went</li>
            <li>Who you were with</li>
            <li>What you did there</li>
            <li>And explain why it was memorable</li>
          </ul>
          <div className="rec-waveform mb-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${(i % 6) * 0.12}s` }} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-slate-400 text-xs mb-1">Fluency</p>
              <div className="progress-track"><div className="progress-fill" style={{ width: '82%' }} /></div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-slate-400 text-xs mb-1">Vocabulary</p>
              <div className="progress-track"><div className="progress-fill" style={{ width: '80%' }} /></div>
            </div>
          </div>
          <div className="gradient-btn rounded-xl p-4 mt-4 text-center">
            <p className="text-xs opacity-80">Predicted IELTS Band</p>
            <p className="text-3xl font-bold">8.0</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="display text-3xl font-bold text-slate-800 mb-3">
          From a blank page to your target band score in 4 steps
        </h2>
        <p className="text-slate-500 mb-12">A guided workflow designed by IELTS educators and refined by AI.</p>

        <div className="grid md:grid-cols-4 gap-5 text-left">
          {[
            ['01', 'Enter Your Name', 'Personalize your session in seconds — no signup required to try.'],
            ['02', 'Receive IELTS Cue Card', 'A random authentic cue card appears, exactly like the real exam.'],
            ['03', 'Speak Your Answer', 'Record with real-time transcription, waveform and speaking timer.'],
            ['04', 'Get AI Feedback', 'Instant fluency, grammar, vocabulary and band score.'],
          ].map(([num, title, desc]) => (
            <div key={num} className="card p-5">
              <div className="w-9 h-9 rounded-full gradient-btn flex items-center justify-center text-sm font-bold mb-4">{num}</div>
              <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>

        <a href="/practice" className="gradient-btn inline-block px-6 py-3 rounded-full mt-10">
          Ready Practicing? →
        </a>
      </section>

      {reviews.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="display text-3xl font-bold mb-10">
            What our <span className="gradient-text">testers</span> say
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <div key={i} className="card p-6 text-left">
                <div className="text-amber-400 mb-3">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p className="font-semibold text-slate-800 mb-3">"{r.comment}"</p>
                <p className="text-sm text-slate-700 font-medium">{r.name}</p>
                {(r.profession || r.institute) && (
                  <p className="text-xs text-slate-400">
                    {r.profession}{r.profession && r.institute ? ' — ' : ''}{r.institute}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="partners" className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="display text-3xl font-bold mb-10">
          Our trusted <span className="gradient-text">Partners</span>
        </h2>
        <div className="card p-12 text-slate-400">
          Partner logos coming soon.
        </div>
      </section>

      <section id="spotlight" className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="display text-3xl font-bold mb-10">
          SelfNative Spotlighted by:
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card overflow-hidden">
              <div className="bg-slate-800 aspect-video flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">▶</div>
              </div>
              <div className="p-4 text-left">
                <div className="h-2 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-2 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}