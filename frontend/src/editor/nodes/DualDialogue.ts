import { Node } from "@tiptap/react";

export const DualDialogueLeft = Node.create({
  name: "dualDialogueLeft",
  group: "dualDialogueContent",
  content: "(character | parenthetical | dialogue)+",

  parseHTML() {
    return [{ tag: "div[data-type='dual-dialogue-left']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-type": "dual-dialogue-left" }, 0];
  },
});

export const DualDialogueRight = Node.create({
  name: "dualDialogueRight",
  group: "dualDialogueContent",
  content: "(character | parenthetical | dialogue)+",

  parseHTML() {
    return [{ tag: "div[data-type='dual-dialogue-right']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-type": "dual-dialogue-right" }, 0];
  },
});

export const DualDialogue = Node.create({
  name: "dualDialogue",
  group: "block",
  content: "dualDialogueLeft dualDialogueRight",

  parseHTML() {
    return [{ tag: "div[data-type='dual-dialogue']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-type": "dual-dialogue" }, 0];
  },
});