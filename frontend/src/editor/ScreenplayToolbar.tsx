import { Editor } from "@tiptap/react";

interface Props {
  editor: Editor | null;
}

const NODE_LABELS: Record<string, string> = {
  sceneHeading: "Scene Heading",
  action: "Action",
  character: "Character",
  parenthetical: "Parenthetical",
  dialogue: "Dialogue",
  transition: "Transition",
};

const SHORTCUTS: Record<string, { enter: string; tab: string }> = {
  sceneHeading: { enter: "Enter → Action", tab: "Tab → Action" },
  action: { enter: "Enter → Action", tab: "Tab → Character" },
  character: { enter: "Enter → Dialogue", tab: "Tab → Action" },
  parenthetical: { enter: "Enter → Dialogue", tab: "Tab → Action" },
  dialogue: { enter: "Enter → Character", tab: "Tab → Action" },
  transition: { enter: "Enter → Scene Heading", tab: "Tab → Action" },
};

export default function ScreenplayToolbar({ editor }: Props) {
  if (!editor) return null;

  const activeNode = Object.keys(NODE_LABELS).find((node) =>
    editor.isActive(node)
  ) ?? "action";

  const shortcuts = SHORTCUTS[activeNode];

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Current element:</span>
        <span className="font-medium text-gray-900">{NODE_LABELS[activeNode]}</span>
      </div>
      <div className="flex items-center gap-4 text-gray-400">
        <span>{shortcuts.enter}</span>
        <span>{shortcuts.tab}</span>
      </div>
      <div className="flex items-center gap-1">
        {Object.entries(NODE_LABELS).map(([node, label]) => (
          <button
            key={node}
            onClick={() => editor.chain().focus().setNode(node).run()}
            className={`px-2 py-1 rounded text-xs font-medium ${
              activeNode === node
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}