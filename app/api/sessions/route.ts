import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  const raw = await redis.lrange('sessions', 0, -1);
  const sessions = raw.map((s: any) => (typeof s === 'string' ? JSON.parse(s) : s));
  return NextResponse.json(sessions);
}