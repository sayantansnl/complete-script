import { describe, it, expect } from "vitest";
import { tiptapToFountain } from "./tiptapToFountain.js";

describe("tiptapToFountain", () => {
  it("returns empty string for empty document", () => {
    expect(tiptapToFountain({ type: "doc", content: [] })).toBe("");
  });

  it("converts a scene heading", () => {
    expect(tiptapToFountain({
      type: "doc",
      content: [{
        type: "sceneHeading",
        content: [{ type: "text", text: "INT. OFFICE - DAY" }]
      }]
    })).toBe(".INT. OFFICE - DAY");
  });

  it("converts an action line", () => {
    expect(tiptapToFountain({
      type: "doc",
      content: [{
        type: "action",
        content: [{ type: "text", text: "John walks into the room." }]
      }]
    })).toBe("John walks into the room.");
  });

  it("converts a character", () => {
    expect(tiptapToFountain({
      type: "doc",
      content: [{
        type: "character",
        content: [{ type: "text", text: "JOHN" }]
      }]
    })).toBe("@JOHN");
  });

  it("converts a parenthetical without parens", () => {
    expect(tiptapToFountain({
      type: "doc",
      content: [{
        type: "parenthetical",
        content: [{ type: "text", text: "beat" }]
      }]
    })).toBe("(beat)");
  });

  it("converts a parenthetical that already has parens", () => {
    expect(tiptapToFountain({
      type: "doc",
      content: [{
        type: "parenthetical",
        content: [{ type: "text", text: "(beat)" }]
      }]
    })).toBe("(beat)");
  });

  it("converts a dialogue line", () => {
    expect(tiptapToFountain({
      type: "doc",
      content: [{
        type: "dialogue",
        content: [{ type: "text", text: "I never asked for this." }]
      }]
    })).toBe("I never asked for this.");
  });

  it("converts a transition", () => {
    expect(tiptapToFountain({
      type: "doc",
      content: [{
        type: "transition",
        content: [{ type: "text", text: "CUT TO:" }]
      }]
    })).toBe("> CUT TO:");
  });

  it("converts a full scene block", () => {
    expect(tiptapToFountain({
      type: "doc",
      content: [
        { type: "sceneHeading", content: [{ type: "text", text: "INT. OFFICE - DAY" }] },
        { type: "action", content: [{ type: "text", text: "John walks in." }] },
        { type: "character", content: [{ type: "text", text: "JOHN" }] },
        { type: "dialogue", content: [{ type: "text", text: "Hello." }] },
      ]
    })).toBe(".INT. OFFICE - DAY\n\nJohn walks in.\n\n@JOHN\n\nHello.");
  });

  it("converts dual dialogue", () => {
    expect(tiptapToFountain({
      type: "doc",
      content: [{
        type: "dualDialogue",
        content: [
          {
            type: "dualDialogueLeft",
            content: [
              { type: "character", content: [{ type: "text", text: "JOHN" }] },
              { type: "dialogue", content: [{ type: "text", text: "Hello." }] },
            ]
          },
          {
            type: "dualDialogueRight",
            content: [
              { type: "character", content: [{ type: "text", text: "JANE" }] },
              { type: "dialogue", content: [{ type: "text", text: "Hi." }] },
            ]
          }
        ]
      }]
    })).toBe("@JOHN\n\nHello.\n\n@JANE ^\n\nHi.");
  });

  it("handles a node with no content gracefully", () => {
    expect(tiptapToFountain({
      type: "doc",
      content: [{
        type: "action",
        content: []
      }]
    })).toBe("");
  });
});