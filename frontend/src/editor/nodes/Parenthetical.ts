import { Node } from "@tiptap/react";

export const Parenthetical = Node.create({
  name: "parenthetical",
  group: "block",
  content: "inline*",

  parseHTML() {
    return [{ tag: "p[data-type='parenthetical']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, "data-type": "parenthetical" }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.setNode("dialogue"),
      Tab: () => this.editor.commands.setNode("dialogue"),
    };
  },
});