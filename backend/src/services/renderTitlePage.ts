import { PDFOptions, TitlePageData } from "./pdfOptions.js";

export function renderTitlePage(doc: PDFKit.PDFDocument, titlePageData: TitlePageData, options: PDFOptions): void {
  const lineHeight = options.fontPreference.size;
  const PAGE_WIDTH = options.pageSize === "us-letter" ? 612 : 595;
  const LEFT_MARGIN = 108;
  const CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - 72;
  const PAGE_HEIGHT = options.pageSize === "us-letter" ? 792 : 842;

  // Title -- upper third of the page
  if (titlePageData.title) {
    doc.font(options.fontPreference.family).fontSize(lineHeight);
    doc.text(titlePageData.title, LEFT_MARGIN, PAGE_HEIGHT / 3, {
      width: CONTENT_WIDTH,
      align: "center",
      underline: true,
    });
  }

  // "Written by" + author
  if (titlePageData.author) {
    doc.font(options.fontPreference.family).fontSize(lineHeight);
    doc.text("Written by", LEFT_MARGIN, doc.y + lineHeight * 2, {
      width: CONTENT_WIDTH,
      align: "center",
    });
    doc.text(titlePageData.author, LEFT_MARGIN, doc.y + lineHeight, {
      width: CONTENT_WIDTH,
      align: "center",
    });
  }

  // Based on
  if (titlePageData.basedOn) {
    doc.font(options.fontPreference.family).fontSize(lineHeight);
    doc.text(titlePageData.basedOn, LEFT_MARGIN, doc.y + lineHeight * 2, {
      width: CONTENT_WIDTH,
      align: "center",
    });
  }

  // Draft -- bottom left
  if (titlePageData.draft) {
    doc.font(options.fontPreference.family).fontSize(lineHeight);
    doc.text(titlePageData.draft, LEFT_MARGIN, PAGE_HEIGHT - 144, {
      width: CONTENT_WIDTH,
      align: "left",
    });
  }

  // Contact -- below draft
  if (titlePageData.contact) {
    doc.font(options.fontPreference.family).fontSize(lineHeight);
    doc.text(titlePageData.contact, LEFT_MARGIN, doc.y + lineHeight, {
      width: CONTENT_WIDTH,
      align: "left",
    });
  }

  // Add a new page after the title page
  doc.addPage();
}