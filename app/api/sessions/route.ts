import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const sessionsPath = path.join('/tmp', 'sessions.json');
  if (!fs.existsSync(sessionsPath)) return NextResponse.json([]);
  const sessions = JSON.parse(fs.readFileSync(sessionsPath, 'utf-8'));
  return NextResponse.json(sessions);
}