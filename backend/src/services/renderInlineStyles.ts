import { options } from "pdfkit";
import { InlineStyle } from "./blocks.js";
import { PDFDoc, PDFOptions } from "./pdfOptions.js";

export function renderInlineStyles(
  doc: PDFDoc,
  segments: InlineStyle[],
  x: number,
  y: number,
  width: number,
  fontSize: number,
  options: PDFOptions
): void {
  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;

    const font = getFontVariant(options.fontPreference.family, segment.bold, segment.italic);

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

function getFontVariant(family: string, bold?: boolean, italic?: boolean): string {
  if (family === "Courier Prime") {
    if (bold && italic) return "Courier Prime Bold Italic";
    if (bold) return "Courier Prime Bold";
    if (italic) return "Courier Prime Italic";
    return "Courier Prime";
  }

  // Default to built-in Courier variants
  if (bold && italic) return "Courier-BoldOblique";
  if (bold) return "Courier-Bold";
  if (italic) return "Courier-Oblique";
  return "Courier";
}