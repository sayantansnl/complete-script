import PDFDocument from "pdfkit";
import fountain from "fountain-js";

import type { Block, DialogueBlock } from "./blocks.js";
import { renderInlineStyles } from "./renderInlineStyles.js";
import { PDFOptions, TitlePageData } from "./pdfOptions.js";
import { renderSceneHeading } from "./renderSceneHeading.js";
import { renderAction } from "./renderAction.js";
import { renderDialogue } from "./renderDialogue.js";
import { renderDualDialogue } from "./renderDualDialogues.js";
import { renderTransition } from "./renderTransition.js";


// function renderScreenplay(doc: PDFKit.PDFDocument, blocks: Block[], options: PDFOptions): void {}

export function renderBlock(doc: PDFKit.PDFDocument, block: Block, options: PDFOptions): void {
    const lineHeight = options.fontPreference.size;
    const BOTTOM_MARGIN = 72;

    const spaceNeeded: Record<Block["type"], number> = {
        scene: lineHeight * 4,
        action: lineHeight * 2,
        dialogue: lineHeight * 3,
        dual_dialogue: lineHeight * 3,
        transition: lineHeight * 2,
    };

    ensureSpace(doc, spaceNeeded[block.type], BOTTOM_MARGIN);

    switch (block.type) {
        case "scene":
            renderSceneHeading(doc, block, options);
            break;
        case "action":
            renderAction(doc, block, options);
            break;
        case "dialogue":
            renderDialogue(doc, block, options);
            break;
        case "dual_dialogue":
            renderDualDialogue(doc, block, options);
            break;
        case "transition":
            renderTransition(doc, block, options);
            break;
        default:
            const _exhaustive: never = block;
            throw new Error(`Unknown block type: ${JSON.stringify(_exhaustive)}`);
    }
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number, bottomMargin: number): void {
    const pageHeight = doc.page.height;

    if (doc.y + needed > pageHeight - bottomMargin) {
        doc.addPage();
    }
}