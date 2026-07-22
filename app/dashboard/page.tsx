'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/sessions').then(r => r.json()).then((data) => {
      setSessions([...data].reverse());
    });
  }, []);

  return (
    <main className="max-w-5xl mx-auto mt-12 px-6 pb-16">
      <h1 className="display text-3xl font-bold text-slate-800 mb-1">Tester Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">{sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded</p>

      {sessions.length === 0 ? (
        <div className="card p-8 text-center text-slate-400">
          No sessions yet. Complete a practice round first.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left border-b border-slate-100">
                {['Name', 'Date', 'Topic', 'Overall', 'Fluency', 'Lexical', 'Grammar', 'Pronunciation'].map((h) => (
                  <th key={h} className="py-3 px-4 text-xs uppercase tracking-wide text-slate-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 px-4 font-medium text-slate-800">{s.name || 'Anonymous'}</td>
                  <td className="py-3 px-4 mono text-slate-400">{new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="py-3 px-4 text-slate-600">{s.topic || '—'}</td>
                  <td className="py-3 px-4 mono font-semibold gradient-text">{s.overallBand}</td>
                  <td className="py-3 px-4 mono text-slate-600">{s.fluency}</td>
                  <td className="py-3 px-4 mono text-slate-600">{s.lexical}</td>
                  <td className="py-3 px-4 mono text-slate-600">{s.grammar}</td>
                  <td className="py-3 px-4 mono text-slate-600">{s.pronunciation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}