import { Block } from "./blocks.js";
import { PDFOptions } from "./pdfOptions.js";

export function renderSceneHeading(doc: PDFKit.PDFDocument, sceneBlock: Block, options: PDFOptions): void {
    const LEFT_MARGIN = 108;
    const ACTION_WIDTH = 432;

    doc.y += 2 * options.fontPreference.size;

    if (sceneBlock.type !== "scene") {
        throw new Error("only scene headings");
    }

    doc.font(options.fontPreference.family).fontSize(options.fontPreference.size);
    doc.text(
        sceneBlock.text.map(s => s.text).join(""),
        LEFT_MARGIN,
        doc.y,
        { width: ACTION_WIDTH, align: "left" }
    );
    doc.y += options.fontPreference.size;
}