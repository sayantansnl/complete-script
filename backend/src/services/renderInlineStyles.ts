import { InlineStyle } from "./blocks.js";
import { PDFDoc } from "./pdfOptions.js";

export function renderInlineStyles(
  doc: PDFDoc,
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