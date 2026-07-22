'use client';
import { useState, useRef, useEffect } from 'react';

const CUE_CARDS = [
  { topic: "Describe a memorable journey you have taken.", points: ["Where you went", "Who you were with", "What you did there", "And explain why it was memorable"] },
  { topic: "Describe a person who has influenced you a lot.", points: ["Who this person is", "How you know them", "What they are like", "And explain why they influenced you"] },
  { topic: "Describe a skill you would like to learn.", points: ["What the skill is", "Why you want to learn it", "How you would learn it", "And explain how it would help you"] },
  { topic: "Describe a book that had a strong impact on you.", points: ["What the book was about", "When you read it", "Why you chose to read it", "And explain what impact it had on you"] },
  { topic: "Describe a place you would like to visit in the future.", points: ["Where this place is", "How you learned about it", "What you would do there", "And explain why you want to visit it"] },
  { topic: "Describe a time you helped someone.", points: ["Who you helped", "What the situation was", "What you did", "And explain how you felt about it"] },
  { topic: "Describe a piece of technology you find useful.", points: ["What it is", "How often you use it", "What you use it for", "And explain why you find it useful"] },
  { topic: "Describe a memorable meal you had.", points: ["What you ate", "Where you had it", "Who you were with", "And explain why it was memorable"] },
  { topic: "Describe a goal you are working towards.", points: ["What the goal is", "Why you set this goal", "What steps you are taking", "And explain how you will feel once you achieve it"] },
  { topic: "Describe a teacher who has influenced you.", points: ["Who this teacher was", "What subject they taught", "What they were like", "And explain how they influenced you"] },
  { topic: "Describe a piece of good news you received.", points: ["What the news was", "How you found out", "How you reacted", "And explain why it was good news"] },
  { topic: "Describe a hobby you enjoy.", points: ["What the hobby is", "How you started doing it", "How often you do it", "And explain why you enjoy it"] },
  { topic: "Describe a city you have visited that you liked.", points: ["Which city it was", "When you visited", "What you did there", "And explain why you liked it"] },
  { topic: "Describe an important decision you made.", points: ["What the decision was", "When you made it", "Why you made this decision", "And explain how it affected your life"] },
  { topic: "Describe a family member you are close to.", points: ["Who this person is", "What they are like", "What you do together", "And explain why you are close to them"] },
  { topic: "Describe an event that made you happy.", points: ["What the event was", "When it happened", "Who was there", "And explain why it made you happy"] },
  { topic: "Describe a website or app you use often.", points: ["What it is", "How you discovered it", "What you use it for", "And explain why you find it useful"] },
  { topic: "Describe a time you learned something new.", points: ["What you learned", "How you learned it", "Why you decided to learn it", "And explain how you felt about it"] },
  { topic: "Describe a piece of clothing you like to wear.", points: ["What it is", "When you got it", "When you wear it", "And explain why you like it"] },
  { topic: "Describe an achievement you are proud of.", points: ["What the achievement was", "How you achieved it", "Who helped you", "And explain why you are proud of it"] },
  { topic: "Describe a film or TV show you enjoyed.", points: ["What it was about", "When you watched it", "Who you watched it with", "And explain why you enjoyed it"] },
  { topic: "Describe a public place near where you live.", points: ["Where it is", "What it looks like", "What people do there", "And explain why you like or dislike it"] },
  { topic: "Describe a time you had to solve a problem.", points: ["What the problem was", "How you solved it", "Who helped you (if anyone)", "And explain how you felt afterward"] },
  { topic: "Describe a gift you gave to someone.", points: ["What the gift was", "Who you gave it to", "Why you chose it", "And explain how they reacted"] },
  { topic: "Describe a sport or physical activity you enjoy.", points: ["What it is", "How you learned it", "How often you do it", "And explain why you enjoy it"] },
  { topic: "Describe a time you were very busy.", points: ["When this was", "What you had to do", "How you managed your time", "And explain how you felt"] },
  { topic: "Describe a website you use for learning.", points: ["What the website is", "What you learn there", "How often you use it", "And explain why you find it helpful"] },
  { topic: "Describe an interesting conversation you had.", points: ["Who you talked to", "What the conversation was about", "Where it took place", "And explain why it was interesting"] },
  { topic: "Describe a change you would like to make in your life.", points: ["What the change is", "Why you want to make it", "How you plan to do it", "And explain how it would improve your life"] },
  { topic: "Describe a neighbor or someone who lives near you.", points: ["Who this person is", "How well you know them", "What they are like", "And explain your relationship with them"] },
];

