/* global WebImporter */
export default function parse(element, { document }) {
  // Start table with header
  const cells = [['Cards (cards8)']];

  // Find the slick-track containing the slides (cards)
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // Get all slides (each card)
  const slides = slickTrack.querySelectorAll(':scope > div.slick-slide');

  slides.forEach((slide) => {
    const card = slide.querySelector('.card');
    if (!card) return;

    // Image cell
    let img = card.querySelector('.iNavSearchResult__image-frame img, .iNavSearchResult__image.card-img-top');
    if (!img) img = card.querySelector('img');
    const imgCell = img ? img : '';

    // Text cell: Title, Description, Author/date row
    const textCell = [];
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    if (contentWrapper) {
      // Title (h2)
      const heading = contentWrapper.querySelector('.iNavSearchResult__heading h2');
      if (heading) textCell.push(heading);
      // Description
      const desc = contentWrapper.querySelector('.iNavSearchResult__sub-heading span');
      if (desc) {
        const descP = document.createElement('p');
        descP.textContent = desc.textContent;
        textCell.push(descP);
      }
      // Author/date row
      const cardRow = contentWrapper.querySelector('.iNavSearchResult__card-row');
      if (cardRow) textCell.push(cardRow);
    }
    cells.push([imgCell, textCell.length ? textCell : '']);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
