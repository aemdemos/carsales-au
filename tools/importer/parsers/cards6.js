/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];
  
  // Find .slick-track containing .slick-slide
  const track = element.querySelector('.slick-track');
  if (!track) return;
  
  const slides = track.querySelectorAll(':scope > .slick-slide');
  slides.forEach(slide => {
    // Each slide should contain a .card.iNavSearchResult
    const cardDiv = slide.querySelector('.card.iNavSearchResult');
    if (!cardDiv) return;

    // First cell: image
    let cardImage = '';
    const imageFrame = cardDiv.querySelector('.iNavSearchResult__image-frame');
    if (imageFrame) {
      const img = imageFrame.querySelector('img');
      if (img) cardImage = img;
    }

    // Second cell: text content
    const contentWrapper = cardDiv.querySelector('.iNavSearchResult__content-wrapper');
    let contentCellElements = [];
    if (contentWrapper) {
      // Only select top-level blocks (not nested links etc.)
      // 1. Card meta
      const meta = contentWrapper.querySelector('.iNavSearchResult__meta');
      if (meta) contentCellElements.push(meta);
      // 2. Heading
      const heading = contentWrapper.querySelector('.iNavSearchResult__heading');
      if (heading) contentCellElements.push(heading);
      // 3. Sub-heading (description)
      const subHeading = contentWrapper.querySelector('.iNavSearchResult__sub-heading');
      if (subHeading) contentCellElements.push(subHeading);
      // 4. Card row (author, sponsor, date)
      const cardRow = contentWrapper.querySelector('.iNavSearchResult__card-row');
      if (cardRow) contentCellElements.push(cardRow);
    }
    
    // If contentCellElements is empty, fallback to the cardDiv text
    let cellContent = contentCellElements.length > 0
      ? (contentCellElements.length === 1 ? contentCellElements[0] : contentCellElements)
      : cardDiv;

    rows.push([
      cardImage || '',
      cellContent
    ]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
