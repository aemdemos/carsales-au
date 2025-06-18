/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the ul containing social links
  // 2. Extract the first social media URL (Facebook, Twitter, Instagram, Youtube)
  let embedUrl = '';
  const socialDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'youtube.com'];
  // Find all links in the element
  const links = element.querySelectorAll('a[href]');
  for (const link of links) {
    if (socialDomains.some(domain => link.href.includes(domain))) {
      embedUrl = link.href;
      break;
    }
  }

  // If not found, gracefully fallback to an empty cell
  let embedCell;
  if (embedUrl) {
    // Reference the *existing* anchor element from the DOM (not a new one)
    // Find the anchor matching the embedUrl
    const embedLink = Array.from(links).find(l => l.href === embedUrl);
    // Set its text to the URL per block requirements
    if (embedLink) {
      embedLink.textContent = embedUrl;
      embedCell = embedLink;
    } else {
      // Fallback: create a new anchor if somehow not found (shouldn't happen)
      const fallbackLink = document.createElement('a');
      fallbackLink.href = embedUrl;
      fallbackLink.textContent = embedUrl;
      embedCell = fallbackLink;
    }
  } else {
    embedCell = '';
  }

  const cells = [
    ['Embed (embedSocial14)'],
    [embedCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
