// Split wordy news posts into a Leader and More detail, without changing a word.
//
// The leader is everything up to and including the first full stop of the
// first paragraph; the rest of that paragraph and every later block move to
// moreDetail. Posts that already have moreDetail are skipped.
//
// Usage:
//   node scripts/split-news-leaders.js                 # dry run: posts over 400 characters
//   node scripts/split-news-leaders.js <slug> [<slug>] # dry run: just these posts
//   node scripts/split-news-leaders.js ... --live      # write (backs up each body first)
//
// --live needs SANITY_WRITE_TOKEN in .env (an Editor token from sanity.io/manage
// → API → Tokens); the site's SANITY_TOKEN is read-only.
import { loadEnv } from 'vite';
import { createClient } from '@sanity/client';
import { randomBytes } from 'crypto';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const MIN_CHARS = 400;

const env = loadEnv('production', process.cwd(), '');
const client = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID,
  dataset: env.PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2025-01-28',
  token: env.SANITY_WRITE_TOKEN || env.SANITY_TOKEN,
});

const args = process.argv.slice(2);
const live = args.includes('--live');
const slugs = args.filter((a) => !a.startsWith('--'));

const key = () => randomBytes(6).toString('hex');
const blockText = (b) => (b._type === 'block' ? b.children.map((c) => c.text).join('') : '');

// A full stop followed by whitespace (or the end of the text) ends a sentence.
const SENTENCE_END = /\.(\s|$)/;

/** Returns { leader, moreDetail } or null when there is nothing to split. */
export function splitAtFirstFullStop(body) {
  const first = body.findIndex((b) => blockText(b).trim());
  if (first === -1) return null;
  const block = body[first];
  const text = blockText(block);
  const m = SENTENCE_END.exec(text);
  if (!m) return null;
  const cut = m.index + 1; // keep the full stop with the leader
  if (!text.slice(cut).trim() && first === body.length - 1) return null;

  const head = [];
  const tail = [];
  let pos = 0;
  for (const span of block.children) {
    const start = pos;
    const end = pos + span.text.length;
    pos = end;
    if (end <= cut) head.push(span);
    else if (start >= cut) tail.push(span);
    else {
      head.push({ ...span, text: span.text.slice(0, cut - start) });
      tail.push({ ...span, _key: key(), text: span.text.slice(cut - start) });
    }
  }
  // drop the space after the full stop
  while (tail.length && !tail[0].text.trimStart()) tail.shift();
  if (tail.length) tail[0] = { ...tail[0], text: tail[0].text.trimStart() };

  const leader = [...body.slice(0, first), { ...block, children: head }];
  const rest = tail.length ? [{ ...block, _key: key(), children: tail }] : [];
  return { leader, moreDetail: [...rest, ...body.slice(first + 1)] };
}

const posts = await client.fetch(
  slugs.length
    ? `*[_type == "post" && slug.current in $slugs && !defined(moreDetail)]{_id, _rev, title, "slug": slug.current, body}`
    : `*[_type == "post" && !defined(moreDetail) && length(pt::text(body)) > ${MIN_CHARS}]{_id, _rev, title, "slug": slug.current, body}`,
  { slugs }
);

if (!posts.length) {
  console.log('Nothing to split.');
  process.exit(0);
}

const backupDir = join(tmpdir(), 'nsguild-news-split');
for (const post of posts) {
  const split = splitAtFirstFullStop(post.body ?? []);
  console.log(`\n## ${post.title} (${post.slug})`);
  if (!split) {
    console.log('   no full stop to split at — skipped');
    continue;
  }
  console.log(`   LEADER: ${split.leader.map(blockText).join('\n           ')}`);
  console.log(`   MORE:   ${split.moreDetail.map(blockText).join('\n           ')}`);

  if (!live) continue;
  mkdirSync(backupDir, { recursive: true });
  const backup = join(backupDir, `${post._id}-${post._rev}.json`);
  writeFileSync(backup, JSON.stringify(post, null, 2));
  await client
    .patch(post._id)
    .ifRevisionId(post._rev)
    .set({ body: split.leader, moreDetail: split.moreDetail })
    .commit();
  console.log(`   written (original body backed up to ${backup})`);
}

if (!live) console.log('\nDry run. Add --live to write.');