export default function Practice() {
  const [phase, setPhase] = useState<'name' | 'prep' | 'speaking' | 'processing' | 'result'>('name');
  const [cueCard] = useState(() => CUE_CARDS[Math.floor(Math.random() * CUE_CARDS.length)]);
  const [name, setName] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (phase === 'prep' || phase === 'speaking') {
      if (secondsLeft <= 0) {
        if (phase === 'prep') startSpeaking();
        else stopSpeaking();
        return;
      }
      const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [secondsLeft, phase]);

  function beginPrep() {
    if (!name.trim()) return;
    setPhase('prep');
    setSecondsLeft(60);
  }

  async function startSpeaking() {
    setPhase('speaking');
    setSecondsLeft(120);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.start();
    mediaRecorderRef.current = recorder;
  }

  async function stopSpeaking() {
    setPhase('processing');
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    recorder.stop();
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', blob, 'response.webm');
      formData.append('name', name);
      formData.append('topic', cueCard.topic);

      try {
        const res = await fetch('/api/score', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.error) {
          setErrorMsg(data.error);
          setPhase('result');
          return;
        }
        setResult(data);
        setPhase('result');
      } catch (err) {
        setErrorMsg('Something went wrong while scoring. Please try again.');
        setPhase('result');
      }
    };
  }

  async function submitReview() {
    if (!rating || !comment.trim()) return;
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rating, comment }),
    });
    setReviewSubmitted(true);
  }

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function band10(n: number) { return `${(n / 9) * 100}%`; }

  if (phase === 'name') {
    return (
      <main className="max-w-md mx-auto mt-20 px-6 text-center">
        <a href="/" className="text-sm text-slate-400 mb-6 inline-block">← Back</a>
        <div className="card p-8">
          <div className="w-11 h-11 rounded-xl gradient-btn flex items-center justify-center mx-auto mb-4">👤</div>
          <h1 className="text-xl font-bold text-slate-800 mb-1">Enter Your Name</h1>
          <p className="text-sm text-slate-500 mb-6">Personalize your session in seconds — no signup required to try.</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 mb-4"
            onKeyDown={(e) => e.key === 'Enter' && beginPrep()}
          />
          <button onClick={beginPrep} className="w-full gradient-btn rounded-xl py-3">
            Continue
          </button>
        </div>
      </main>
    );
  }

  if (phase === 'prep') {
    return (
      <main className="max-w-xl mx-auto mt-16 px-6">
        <a href="/" className="text-sm text-slate-400 mb-6 inline-block">← Back</a>
        <div className="card p-8">
          <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">📋 IELTS CUE CARD</span>
          <h1 className="text-xl font-bold text-slate-800 mt-4 mb-4">{cueCard.topic}</h1>
          <ul className="text-sm text-slate-500 space-y-1 mb-6">
            {cueCard.points.map((p, i) => <li key={i}>• {p}</li>)}
          </ul>
          <p className="mono text-3xl font-bold text-slate-800">{fmt(secondsLeft)}</p>
          <p className="text-xs text-slate-400 mt-1">Preparation time</p>
        </div>
      </main>
    );
  }

  if (phase === 'speaking') {
    return (
      <main className="max-w-3xl mx-auto mt-16 px-6">
        <a href="/" className="text-sm text-slate-400 mb-6 inline-block">← Back</a>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card p-6">
            <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">📋 IELTS CUE CARD</span>
            <h1 className="text-lg font-bold text-slate-800 mt-4 mb-3">{cueCard.topic}</h1>
            <ul className="text-sm text-slate-500 space-y-1">
              {cueCard.points.map((p, i) => <li key={i}>• {p}</li>)}
            </ul>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">🎙 Recording <span className="mono font-semibold text-slate-800">{fmt(secondsLeft)}</span></span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">● LIVE</span>
            </div>
            <div className="rec-waveform mb-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} style={{ animationDelay: `${(i % 7) * 0.12}s` }} />
              ))}
            </div>
            <button
              onClick={stopSpeaking}
              className="w-full border border-slate-200 rounded-xl py-2.5 text-slate-600 hover:border-violet-300 transition"
            >
              Stop early
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (phase === 'processing') {
    return (
      <main className="max-w-xl mx-auto mt-24 px-6 text-center">
        <div className="rec-waveform mb-6" style={{ opacity: 0.5 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${(i % 7) * 0.12}s` }} />
          ))}
        </div>
        <h1 className="text-xl font-semibold text-slate-800">Scoring your response…</h1>
        <p className="text-slate-500 mt-2 text-sm">Transcribing and comparing against the IELTS rubric.</p>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="max-w-xl mx-auto mt-24 px-6 text-center">
        <div className="card p-8">
          <h1 className="text-lg font-semibold text-red-600 mb-2">Something went wrong</h1>
          <p className="text-slate-500 text-sm mb-6">{errorMsg}</p>
          <button onClick={() => window.location.reload()} className="gradient-btn rounded-xl px-6 py-3">
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto mt-16 px-6 pb-16">
      <a href="/" className="text-sm text-slate-400 mb-6 inline-block">← Back</a>
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="card p-6">
          <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">🤖 AI Feedback · Live Analysis</span>
          <div className="space-y-4 mt-5">
            {[
              ['Fluency', result?.fluency],
              ['Grammar', result?.grammar],
              ['Pronunciation', result?.pronunciation],
              ['Vocabulary', result?.lexical],
            ].map(([label, val]) => (
              <div key={label as string}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800">{val}</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: band10(Number(val) || 0) }} /></div>
              </div>
            ))}
          </div>
          <div className="gradient-btn rounded-xl p-4 mt-6 text-center">
            <p className="text-xs opacity-80">Predicted IELTS Band</p>
            <p className="text-3xl font-bold">{result?.overallBand}</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-slate-800 mb-4 text-lg">Session Feedback</h2>
          <p className="text-emerald-700 font-medium text-sm mb-3">
            Strengths: {result?.strengths?.join(' • ')}
          </p>
          <p className="text-amber-800 font-medium text-sm mb-4">
            Improvements: {result?.improvements?.join(' • ')}
          </p>
          <div className="bg-slate-50 rounded-xl p-4 flex gap-3 text-sm text-slate-700">
            <span>📅</span>
            <span>Suggested: {result?.suggested}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full gradient-btn rounded-xl py-3 mt-6"
          >
            Try another →
          </button>
        </div>
      </div>

      <div className="card p-6">
        {reviewSubmitted ? (
          <p className="text-center text-emerald-600 font-semibold">Thanks for your feedback! 🎉</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0">
              <p className="font-bold text-slate-800 text-lg mb-1">Review →</p>
              <p className="text-sm text-slate-500 max-w-[220px]">Share your opinion by giving a personal review</p>
            </div>
            <div className="flex-1 w-full">
              <div className="flex gap-1 mb-3">
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
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think of your practice session?"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 mb-3 resize-none"
                rows={3}
              />
              <button onClick={submitReview} className="gradient-btn rounded-xl px-6 py-2.5 text-sm">
                Submit review
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}