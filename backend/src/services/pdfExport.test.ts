import { font, page, text, y } from "pdfkit";
import { height } from "pdfkit/js/page";
import { describe, expect, it, vi } from "vitest";
import { renderSceneHeading, PDFOptions } from "./pdfExport";

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