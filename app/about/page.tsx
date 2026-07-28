export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-3">About SelfNative</p>
      <h1 className="display text-3xl md:text-4xl font-bold text-slate-800 mb-2 leading-tight">
        From nervous to <span className="gradient-text">native.</span>
      </h1>
      <p className="text-slate-500 mb-10">
        Millions of students prepare for IELTS through coaching centers and English clubs — expensive, fixed-length, and group-paced. Shy students rarely get real speaking time. They stay quiet, don't ask questions, and never get the reps they actually need.
      </p>

      <div className="card p-8 mb-6">
        <h2 className="font-bold text-slate-800 text-lg mb-3">The real problem isn't scoring — it's fear</h2>
        <p className="text-slate-600 leading-relaxed">
          Every AI tool in this space solves the same thing: it listens to you and gives you a number. What none of them solve is the actual reason most students stall — they're afraid to speak until it's already too late in their prep. A score doesn't fix that. Confidence does.
        </p>
      </div>

      <div className="card p-8 mb-6">
        <h2 className="font-bold text-slate-800 text-lg mb-3">The Confidence Ladder</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Instead of dropping students straight into "record and get scored" — the exact moment shy students freeze — SelfNative structures practice as a graduated path:
        </p>
        <ul className="space-y-2 text-slate-600">
          <li className="flex gap-3"><span className="text-violet-500 font-semibold shrink-0">1.</span> Private solo practice, no pressure, AI feedback only</li>
          <li className="flex gap-3"><span className="text-violet-500 font-semibold shrink-0">2.</span> AI-simulated conversation with follow-up questions, still private</li>
          <li className="flex gap-3"><span className="text-violet-500 font-semibold shrink-0">3.</span> Small recorded group scenarios, low-stakes</li>
          <li className="flex gap-3"><span className="text-violet-500 font-semibold shrink-0">4.</span> Full live simulation / public speaking mode</li>
        </ul>
      </div>

      <div className="card p-8 mb-6">
        <h2 className="font-bold text-slate-800 text-lg mb-3">Validated, not just claimed</h2>
        <p className="text-slate-600 leading-relaxed">
          Scoring is calibrated against real, independently blind-scored examiner recordings — not a marketing claim of "AI accuracy." Every strength and improvement in your feedback is quoted directly from your own transcript, the way a real examiner would speak to you face to face, not generic advice that could apply to anyone.
        </p>
      </div>

      <div className="card p-8 mb-6">
        <h2 className="font-bold text-slate-800 text-lg mb-3">One profile that remembers you</h2>
        <p className="text-slate-600 leading-relaxed">
          Most tools start from zero every session. SelfNative is building toward a Unified Mistake Profile — one record of your recurring patterns across speaking, and eventually writing and grammar too — so the longer you use it, the more personalized your feedback gets.
        </p>
      </div>

      <div className="card p-8">
        <h2 className="font-bold text-slate-800 text-lg mb-3">Built with real coaching centers, not against them</h2>
        <p className="text-slate-600 leading-relaxed">
          SelfNative isn't trying to replace coaching centers — it's built to work alongside them. Centers get a private practice option for their shy students, freeing instructor time from repetitive correction so live sessions focus on higher-value coaching. Students get unlimited practice at a fraction of the cost of an extra class.
        </p>
      </div>

      <div className="text-center mt-10">
        <a href="/practice" className="gradient-btn inline-block px-6 py-3 rounded-full">
          Start Practicing →
        </a>
      </div>
    </main>
  );
}