/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row as per the guidelines
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // Get the slick-track that contains all the slides
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // Loop over each slide
  const slides = slickTrack.querySelectorAll('.slick-slide');
  slides.forEach(slide => {
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return;

    // --- IMAGE COLUMN ---
    // Look for image in the .iNavSearchResult__image-frame
    let imageEl = null;
    const imageFrame = card.querySelector('.iNavSearchResult__image-frame img');
    if (imageFrame) {
      imageEl = imageFrame;
    }

    // --- TEXT COLUMN ---
    const textParts = [];
    const content = card.querySelector('.iNavSearchResult__content-wrapper');
    if (content) {
      // Heading/title
      const heading = content.querySelector('.iNavSearchResult__heading h2');
      if (heading) textParts.push(heading);
      // Description
      const desc = content.querySelector('.iNavSearchResult__sub-heading');
      if (desc) textParts.push(desc);
      // Author row (includes author, date, and avatar)
      const authorRow = content.querySelector('.iNavSearchResult__card-row');
      if (authorRow) textParts.push(authorRow);
    }
    // Only add card if there's both image and text (per block spec)
    if (imageEl && textParts.length) {
      cells.push([imageEl, textParts]);
    }
  });

  // Create and replace with the new block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
