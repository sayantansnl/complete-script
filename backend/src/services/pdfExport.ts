import type { Block } from "./blocks.js";
import { PDFDoc, PDFOptions } from "./pdfOptions.js";
import { renderSceneHeading } from "./renderSceneHeading.js";
import { renderAction } from "./renderAction.js";
import { renderDialogue } from "./renderDialogue.js";
import { renderDualDialogue } from "./renderDualDialogues.js";
import { renderTransition } from "./renderTransition.js";
import { renderTitlePage } from "./renderTitlePage.js";
import { renderPageNumber } from "./renderPageNumber.js";


export function renderScreenplay(doc: PDFDoc, blocks: Block[], options: PDFOptions): void {
    renderPageNumber(doc, options);
    renderTitlePage(doc, options.titlePageData, options);

    for (const block of blocks) {
        renderBlock(doc, block, options);
    }
}

export function renderBlock(doc: PDFDoc, block: Block, options: PDFOptions): void {
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

function ensureSpace(doc: PDFDoc, needed: number, bottomMargin: number): void {
    const pageHeight = doc.page.height;

    if (doc.y + needed > pageHeight - bottomMargin) {
        doc.addPage();
        doc.y = 72;
    }
}