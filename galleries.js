// variables
const imgData = {
    'two-d-animation': ['345174553', '345175474', '345175829', '345175077',
        '345176568', '345175631', '345177076', '345177307'],
    'three-d-animation': ['350924982', '351586611', '351589994', '350928467',
        '346129663', '344060912', '344061867', '344062658', '344062988',
        '344063425', '344063899', '344064432', '344065015',
        '345177601', '345177874', '346133515'],
    'crumbling': ['crumbling1.png', 'crumbling2.png', 'crumbling3.png'],
    'decay': ['decay1.png', 'decay10.png', 'decay11.png', 'decay12.png',
        'decay2.png', 'decay3.png', 'decay4.png', 'decay5.png',
        'decay6.png', 'decay7.png', 'decay8.png', 'decay9.png'],
    'enso': ['enso1.png', 'enso2.png', 'enso3.png', 'enso4.png', 'enso5.png',
        'enso6.png'],
    'ethereal': ['ethereal1.png', 'ethereal2.png', 'ethereal3.png',
        'ethereal4.png', 'ethereal5.png', 'ethereal6.png'],
    'floroid': ['floroid1.png', 'floroid10.png', 'floroid11.png', 'floroid12.png',
        'floroid13.png', 'floroid14.png', 'floroid15.png', 'floroid16.png',
        'floroid17.png', 'floroid18.png', 'floroid19.png', 'floroid2.png',
        'floroid20.png', 'floroid21.png', 'floroid22.png', 'floroid23.png',
        'floroid24.png', 'floroid25.png', 'floroid26.png', 'floroid27.png',
        'floroid28.png', 'floroid29.png', 'floroid3.png', 'floroid30.png',
        'floroid31.png', 'floroid4.png', 'floroid5.png', 'floroid6.png',
        'floroid8.png', 'floroid9.png'],
    'graphite': ['graphite1.png', 'graphite2.png', 'graphite3.png', 'graphite4.png',
        'graphite5.png', 'graphite6.png', 'graphite7.png', 'graphite8.png'],
    'grid_paint': ['grid_paint1.png', 'grid_paint10.png', 'grid_paint11.png',
        'grid_paint12.png', 'grid_paint13.png', 'grid_paint14.png',
        'grid_paint15.png', 'grid_paint16.png', 'grid_paint17.png',
        'grid_paint18.png', 'grid_paint19.png', 'grid_paint2.png',
        'grid_paint20.png', 'grid_paint21.png', 'grid_paint22.png',
        'grid_paint23.png', 'grid_paint24.png', 'grid_paint25.png',
        'grid_paint26.png', 'grid_paint27.png', 'grid_paint28.png',
        'grid_paint3.png', 'grid_paint4.png', 'grid_paint5.png',
        'grid_paint6.png', 'grid_paint7.png', 'grid_paint8.png',
        'grid_paint9.png'],
    'growth': ['growth1.png', 'growth10.png', 'growth11.png', 'growth12.png',
        'growth2.png', 'growth3.png', 'growth4.png', 'growth5.png',
        'growth6.png', 'growth7.png', 'growth8.png', 'growth9.png'],
    'legs': ['legs1.png', 'legs2.png', 'legs3.png'],
    'metropolitan': ['metropolitan1.png', 'metropolitan2.png', 'metropolitan3.png',
        'metropolitan4.png', 'metropolitan5.png', 'metropolitan6.png'],
    'moon': ['moon1.png', 'moon2.png', 'moon3.png', 'moon4.png', 'moon5.png', 'moon6.png'],
    'nebula': ['nebula1.png', 'nebula10.png', 'nebula11.png', 'nebula2.png', 'nebula3.png',
        'nebula4.png', 'nebula5.png', 'nebula6.png', 'nebula7.png', 'nebula8.png',
        'nebula9.png'],
    'orbitalpaint': ['orbitalpaint1.png', 'orbitalpaint2.png', 'orbitalpaint3.png',
        'orbitalpaint4.png', 'orbitalpaint5.png', 'orbitalpaint6.png',
        'orbitalpaint7.png', 'orbitalpaint8.png', 'orbitalpaint9.png',
        'orbitalpaint10.png', 'orbitalpaint11.png', 'orbitalpaint12.png',
        'orbitalpaint13.png', 'orbitalpaint14.png', 'orbitalpaint15.png'],
    'organs': ['organs1.png', 'organs10.png', 'organs11.png', 'organs12.png',
        'organs13.png', 'organs2.png', 'organs3.png', 'organs4.png',
        'organs5.png', 'organs6.png', 'organs7.png', 'organs8.png', 'organs9.png'],
    'sine_globe': ['sineglobe1.png', 'sineglobe2.png', 'sineglobe3.png',
        'sineglobe4.png', 'sineglobe5.png', 'sineglobe6.png',
        'sineglobe7.png', 'sineglobe8.png', 'sineglobe9.png',
        'sineglobe10.png', 'sineglobe11.png'],
    'tangled': ['tangled1.png', 'tangled2.png', 'tangled3.png', 'tangled4.png',
        'tangled5.png', 'tangled6.png', 'tangled7.png', 'tangled8.png',
        'tangled9.png'],
    'textures': ['textures1.png', 'textures2.png'],
    'trace': ['trace1.png', 'trace2.png', 'trace3.png', 'trace4.png', 'trace5.png',
        'trace6.png', 'trace7.png'],
    'trajectories': ['trajectories1.png', 'trajectories10.png', 'trajectories2.png',
        'trajectories3.png', 'trajectories4.png', 'trajectories5.png',
        'trajectories6.png', 'trajectories7.png', 'trajectories8.png',
        'trajectories9.png'],
    'veil': ['veil1.png', 'veil10.png', 'veil2.png', 'veil3.png', 'veil4.png',
        'veil5.png', 'veil6.png', 'veil7.png', 'veil8.png', 'veil9.png']
};

