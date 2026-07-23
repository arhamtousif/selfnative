import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  const raw = await redis.lrange('reviews', 0, -1);
  const reviews = raw.map((r: any) => (typeof r === 'string' ? JSON.parse(r) : r));
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, profession, institute, rating, comment } = body;
  if (!comment || !rating || !name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const reviewRecord = {
    name,
    profession: profession || '',
    institute: institute || '',
    rating,
    comment,
    date: new Date().toISOString(),
  };
  await redis.rpush('reviews', JSON.stringify(reviewRecord));
  return NextResponse.json({ success: true });
}