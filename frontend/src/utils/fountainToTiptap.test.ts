import { describe, it, expect } from "vitest";
import { fountainToTiptap } from "./fountainToTiptap.js";

describe("fountainToTiptap", () => {
  it("returns empty doc for empty string", () => {
    expect(fountainToTiptap("")).toEqual({ type: "doc", content: [] });
  });

  it("returns empty doc for whitespace only string", () => {
    expect(fountainToTiptap("   ")).toEqual({ type: "doc", content: [] });
  });

  it("converts a scene heading", () => {
    expect(fountainToTiptap(".INT. OFFICE - DAY")).toEqual({
      type: "doc",
      content: [{
        type: "sceneHeading",
        content: [{ type: "text", text: "INT. OFFICE - DAY" }]
      }]
    });
  });

  it("converts an action line", () => {
    expect(fountainToTiptap("John walks into the room.")).toEqual({
      type: "doc",
      content: [{
        type: "action",
        content: [{ type: "text", text: "John walks into the room." }]
      }]
    });
  });

  it("converts a transition", () => {
    expect(fountainToTiptap("> CUT TO:")).toEqual({
      type: "doc",
      content: [{
        type: "transition",
        content: [{ type: "text", text: "CUT TO:" }]
      }]
    });
  });

  it("converts a character and dialogue", () => {
    expect(fountainToTiptap("JOHN\n\nHello.")).toEqual({
      type: "doc",
      content: [
        { type: "character", content: [{ type: "text", text: "JOHN" }] },
        { type: "dialogue", content: [{ type: "text", text: "Hello." }] },
      ]
    });
  });

  it("converts a character with parenthetical and dialogue", () => {
    expect(fountainToTiptap("JOHN\n\n(beat)\n\nHello.")).toEqual({
      type: "doc",
      content: [
        { type: "character", content: [{ type: "text", text: "JOHN" }] },
        { type: "parenthetical", content: [{ type: "text", text: "(beat)" }] },
        { type: "dialogue", content: [{ type: "text", text: "Hello." }] },
      ]
    });
  });

  it("converts a full scene block", () => {
    expect(fountainToTiptap(".INT. OFFICE - DAY\n\nJohn walks in.\n\nJOHN\n\nHello.")).toEqual({
      type: "doc",
      content: [
        { type: "sceneHeading", content: [{ type: "text", text: "INT. OFFICE - DAY" }] },
        { type: "action", content: [{ type: "text", text: "John walks in." }] },
        { type: "character", content: [{ type: "text", text: "JOHN" }] },
        { type: "dialogue", content: [{ type: "text", text: "Hello." }] },
      ]
    });
  });

  it("converts dual dialogue", () => {
    expect(fountainToTiptap("JOHN\n\nHello.\n\nJANE ^\n\nHi.")).toEqual({
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
    });
  });

  it("converts dual dialogue with parentheticals", () => {
    expect(fountainToTiptap("JOHN\n\n(quietly)\n\nHello.\n\nJANE ^\n\n(beat)\n\nHi.")).toEqual({
      type: "doc",
      content: [{
        type: "dualDialogue",
        content: [
          {
            type: "dualDialogueLeft",
            content: [
              { type: "character", content: [{ type: "text", text: "JOHN" }] },
              { type: "parenthetical", content: [{ type: "text", text: "(quietly)" }] },
              { type: "dialogue", content: [{ type: "text", text: "Hello." }] },
            ]
          },
          {
            type: "dualDialogueRight",
            content: [
              { type: "character", content: [{ type: "text", text: "JANE" }] },
              { type: "parenthetical", content: [{ type: "text", text: "(beat)" }] },
              { type: "dialogue", content: [{ type: "text", text: "Hi." }] },
            ]
          }
        ]
      }]
    });
  });

  it("handles multiple scenes", () => {
    expect(fountainToTiptap(".INT. OFFICE - DAY\n\nJohn walks in.\n\n.EXT. STREET - NIGHT\n\nJane runs.")).toEqual({
      type: "doc",
      content: [
        { type: "sceneHeading", content: [{ type: "text", text: "INT. OFFICE - DAY" }] },
        { type: "action", content: [{ type: "text", text: "John walks in." }] },
        { type: "sceneHeading", content: [{ type: "text", text: "EXT. STREET - NIGHT" }] },
        { type: "action", content: [{ type: "text", text: "Jane runs." }] },
      ]
    });
  });
});