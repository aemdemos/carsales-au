/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all card elements
  function getCardElements(root) {
    // All cards are .card.iNavSearchResult
    return Array.from(root.querySelectorAll('.card.iNavSearchResult'));
  }

  // Helper: build content cell for a card (reuse DOM nodes when possible)
  function buildCardTextCell(card) {
    // Content wrapper has all the info
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    if (!contentWrapper) return '';
    // Use the rating text node, if present
    let ratingText = contentWrapper.querySelector('.owner-review-rating-text');
    // Use the heading (h2)
    let heading = contentWrapper.querySelector('.iNavSearchResult__heading h2');
    // Use the description (span)
    let desc = contentWrapper.querySelector('.iNavSearchResult__sub-heading span');
    // Use the author
    let author = contentWrapper.querySelector('.iNavSearchResult__authorname');
    // Use the date
    let date = contentWrapper.querySelector('.iNavSearchResult__date');
    // Compose the content cell as an array of referenced nodes (not clones)
    const cellNodes = [];
    // Add rating, styled to float right as in original card (if present)
    if (ratingText) {
      cellNodes.push(ratingText);
    }
    // Add heading
    if (heading) {
      cellNodes.push(heading);
    }
    // Add description
    if (desc) {
      cellNodes.push(desc);
    }
    // Add author/date row
    if (author || date) {
      // Compose a div with referenced nodes
      const metaDiv = document.createElement('div');
      if (author) {
        metaDiv.appendChild(author);
      }
      if (date) {
        if (author) metaDiv.appendChild(document.createTextNode(' '));
        metaDiv.appendChild(date);
      }
      cellNodes.push(metaDiv);
    }
    return cellNodes;
  }

  const rows = [['Cards (cards11)']];
  const cards = getCardElements(element);
  cards.forEach(card => {
    // Image: reference the image node directly
    let imageEl = card.querySelector('.iNavSearchResult__image-frame img');
    // If no image, fallback to a placeholder (rare, but possible)
    if (!imageEl) imageEl = '';
    // Content: referenced nodes
    const textCell = buildCardTextCell(card);
    rows.push([imageEl, textCell]);
  });
  // Create block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
