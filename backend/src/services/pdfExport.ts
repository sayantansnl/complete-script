import PDFDocument from "pdfkit";
import fountain from "fountain-js";
import { Readable } from "stream";
import { projects } from "../db/schema.js";
import type { Block } from "./blocks.js";

export type CompleteProject = typeof projects.$inferSelect;
export type TitlePageData = NonNullable<CompleteProject["titlePageData"]>;
export type FontPreference = NonNullable<CompleteProject["fontPreference"]>;

interface PDFOptions {
    fountainText: string;
    titlePageData: TitlePageData;
    pageSize: "us-letter" | "a4";
    fontPreference: FontPreference;
};

function renderScreenplay(doc: PDFKit.PDFDocument, blocks: Block[], options: PDFOptions): void {}

function renderBlock(doc: PDFKit.PDFDocument, block: Block, options: PDFOptions): void {
    switch (block.type) {
        case "scene":
            renderSceneHeading(doc, block, options);
            break;
    }
}

function renderSceneHeading(doc: PDFKit.PDFDocument, sceneBlock: Block, options: PDFOptions): void {
    const LEFT_MARGIN = 108;
    const ACTION_WIDTH = 432;

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