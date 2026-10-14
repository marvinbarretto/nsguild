// TEMPORARY, design preview only: shows how the homepage reads with
// headline-length leaders without editing any real post. Delete once posts
// carry short leaders of their own.

type Span = { _type: string; _key?: string; text?: string; marks?: string[] };
type Block = { _type: string; _key?: string; children?: Span[]; [k: string]: unknown };

const blockText = (b: Block) =>
  b._type === "block" ? (b.children ?? []).map((c) => c.text ?? "").join("") : "";

// A full stop followed by whitespace or the end of the text ends a sentence,
// so "9.30am" and URLs don't count.
const SENTENCE_END = /\.(\s|$)/;

/**
 * The first sentence of a Portable Text body, as Portable Text (marks and
 * links kept), and whether anything was left out.
 */
export function firstSentence(body: Block[] | undefined | null): { blocks: Block[]; truncated: boolean } {
  const blocks = body ?? [];
  const first = blocks.findIndex((b) => blockText(b).trim());
  if (first === -1) return { blocks: [], truncated: false };

  const block = blocks[first];
  const text = blockText(block);
  const restHasText = blocks.slice(first + 1).some((b) => blockText(b).trim() || b._type !== "block");
  const m = SENTENCE_END.exec(text);
  const cut = m ? m.index + 1 : text.length;
  const truncated = Boolean(text.slice(cut).trim()) || restHasText;

  const children: Span[] = [];
  let pos = 0;
  for (const span of block.children ?? []) {
    const t = span.text ?? "";
    if (pos >= cut) break;
    children.push(pos + t.length <= cut ? span : { ...span, text: t.slice(0, cut - pos) });
    pos += t.length;
  }

  return { blocks: [{ ...block, children }], truncated };
}
