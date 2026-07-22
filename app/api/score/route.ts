import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RUBRIC = `
You are an experienced, fair IELTS Speaking examiner. Score holistically, the way a real examiner does: listen to overall communicative effectiveness first, then check against band descriptors. Do not hunt for minor flaws to justify a lower score.

CRITICAL CALIBRATION NOTE: Examiners consistently under-score confident, natural speakers when scoring from transcripts alone, because transcripts strip out delivery, pacing, and natural intonation that would be obvious in audio. To compensate: if the transcript shows natural word choice, idiomatic phrasing, complex sentence structures used correctly, and clear logical organization — even in a short sample — this is strong evidence of a Band 7.5-9 speaker. Do not default to the 6-7 range out of caution. Trust clear evidence of fluency and range.

IMPORTANT: The transcript may start or end abruptly because of recording start/stop timing, not because of the speaker's fluency. Never penalize fluency, coherence, or grammar for an abrupt beginning or cutoff ending of the transcript.

FLUENCY & COHERENCE (1-9): Band 9 = fluent, only rare content-related hesitation. Band 7-8 = speaks at length with ease, ideas well connected, occasional hesitation. Band 5-6 = maintains flow with noticeable repetition or slower pace. Band 3-4 = frequent long pauses.

LEXICAL RESOURCE (1-9): Band 9 = wide, precise, natural vocabulary. Band 7-8 = flexible vocabulary, idiomatic phrasing, occasional inaccuracy in less common words. Band 5-6 = adequate but limited, some noticeable errors. Band 3-4 = very basic, frequent errors.

GRAMMATICAL RANGE & ACCURACY (1-9): Band 9 = full range, natural, nearly error-free. Band 7-8 = good range used flexibly, frequent error-free complex sentences, occasional slips. Band 5-6 = basic structures, frequent errors in complex sentences. Band 3-4 = only basic forms, errors impede meaning.

PRONUNCIATION (1-9): Since only a transcript is available, infer pronunciation from sentence flow and word choice clarity — do not default to a low or middling score just because audio isn't directly assessed. Band 7-8 should be the default assumption for clear, well-formed, idiomatic transcripts.
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const name = (formData.get('name') as string) || 'Anonymous';
    const topic = (formData.get('topic') as string) || '';

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const tempPath = path.join('/tmp', `rec-${Date.now()}.webm`);
    fs.writeFileSync(tempPath, buffer);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: 'whisper-1',
      response_format: 'json',
    });

    fs.unlinkSync(tempPath);

const scoringPrompt = `
${RUBRIC}

Score this IELTS Speaking Part 2 response the way a real, fair, generous-but-honest examiner would.

Transcript:
"${transcription.text}"

First, in 3-4 sentences, briefly reason through the evidence for each of the four criteria, quoting specific words or phrases from the transcript that justify your scores. Be honest about genuine weaknesses, but don't invent flaws — if the sample sounds like a strong, natural speaker, say so and score accordingly.

Then write the exact line:
===SCORE===

Then, after that line, output ONLY the JSON object in this exact format, nothing else after it:
{
  "fluency": <1-9>,
  "lexical": <1-9>,
  "grammar": <1-9>,
  "pronunciation": <1-9>,
  "overallBand": <average, rounded to nearest 0.5>,
  "strengths": ["short phrase", "short phrase", "short phrase"],
  "improvements": ["short phrase", "short phrase", "short phrase"],
  "suggested": "one short, encouraging, specific recommendation for what to practice next, written like a real instructor"
}
`;

    const scoreRes = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: scoringPrompt }],
    });

const textBlock = scoreRes.content.find((c: any) => c.type === 'text') as any;
    const rawText = textBlock.text as string;
    const jsonPart = rawText.includes('===SCORE===') ? rawText.split('===SCORE===')[1] : rawText;
    const scoreData = JSON.parse(jsonPart.replace(/```json|```/g, '').trim());
    const sessionsPath = path.join('/tmp', 'sessions.json');
    fs.mkdirSync(path.dirname(sessionsPath), { recursive: true });
    let sessions = [];
    if (fs.existsSync(sessionsPath)) {
      sessions = JSON.parse(fs.readFileSync(sessionsPath, 'utf-8'));
    }
    sessions.push({ date: new Date().toISOString(), name, topic, transcript: transcription.text, ...scoreData });
    fs.writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2));

    return NextResponse.json(scoreData);
  } catch (err: any) {
    console.error('Scoring error:', err);
    return NextResponse.json({ error: err.message || 'Something went wrong while scoring.' }, { status: 500 });
  }
}