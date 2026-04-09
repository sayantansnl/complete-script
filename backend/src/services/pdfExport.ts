import PDFDocument from "pdfkit";
import fountain from "fountain-js";

import type { Block, DialogueBlock } from "./blocks.js";
import { renderInlineStyles } from "./renderInlineStyles.js";
import { PDFOptions, TitlePageData } from "./pdfOptions.js";


// function renderScreenplay(doc: PDFKit.PDFDocument, blocks: Block[], options: PDFOptions): void {}

// function renderBlock(doc: PDFKit.PDFDocument, block: Block, options: PDFOptions): void {
//     switch (block.type) {
//         case "scene":
//             renderSceneHeading(doc, block, options);
//             break;
//     }
// }