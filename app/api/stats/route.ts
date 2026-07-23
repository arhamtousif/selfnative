import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const sessionsPath = path.join('/tmp', 'sessions.json');
  const reviewsPath = path.join('/tmp', 'reviews.json');

  let sessionCount = 0;
  let reviewCount = 0;
  let avgRating = 0;

  if (fs.existsSync(sessionsPath)) {
    const sessions = JSON.parse(fs.readFileSync(sessionsPath, 'utf-8'));
    sessionCount = sessions.length;
  }

  if (fs.existsSync(reviewsPath)) {
    const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));
    reviewCount = reviews.length;
    if (reviewCount > 0) {
      const total = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
      avgRating = Math.round((total / reviewCount) * 10) / 10;
    }
  }

  return NextResponse.json({ sessionCount, reviewCount, avgRating });
}