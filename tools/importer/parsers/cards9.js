/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards9)'];

  // Get all cards in the slick carousel
  // Each .slick-slide with a .card inside is a card
  const slides = element.querySelectorAll('.slick-slide');
  const rows = [];

  slides.forEach((slide) => {
    // Only process visible slides (should include all, but just in case)
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return;

    // --- First cell: Image (with possible Sponsored label) ---
    const imageFrame = card.querySelector('.iNavSearchResult__image-frame');
    let imageCell = '';
    if (imageFrame) {
      // Use the imageFrame div directly, preserves structure (img + label)
      imageCell = imageFrame;
    }

    // --- Second cell: Text content ---
    // All main content in .iNavSearchResult__content-wrapper
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    let textCell = '';
    if (contentWrapper) {
      textCell = contentWrapper;
    }
    rows.push([imageCell, textCell]);
  });

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
