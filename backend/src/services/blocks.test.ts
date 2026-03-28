import { describe, it, expect } from "vitest";
import { buildBlocks } from "./blocks";

describe("buildBlocks", () => {

  it("should parse scene heading and action", () => {
    const input = `
INT. OFFICE - DAY

John sits at his desk.
    `;

    const blocks = buildBlocks(input);

    expect(blocks.length).toBe(2);

    expect(blocks[0]).toMatchObject({
      type: "scene",
    });

    expect(blocks[1]).toMatchObject({
      type: "action",
    });

    expect(blocks[1].text[0].text).toContain("John sits");
  });

  it("should parse a dialogue block correctly", () => {
    const input = `
JOHN
I can't do this anymore.
    `;

    const blocks = buildBlocks(input);

    expect(blocks.length).toBe(1);

    const dialogue = blocks[0];

    expect(dialogue.type).toBe("dialogue");
    expect(dialogue.character).toBe("JOHN");
    expect(dialogue.lines.length).toBe(1);
    expect(dialogue.lines[0][0].text).toContain("can't do this");
  });

  it("should handle parenthetical in dialogue", () => {
    const input = `
MARY
(whispering)
You have to.
    `;

    const blocks = buildBlocks(input);

    const dialogue = blocks[0];

    expect(dialogue.type).toBe("dialogue");
    expect(dialogue.parenthetical?.[0].text).toContain("whispering");
    expect(dialogue.lines[0][0].text).toContain("You have to");
  });

  it("should parse transitions correctly", () => {
    const input = `
CUT TO:
    `;

    const blocks = buildBlocks(input);

    expect(blocks.length).toBe(1);
    expect(blocks[0].type).toBe("transition");
  });

  it("should parse inline styles (bold + italic)", () => {
    const input = `
INT. ROOM - NIGHT

He is **angry** but trying to stay *calm*.
    `;

    const blocks = buildBlocks(input);

    const action = blocks[1];

    expect(action.type).toBe("action");

    const segments = action.text;

    const hasBold = segments.some(s => s.bold);
    const hasItalic = segments.some(s => s.italic);

    expect(hasBold).toBe(true);
    expect(hasItalic).toBe(true);
  });

  it("should parse dual dialogue", () => {
    const input = `
JOHN ^
Hello.

MARY ^
Hi.
    `;

    const blocks = buildBlocks(input);

    expect(blocks.length).toBe(1);

    const dual = blocks[0];

    expect(dual.type).toBe("dual_dialogue");

    expect(dual.left.character).toBe("JOHN");
    expect(dual.right.character).toBe("MARY");

    expect(dual.left.lines[0][0].text).toContain("Hello");
    expect(dual.right.lines[0][0].text).toContain("Hi");
  });

});