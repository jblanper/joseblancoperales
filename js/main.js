// main.js: filters, lightbox and shareable links for the Illustrations page.
// The About page does not load this file.

const mosaic = document.getElementById('mosaic');

if (mosaic) {
  const items = mosaic.querySelectorAll('.item');
  const filterButtons = document.querySelectorAll('.filters button');
  const FADE_MS = 200; // keep in sync with --fade in style.css

  // ---------------------------------------------------------------- Lightbox
  // GLightbox (vendor/glightbox.min.js) shows the images fullscreen as a carousel.
  // We start it with no slides and set them right before each opening, so the carousel
  // only contains the pieces that are visible with the current filter.
  const lightbox = GLightbox({
    elements: [],
    loop: true,
    openEffect: 'fade',
    closeEffect: 'fade',
    slideEffect: 'fade', // on phones GLightbox always uses its swipe animation between slides
    moreLength: 110, // phones only: long descriptions are cut after this many characters
    moreText: 'See more',
  });

  // Tooltip (and screen reader hint) on the pieces that have a book spread
  mosaic.querySelectorAll('.spread').forEach((spread) => {
    spread.parentElement.querySelector('a').title = 'Includes the book spread';
  });

  // Visible links in page order. A book illustration has two links: the illustration
  // and its book spread, so it becomes two slides, one after the other.
  function visibleLinks() {
    return Array.from(mosaic.querySelectorAll('.item:not([hidden]) a'));
  }

  // The name used in shareable links: the image file name, plus "-spread" for book spreads.
  // Example: images/full/portrait-03.webp -> #portrait-03
  function slugFor(link) {
    const file = link.getAttribute('href').split('/').pop().replace(/\.[^.]+$/, '');
    return link.classList.contains('spread') ? `${file}-spread` : file;
  }

  // What GLightbox needs to know about one link. The caption is the title. If the item has a
  // long description it is shown beside the image, otherwise only the caption under it.
  function slideFor(link) {
    const isSpread = link.classList.contains('spread');
    const description = isSpread ? null : link.parentElement.querySelector('.description');
    return {
      href: link.href,
      type: 'image',
      alt: link.dataset.caption,
      title: link.dataset.caption,
      description: description ? description.innerHTML.trim() : '',
      descPosition: description ? 'right' : 'bottom',
    };
  }

  // The address shows which slide is open (#portrait-03), so it can be copied and shared.
  // It is cleared when the lightbox closes.
  function setHash(link) {
    try {
      history.replaceState(null, '', link ? `#${slugFor(link)}` : location.pathname + location.search);
    } catch (error) {
      // Some browsers refuse this on local files. Sharing only works on the real site anyway.
    }
  }

  let openLinks = []; // the links behind the slides of the open lightbox

  function openLightbox(link) {
    openLinks = visibleLinks();
    lightbox.setElements(openLinks.map(slideFor));
    lightbox.openAt(openLinks.indexOf(link));
    setHash(link);
  }

  lightbox.on('slide_changed', ({ current }) => setHash(openLinks[current.index]));
  lightbox.on('close', () => setHash(null));

  // Phones: tapping "See more" expands the text and dims the image (GLightbox adds the class
  // gdesc-open to <body>). Swiping to another slide does not collapse it, so the next image
  // would stay dimmed. A click on <body> runs GLightbox's own "collapse" handler.
  lightbox.on('slide_before_change', () => {
    if (document.body.classList.contains('gdesc-open')) document.body.click();
  });

  mosaic.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    event.preventDefault();
    openLightbox(link);
  });

  // Open the slide named in the address, for example when someone follows a shared link.
  function openFromHash() {
    const slug = decodeURIComponent(location.hash.slice(1));
    if (!slug || lightbox.lightboxOpen) return;

    const link = Array.from(mosaic.querySelectorAll('a')).find((a) => slugFor(a) === slug);
    if (!link) return;

    // If the active filter hides this piece, show everything again
    if (link.closest('.item').hidden) {
      markPressed('all');
      showItems('all');
    }
    openLightbox(link);
  }

  // ---------------------------------------------------------------- Filters
  function markPressed(tag) {
    filterButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === tag));
    });
  }

  function showItems(tag) {
    items.forEach((item) => {
      const tags = item.dataset.tags.split(' ');
      item.hidden = !(tag === 'all' || tags.includes(tag));
    });
  }

  function applyFilter(tag) {
    markPressed(tag);

    // Fade the mosaic out, swap the items while it is invisible, fade it back in.
    mosaic.classList.add('is-fading');
    setTimeout(() => {
      showItems(tag);
      mosaic.classList.remove('is-fading');
    }, FADE_MS);
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter));
  });

  // ---------------------------------------------------------------- Start
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
}
