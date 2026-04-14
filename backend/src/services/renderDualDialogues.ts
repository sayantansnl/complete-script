import { Block, DialogueBlock } from "./blocks.js";
import { PDFDoc, PDFOptions } from "./pdfOptions.js";
import { renderInlineStyles } from "./renderInlineStyles.js";

function renderDualDialogueSide(
  doc: PDFDoc,
  side: DialogueBlock,
  characterX: number,
  dialogueX: number,
  parentheticalX: number,
  columnWidth: number,
  startY: number,
  options: PDFOptions
): number {
  const lineHeight = options.fontPreference.size;
  let y = startY;

  // Character name
  doc.font(options.fontPreference.family).fontSize(lineHeight);
  doc.text(side.character, characterX, y, {
    width: columnWidth,
    align: "left",
  });
  y = doc.y;

  // Parentheticals
  if (side.parentheticals && side.parentheticals.length > 0) {
    const parentheticalText =
      "(" + side.parentheticals.map(s => s.text).join("") + ")";
    doc.font("Courier").fontSize(lineHeight);
    doc.text(parentheticalText, parentheticalX, y, {
      width: columnWidth,
      align: "left",
    });
    y = doc.y;
  }

  // Dialogue lines
  for (const line of side.lines) {
    renderInlineStyles(doc, line, dialogueX, y, columnWidth, lineHeight, options);
    y = doc.y;
  }

  return y; // return the final Y position of this side
}

export function renderDualDialogue(doc: PDFDoc, dualDialogueBlock: Block, options: PDFOptions): void {
  if (dualDialogueBlock.type !== "dual_dialogue") {
    throw new Error("dual dialogues only");
  }
  const lineHeight = options.fontPreference.size;

  // One blank line before
  doc.y += lineHeight;

  const startY = doc.y;

  // Render left side
  const leftEndY = renderDualDialogueSide(
    doc,
    dualDialogueBlock.left,
    108,  // characterX
    108,  // dialogueX
    144,  // parentheticalX
    216,  // columnWidth
    startY,
    options
  );

  // Reset Y to start of dual dialogue block
  doc.y = startY;

  // Render right side
  const rightEndY = renderDualDialogueSide(
    doc,
    dualDialogueBlock.right,
    342,  // characterX
    342,  // dialogueX
    378,  // parentheticalX
    216,  // columnWidth
    startY,
    options
  );

  // Advance Y past whichever column was taller
  doc.y = Math.max(leftEndY, rightEndY);
}