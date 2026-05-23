import { Node } from "@tiptap/react";

export const Dialogue = Node.create({
  name: "dialogue",
  group: "block",
  content: "inline*",

  parseHTML() {
    return [{ tag: "p[data-type='dialogue']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, "data-type": "dialogue" }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () =>
        this.editor
          .chain()
          .createParagraphNear()
          .setNode("action")
          .run(),
      Tab: () => this.editor.commands.setNode("character"),
    };
  },
});