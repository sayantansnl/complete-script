import { describe, expect, it, vi } from "vitest";
import { EventEmitter } from "events";
import { Block } from "./blocks";
import { PDFOptions } from "./pdfOptions";
import { renderSceneHeading } from "./renderSceneHeading";
import { renderAction } from "./renderAction";
import { renderDialogue } from "./renderDialogue";
import { renderDualDialogue } from "./renderDualDialogues";
import { renderTransition } from "./renderTransition";
import { renderTitlePage } from "./renderTitlePage";
import { renderPageNumber } from "./renderPageNumber";

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

describe("render dialogues", () => {
    it("renders character name at correct position", () => {
        const doc = {
            text: vi.fn(),
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            y: 72,
            page: { height: 792 },
        };

        const block: Block = {
            type: "dialogue",
            character: "JOHN",
            lines: [[{ text: "Hello there." }]],
        };

        renderDialogue(doc as any, block, defaultOptions);

        expect(doc.text).toHaveBeenCalledWith(
            "JOHN",
            266,
            expect.any(Number),
            expect.objectContaining({ align: "left" })
        );
    });

    it("renders parenthetical with parentheses", () => {
        const doc = {
            text: vi.fn(),
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            y: 72,
            page: { height: 792 },
        };

        const block: Block = {
            type: "dialogue",
            character: "JOHN",
            parentheticals: [{ text: "whispering" }],
            lines: [[{ text: "Be quiet." }]],
        };

        renderDialogue(doc as any, block, defaultOptions);

        expect(doc.text).toHaveBeenCalledWith(
            "(whispering)",
            223,
            expect.any(Number),
            expect.objectContaining({ width: 144 })
        );
    });
});

describe("render dual dialogues", () => {
    it("renders both sides starting at the same Y position", () => {
        const doc = {
            text: vi.fn(),
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            y: 72,
            page: { height: 792 },
        };

        const block: Block = {
            type: "dual_dialogue",
            left: { character: "JOHN", lines: [[{ text: "Hello." }]] },
            right: { character: "JANE", lines: [[{ text: "Hi." }]] },
        };

        renderDualDialogue(doc as any, block, defaultOptions);

        const textCalls = doc.text.mock.calls;

        // JOHN and JANE should both be rendered with the same Y coordinate
        const johnCall = textCalls.find(call => call[0] === "JOHN");
        const janeCall = textCalls.find(call => call[0] === "JANE");

        expect(johnCall).toBeDefined();
        expect(janeCall).toBeDefined();
        expect(johnCall![2]).toBe(janeCall![2]);
    });
});

describe("it renders transitions", () => {
    it("renders transitions right aligned", () => {
        const doc = {
            text: vi.fn(),
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            y: 72,
            page: { height: 792 }
        };

        const block: Block = {
            type: "transition",
            text: [{ text: "CUT TO:" }]
        };

        renderTransition(doc as any, block, defaultOptions);

        expect(doc.text).toHaveBeenCalledWith(
            "CUT TO:",
            108,
            expect.any(Number),
            expect.objectContaining({ align: "right" })
        );
    });
});

describe("renderTitlePage", () => {
    const buildDoc = () => {
        const doc = {
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            addPage: vi.fn(),
            y: 0,
            page: { height: 792 },
            text: vi.fn().mockImplementation((_text, _x, y) => {
                if (typeof y === "number") {
                    doc.y = y + 12; // advance y by one line height after each text call
                }
            }),
        };
        return doc;
    };

    it("renders title in upper third of the page", () => {
        const doc = buildDoc();

        renderTitlePage(doc as any, { title: "MY SCREENPLAY" }, defaultOptions);

        expect(doc.text).toHaveBeenCalledWith(
            "MY SCREENPLAY",
            108,
            792 / 3, // upper third
            expect.objectContaining({ align: "center", underline: true })
        );
  });

  it("renders author below title", () => {
        const doc = buildDoc();

        renderTitlePage(doc as any, { title: "MY SCREENPLAY", author: "John Doe" }, defaultOptions);

        const textCalls = doc.text.mock.calls as [string, number, number, object][];

        const writtenByCall = textCalls.find(call => call[0] === "Written by");
        const authorCall = textCalls.find(call => call[0] === "John Doe");

        expect(writtenByCall).toBeDefined();
        expect(authorCall).toBeDefined();
        expect(writtenByCall![2]).toBeLessThan(authorCall![2]); // "Written by" appears above author
  });

  it("renders draft at bottom left", () => {
        const doc = buildDoc();

        renderTitlePage(doc as any, { draft: "First Draft" }, defaultOptions);

        const textCalls = doc.text.mock.calls as [string, number, number, object][];
        const draftCall = textCalls.find(call => call[0] === "First Draft");

        expect(draftCall).toBeDefined();
        expect(draftCall![2]).toBe(792 - 144); // bottom of page minus two inches
        expect(draftCall![3]).toMatchObject({ align: "left" });
  });

  it("renders contact below draft", () => {
        const doc = buildDoc();

        renderTitlePage(doc as any, { draft: "First Draft", contact: "john@example.com" }, defaultOptions);

        const textCalls = doc.text.mock.calls as [string, number, number, object][];
        const draftCall = textCalls.find(call => call[0] === "First Draft");
        const contactCall = textCalls.find(call => call[0] === "john@example.com");

        expect(draftCall).toBeDefined();
        expect(contactCall).toBeDefined();
        expect(draftCall![2]).toBeLessThan(contactCall![2]); // draft appears above contact
    });

    it("skips missing fields", () => {
        const doc = buildDoc();

        renderTitlePage(doc as any, { title: "MY SCREENPLAY" }, defaultOptions);

        const textCalls = doc.text.mock.calls as [string, number, number, object][];
        const writtenByCall = textCalls.find(call => call[0] === "Written by");

        expect(writtenByCall).toBeUndefined(); // no author provided
    });

  it("adds a new page after the title page", () => {
        const doc = buildDoc();

        renderTitlePage(doc as any, { title: "MY SCREENPLAY" }, defaultOptions);

        expect(doc.addPage).toHaveBeenCalledOnce();
  });
});

describe("render page number", () => {
    it("skips page numbers on title and first screenplay page", () => {
        const emitter = new EventEmitter();
        const doc = {
            text: vi.fn(),
            font: vi.fn().mockReturnThis(),
            fontSize: vi.fn().mockReturnThis(),
            on: emitter.on.bind(emitter),
            page: { height: 792 },
            y: 0,
        };

        renderPageNumber(doc as any, defaultOptions);

        // Simulate adding pages
        emitter.emit("pageAdded"); // title page
        emitter.emit("pageAdded"); // first screenplay page
        emitter.emit("pageAdded"); // second screenplay page -- should render "2."

        const textCalls = doc.text.mock.calls as [string, number, number, object][];
        expect(textCalls.length).toBe(1); // only one page number rendered
        expect(textCalls[0][0]).toBe("2.");
    });
});