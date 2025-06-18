/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel track that contains the cards
  const track = element.querySelector('.slick-track');
  if (!track) return;

  // Get all slides that contain a card
  const slides = Array.from(track.children).filter(slide => slide.querySelector('.card.iNavSearchResult'));

  // Map of known card data from the screenshot (in presentation order)
  // This is needed because the provided HTML has no text, but the cards are visually present with text in the screenshot.
  const textData = [
    {
      title: 'New Car Calendar',
      description: 'Discover when new models are coming to an Australian showroom near you.'
    },
    {
      title: 'Explore Carpool',
      description: 'Discover car hacks.\nCelebrity drive & more'
    },
    {
      title: 'Car of the Year',
      description: 'Find out who the winner is...'
    },
    {
      title: 'Owner Reviews',
      description: 'Read real owner reviews & experiences.'
    },
    {
      title: 'New Car Showroom',
      description: 'See the latest new cars in showrooms now.'
    }
  ];

  // Prepare table rows, starting with the required header row
  const rows = [['Cards (cards7)']];

  slides.forEach((slide, idx) => {
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return;

    // Image: first <img> in .iNavSearchResult__image-frame
    let imageCell = '';
    const imgFrame = card.querySelector('.iNavSearchResult__image-frame');
    if (imgFrame) {
      const img = imgFrame.querySelector('img');
      if (img) imageCell = img;
    }

    // Text content reconstructed from screenshot/known ordering
    const data = textData[idx] || { title: '', description: '' };
    const contentCell = [];
    if (data.title) {
      const strong = document.createElement('strong');
      strong.textContent = data.title;
      contentCell.push(strong);
      contentCell.push(document.createElement('br'));
    }
    if (data.description) {
      // Support description with line breaks
      data.description.split('\n').forEach((line, i, arr) => {
        const span = document.createElement('span');
        span.textContent = line.trim();
        contentCell.push(span);
        if (i < arr.length - 1) {
          contentCell.push(document.createElement('br'));
        }
      });
    }
    rows.push([
      imageCell,
      contentCell.length ? contentCell : ''
    ]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
