import { type JSONContent } from "@tiptap/react";

function getNodeText(node: JSONContent): string {
  return node.content?.map((n) => n.text ?? "").join("") ?? "";
}

function formatNode(node: JSONContent): string {
  const text = getNodeText(node);

  switch (node.type) {
    case "sceneHeading":
      return `.${text.toUpperCase()}`;
    case "action":
      return text;
    case "character":
      return text.toUpperCase();
    case "parenthetical":
      return text.startsWith("(") ? text : `(${text})`;
    case "dialogue":
      return text;
    case "transition": {
      const t = text.toUpperCase();
      return t.endsWith(":") ? t : `${t}:`;
    }
    case "dualDialogue": {
      const [left, right] = node.content ?? [];

      const leftLines = left?.content?.map((n) => {
        const t = getNodeText(n);
        switch (n.type) {
          case "character":
            return t.toUpperCase();
          case "parenthetical":
            return t.startsWith("(") ? t : `(${t})`;
          case "dialogue":
            return t;
          default:
            return t;
        }
      }) ?? [];

      const rightLines = right?.content?.map((n) => {
        const t = getNodeText(n);
        switch (n.type) {
          case "character":
            return `${t.toUpperCase()} ^`;
          case "parenthetical":
            return t.startsWith("(") ? t : `(${t})`;
          case "dialogue":
            return t;
          default:
            return t;
        }
      }) ?? [];

      return [...leftLines, ...rightLines].join("\n");
    }
    default:
      return text;
  }
}

function isDialoguePart(type?: string): boolean {
  return type === "character" || type === "parenthetical" || type === "dialogue";
}

export function tiptapToFountain(doc: JSONContent): string {
  if (!doc.content || doc.content.length === 0) {
    return "";
  }

  const chunks: string[] = [];
  let i = 0;

  while (i < doc.content.length) {
    const node = doc.content[i];

    if (node.type === "character") {
      const group: string[] = [formatNode(node)];
      i++;

      while (i < doc.content.length && isDialoguePart(doc.content[i].type)) {
        group.push(formatNode(doc.content[i]));
        i++;
      }

      chunks.push(group.join("\n"));
      continue;
    }

    chunks.push(formatNode(node));
    i++;
  }

  return chunks.join("\n\n");
}