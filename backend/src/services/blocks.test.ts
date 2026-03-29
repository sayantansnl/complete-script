import { describe, it, expect } from "vitest";
import { parseInlineStyles, buildBlocks } from "./blocks";

describe("parseInlineStyles", () => {
  it("parses plain text", () => {
    const result = parseInlineStyles("Hello world");

    expect(result).toEqual([
      { text: "Hello world" }
    ]);
  });

  it("parses bold text", () => {
    const result = parseInlineStyles("This is **bold** text");

    expect(result).toEqual([
      { text: "This is " },
      { text: "bold", bold: true },
      { text: " text" },
    ]);
  });

  it("parses multiple styles in one string", () => {
    const result = parseInlineStyles("**Bold** and *italic*");

    expect(result).toEqual([
      { text: "Bold", bold: true },
      { text: " and " },
      { text: "italic", italic: true },
    ]);
  });

  it("handles underline and strike", () => {
    const result = parseInlineStyles("_underline_ and ~~strike~~");

    expect(result).toEqual([
      { text: "underline", underline: true },
      { text: " and " },
      { text: "strike", strike: true },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(parseInlineStyles("")).toEqual([]);
  });
});

describe("buildBlocks - basic blocks", () => {
  it("parses scene heading and action", () => {
    const input = `
INT. ROOM - DAY

John sits on the chair.
    `.trim();

    const blocks = buildBlocks(input);

    expect(blocks.length).toBe(2);

    expect(blocks[0]).toEqual({
      type: "scene",
      text: [{ text: "INT. ROOM - DAY" }],
    });

    expect(blocks[1]).toEqual({
      type: "action",
      text: [{ text: "John sits on the chair." }],
    });
  });
});

describe("buildBlocks - dialogue", () => {
  it("parses character and dialogue lines", () => {
    const input = `
JOHN
Hello there.
How are you?
    `.trim();

    const blocks = buildBlocks(input);

    expect(blocks.length).toBe(1);

    expect(blocks[0]).toEqual({
      type: "dialogue",
      character: "JOHN",
      lines: [
        [{ text: "Hello there." }],
        [{ text: "How are you?" }],
      ],
    });
  });

  it("parses dialogue with parenthetical", () => {
    const input = `
JOHN
(whispering)
Be quiet.
    `.trim();

    const blocks = buildBlocks(input);

    expect(blocks[0]).toEqual({
      type: "dialogue",
      character: "JOHN",
      parentheticals: [{ text: "whispering" }],
      lines: [[{ text: "Be quiet." }]],
    });
  });
});

describe("buildBlocks - dual dialogue", () => {
  it("parses dual dialogue correctly", () => {
    const input = `
JOHN ^
Hello.

JANE ^
Hi.
    `.trim();

    const blocks = buildBlocks(input);

    expect(blocks.length).toBe(1);

    const block = blocks[0];

    expect(block.type).toBe("dual_dialogue");

    if (block.type === "dual_dialogue") {
      expect(block.left.character).toBe("JOHN");
      expect(block.left.lines).toEqual([
        [{ text: "Hello." }]
      ]);

      expect(block.right.character).toBe("JANE");
      expect(block.right.lines).toEqual([
        [{ text: "Hi." }]
      ]);
    }
  });
});