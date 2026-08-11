import { describe, it, expect } from "vitest";
import { splitTextOnLinks, linkifyBlocks } from "./linkify";

const span = (text: string, key = "s1", marks: string[] = []) => ({
  _type: "span",
  _key: key,
  text,
  marks,
});

const block = (children: any[], markDefs: any[] = []) => ({
  _type: "block",
  _key: "b1",
  style: "normal",
  children,
  markDefs,
});

describe("splitTextOnLinks", () => {
  it("returns plain text untouched", () => {
    expect(splitTextOnLinks("just some words")).toEqual([{ text: "just some words" }]);
  });

  it("links a bare https URL and trims trailing punctuation", () => {
    const parts = splitTextOnLinks("book at https://www.selvedge.org/products/threads-of-paper.");
    expect(parts).toEqual([
      { text: "book at " },
      {
        text: "https://www.selvedge.org/products/threads-of-paper",
        href: "https://www.selvedge.org/products/threads-of-paper",
      },
      { text: "." },
    ]);
  });

  it("prefixes www URLs with https", () => {
    const parts = splitTextOnLinks("see www.wsd.org.uk for details");
    expect(parts[1]).toEqual({ text: "www.wsd.org.uk", href: "https://www.wsd.org.uk" });
  });

  it("turns email addresses into mailto links", () => {
    const parts = splitTextOnLinks("contact Sue at sue@example.com please");
    expect(parts[1]).toEqual({ text: "sue@example.com", href: "mailto:sue@example.com" });
  });

  it("handles multiple links in one span", () => {
    const parts = splitTextOnLinks("a https://a.com and b https://b.com");
    expect(parts.filter((p) => p.href)).toHaveLength(2);
  });
});

describe("linkifyBlocks", () => {
  it("passes through non-array input", () => {
    expect(linkifyBlocks(undefined)).toBeUndefined();
    expect(linkifyBlocks(null)).toBeNull();
  });

  it("leaves blocks without URLs unchanged (same reference)", () => {
    const input = [block([span("no links here")])];
    expect(linkifyBlocks(input)[0]).toBe(input[0]);
  });

  it("adds a link markDef and marked span for a bare URL", () => {
    const result: any = linkifyBlocks([block([span("go to https://example.com now")])]);
    const b = result[0];
    expect(b.markDefs).toHaveLength(1);
    expect(b.markDefs[0]).toMatchObject({ _type: "link", href: "https://example.com" });
    const linked = b.children.find((c: any) => c.marks.includes(b.markDefs[0]._key));
    expect(linked.text).toBe("https://example.com");
    expect(b.children.map((c: any) => c.text).join("")).toBe("go to https://example.com now");
  });

  it("recovers the destination for an empty link markDef wrapping a URL", () => {
    // Real production shape: editor wrapped a pasted URL in a link annotation
    // but the URL field saved nothing.
    const emptyDef = { _type: "link", _key: "def1" };
    const input = [block([span("https://www.selvedge.org/products/threads", "s1", ["def1"])], [emptyDef])];
    const result: any = linkifyBlocks(input);
    expect(result[0].markDefs[0].href).toBe("https://www.selvedge.org/products/threads");
    expect(result[0].children).toHaveLength(1);
  });

  it("leaves an empty link markDef alone when its text is not a URL", () => {
    const emptyDef = { _type: "link", _key: "def1" };
    const input = [block([span("click here", "s1", ["def1"])], [emptyDef])];
    const result: any = linkifyBlocks(input);
    expect(result[0].markDefs[0].href).toBeUndefined();
  });

  it("does not touch spans already inside an authored link", () => {
    const authored = { _type: "link", _key: "def1", href: "https://authored.com" };
    const input = [block([span("https://authored.com", "s1", ["def1"])], [authored])];
    const result: any = linkifyBlocks(input);
    expect(result[0].markDefs).toHaveLength(1);
    expect(result[0].children).toHaveLength(1);
  });

  it("leaves non-block members (e.g. images) untouched", () => {
    const image = { _type: "image", _key: "img1", asset: { _ref: "x" } };
    const result: any = linkifyBlocks([image]);
    expect(result[0]).toBe(image);
  });
});
