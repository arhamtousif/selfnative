'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Progress() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/sessions').then(r => r.json()).then(setData);
  }, []);

  return (
    <main className="max-w-3xl mx-auto mt-12 px-6 pb-16">
      <h1 className="display text-3xl font-bold text-slate-800 mb-8">Progress Over Time</h1>
      <div className="card p-6">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} stroke="#94a3b8" fontSize={12} />
            <YAxis domain={[0, 9]} stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="overallBand" stroke="#7c3aed" strokeWidth={2} name="Overall Band" />
            <Line type="monotone" dataKey="fluency" stroke="#06b6d4" strokeWidth={2} name="Fluency" />
            <Line type="monotone" dataKey="lexical" stroke="#f59e0b" strokeWidth={2} name="Lexical" />
            <Line type="monotone" dataKey="grammar" stroke="#ef4444" strokeWidth={2} name="Grammar" />
            <Line type="monotone" dataKey="pronunciation" stroke="#8b5cf6" strokeWidth={2} name="Pronunciation" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}