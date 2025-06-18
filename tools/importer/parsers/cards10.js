/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row from block name and variant
  const headerRow = ['Cards (cards10)'];
  const tableRows = [headerRow];
  // Gather all direct card slides (regardless of active state)
  const slides = element.querySelectorAll('.slick-slide');
  slides.forEach(slide => {
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return; // skip if not a card
    // IMAGE CELL
    let imgFrame = card.querySelector('.iNavSearchResult__image-frame');
    let img = imgFrame ? imgFrame.querySelector('img') : null;
    // Use the actual element in the DOM if possible
    let imageCell = img || '';
    // TEXT CELL
    const textContent = [];
    // Meta (REVIEW/NEWS/FEATURE, image/video count)
    const meta = card.querySelector('.iNavSearchResult__meta');
    if (meta) {
      textContent.push(meta);
    }
    // Heading/title
    const heading = card.querySelector('.iNavSearchResult__heading');
    if (heading) {
      // Use the actual H2 if inside
      const h2 = heading.querySelector('h2');
      if (h2) {
        textContent.push(h2);
      } else {
        textContent.push(heading);
      }
    }
    // Subheading/description
    const subheading = card.querySelector('.iNavSearchResult__sub-heading');
    if (subheading) {
      const span = subheading.querySelector('span');
      if (span) {
        textContent.push(span);
      } else {
        textContent.push(subheading);
      }
    }
    // Author row (image, name, date)
    const authorRow = card.querySelector('.iNavSearchResult__card-row');
    if (authorRow) {
      textContent.push(authorRow);
    }
    tableRows.push([imageCell, textContent]);
  });
  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
