import { PDFDoc, PDFOptions } from "./pdfOptions.js";

export function renderPageNumber(doc: PDFDoc, options: PDFOptions) {
    const lineHeight = options.fontPreference.size;
    const PAGE_WIDTH = options.pageSize === "us-letter" ? 612 : 595;
    const RIGHT_MARGIN = 72;
    const TOP_MARGIN = 72;
    const NUMBER_WIDTH = 50;

    let pageCount = 0;

    doc.on("pageAdded", () => {
        pageCount++;

        const x = PAGE_WIDTH - RIGHT_MARGIN - NUMBER_WIDTH;
        if (pageCount > 1) {
            doc.font(options.fontPreference.family).fontSize(lineHeight).text(`${pageCount}.`, x, TOP_MARGIN / 2, {
                width: NUMBER_WIDTH,
                align: "right"
            });
        }
        
    });
}