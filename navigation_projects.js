// ------------------------------------------------------------
// PROJECT THUMBNAILS ON HOVER
// Matches each list item to its thumbnail by CMS slug (data-slug),
// so it works for both the Projects and Workshops panels.
// Replaces project-thumbnails.js, which duplicated this handler.
// ------------------------------------------------------------
// Thumbnail list is centred in the viewport. Shift it so the current
// image centres on the hovered row, clamped so it never leaves the screen.
const THUMB_EDGE_MARGIN = 24; // px kept clear at top/bottom of viewport

function followRow(rowEl) {
  const row = rowEl.getBoundingClientRect();
  const img = document.querySelector('.g_nav_project-thumbnail_image.current');
  const imgH = img ? img.getBoundingClientRect().height : 0;
  const vh = window.innerHeight;

  let target = row.top + row.height / 2;
  target = Math.min(
    Math.max(target, imgH / 2 + THUMB_EDGE_MARGIN),
    vh - imgH / 2 - THUMB_EDGE_MARGIN
  );

  gsap.to('.g_nav_project-thumbnail_list', {
    y: target - vh / 2,
    duration: 0.6,
    ease: 'power3.out',
    overwrite: true
  });
}

function clearCurrent() {
  $('.g_nav_filter-item.current').removeClass('current');
  $('.g_nav_project-thumbnail_image.current').removeClass('current');
}

$('.g_nav_project-item_cont')
  .on('mouseenter', function () {
    const $cont = $(this);
    const slug = $cont.attr('data-slug');

    clearCurrent();

    // set current on parent list item
    $cont.closest('.g_nav_filter-item').addClass('current');

    // set current on the thumbnail with the same slug
    if (slug) {
      $(`.g_nav_project-thumbnail_item[data-slug="${CSS.escape(slug)}"]`)
        .find('.g_nav_project-thumbnail_image')
        .addClass('current');
    }

    followRow(this);

    console.log('hover in (project):', slug);
  })
  .on('mouseleave', function () {
    clearCurrent();
    console.log('hover out (project)');
  });
