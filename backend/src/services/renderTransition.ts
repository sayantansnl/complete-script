import { Block } from "./blocks.js";
import { PDFOptions } from "./pdfOptions.js";

export function renderTransition(doc: PDFKit.PDFDocument, transitionBlock: Block, options: PDFOptions): void {
  if (transitionBlock.type !== "transition") {
    throw new Error("transitions only");
  }
  const lineHeight = options.fontPreference.size;
  const LEFT_MARGIN = 108;
  const ACTION_WIDTH = 432;

  doc.font(options.fontPreference.family).fontSize(lineHeight);
  doc.text(
    transitionBlock.text.map(s => s.text).join(""),
    LEFT_MARGIN,
    doc.y, 
    {
      width: ACTION_WIDTH,
      align: "right"
    }
  );

  //one blank line after
  doc.y += lineHeight;
}