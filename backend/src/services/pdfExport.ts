import PDFDocument from "pdfkit";
import fountain from "fountain-js";
import { Readable } from "stream";
import { projects } from "../db/schema.js";
import type { Block, InlineStyle, DialogueBlock } from "./blocks.js";
import { line } from "drizzle-orm/pg-core/index.js";

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

export function renderDialogue(doc: PDFKit.PDFDocument, dialogueBlock: Block, options: PDFOptions): void {
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

function renderDualDialogueSide(
  doc: PDFKit.PDFDocument,
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
    renderInlineStyles(doc, line, dialogueX, y, columnWidth, lineHeight);
    y = doc.y;
  }

  return y; // return the final Y position of this side
}

export function renderDualDialogue(doc: PDFKit.PDFDocument, dualDialogueBlock: Block, options: PDFOptions): void {
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

  // One blank line after
  doc.y += lineHeight;
}

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