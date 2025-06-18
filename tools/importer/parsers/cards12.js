/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header row
  const headerRow = ['Cards (cards12)'];
  const cells = [headerRow];

  // 1. Get the list of cards from the track inside the carousel
  const slickList = element.querySelector('.slick-list');
  if (!slickList) return;
  const slickTrack = slickList.querySelector('.slick-track');
  if (!slickTrack) return;
  // Each .slick-slide is a card item
  const slides = slickTrack.querySelectorAll(':scope > .slick-slide');

  slides.forEach((slide) => {
    // Each card is inside .card.iNavSearchResult
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return;

    // First cell: Card image (mandatory)
    let cardImage = null;
    const imgFrame = card.querySelector('.iNavSearchResult__image-frame');
    if (imgFrame) {
      // Use the actual <img> element (don't clone)
      cardImage = imgFrame.querySelector('img');
    }

    // Second cell: Textual/structured content
    // Use the card's main content area
    let contentCell = null;
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    if (contentWrapper) {
      // Get the first <a> inside contentWrapper (should wrap the details)
      const contentLink = contentWrapper.querySelector('a');
      if (contentLink) {
        // We'll make a div and move (not clone) all children of the link into it for semantic clarity, NOT copying link
        const container = document.createElement('div');
        while(contentLink.firstChild) {
          container.appendChild(contentLink.firstChild);
        }
        // Also, get any children of contentWrapper that are NOT inside <a>, such as sponsor strip
        Array.from(contentWrapper.childNodes).forEach((node) => {
          if (node !== contentLink) {
            container.appendChild(node);
          }
        });
        contentCell = container;
      } else {
        contentCell = contentWrapper;
      }
    }
    // Add new row to table
    cells.push([cardImage, contentCell]);
  });

  // Replace the original element with the new table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
