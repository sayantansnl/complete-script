import { Fountain } from "fountain-js";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type InlineStyle = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
};

type DialogueBlock = {
  character: string;
  parentheticals?: InlineStyle[];   // array of parentheticals (may appear between lines)
  lines: InlineStyle[][];           // each line is an array of styled segments
};

type Block =
  | { type: "scene"; text: InlineStyle[] }
  | { type: "action"; text: InlineStyle[] }
  | { type: "transition"; text: InlineStyle[] }
  | { type: "dialogue"; character: string; parentheticals?: InlineStyle[]; lines: InlineStyle[][] }
  | { type: "dual_dialogue"; left: DialogueBlock; right: DialogueBlock };

// -----------------------------------------------------------------------------
// Inline style parser (supports bold, italic, underline, strike)
// -----------------------------------------------------------------------------

export function parseInlineStyles(text: string): InlineStyle[] {
  if (!text) return [];

  // Patterns: **bold**, *italic*, _underline_, ~~strikethrough~~
  // Note: Order matters – longer patterns first to avoid overlap issues.
  const patterns: { regex: RegExp; style: keyof Omit<InlineStyle, "text"> }[] = [
    { regex: /\*\*(.*?)\*\*/g, style: "bold" },
    { regex: /\*(.*?)\*/g, style: "italic" },
    { regex: /_(.*?)_/g, style: "underline" },
    { regex: /~~(.*?)~~/g, style: "strike" },
  ];

  const segments: InlineStyle[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliestMatch: RegExpExecArray | null = null;
    let earliestIndex = Infinity;
    let matchedStyle: keyof Omit<InlineStyle, "text"> | null = null;

    // Find the earliest pattern match in the remaining string
    for (const { regex, style } of patterns) {
      regex.lastIndex = 0; // reset each time
      const match = regex.exec(remaining);
      if (match && match.index < earliestIndex) {
        earliestMatch = match;
        earliestIndex = match.index;
        matchedStyle = style;
      }
    }

    if (!earliestMatch || matchedStyle === null) {
      // No more markers → push the rest as plain text
      if (remaining.length > 0) {
        segments.push({ text: remaining });
      }
      break;
    }

    // Add plain text before the match
    if (earliestIndex > 0) {
      segments.push({ text: remaining.slice(0, earliestIndex) });
    }

    // Add the styled segment
    segments.push({
      text: earliestMatch[1],
      [matchedStyle]: true,
    });

    // Move remaining past the matched part
    remaining = remaining.slice(earliestIndex + earliestMatch[0].length);
  }

  return segments;
}

// -----------------------------------------------------------------------------
// Extract a normal dialogue block (character + optional parentheticals + lines)
// -----------------------------------------------------------------------------

export function extractDialogue(tokens: any[], startIdx: number): { block: Block; nextIndex: number } {
  const firstToken = tokens[startIdx];
  if (!firstToken || firstToken.type !== "character") {
    throw new Error(`extractDialogue: expected 'character' token at index ${startIdx}`);
  }

  const character = firstToken.text;
  const parentheticals: InlineStyle[] = [];
  const lines: InlineStyle[][] = [];

  let i = startIdx + 1;

  while (i < tokens.length) {
    const token = tokens[i];
    if (token.type === "parenthetical") {
      parentheticals.push(...parseInlineStyles(token.text));
      i++;
    } else if (token.type === "dialogue") {
      lines.push(parseInlineStyles(token.text));
      i++;
    } else {
      // Stop when we encounter any other token type
      break;
    }
  }

  const block: Block = {
    type: "dialogue",
    character,
    lines,
  };
  if (parentheticals.length > 0) {
    block.parentheticals = parentheticals;
  }

  return { block, nextIndex: i };
}

// -----------------------------------------------------------------------------
// Extract a dual-dialogue block
// -----------------------------------------------------------------------------

export function parseDialogueSide(tokens: any[], startIdx: number): { side: DialogueBlock; endIdx: number } {
  const firstToken = tokens[startIdx];
  if (!firstToken || firstToken.type !== "character") {
    throw new Error(`parseDialogueSide: expected 'character' at index ${startIdx}`);
  }
  const character = firstToken.text;
  const parentheticals: InlineStyle[] = [];
  const lines: InlineStyle[][] = [];

  let i = startIdx + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token.type === "parenthetical") {
      parentheticals.push(...parseInlineStyles(token.text));
      i++;
    } else if (token.type === "dialogue") {
      lines.push(parseInlineStyles(token.text));
      i++;
    } else {
      // Stop at any other token (including 'dual_dialogue_right' or 'dual_dialogue_end')
      break;
    }
  }

  const side: DialogueBlock = { character, lines };
  if (parentheticals.length) side.parentheticals = parentheticals;
  return { side, endIdx: i };
}

export function extractDualDialogue(tokens: any[], startIdx: number): { block: Block; nextIndex: number } {
  // Expect tokens: dual_dialogue_begin, (left character, parentheticals, dialogues...), dual_dialogue_right,
  // (right character, parentheticals, dialogues...), dual_dialogue_end
  let i = startIdx + 1; // skip 'dual_dialogue_begin'

  // Parse left side
  const leftResult = parseDialogueSide(tokens, i);
  i = leftResult.endIdx;

  // Expect 'dual_dialogue_right'
  if (i >= tokens.length || tokens[i].type !== "dual_dialogue_right") {
    throw new Error("Malformed dual dialogue: missing 'dual_dialogue_right'");
  }
  i++; // skip right marker

  // Parse right side
  const rightResult = parseDialogueSide(tokens, i);
  i = rightResult.endIdx;

  // Expect 'dual_dialogue_end'
  if (i >= tokens.length || tokens[i].type !== "dual_dialogue_end") {
    throw new Error("Malformed dual dialogue: missing 'dual_dialogue_end'");
  }
  i++; // skip end marker

  const block: Block = {
    type: "dual_dialogue",
    left: leftResult.side,
    right: rightResult.side,
  };

  return { block, nextIndex: i };
}

// -----------------------------------------------------------------------------
// Main block builder
// -----------------------------------------------------------------------------

export function buildBlocks(fountainText: string): Block[] {
  if (!fountainText) return [];

  const fountain = new Fountain();
  let parsed;
  try {
    parsed = fountain.parse(fountainText, true);
  } catch (err) {
    console.error("Fountain parse error:", err);
    return [];
  }

  const tokens = parsed.tokens;
  const blocks: Block[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      i++;
      continue;
    }

    switch (token.type) {
      case "scene heading":
        blocks.push({
          type: "scene",
          text: parseInlineStyles(token.text ?? ""),
        });
        i++;
        break;

      case "action":
        blocks.push({
          type: "action",
          text: parseInlineStyles(token.text ?? ""),
        });
        i++;
        break;

      case "transition":
        blocks.push({
          type: "transition",
          text: parseInlineStyles(token.text ?? ""),
        });
        i++;
        break;

      case "character": {
        const { block, nextIndex } = extractDialogue(tokens, i);
        blocks.push(block);
        i = nextIndex;
        break;
      }

      case "dual_dialogue_begin": {
        const { block, nextIndex } = extractDualDialogue(tokens, i);
        blocks.push(block);
        i = nextIndex;
        break;
      }

      default:
        // Ignore other token types (e.g., 'section', 'synopsis', 'note', etc.)
        i++;
        break;
    }
  }

  return blocks;
}