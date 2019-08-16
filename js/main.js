const header = document.querySelector('header');

window.addEventListener('scroll', e => {
    if (document.scrollingElement.scrollTop >= 20) {
        header.classList.add('scrolled');
    } else if (document.scrollingElement.scrollTop < 20) {
        header.classList.remove('scrolled');
    }
});