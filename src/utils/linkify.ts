// Editors paste bare URLs and email addresses into rich text; Sanity stores
// them as plain spans. This walks portable text blocks and wraps those runs
// in link markDefs so they render as real anchors.

const URL_OR_EMAIL = /(https?:\/\/[^\s<>]+|www\.[^\s<>]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?)'"\]]+$/;

interface TextPart {
  text: string;
  href?: string;
}

function hrefFor(match: string): string {
  if (/^https?:\/\//i.test(match)) return match;
  if (/^www\./i.test(match)) return `https://${match}`;
  return `mailto:${match}`;
}

export function splitTextOnLinks(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_OR_EMAIL)) {
    let candidate = match[0];
    const trailing = candidate.match(TRAILING_PUNCTUATION);
    if (trailing) candidate = candidate.slice(0, -trailing[0].length);
    if (!candidate) continue;

    const start = match.index!;
    if (start > lastIndex) parts.push({ text: text.slice(lastIndex, start) });
    parts.push({ text: candidate, href: hrefFor(candidate) });
    lastIndex = start + candidate.length;
  }

  if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex) });
  return parts.length ? parts : [{ text }];
}

function destinationFor(def: any): string | undefined {
  return def.href || def.externalUrl || def.internalLink || undefined;
}

export function linkifyBlocks<T>(blocks: T): T {
  if (!Array.isArray(blocks)) return blocks;

  return blocks.map((block: any) => {
    if (block?._type !== "block" || !Array.isArray(block.children)) return block;

    const existingLinkKeys = new Set(
      (block.markDefs ?? [])
        .filter((def: any) => def._type === "link")
        .map((def: any) => def._key)
    );

    let changed = false;

    // Editors sometimes wrap a pasted URL in a link annotation without filling
    // in the URL field — the markDef ends up empty. Recover the destination
    // from the linked text itself.
    const markDefs = (block.markDefs ?? []).map((def: any) => {
      if (def._type !== "link" || destinationFor(def)) return def;
      const linkedText = block.children
        .filter((child: any) => (child.marks ?? []).includes(def._key))
        .map((child: any) => child.text ?? "")
        .join("")
        .trim();
      const derived = splitTextOnLinks(linkedText).find((part) => part.href);
      if (!derived) return def;
      changed = true;
      return { ...def, href: derived.href };
    });

    const children: any[] = [];
    let counter = 0;

    for (const child of block.children) {
      const alreadyLinked = (child.marks ?? []).some((mark: string) => existingLinkKeys.has(mark));
      if (child._type !== "span" || typeof child.text !== "string" || alreadyLinked) {
        children.push(child);
        continue;
      }

      const parts = splitTextOnLinks(child.text);
      if (parts.length === 1 && !parts[0].href) {
        children.push(child);
        continue;
      }

      changed = true;
      for (const part of parts) {
        const key = `${child._key ?? "span"}-lk${counter++}`;
        if (part.href) {
          const defKey = `${key}-def`;
          markDefs.push({ _type: "link", _key: defKey, href: part.href });
          children.push({ ...child, _key: key, text: part.text, marks: [...(child.marks ?? []), defKey] });
        } else {
          children.push({ ...child, _key: key, text: part.text });
        }
      }
    }

    return changed ? { ...block, children, markDefs } : block;
  }) as T;
}
