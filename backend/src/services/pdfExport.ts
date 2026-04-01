import PDFDocument from "pdfkit";
import fountain from "fountain-js";
import { Readable } from "stream";

interface PDFOptions {
    fountainText: string;
    titlePageData: any;
    pageSize: "us-letter" | "a4";
    fontPreference: {
        family: string;
        size: number;
        line: number;
    };
};

function renderScreenplay(
    doc: PDFKit.PDFDocument,
    tokens: any[],
    fontPreference: { family: string, size: number, line: number}
) {}