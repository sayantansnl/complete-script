import { describe, expect, it, vi } from "vitest";
import { 
    renderSceneHeading, 
    renderAction, 
    PDFOptions 
} from "./pdfExport";
import { Block } from "./blocks";

const defaultOptions: PDFOptions = {
  fountainText: "",
  titlePageData: {
    title: "Test Screenplay",
    author: "Test Author",
    basedOn: undefined,
    contact: undefined,
    draft: undefined,
  },
  pageSize: "us-letter",
  fontPreference: {
    family: "Courier",
    size: 12,
    lineSpacing: 1,
  },
};

describe("render scene heading", () => {
    it("renders scene heading at correct position", () => {
        const doc = {
            text: vi.fn(),
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            y: 72,
            page: { height: 792 }
        };

        renderSceneHeading(doc as any, { type: "scene", text: [{ text: "INT. ROOM - DAY" }] }, defaultOptions);

        expect(doc.text).toHaveBeenCalledWith(
            "INT. ROOM - DAY",
            108,
            expect.any(Number),
            expect.objectContaining({ width: 432 })
        );
    });
});

describe("render action lines", () => {
    it("renders action lines at correct position", () => {
        const doc = {
            text: vi.fn(),
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            y: 72,
            page: { height: 792 }
        };

        renderAction(doc as any, { type: "action", text: [{ text: "John gets his gun from the cabinet." }]}, defaultOptions);

        expect(doc.text).toHaveBeenCalledWith(
            "John gets his gun from the cabinet.",
            108,
            expect.any(Number),
            expect.objectContaining({ width: 432 })
        );
    });

    it("renders action with bold and italic segments", () => {
        const doc = {
            text: vi.fn(),
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            y: 72,
            page: { height: 792 },
        };

        const block: Block = {
            type: "action",
            text: [
            { text: "She walks in. " },
            { text: "Slowly.", italic: true },
            { text: " Then stops.", bold: true },
            ],
        };

        renderAction(doc as any, block, defaultOptions);

        const fontCalls = doc.font.mock.calls.map(call => call[0]);

        expect(fontCalls).toContain("Courier");
        expect(fontCalls).toContain("Courier-Oblique");
        expect(fontCalls).toContain("Courier-Bold");
    });

    it("renders action with bold-italic segment", () => {
        const doc = {
            text: vi.fn(),
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            y: 72,
            page: { height: 792 },
        };

        const block: Block = {
            type: "action",
            text: [
                { text: "This is ", },
                { text: "very important", bold: true, italic: true },
                { text: "." },
            ],
        };

        renderAction(doc as any, block, defaultOptions);

        const fontCalls = doc.font.mock.calls.map(call => call[0]);
        expect(fontCalls).toContain("Courier-BoldOblique");
    });

    it("passes continued: true for all segments except the last", () => {
        const doc = {
            text: vi.fn(),
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            y: 72,
            page: { height: 792 },
        };

        const block: Block = {
            type: "action",
            text: [
                { text: "First " },
                { text: "second " },
                { text: "third" },
            ],
        };

        renderAction(doc as any, block, defaultOptions);

        const textCalls = doc.text.mock.calls;

        // All but the last should have continued: true
        expect(textCalls[0][3]).toMatchObject({ continued: true });  // "First "
        expect(textCalls[1][1]).toMatchObject({ continued: true });  // "second "
        expect(textCalls[2][1]).toMatchObject({ continued: false }); // "third"
    });
});