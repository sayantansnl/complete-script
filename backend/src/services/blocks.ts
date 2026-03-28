import { Fountain }  from "fountain-js";

type InlineStyle = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
};

type DialogueBlock = {
    character: string;
    parenthetical?: InlineStyle[];
    lines: InlineStyle[][]; 
};

type Block = {
    type: "scene";
    text: InlineStyle[];
} | {
    type: "action";
    text : InlineStyle[];
} | {
    type: "transition";
    text: InlineStyle[];
} | {
    type: "dialogue";
    character: string;
    parenthetical?: InlineStyle[];
    lines: InlineStyle[][];
} | {
    type: "dual_dialogue";
    left: DialogueBlock;
    right: DialogueBlock;
};

function parseInlineStyles(text: string): InlineStyle[] {
    const patterns = [
        { regex: /\*\*(.*?)\*\*/g, style: "bold" },
        { regex: /\*(.*?)\*/g, style: "italic" },
        { regex: /_(.*?)_/g, style: "underline" },
        { regex: /~~(.*?)~~/g, style: "strike" },
    ];

    const segments: InlineStyle[] = [];
    let remaining = text;

    while (remaining.length > 0) {
        let earliestMatch: any = null;
        let earliestIndex = Infinity;
        let matchedPattern: any = null; 

        for (const pattern of patterns) {
            const match = pattern.regex.exec(remaining);
            if (match && match.index < earliestIndex) {
                earliestMatch = match;
                earliestIndex = match.index;
                matchedPattern = pattern;
            }
            pattern.regex.lastIndex = 0;
        }

        if (!earliestMatch) {
            segments.push({ text: remaining });
            break;
        }

        if (earliestIndex > 0) {
            segments.push({ text: remaining.slice(0, earliestIndex) });
        }

        segments.push({
            text: earliestMatch[1],
            [matchedPattern.style]: true
        });
    }

    return segments;
}

function extractDialogue(tokens: any[], start: number) {
    const character = tokens[start].text;

    let parenthetical: InlineStyle[] | undefined;
    const lines: InlineStyle[][] = [];

    let i = start + 1;

    while (tokens[i]) {
        const t = tokens[i];

        if (t.type === "parenthetical") {
        parenthetical = parseInlineStyles(t.text);
        } else if (t.type === "dialogue") {
        lines.push(parseInlineStyles(t.text));
        } else {
        break;
        }

        i++;
    }

    return {
        block: {
        type: "dialogue" as const,
        character,
        parenthetical,
        lines,
        },
        nextIndex: i,
    };
}

function extractDualDialogue(tokens: any[], start: number) {
    let i = start + 1;

    // LEFT
    const leftStart = i;
    while (tokens[i].type !== "dual_dialogue_right") i++;

    const left = extractDialogue(tokens, leftStart).block;

    i++; // skip right marker

    // RIGHT
    const rightStart = i;
    while (tokens[i].type !== "dual_dialogue_end") i++;

    const right = extractDialogue(tokens, rightStart).block;

    return {
        block: {
        type: "dual_dialogue" as const,
        left,
        right,
        },
        nextIndex: i + 1,
    };
}

export function buildBlocks(fountainText: string): Block[] {
    if (!fountainText) {
        return [];
    }
    let fountain = new Fountain();
    const parsed = fountain.parse(fountainText, true);
    const tokens = parsed.tokens;

    const blocks: Block[] = [];

    let i = 0;
    while (i < tokens.length) {
        const token = tokens[i];
        const tokenText = token.text;

        switch (token.type) {
            case "scene_heading":
                blocks.push({
                    type: "scene",
                    text: parseInlineStyles(token.text ?? "")
                });
                i++;
                break;
            case "action":
                blocks.push({
                    type: "action",
                    text: parseInlineStyles(token.text ?? "")
                })
                i++;
                break;
            case "transition":
                blocks.push({
                    type: "transition",
                    text: parseInlineStyles(token.text ?? "")
                })
                i++;
                break;
            case "character": {
                const { block, nextIndex } = extractDialogue(tokens, i);
                blocks.push(block);
                i = nextIndex;
                break;
            }
            case "dual_dialogue_begin": {
                const { block, nextIndex } = extractDialogue(tokens, i);
                blocks.push(block);
                i = nextIndex;
                break;
            }
            default: 
                i++;
                break;
        }
    }
    return blocks;
}