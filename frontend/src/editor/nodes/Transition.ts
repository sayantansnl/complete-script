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
      Enter: ({ editor }) => {
        const node = editor.state.selection.$head.parent;
        if (node.type.name !== "transition") return false;
        if (node.textContent === "") return false;

        const endOfNode = editor.state.selection.$to.end();
        return editor
          .chain()
          .insertContentAt(endOfNode + 1, { type: "sceneHeading", content: [] })
          .focus(endOfNode + 2)
          .run();
      },
      Tab: ({ editor }) => {
        const node = editor.state.selection.$head.parent;
        if (node.type.name !== "transition") return false;
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