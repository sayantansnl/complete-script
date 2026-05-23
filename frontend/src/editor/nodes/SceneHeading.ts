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
      Enter: ({ editor }) => {
        const node = editor.state.selection.$head.parent;
        if (node.type.name !== "sceneHeading") return false;
        if (node.textContent === "") return false;

        const endOfNode = editor.state.selection.$to.end();
        return editor
          .chain()
          .insertContentAt(endOfNode + 1, { type: "action", content: [] })
          .focus(endOfNode + 2)
          .run();
      },
      Tab: ({ editor }) => {
        const node = editor.state.selection.$head.parent;
        if (node.type.name !== "sceneHeading") return false;
        if (node.textContent === "") return false;
        
        const endOfNode = editor.state.selection.$to.end();
        return editor
          .chain()
          .insertContentAt(endOfNode + 1, { type: "action", content: [] })
          .focus(endOfNode + 2)
          .run();
      },
    };
  },
});