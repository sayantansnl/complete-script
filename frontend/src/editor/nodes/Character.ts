import { Node } from "@tiptap/core";

export const Character = Node.create({
  name: "character",
  group: "block",
  content: "inline*",

  parseHTML() {
    return [{ tag: "p[data-type='character']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, "data-type": "character" }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.setNode("dialogue"),
      Tab: () => this.editor.commands.setNode("parenthetical"),
    };
  },
});