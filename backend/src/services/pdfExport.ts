import PDFDocument from "pdfkit";
import fountain from "fountain-js";
import { Readable } from "stream";
import { projects } from "../db/schema.js";
import type { Block, InlineStyle } from "./blocks.js";

export type CompleteProject = typeof projects.$inferSelect;
export type TitlePageData = NonNullable<CompleteProject["titlePageData"]>;
export type FontPreference = NonNullable<CompleteProject["fontPreference"]>;

export interface PDFOptions {
    fountainText: string;
    titlePageData: TitlePageData;
    pageSize: "us-letter" | "a4";
    fontPreference: FontPreference;
};

// function renderScreenplay(doc: PDFKit.PDFDocument, blocks: Block[], options: PDFOptions): void {}

// function renderBlock(doc: PDFKit.PDFDocument, block: Block, options: PDFOptions): void {
//     switch (block.type) {
//         case "scene":
//             renderSceneHeading(doc, block, options);
//             break;
//     }
// }

function renderInlineStyles(
  doc: PDFKit.PDFDocument,
  segments: InlineStyle[],
  x: number,
  y: number,
  width: number,
  fontSize: number
): void {
  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;

    const font = segment.bold && segment.italic ? "Courier-BoldOblique"
      : segment.bold ? "Courier-Bold"
      : segment.italic ? "Courier-Oblique"
      : "Courier";

    doc.font(font).fontSize(fontSize);

    // Only pass x and y on the first segment
    if (index === 0) {
      doc.text(segment.text, x, y, {
        width,
        continued: !isLast,
      });
    } else {
      doc.text(segment.text, {
        width,
        continued: !isLast,
      });
    }
  });
}

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

export function renderAction(doc: PDFKit.PDFDocument, actionBlock: Block, options: PDFOptions): void {
    if (actionBlock.type !== "action") {
        throw new Error("only action lines");
    }
    const lineHeight = options.fontPreference.size;
    const LEFT_MARGIN = 108;
    const ACTION_WIDTH = 432;

    doc.y += lineHeight; // one blank line before

    renderInlineStyles(doc, actionBlock.text, LEFT_MARGIN, doc.y, ACTION_WIDTH, lineHeight);

    doc.y += lineHeight; // one blank line after
}