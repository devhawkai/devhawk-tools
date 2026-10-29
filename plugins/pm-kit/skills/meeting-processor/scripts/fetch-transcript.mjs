// Save a Fireflies transcript to a file, straight from the API, so no model ever retypes it.
// Usage: node fetch-transcript.mjs <fireflies meeting id or URL> <out.md>
// Needs FIREFLIES_API_KEY (Fireflies → Settings → Developer settings). The key is never printed.
//
// Each line is `[mm:ss] Speaker: text` (`[h:mm:ss]` past an hour), the format meeting-processor
// timestamps its bullets with. The file is the source of truth for the VERBATIM-OK diff.
//
// Exit codes: 0 written (prints the path) · 1 Fireflies refused or returned nothing · 2 bad usage.

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENDPOINT = 'https://api.fireflies.ai/graphql';
const QUERY = `query Transcript($id: String!) {
  transcript(id: $id) { title dateString sentences { speaker_name text start_time } }
}`;

/** A bare id, or the id at the end of an app.fireflies.ai/view/<slug>::<id> or /view/<id> URL. */
export function meetingId(arg) {
  const s = String(arg ?? '').trim();
  if (!s) return null;
  const tail =
    s
      .replace(/[?#].*$/, '')
      .replace(/\/+$/, '')
      .split('/')
      .pop() ?? '';
  const id = tail.includes('::') ? tail.split('::').pop() : tail;
  return /^[A-Za-z0-9_-]{6,}$/.test(id) ? id : null;
}

export function stamp(seconds) {
  const t = Math.max(0, Math.floor(Number(seconds) || 0));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = String(t % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${String(m).padStart(2, '0')}:${sec}`;
}

/** Sentences → transcript text. Speaker and words exactly as Fireflies returned them. */
export function formatTranscript(sentences) {
  return (
    (sentences ?? [])
      .filter((x) => (x?.text ?? '').trim())
      .map((x) => {
        const who = (x.speaker_name ?? '').trim();
        return `[${stamp(x.start_time)}] ${who ? `${who}: ` : ''}${x.text.trim()}`;
      })
      .join('\n') + '\n'
  );
}

export async function fetchTranscript(id, apiKey, doFetch = fetch) {
  const res = await doFetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ query: QUERY, variables: { id } }),
  });
  if (!res.ok) throw new Error(`Fireflies API error ${res.status}`);
  const body = await res.json();
  // A spent quota arrives as HTTP 200 with an errors array, not as a 429.
  if (body.errors?.length)
    throw new Error(`Fireflies: ${body.errors.map((e) => e.message).join('; ')}`);
  const t = body.data?.transcript;
  if (!t) throw new Error(`Fireflies has no transcript with id ${id}`);
  if (!t.sentences?.length) throw new Error('Fireflies returned no sentences (still processing?)');
  return { title: t.title ?? '', date: t.dateString ?? '', text: formatTranscript(t.sentences) };
}

export async function main(argv, env = process.env, doFetch = fetch) {
  const [arg, out] = argv;
  const id = meetingId(arg);
  if (!id || !out) {
    console.error('usage: node fetch-transcript.mjs <fireflies meeting id or URL> <out.md>');
    return 2;
  }
  if (!env.FIREFLIES_API_KEY) {
    console.error(
      'FIREFLIES_API_KEY is not set. Create one under Fireflies → Settings → Developer settings,\n' +
        'or download the transcript from the meeting page and hand over the file instead.',
    );
    return 2;
  }
  try {
    const t = await fetchTranscript(id, env.FIREFLIES_API_KEY, doFetch);
    const path = resolve(out);
    writeFileSync(path, t.text);
    console.log(path);
    console.log(`title: ${t.title}`);
    console.log(`date: ${t.date}`);
    return 0;
  } catch (e) {
    console.error(String(e.message ?? e));
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
