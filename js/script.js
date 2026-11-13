(() => {
  'use strict';

  const viewer = document.getElementById('viewer');
  if (typeof viewer?.showModal !== 'function') return;

  const LABELS = { fiction: 'Fiction', portrait: 'Portraits' };

  // Settings of the swipe
  const SLIDE_MS = 220;       // duration of what is left of the movement after letting go, in ms
  const DRAG_START = 8;       // px before we decide if a gesture is horizontal or vertical
  const DRAG_DISTANCE = 0.2;  // fraction of the width a drag needs to change piece
  const FLICK_SPEED = 0.4;    // px per ms: a quick flick also changes piece, even if short

  const pieces = [...document.querySelectorAll('.piece')];
  const body = viewer.querySelector('.viewer__body');
  const number = viewer.querySelector('.viewer__number');
  const label = viewer.querySelector('.viewer__label');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let index = 0;         // piece on screen
  let neighbour = null;  // piece that comes in while swiping
  let step = 0;          // where the neighbour is: 1 = next (right), -1 = previous (left)
  let busy = false;      // true while a swipe finishes; ignores new movements
  let touch = null;      // finger gesture in progress

  const pad = (n) => String(n).padStart(2, '0');
  const wrap = (i) => (i + pieces.length) % pieces.length;


  /* Content
     ------------------------------------------------------------------------ */

  // Builds the content of a piece for the viewer
  function build(piece) {
    const image = piece.querySelector('.piece__link img').cloneNode();
    image.className = 'detail__illustration';
    image.removeAttribute('loading');

    const side = document.createElement('div');
    side.className = 'detail__side';
    side.append(piece.querySelector('template').content.cloneNode(true));

    const detail = document.createElement('div');
    detail.className = 'detail';
    detail.dataset.type = piece.dataset.type;
    detail.append(image, side);
    return detail;
  }

  // Download the images of a piece in advance, so they are ready when the user gets there
  function preload(piece) {
    const spread = piece.querySelector('template').content.querySelector('img');
    [piece.querySelector('.piece__link').getAttribute('href'), spread?.getAttribute('src')]
      .forEach((src) => { if (src) new Image().src = src; });
  }

  function render() {
    const piece = pieces[index];
    body.replaceChildren(build(piece));
    body.scrollTop = 0;

    number.textContent = `${pad(index + 1)} / ${pad(pieces.length)}`;
    label.textContent = LABELS[piece.dataset.type];

    preload(pieces[wrap(index + 1)]);
    preload(pieces[wrap(index - 1)]);
  }

  // Goes to the next (1) or previous (-1) piece, at once
  function go(direction) {
    if (busy || neighbour) return;
    index = wrap(index + direction);
    render();
  }


  /* Swipe: the current piece and its neighbour follow the finger
     ------------------------------------------------------------------------ */

  // Places the neighbour piece (next or previous) right on top of the current one
  function showNeighbour(newStep) {
    const current = body.firstElementChild;
    neighbour?.remove();
    step = newStep;
    neighbour = build(pieces[wrap(index + step)]);
    Object.assign(neighbour.style, {
      position: 'absolute',
      top: `${body.scrollTop}px`,
      left: `${current.offsetLeft}px`,
      width: `${current.offsetWidth}px`,
      height: `${current.offsetHeight}px`,
    });
    body.append(neighbour);
  }

  // Moves the current piece x px; the neighbour always sits one screen width away from it
  function place(x) {
    body.firstElementChild.style.transform = `translateX(${x}px)`;
    neighbour.style.transform = `translateX(${x + step * body.clientWidth}px)`;
  }

  // Slides both pieces to x, then runs `done`
  function finish(x, done) {
    busy = true;
    const ms = reduceMotion.matches ? 0 : SLIDE_MS;
    [body.firstElementChild, neighbour].forEach((piece) => {
      piece.style.transition = `transform ${ms}ms ease-out`;
    });
    place(x);
    setTimeout(() => {
      done();
      neighbour = null;
      step = 0;
      busy = false;
    }, ms);
  }

  // The neighbour takes the place of the current piece
  function commit() {
    finish(-step * body.clientWidth, () => {
      index = wrap(index + step);
      render();
    });
  }

  // Not enough: the current piece goes back to its place
  function cancel() {
    const current = body.firstElementChild;
    finish(0, () => {
      neighbour.remove();
      current.removeAttribute('style');
    });
  }

  body.addEventListener('touchstart', (event) => {
    const { clientX, clientY } = event.touches[0];
    // Ignore pinch (several fingers) and touches while a swipe is finishing
    touch = busy || event.touches.length !== 1
      ? null
      : { x: clientX, y: clientY, time: Date.now(), axis: null };
  }, { passive: true });

  body.addEventListener('touchmove', (event) => {
    if (!touch || touch.axis === 'y') return;
    const dx = event.touches[0].clientX - touch.x;
    const dy = event.touches[0].clientY - touch.y;

    if (!touch.axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < DRAG_START) return;
      // Mostly horizontal: we drag. Otherwise the browser scrolls the text as usual
      touch.axis = Math.abs(dx) > Math.abs(dy) * 1.5 ? 'x' : 'y';
    }
    if (touch.axis !== 'x') return;

    // Dragging left shows the next piece (on the right); dragging right, the previous one
    const direction = dx < 0 ? 1 : -1;
    if (direction !== step) showNeighbour(direction);
    place(dx);
  }, { passive: true });

  body.addEventListener('touchend', (event) => {
    if (touch?.axis === 'x' && neighbour) {
      const dx = event.changedTouches[0].clientX - touch.x;
      const speed = Math.abs(dx) / Math.max(Date.now() - touch.time, 1);
      const enough = Math.abs(dx) > body.clientWidth * DRAG_DISTANCE
        || (speed > FLICK_SPEED && Math.abs(dx) > 30);
      if (enough) commit(); else cancel();
    }
    touch = null;
  }, { passive: true });

  body.addEventListener('touchcancel', () => {
    if (touch?.axis === 'x' && neighbour) cancel();
    touch = null;
  }, { passive: true });


  /* Events
     ------------------------------------------------------------------------ */

  // Click on a thumbnail
  document.addEventListener('click', (event) => {
    const link = event.target.closest('.piece__link');
    if (!link) return;
    event.preventDefault();
    index = pieces.indexOf(link.closest('.piece'));
    neighbour = null;
    step = 0;
    render();
    viewer.showModal();
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

})();
