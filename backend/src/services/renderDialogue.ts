import { Block } from "./blocks.js";
import { PDFDoc, PDFOptions } from "./pdfOptions.js";
import { renderInlineStyles } from "./renderInlineStyles.js";

export function renderDialogue(doc: PDFDoc, dialogueBlock: Block, options: PDFOptions): void {
  if (dialogueBlock.type !== "dialogue") {
    throw new Error("only dialogue lines");
  }
  const lineHeight = options.fontPreference.size;
  const CHARACTER_X = 266;
  const PARENTHETICAL_X = 223;
  const PARENTHETICAL_WIDTH = 144;
  const DIALOGUE_X = 180;
  const DIALOGUE_WIDTH = 252;

  //one blank line before dialogue block
  doc.y += lineHeight;

  doc.font(options.fontPreference.family).fontSize(lineHeight);
  doc.text(dialogueBlock.character, CHARACTER_X, doc.y, {
    width: DIALOGUE_WIDTH,
    align: "left",
  });

  //for parentheticals if present
  if (dialogueBlock.parentheticals && dialogueBlock.parentheticals.length > 0) {
    const parentheticalText = `(${dialogueBlock.parentheticals.map(s => s.text).join("")})`;
    doc.font(options.fontPreference.family).fontSize(lineHeight);
    doc.text(parentheticalText, PARENTHETICAL_X, doc.y, {
      width: PARENTHETICAL_WIDTH,
      align: "left",
    });
  }

  //Dialogue lines

  for (const line of dialogueBlock.lines) {
    renderInlineStyles(doc, line, DIALOGUE_X, doc.y, DIALOGUE_WIDTH, lineHeight);
  }

  //one blank line after 
  doc.y += lineHeight
}