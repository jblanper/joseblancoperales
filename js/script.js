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

    function render() {
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
      detail.append(image, side);

      body.replaceChildren(detail);
      body.scrollTop = 0;

      number.textContent = `${pad(index + 1)} / ${pad(items.length)}`;
      label.textContent = TYPE_LABELS[type];
    }

    function go(step) {
      index = (index + step + items.length) % items.length;
      render();
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
  }


  initViewer();
})();
