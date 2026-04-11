export function renderPageNumber(doc, options) {
    const lineHeight = options.fontPreference.size;
    const PAGE_WIDTH = options.pageSize === "us-letter" ? 612 : 595;
    const RIGHT_MARGIN = 72;
    const TOP_MARGIN = 72;
    const NUMBER_WIDTH = 50;
    let pageCount = 0;
    doc.on("pageAdded", () => {
        pageCount++;
        //Skip title page (pageCount = 1) and first page of the screenplay (pageCount = 2)
        if (pageCount <= 2) {
            return;
        }
        const x = PAGE_WIDTH - RIGHT_MARGIN - NUMBER_WIDTH;
        doc.font(options.fontPreference.family).fontSize(lineHeight).text(`${pageCount - 1}.`, x, TOP_MARGIN / 2, {
            width: NUMBER_WIDTH,
            align: "right"
        });
    });
}