// functions
function createVideo(galleryId) {
    if (galleryId === '#gallery-menu') return;

    const galleryKey = galleryId.slice(1);
    const activeGallery = document.querySelector(galleryId);

    // return if section has already videos
    if (activeGallery.querySelector('iframe')) return;

    imgData[galleryKey].forEach(file => {
        const div = document.createElement('div');
        div.classList.add('vimeo-video');

        const iframe = document.createElement('iframe');
        iframe.src = 'https://player.vimeo.com/video/' + file;
        iframe.setAttribute('allowFullScreen', '')
        iframe.setAttribute('webkitallowfullscreen', '')
        iframe.setAttribute('mozallowfullscreen', '')
        iframe.setAttribute('frameborder', '0')

        div.appendChild(iframe);
        activeGallery.appendChild(div);
    });
}

function createThumbnails(galleryId) {
    if (galleryId === '#gallery-menu') return;

    const galleryKey = galleryId.slice(1);
    const activeGallery = document.querySelector(galleryId + ' .gallery-items');

    // return if section has already images
    if (activeGallery.querySelector('img')) return;

    imgData[galleryKey].forEach(file => {
        const [filename, ext] = file.split('.');

        const image = document.createElement('img');
        image.classList.add('thumbnail');
        image.src = 'imgs/' + galleryKey + '/thumbnails/' + filename + '-small.' + ext;
        image.alt = filename;

        activeGallery.appendChild(image);

        // binding for zooming
        image.addEventListener('click', createBigImage);
    });
}

function createBigImage(event) {
    // create and add overlay
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    // generate big image src
    const src = event.target.src
        .replace('thumbnails/', '')
        .replace('-small', '');

    // create and add big-image
    const bigImage = document.createElement('img');
    bigImage.classList.add('big-image');
    bigImage.src = src;
    document.body.appendChild(bigImage);

    // click on image to remove it
    bigImage.addEventListener('click', removeBigImage);
    overlay.addEventListener('click', removeBigImage);
}

function removeBigImage(event) {
    // remove overlay and big-image
    const overlay = document.querySelector('.overlay');
    document.body.removeChild(overlay);

    const bigImage = document.querySelector('.big-image');
    document.body.removeChild(bigImage);
}

function changeGallery(event) {
    let hash = window.location.hash;

    // if back button is pushed and there is no hash
    if (!hash) hash = '#gallery-menu';
    // remove big image (when back button is pushed)
    if (document.querySelector('.overlay')) removeBigImage();

    const activeGalleryId = hash.slice(1);

    // prevent scrolling;
    event.preventDefault();

    // if gallery has already images or videos, do not recreate them
    if (['three-d-animation', 'two-d-animation'].includes(activeGalleryId)) {
        createVideo(hash);
    } else {
        createThumbnails(hash);
    }

    // handle galleriy sections
    document.querySelectorAll('.gallery').forEach(section => {
        if (section.id !== activeGalleryId) {
            // hide gallery
            section.classList.add('fade-out');
            // for animation
            window.setTimeout(_ => section.classList.add('hide'), 300);
        } else {
            // show gallery
            // for animation
            window.setTimeout(_ => section.classList.remove('hide'), 300);
            section.classList.remove('fade-out')
        }
    });
    window.setTimeout(_ => window.scrollTo(0, 0), 300);
}

// general bindings
document.querySelectorAll('#gallery-menu a').forEach(a => {
    a.addEventListener('click', e => window.location.hash = event.currentTarget.hash);
});

document.querySelectorAll('nav a[href="#gallery-menu"]').forEach(a => {
    a.addEventListener('click', e => window.location.hash = event.currentTarget.hash);
});

document.querySelectorAll('.back-link a').forEach(a => {
    a.addEventListener('click', e => window.location.hash = event.currentTarget.hash);
});

window.addEventListener("hashchange", changeGallery);

window.onload = _ => history.pushState("", document.title, window.location.pathname);