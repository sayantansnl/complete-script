import { Fountain } from "fountain-js";
// -----------------------------------------------------------------------------
// Inline style parser (supports bold, italic, underline, strike)
// -----------------------------------------------------------------------------
export function parseInlineStyles(text) {
    if (!text)
        return [];
    // Patterns: **bold**, *italic*, _underline_, ~~strikethrough~~
    // Note: Order matters – longer patterns first to avoid overlap issues.
    const patterns = [
        { regex: /\*\*(.*?)\*\*/g, style: "bold" },
        { regex: /\*(.*?)\*/g, style: "italic" },
        { regex: /_(.*?)_/g, style: "underline" },
        { regex: /~~(.*?)~~/g, style: "strike" },
    ];
    const segments = [];
    let remaining = text;
    while (remaining.length > 0) {
        let earliestMatch = null;
        let earliestIndex = Infinity;
        let matchedStyle = null;
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
export function extractDialogue(tokens, startIdx) {
    const firstToken = tokens[startIdx];
    if (!firstToken || firstToken.type !== "character") {
        throw new Error(`extractDialogue: expected 'character' token at index ${startIdx}`);
    }
    const character = firstToken.text;
    const parentheticals = [];
    const lines = [];
    let i = startIdx + 1;
    while (i < tokens.length) {
        const token = tokens[i];
        if (token.type === "parenthetical") {
            const cleaned = token.text.replace(/^\(|\)$/g, "");
            parentheticals.push(...parseInlineStyles(cleaned));
            i++;
        }
        else if (token.type === "dialogue") {
            const dialogueLines = token.text.split("\n").filter((l) => l.trim() !== "");
            for (const line of dialogueLines) {
                lines.push(parseInlineStyles(line));
            }
            i++;
        }
        else {
            // Stop when we encounter any other token type
            break;
        }
    }
    const block = {
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
export function parseDialogueSide(tokens, startIdx) {
    const firstToken = tokens[startIdx];
    if (!firstToken || firstToken.type !== "character") {
        throw new Error(`parseDialogueSide: expected 'character' at index ${startIdx}`);
    }
    const character = firstToken.text;
    const parentheticals = [];
    const lines = [];
    let i = startIdx + 1;
    while (i < tokens.length) {
        const token = tokens[i];
        if (token.type === "parenthetical") {
            parentheticals.push(...parseInlineStyles(token.text));
            i++;
        }
        else if (token.type === "dialogue") {
            lines.push(parseInlineStyles(token.text));
            i++;
        }
        else {
            // Stop at any other token (including 'dual_dialogue_right' or 'dual_dialogue_end')
            break;
        }
    }
    const side = { character, lines };
    if (parentheticals.length)
        side.parentheticals = parentheticals;
    return { side, endIdx: i };
}
export function extractDualDialogue(tokens, startIdx) {
    let i = startIdx + 1; // skip first 'dual_dialogue_begin'
    // Skip 'dialogue_begin' for left side
    if (tokens[i]?.type === "dialogue_begin")
        i++;
    const leftResult = parseDialogueSide(tokens, i);
    i = leftResult.endIdx;
    // Skip 'dialogue_end' for left side
    if (tokens[i]?.type === "dialogue_end")
        i++;
    // Skip second 'dual_dialogue_begin'
    if (tokens[i]?.type === "dual_dialogue_begin")
        i++;
    // Skip 'dialogue_begin' for right side
    if (tokens[i]?.type === "dialogue_begin")
        i++;
    const rightResult = parseDialogueSide(tokens, i);
    i = rightResult.endIdx;
    // Skip 'dialogue_end' for right side
    if (tokens[i]?.type === "dialogue_end")
        i++;
    // Skip 'dual_dialogue_end'
    if (tokens[i]?.type === "dual_dialogue_end")
        i++;
    // Skip trailing 'dialogue_begin'
    if (tokens[i]?.type === "dialogue_begin")
        i++;
    // Parse SARAH's side
    // Wait -- SARAH is a separate speaker outside the dual dialogue block
    // so we stop here and let buildBlocks handle her as a regular dialogue
    const block = {
        type: "dual_dialogue",
        left: leftResult.side,
        right: rightResult.side,
    };
    return { block, nextIndex: i };
}
// -----------------------------------------------------------------------------
// Main block builder
// -----------------------------------------------------------------------------
export function buildBlocks(fountainText) {
    if (!fountainText)
        return [];
    const fountain = new Fountain();
    let parsed;
    try {
        parsed = fountain.parse(fountainText, true);
    }
    catch (err) {
        console.error("Fountain parse error:", err);
        return [];
    }
    const tokens = parsed.tokens;
    const blocks = [];
    let i = 0;
    while (i < tokens.length) {
        const token = tokens[i];
        if (!token) {
            i++;
            continue;
        }
        switch (token.type) {
            case "scene_heading":
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
