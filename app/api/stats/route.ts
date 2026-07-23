import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  const sessionCount = await redis.llen('sessions');
  const reviewsRaw = await redis.lrange('reviews', 0, -1);
  const reviews = reviewsRaw.map((r: any) => (typeof r === 'string' ? JSON.parse(r) : r));

  const reviewCount = reviews.length;
  let avgRating = 0;
  if (reviewCount > 0) {
    const total = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
    avgRating = Math.round((total / reviewCount) * 10) / 10;
  }

  return NextResponse.json({ sessionCount, reviewCount, avgRating });
}