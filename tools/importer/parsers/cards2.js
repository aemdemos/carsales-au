/* global WebImporter */
export default function parse(element, { document }) {
  // Set up the table rows: header first, then one row per card
  const rows = [['Cards (cards2)']];

  // Find the .slick-list
  const slickList = element.querySelector('.slick-list');
  if (!slickList) return;
  // Inside .slick-list, find .slick-track (track of slides)
  const slickTrack = slickList.querySelector('.slick-track');
  if (!slickTrack) return;
  // Each card is inside a .slick-slide
  const slides = slickTrack.querySelectorAll(':scope > .slick-slide');

  slides.forEach((slide) => {
    // Each slide may be inactive or not have a card, skip if missing
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return;
    // IMAGE COLUMN: Use image from .iNavSearchResult__image-frame
    let imgCell = null;
    const imgFrame = card.querySelector('.iNavSearchResult__image-frame');
    if (imgFrame) {
      const img = imgFrame.querySelector('img');
      if (img) imgCell = img;
    }
    // TEXT COLUMN: Build array of elements from content wrapper
    const textCellContents = [];
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    if (contentWrapper) {
      // Heading (title)
      const heading = contentWrapper.querySelector('.iNavSearchResult__heading h2');
      if (heading) {
        // Use the <h2> directly to preserve heading semantics
        textCellContents.push(heading);
      }
      // Description
      const desc = contentWrapper.querySelector('.iNavSearchResult__sub-heading span');
      if (desc && desc.textContent.trim()) {
        const descP = document.createElement('p');
        descP.textContent = desc.textContent.trim();
        textCellContents.push(descP);
      }
      // Author/date row
      const cardRow = contentWrapper.querySelector('.iNavSearchResult__card-row');
      if (cardRow) {
        textCellContents.push(cardRow);
      }
      // Call-to-action: link to full article, use top-level card link
      // Only add if present and unique
      const topLink = card.querySelector(':scope > a[href]');
      if (topLink && topLink.getAttribute('href')) {
        // Check if already included
        const alreadyLinked = textCellContents.some(el => el.tagName === 'A');
        if (!alreadyLinked) {
          const a = document.createElement('a');
          a.href = topLink.getAttribute('href');
          a.textContent = 'Read more';
          textCellContents.push(a);
        }
      }
    }
    // Only include cards where both an image and at least one text content present
    if (imgCell && textCellContents.length > 0) {
      rows.push([imgCell, textCellContents]);
    }
  });
  // Create the table block and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
