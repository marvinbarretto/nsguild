import { describe, it, expect } from "vitest";
import { firstSentence } from "./firstSentence";

const block = (...texts: string[]) => ({
  _type: "block",
  _key: "b",
  style: "normal",
  markDefs: [],
  children: texts.map((text, i) => ({ _type: "span", _key: `s${i}`, text, marks: [] as string[] })),
});
const textOf = (r: ReturnType<typeof firstSentence>) =>
  r.blocks.map((b) => (b.children ?? []).map((c) => c.text).join("")).join("|");

describe("firstSentence", () => {
  it("cuts the first paragraph at its first full stop", () => {
    const r = firstSentence([block("Workshop on Saturday. Bring a frame. Lunch provided.")]);
    expect(textOf(r)).toBe("Workshop on Saturday.");
    expect(r.truncated).toBe(true);
  });

  it("cuts inside a span, keeping earlier spans and their marks", () => {
    const body = [block("Sue Lawty ", "runs it. Book now.")];
    body[0].children[0].marks = ["strong"];
    const r = firstSentence(body);
    expect(textOf(r)).toBe("Sue Lawty runs it.");
    expect(r.blocks[0].children?.[0].marks).toEqual(["strong"]);
  });

  it("doesn't treat a time or a URL as a sentence end", () => {
    const r = firstSentence([block("Doors at 9.30am at example.org today. More later.")]);
    expect(textOf(r)).toBe("Doors at 9.30am at example.org today.");
  });

  it("is not truncated when the body is one sentence", () => {
    const r = firstSentence([block("Spinning wheel for sale.")]);
    expect(textOf(r)).toBe("Spinning wheel for sale.");
    expect(r.truncated).toBe(false);
  });

  it("is truncated when later paragraphs have text, skipping leading blanks", () => {
    const r = firstSentence([block(""), block("Cancelled"), block(""), block("Refunds by email.")]);
    expect(textOf(r)).toBe("Cancelled");
    expect(r.truncated).toBe(true);
  });

  it("handles an empty or missing body", () => {
    expect(firstSentence(undefined)).toEqual({ blocks: [], truncated: false });
    expect(firstSentence([block("  ")])).toEqual({ blocks: [], truncated: false });
  });
});
