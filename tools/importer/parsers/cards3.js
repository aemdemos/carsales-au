/* global WebImporter */
export default function parse(element, { document }) {
  // Get the slick-list containing slides
  const slickList = element.querySelector('.slick-list');
  if (!slickList) return;

  // Find all .slick-slide > div > .card
  const slides = slickList.querySelectorAll('.slick-slide > div > .card');
  if (!slides.length) return;

  // Header row: block name (must match example exactly)
  const rows = [['Cards (cards3)']];

  slides.forEach((card) => {
    // Image cell: first .iNavSearchResult__image-frame img
    let imageCell = '';
    const imageFrame = card.querySelector('.iNavSearchResult__image-frame img');
    if (imageFrame) {
      imageCell = imageFrame;
    }

    // Text cell: heading, description, meta, author row
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    let textCellContent = [];
    if (contentWrapper) {
      // Heading: .iNavSearchResult__heading h2 (prefer h2, fallback to div)
      let heading = contentWrapper.querySelector('.iNavSearchResult__heading h2');
      if (!heading) heading = contentWrapper.querySelector('.iNavSearchResult__heading');
      if (heading) textCellContent.push(heading);

      // Description: .iNavSearchResult__sub-heading or .card-subtitle (should be a <span>)
      const desc = contentWrapper.querySelector('.iNavSearchResult__sub-heading, .card-subtitle');
      if (desc) textCellContent.push(desc);

      // Meta: .iNavSearchResult__meta (review type, images, rating, etc)
      const meta = contentWrapper.querySelector('.iNavSearchResult__meta');
      if (meta) textCellContent.push(meta);

      // Author row: .iNavSearchResult__card-row
      const authorRow = contentWrapper.querySelector('.iNavSearchResult__card-row');
      if (authorRow) textCellContent.push(authorRow);
    }
    // Defensive: if nothing extracted, leave cell empty
    if (!textCellContent.length) textCellContent = [''];

    rows.push([imageCell, textCellContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
