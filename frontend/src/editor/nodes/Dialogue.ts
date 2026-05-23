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
      Enter: ({ editor }) => {
        const node = editor.state.selection.$head.parent;
        if (node.type.name !== "dialogue") return false;
        if (node.textContent === "") return false;

        const endOfNode = editor.state.selection.$to.end();
        return editor
          .chain()
          .insertContentAt(endOfNode + 1, { type: "character", content: [] })
          .focus(endOfNode + 2)
          .run();
      },
      Tab: ({ editor }) => {
        const node = editor.state.selection.$head.parent;
        if (node.type.name !== "dialogue") return false;
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