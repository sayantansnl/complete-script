import { type JSONContent } from "@tiptap/react";

export function tiptapToFountain(doc: JSONContent): string {
  if (!doc.content) {
    return "";
  }

  const lines = doc.content.map((node) => {
    const text = node.content?.map(n => n.text ?? "").join("") ?? "";

    switch (node.type) {
      case "sceneHeading":
        return `.${text}`;
      case "action":
        return text;
      case "character":
        return `@${text}`;
      case "parenthetical":
        return text.startsWith("(") ? text : `(${text})`;
      case "dialogue":
        return text;
      case "dualDialogue": {
        const [left, right] = node.content ?? [];

        const leftLines = left?.content?.map((n) => {
          const t = n.content?.map((c) => c.text ?? "").join("") ?? "";
          switch (n.type) {
            case "character": return `@${t}`;
            case "parenthetical": return t.startsWith("(") ? t : `(${t})`;
            case "dialogue": return t;
            default: return t;
          }
        }) ?? [];

        const rightLines = right?.content?.map((n) => {
          const t = n.content?.map((c) => c.text ?? "").join("") ?? "";
          switch (n.type) {
            case "character": return `@${t} ^`;
            case "parenthetical": return t.startsWith("(") ? t : `(${t})`;
            case "dialogue": return t;
            default: return t;
          }
        }) ?? [];

        return [...leftLines, ...rightLines].join("\n\n");
      }
      case "transition":
        return `> ${text}`;
      default:
        return text;
    }
  });

  return lines.join("\n\n");
}