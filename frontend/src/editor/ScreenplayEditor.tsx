import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { 
  SceneHeading, 
  Action, 
  Character, 
  Parenthetical, 
  Dialogue, 
  Transition, 
  DualDialogue, 
  DualDialogueLeft, 
  DualDialogueRight 
} from "./nodes/index.js";
import { fountainToTiptap } from "../utils/fountainToTiptap.js";
import { tiptapToFountain } from "../utils/tiptapToFountain.js";
import { useSaveProject } from "../hooks/useSaveProject.js";
import ScreenplayToolbar from "./ScreenplayToolbar.js";

interface Props {
  projectId: string;
  fountainText: string | null;
}

const AUTOSAVE_DELAY = 1500;

export default function ScreenplayEditor({ projectId, fountainText }: Props) {
  const { mutate: saveProject } = useSaveProject();
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      SceneHeading,
      Action,
      Character,
      Parenthetical,
      Dialogue,
      Transition,
      DualDialogue,
      DualDialogueLeft,
      DualDialogueRight,
    ],
    content: fountainToTiptap(fountainText ?? ""),
    onUpdate({ editor }) {
      const fountain = tiptapToFountain(editor.getJSON());
      console.log(fountain);

      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }

      autosaveTimer.current = setTimeout(() => {
        saveProject({ projectId, fountainText: fountain });
      }, AUTOSAVE_DELAY);
    },
  });

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }
    };
  }, []);

  return (
    <div>
      <ScreenplayToolbar editor={editor}/>
      <div className="max-w-[210mm] mx-auto py-16 px-27 bg-white shadow min-h-screen font-courier">
        <EditorContent editor={editor} />
      </div>
    </div>
    
  );
}