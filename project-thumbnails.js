// Project thumbnails on hover
  $('.g_nav_project-item_cont')
  .on('mouseenter', function () {
    // get parent filter item
    const $filterItem = $(this).closest('.g_nav_filter-item');
    const projectIndex = $filterItem.index();

    // clear existing state
    $('.g_nav_filter-item.current').removeClass('current');
    $('.g_nav_project-thumbnail_image.current').removeClass('current');

    // set current on parent
    $filterItem.addClass('current');

    // set current on matching thumbnail image
    $('.g_nav_project-thumbnail_item')
      .eq(projectIndex)
      .find('.g_nav_project-thumbnail_image')
      .addClass('current');

    console.log('hover in (project):', projectIndex);
  })
  .on('mouseleave', function () {
    // clear state on exit
    $('.g_nav_filter-item.current').removeClass('current');
    $('.g_nav_project-thumbnail_image.current').removeClass('current');

    console.log('hover out (project)');
  });