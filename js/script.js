(() => {
  'use strict';

  const TYPE_LABELS = { fiction: 'Fiction', portrait: 'Portraits' };

  const pieces = [...document.querySelectorAll('.piece')];

  const pad = (number) => String(number).padStart(2, '0');


  /* 2. Viewer
     ------------------------------------------------------------------------ */
  function initViewer() {
    const viewer = document.getElementById('viewer');
    if (!viewer || typeof viewer.showModal !== 'function') return;

    const body = viewer.querySelector('.viewer__body');
    const number = viewer.querySelector('.viewer__number');
    const label = viewer.querySelector('.viewer__label');

    let items = [];   // pieces that can be browsed (the visible ones)
    let index = 0;

    const preloaded = new Set();

    // Download the images of a piece in advance, so they are ready when the user gets there
    function preload(piece) {
      const sources = [
        piece.querySelector('.piece__link').getAttribute('href'),
        piece.querySelector('template').content.querySelector('img')?.getAttribute('src'),
      ];
      sources.forEach((source) => {
        if (!source || preloaded.has(source)) return;
        preloaded.add(source);
        new Image().src = source;
      });
    }

    function render(direction = 0) {
      const piece = items[index];
      const type = piece.dataset.type;

      const image = piece.querySelector('.piece__link img').cloneNode();
      image.className = 'detail__illustration';
      image.removeAttribute('loading');

      const side = document.createElement('div');
      side.className = 'detail__side';
      side.append(piece.querySelector('template').content.cloneNode(true));

      const detail = document.createElement('div');
      detail.className = 'detail';
      detail.dataset.type = type;
      detail.dataset.direction = direction;
      detail.append(image, side);

      body.replaceChildren(detail);
      body.scrollTop = 0;

      number.textContent = `${pad(index + 1)} / ${pad(items.length)}`;
      label.textContent = TYPE_LABELS[type];

      preload(items[(index + 1) % items.length]);
      preload(items[(index - 1 + items.length) % items.length]);
    }

    function go(step) {
      index = (index + step + items.length) % items.length;
      render(step);
    }

    function open(piece) {
      items = pieces.filter((item) => !item.hidden);
      index = items.indexOf(piece);
      render();
      viewer.showModal();
    }

    // Click on a thumbnail
    document.addEventListener('click', (event) => {
      const link = event.target.closest('.piece__link');
      if (!link) return;
      event.preventDefault();
      open(link.closest('.piece'));
    });

    // Previous / next / close buttons
    viewer.addEventListener('click', (event) => {
      const button = event.target.closest('[data-viewer]');
      if (!button) return;
      const action = button.dataset.viewer;
      if (action === 'prev') go(-1);
      if (action === 'next') go(1);
      if (action === 'close') viewer.close();
    });

    // Arrow keys (Esc closes the dialog by itself)
    viewer.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    });

    // Swipe left / right on touch screens
    const SWIPE_MIN = 50;   // minimum horizontal distance, in px
    let swipeStart = null;

    viewer.addEventListener('touchstart', (event) => {
      // Ignore gestures with more than one finger (pinch)
      const touch = event.touches[0];
      swipeStart = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
    }, { passive: true });

    viewer.addEventListener('touchend', (event) => {
      if (!swipeStart) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - swipeStart.x;
      const dy = touch.clientY - swipeStart.y;
      swipeStart = null;

      // Only count mostly horizontal gestures, so scrolling down still works
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      go(dx < 0 ? 1 : -1);
    }, { passive: true });

    viewer.addEventListener('touchcancel', () => {
      swipeStart = null;
    }, { passive: true });
  }


  initViewer();
})();
