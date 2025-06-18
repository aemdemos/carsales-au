/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as example
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // The .slick-track holds all .slick-slide (cards)
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return undefined; // Don't return; just end

  // Each .slick-slide is a card (may have aria-hidden=true or false, include all)
  const slides = slickTrack.querySelectorAll(':scope > .slick-slide');
  slides.forEach(slide => {
    // Defensive: Only process if .card.iNavSearchResult exists
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return;

    // IMAGE CELL
    // The card image is inside .iNavSearchResult__image-frame img
    const imageEl = card.querySelector('.iNavSearchResult__image-frame img');
    // If no image, use empty string as fallback
    const imageCell = imageEl ? imageEl : '';

    // TEXT CELL
    // .iNavSearchResult__content-wrapper > a contains all text
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    let textCell;
    if (contentWrapper) {
      // Find the first link inside content wrapper
      const link = contentWrapper.querySelector('a');
      if (link) {
        // Build the text cell as an array of referenced elements, keeping original order
        const textCellArr = [];
        // Add .iNavSearchResult__meta (PODCAST, etc)
        const meta = link.querySelector('.iNavSearchResult__meta');
        if (meta) textCellArr.push(meta);
        // Add .iNavSearchResult__heading h2 (title)
        const headingDiv = link.querySelector('.iNavSearchResult__heading');
        if (headingDiv) {
          const h2 = headingDiv.querySelector('h2');
          if (h2) textCellArr.push(h2);
        }
        // Add .iNavSearchResult__sub-heading span (description)
        const subHeadingDiv = link.querySelector('.iNavSearchResult__sub-heading');
        if (subHeadingDiv) {
          const span = subHeadingDiv.querySelector('span');
          if (span) textCellArr.push(span);
        }
        // Add .iNavSearchResult__card-row (author/date)
        const cardRow = link.querySelector('.iNavSearchResult__card-row');
        if (cardRow) textCellArr.push(cardRow);
        // Use textCellArr as the text cell, or empty string if nothing present
        textCell = textCellArr.length ? textCellArr : '';
      } else {
        textCell = '';
      }
    } else {
      textCell = '';
    }
    rows.push([imageCell, textCell]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
  // Do not return anything
}
