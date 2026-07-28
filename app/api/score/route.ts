import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function extractDisfluencyMarkers(transcription: any) {
  const words: any[] = transcription.words || [];
  const pauses: { after: string; duration: number }[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    const gap = words[i + 1].start - words[i].end;
    if (gap > 0.5) pauses.push({ after: words[i].word, duration: Math.round(gap * 10) / 10 });
  }
  const duration = transcription.duration || (words.length ? words[words.length - 1].end : 0);
  const speechRate = duration > 0 ? Math.round((words.length / (duration / 60)) * 10) / 10 : 0;
  return { pauses, speechRate, duration };
}

function classifyScoringError(err: unknown): { type: string; message: string } {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();
  if (lower.includes('credit balance') || lower.includes('insufficient_quota') || lower.includes('billing'))
    return { type: 'billing', message };
  if (lower.includes('json') || lower.includes('unexpected token') || lower.includes('malformed'))
    return { type: 'malformed_response', message };
  if (lower.includes('whisper') || lower.includes('transcription') || lower.includes('audio'))
    return { type: 'whisper_failed', message };
  if (lower.includes('fetch failed') || lower.includes('network') || lower.includes('timeout'))
    return { type: 'network', message };
  return { type: 'unknown', message };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const name = (formData.get('name') as string) || 'Anonymous';
    const topic = (formData.get('topic') as string) || '';
    const points = (formData.get('points') as string) || '';

    let transcription: any;
    try {
      transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
        response_format: 'verbose_json',
        timestamp_granularities: ['word', 'segment'],
        temperature: 0.2,
        prompt:
          'This is a spoken IELTS Speaking test response. The speaker may pause, self-correct, use filler words like um, uh, like, or repeat words. Transcribe exactly as spoken, including hesitations and false starts.',
      } as any);
    } catch (err) {
      throw new Error(`whisper transcription failed: ${err instanceof Error ? err.message : err}`);
    }

    const segments = transcription.segments || [];
    const transcriptWithTimestamps = segments
      .map((s: any) => `[${s.start.toFixed(1)}s] ${s.text}`)
      .join('\n');
      const wordCount = (transcription.words || []).length;
    if (wordCount < 8) {
      return NextResponse.json(
        { error: 'Your recording seems too short to score. Please speak for at least 15-20 seconds and try again.', type: 'too_short' },
        { status: 400 }
      );
    }

    const { pauses, speechRate, duration } = extractDisfluencyMarkers(transcription);
    const disfluencyMarkers = `Speech rate: ${speechRate} words per minute. Significant pauses: ${
      pauses.length ? pauses.map((p) => `after "${p.after}" (${p.duration}s)`).join(', ') : 'none detected'
    }.`;

    const scoringPrompt = `You are a certified IELTS Speaking examiner with 15+ years of experience, trained on the official IELTS Speaking Band Descriptors (Public Version). You are evaluating a candidate's response to a single Cue Card task.

CONTEXT PROVIDED TO YOU:
- Cue Card topic: ${topic}
- Cue Card prompts: ${points}
- Full timestamped transcript: ${transcriptWithTimestamps}
- Response duration: ${Math.round(duration)} seconds
- Filler word / pause markers from transcription: ${disfluencyMarkers}

CALIBRATION RULES (read carefully before scoring):
1. Score holistically across all 4 criteria, the way a real examiner does in a live test — not like an automated grammar checker penalizing every minor slip.
2. Do NOT default to a "safe middle" score. If the candidate shows genuine range, coherence, and only occasional lapses, score 7-8, not 6-6.5. Reserve 6 and below for responses with clear, repeated breakdowns in communication, not just imperfect grammar.
3. Under-length or single-sentence answers should be penalized under Fluency & Coherence specifically — not used to drag down all four scores.
4. Weigh natural spoken English patterns (self-correction, natural pausing, informal connectors) as normal — not as errors — unless they actually obstruct meaning.
5. A few minor grammar or pronunciation slips in an otherwise fluent, well-developed, idea-rich answer should NOT cap the band below 7.

SCORE EACH CRITERION 0-9 (in 0.5 increments) USING THE OFFICIAL DESCRIPTORS:
Fluency & Coherence: speech rate/rhythm, hesitation patterns, self-correction, logical sequencing, coherent linking, topic development and extension.
Lexical Resource: range of vocabulary, use of less common/idiomatic language, paraphrase ability, precision and appropriacy of word choice, collocation accuracy.
Grammatical Range & Accuracy: range of structures attempted, complex sentence use, error frequency AND whether errors impede meaning, accuracy of tense/agreement.
Pronunciation: word/sentence stress, intonation, individual sound production, chunking, overall intelligibility.

OUTPUT FORMAT — return ONLY valid JSON, no markdown, no preamble:
{
  "overall_band": <number>,
  "criteria": {
    "fluency_coherence": { "band": <number>, "evidence": "<1-2 specific quotes/moments from the transcript that justify this score>" },
    "lexical_resource": { "band": <number>, "evidence": "<...>" },
    "grammatical_range_accuracy": { "band": <number>, "evidence": "<...>" },
    "pronunciation": { "band": <number>, "evidence": "<...>" }
  },
  "top_strengths": [
    { "strength": "<specific, named skill>", "evidence": "<exact moment/phrase from transcript>", "why_it_matters": "<how this maps to band descriptors>" }
  ],
  "priority_improvements": [
    { "issue": "<specific, named weakness>", "evidence": "<exact moment/phrase>", "connected_strength": "<which existing strength this should build on>", "actionable_fix": "<one concrete drill or rephrasing exercise>" }
  ],
  "examiner_summary": "<3-4 sentences, written the way a real examiner would speak it to the candidate face-to-face — encouraging but honest, referencing their actual answer content>"
}
IMPORTANT: Every strength and improvement MUST cite actual words/phrases from the transcript. Never write generic feedback. The "connected_strength" field is mandatory.`;

    async function callClaudeAndParse() {
      const scoreRes = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: scoringPrompt }],
      });
      const textBlock = scoreRes.content.find((c: any) => c.type === 'text') as any;
      const raw = textBlock.text as string;
      const cleaned = raw.replace(/```json\n?|```/g, '').trim();
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      const jsonSlice = cleaned.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonSlice);
      if (!parsed.overall_band || !parsed.criteria) {
        throw new Error('malformed score response — missing required fields');
      }
      return parsed;
    }

    let result: any;
    try {
      result = await callClaudeAndParse();
    } catch (firstErr) {
      // Silent one-time retry before surfacing an error to the user
      try {
        result = await callClaudeAndParse();
      } catch (secondErr) {
        throw new Error(`malformed json response from scoring model after retry: ${secondErr instanceof Error ? secondErr.message : secondErr}`);
      }
    }

    const flat = {
      fluency: result.criteria.fluency_coherence.band,
      lexical: result.criteria.lexical_resource.band,
      grammar: result.criteria.grammatical_range_accuracy.band,
      pronunciation: result.criteria.pronunciation.band,
      overallBand: result.overall_band,
    };

    const sessionRecord = {
      date: new Date().toISOString(),
      name,
      topic,
      transcript: transcription.text,
      ...flat,
      topStrengths: result.top_strengths,
      priorityImprovements: result.priority_improvements,
      examinerSummary: result.examiner_summary,
    };
    await redis.rpush('sessions', JSON.stringify(sessionRecord));

    return NextResponse.json({ ...flat, full: result });
  } catch (err) {
    const classified = classifyScoringError(err);
    console.error('Scoring error:', classified);
    return NextResponse.json({ error: classified.message, type: classified.type }, { status: 500 });
  }
}