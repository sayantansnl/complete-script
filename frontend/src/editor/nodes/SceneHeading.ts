import { Node } from "@tiptap/react";

export const SceneHeading = Node.create({
  name: "sceneHeading",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {};
  },

  parseHTML() {
    return [{ tag: "p[data-type='scene-heading']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, "data-type": "scene-heading" }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.setNode("action"),
      Tab: () => this.editor.commands.setNode("character"),
    };
  },
});