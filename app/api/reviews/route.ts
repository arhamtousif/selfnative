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
  const { name, profession, institute, rating, comment } = body;
  if (!comment || !rating || !name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  let reviews = [];
  if (fs.existsSync(reviewsPath)) {
    reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));
  }
  reviews.push({
    name,
    profession: profession || '',
    institute: institute || '',
    rating,
    comment,
    date: new Date().toISOString(),
  });
  fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));
  return NextResponse.json({ success: true });
}