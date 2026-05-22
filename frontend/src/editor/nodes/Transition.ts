import { Node } from "@tiptap/react";

export const Transition = Node.create({
  name: "transition",
  group: "block",
  content: "inline*",

  parseHTML() {
    return [{ tag: "p[data-type='transition']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, "data-type": "transition" }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.setNode("sceneHeading"),
      Tab: () => this.editor.commands.setNode("action"),
    };
  },
});