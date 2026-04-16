import { describe, it, expect } from "vitest";
import { parseInlineStyles, buildBlocks } from "./blocks.js";

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
INT. ROOM - DAY

JOHN
Hello there.
How are you?
    `.trim();

    const blocks = buildBlocks(input);

    expect(blocks.length).toBe(2);

    expect(blocks[1]).toEqual({
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
INT. COFFEE SHOP - DAY

JOHN
Has it really been that long?

JOHN^
I can't believe it.

SARAH^
Neither can I.
  `.trim();

  const blocks = buildBlocks(input);

  const dualBlock = blocks.find(b => b.type === "dual_dialogue");

  expect(dualBlock).toBeDefined();

  if (dualBlock?.type === "dual_dialogue") {
    expect(dualBlock.left.character).toBe("JOHN");
    expect(dualBlock.left.lines).toEqual([
      [{ text: "Has it really been that long?" }]
    ]);

    expect(dualBlock.right.character).toBe("JOHN");
    expect(dualBlock.right.lines).toEqual([
      [{ text: "I can't believe it." }]
    ]);
  }
});
});

describe("buildBlocks - transitions", () => {
  it("parses transition correctly", () => {
    const input = `
INT. ROOM - DAY

John sits.

> FADE OUT:
    `;
    const blocks = buildBlocks(input);
    expect(blocks[2]).toEqual({
      type: "transition",
      text: [{ text: "FADE OUT:" }]
    })
  });
});

describe("buildBlocks - empty input", () => {
  it("returns an empty array for an empty input", () => {
    expect(buildBlocks("")).toEqual([]);
  });
});