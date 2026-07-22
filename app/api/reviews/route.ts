import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const reviewsPath = path.join('/tmp', 'reviews.json');

export async function GET() {
  if (!fs.existsSync(reviewsPath)) return NextResponse.json([]);
  const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, rating, comment } = body;
  if (!comment || !rating) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  fs.mkdirSync(path.dirname(reviewsPath), { recursive: true });
  let reviews = [];
  if (fs.existsSync(reviewsPath)) {
    reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));
  }
  reviews.push({ name: name || 'Anonymous', rating, comment, date: new Date().toISOString() });
  fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));
  return NextResponse.json({ success: true });
}