import { type JSONContent } from "@tiptap/react";

function makeNode(type: string, text: string): JSONContent {
  return {
    type,
    content: [{ type: "text", text }],
  };
}

export function fountainToTiptap(fountain: string): JSONContent {
  if (!fountain.trim()) {
    return { type: "doc", content: [] };
  }

  const blocks = fountain.split(/\n\n+/);
  const nodes: JSONContent[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i].trim();

    // Scene heading
    if (block.startsWith(".")) {
      nodes.push(makeNode("sceneHeading", block.slice(1).trim()));
      i++;
      continue;
    }

    // Transition
    if (block.startsWith(">")) {
      nodes.push(makeNode("transition", block.slice(1).trim()));
      i++;
      continue;
    }

    // Character (with optional dual dialogue marker)
    if (block.startsWith("@")) {
      const characterText = block
        .slice(1)
        .replace(/\s*\^$/, "")
        .trim();

      // Look ahead to build a dialogue block
      const dialogueNodes: JSONContent[] = [
        makeNode("character", characterText),
      ];

      i++;
      while (i < blocks.length) {
        const next = blocks[i].trim();
        if (next.startsWith("(") && next.endsWith(")")) {
          dialogueNodes.push(makeNode("parenthetical", next));
          i++;
        } else if (
          !next.startsWith("@") &&
          !next.startsWith(".") &&
          !next.startsWith(">")
        ) {
          dialogueNodes.push(makeNode("dialogue", next));
          i++;
        } else {
          break;
        }
      }

      // Check if next character is dual dialogue
      if (i < blocks.length && blocks[i].trim().startsWith("@") && blocks[i].trim().endsWith("^")) {
        const rightCharacterText = blocks[i].trim().slice(1).replace(/\s*\^$/, "").trim();
        const rightDialogueNodes: JSONContent[] = [
          makeNode("character", rightCharacterText),
        ];

        i++;
        while (i < blocks.length) {
          const next = blocks[i].trim();
          if (next.startsWith("(") && next.endsWith(")")) {
            rightDialogueNodes.push(makeNode("parenthetical", next));
            i++;
          } else if (
            !next.startsWith("@") &&
            !next.startsWith(".") &&
            !next.startsWith(">")
          ) {
            rightDialogueNodes.push(makeNode("dialogue", next));
            i++;
          } else {
            break;
          }
        }

        nodes.push({
          type: "dualDialogue",
          content: [
            { type: "dualDialogueLeft", content: dialogueNodes },
            { type: "dualDialogueRight", content: rightDialogueNodes },
          ],
        });
      } else {
        nodes.push(...dialogueNodes);
      }

      continue;
    }

    // Parenthetical (standalone, outside dialogue)
    if (block.startsWith("(") && block.endsWith(")")) {
      nodes.push(makeNode("parenthetical", block));
      i++;
      continue;
    }

    // Action (default)
    nodes.push(makeNode("action", block));
    i++;
  }

  return { type: "doc", content: nodes };
}