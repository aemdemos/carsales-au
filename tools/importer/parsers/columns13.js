/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row of columns within the container
  const row = element.querySelector('.container > .row');
  if (!row) return;
  // Get all direct children with class 'col' (the columns)
  const cols = Array.from(row.children).filter(c => c.classList.contains('col'));

  // Prepare the header row exactly as required
  const headerRow = ['Columns (columns13)'];
  const cells = [headerRow];

  // Prepare the content row: one cell per column, each referencing the block of content in the column
  const contentRow = cols.map(col => {
    // Collect all child nodes (Element or Text) except empty text
    const colContent = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return node.nodeType === Node.ELEMENT_NODE;
    });
    // If single item, return that element directly; if multiple, return as array
    if (colContent.length === 1) return colContent[0];
    if (colContent.length > 1) return colContent;
    return '';
  });
  cells.push(contentRow);

  // Create and insert the structured table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
