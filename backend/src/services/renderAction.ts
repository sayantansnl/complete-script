import { Block } from "./blocks.js";
import { PDFDoc, PDFOptions } from "./pdfOptions.js";
import { renderInlineStyles } from "./renderInlineStyles.js";

export function renderAction(doc: PDFDoc, actionBlock: Block, options: PDFOptions): void {
    if (actionBlock.type !== "action") {
        throw new Error("only action lines");
    }
    const lineHeight = options.fontPreference.size;
    const LEFT_MARGIN = 108;
    const ACTION_WIDTH = 432;

    doc.y += lineHeight; // one blank line before

    renderInlineStyles(doc, actionBlock.text, LEFT_MARGIN, doc.y, ACTION_WIDTH, lineHeight, options);

    doc.y += lineHeight; // one blank line after
}