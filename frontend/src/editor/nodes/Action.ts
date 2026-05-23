import { Node } from "@tiptap/react";

export const Action = Node.create({
  name: "action",
  group: "block",
  content: "inline*",

  parseHTML() {
    return [{ tag: "p[data-type='action']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, "data-type": "action" }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () =>
        this.editor
          .chain()
          .createParagraphNear()
          .setNode("action")
          .run(),
      Tab: () => this.editor.commands.setNode("sceneHeading"),
    };
  },
});