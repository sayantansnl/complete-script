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
      Enter: ({ editor }) => {
        const node = editor.state.selection.$head.parent;
        if (node.type.name !== "parenthetical") return false;
        if (node.textContent === "") return false;

        const endOfNode = editor.state.selection.$to.end();
        return editor
          .chain()
          .insertContentAt(endOfNode + 1, { type: "dialogue", content: [] })
          .focus(endOfNode + 2)
          .run();
      },
      Tab: ({ editor }) => {
        const node = editor.state.selection.$head.parent;
        if (node.type.name !== "parenthetical") return false;
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