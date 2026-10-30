console.log(
  "%cThis site was built by ciaran",
  "background:blue;color:#fff;padding: 8px;"
);

// ------------------------------------------------------------
// GSAP INITIAL STATE
// ------------------------------------------------------------
gsap.set('.g_nav_filters_cont', { autoAlpha: 0 });
gsap.set('.g_nav_modal_close-btn', { width: 0 });

// ------------------------------------------------------------
// PAGE-SPECIFIC GUARDS
// ------------------------------------------------------------
const $sliderBg = $('.slider-bg_component');
const hasSliderBg = $sliderBg.length > 0;

// ------------------------------------------------------------
// STATE
// ------------------------------------------------------------
let isModalOpen = false;
let currentSection = null;

// ------------------------------------------------------------
// ELEMENTS
// Any button + panel pair sharing a data-section value is picked
// up automatically (projects, workshops, about, ...).
// ------------------------------------------------------------
const $buttons = $('.g_nav_bar_button-wrap[data-section]');
const $sections = $('.g_nav_section_cont[data-section]');
const $btnClose = $('.g_nav_modal_close-btn');

// ------------------------------------------------------------
// NAV CONSTANTS
// ------------------------------------------------------------
const navModalWidth = $('.g_nav_modal_wrap').outerWidth();

const modalOpenWidth = getComputedStyle(document.documentElement)
  .getPropertyValue('--_components---nav--modal-open-width')
  .trim();

// ------------------------------------------------------------
// TEMPORARILY ACTIVATE EVERYTHING TO MEASURE
// ------------------------------------------------------------
$('.g_nav_modal_wrap').addClass('is-active');
$sections.addClass('is-active');

void document.body.offsetHeight;

// CSS modal margins (rem → px)
const modalMargins = parseFloat(
  getComputedStyle(document.documentElement)
  .getPropertyValue('--_components---nav--modal-margins')
);

const navBarHeight = $('.g_nav_bar_cont').outerHeight();

const rootFontSize = parseFloat(
  getComputedStyle(document.documentElement).fontSize
);

const modalMarginsPx = modalMargins * rootFontSize;
const viewportHeight = window.innerHeight;
const maxModalHeight = viewportHeight - (2 * modalMarginsPx) - navBarHeight;

// Capture natural height of every panel, clamped to the viewport
const sectionHeights = {};
$sections.each(function () {
  const name = $(this).attr('data-section');
  sectionHeights[name] = Math.min($(this).outerHeight(), maxModalHeight);
});

// Update base modal width after height capture
document.documentElement.style.setProperty('--_components---nav--modal-base-width', '5rem');

console.log('sectionHeights:', sectionHeights);
console.log('maxModalHeight:', maxModalHeight);
console.log('modalMargins:', modalMargins);

// Remove temp classes
$('.g_nav_modal_wrap').removeClass('is-active');
$sections.removeClass('is-active');

// ------------------------------------------------------------
// ANIMATION CONTROLS
// ------------------------------------------------------------
const ANIM_DURATION = 0.8;
const ANIM_EASE = "power3.inOut";

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function activateSection($button, $section) {
  $('.g_nav_modal_wrap').addClass('is-active');
  $sections.removeClass('is-active');
  $buttons.removeClass('is-active');

  $button.addClass('is-active');
  $section.addClass('is-active');
}

// ------------------------------------------------------------
// OPEN ANIMATION
// ------------------------------------------------------------
function animateOpen(height) {
  $('.g_nav_bg_cont').addClass('is-active');

  const tl = gsap.timeline();

  tl.to('.g_nav_modal_wrap, .g_nav_filters_cont, .g_nav_filter-item', {
      duration: 0.6,
      ease: "power3.out",
      width: modalOpenWidth
    })
    .to($btnClose, {
      duration: ANIM_DURATION,
      autoAlpha: 1,
      ease: ANIM_EASE,
      width: "2.5rem"
    }, "<")
    .to('.g_nav_filters_cont', {
      duration: 0.4,
      autoAlpha: 1,
      ease: "power3.out",
      width: "auto"
    }, "<")
    .fromTo('.g_nav_section_wrap', { height: 0 },
      {
        duration: ANIM_DURATION,
        ease: ANIM_EASE,
        height: height + "px"
      },
      "<"
    );

  // Homepage-only background fade
  if (hasSliderBg) {
    tl.to($sliderBg, { opacity: 0.8 }, "<");
  }
}

// ------------------------------------------------------------
// SWITCH SECTION
// ------------------------------------------------------------
function animateSwitch(toHeight) {
  gsap.to('.g_nav_section_wrap', {
    duration: ANIM_DURATION,
    ease: ANIM_EASE,
    height: toHeight + "px"
  });
}

// ------------------------------------------------------------
// SWIPER HELPERS (GUARDED)
// ------------------------------------------------------------
function pauseSwipers() {
  if (window.bgSwipers?.length) {
    window.bgSwipers.forEach(swiper => {
      swiper.autoplay.stop();
      swiper.keyboard.disable();
      swiper.mousewheel.disable();
    });
  }
}

function resumeSwipers() {
  if (window.bgSwipers?.length) {
    window.bgSwipers.forEach(swiper => {
      swiper.autoplay.start();
      swiper.keyboard.enable();
      swiper.mousewheel.enable();
    });
  }
}

// ------------------------------------------------------------
// SECTION BUTTONS (one handler for all)
// ------------------------------------------------------------
$buttons.on('click', function () {
  const $button = $(this);
  const target = $button.attr('data-section');
  const $section = $sections.filter(`[data-section="${target}"]`);

  if (!$section.length) {
    console.warn(`No .g_nav_section_cont found for data-section="${target}"`);
    return;
  }

  $('body').addClass('is-nav-open');

  if (!isModalOpen) {
    $btnClose.css('display', 'block');
    activateSection($button, $section);
    animateOpen(sectionHeights[target]);
    pauseSwipers();

    isModalOpen = true;
    currentSection = target;
    console.log(`OPEN → ${target}`);
    return;
  }

  if (currentSection !== target) {
    activateSection($button, $section);
    animateSwitch(sectionHeights[target]);

    currentSection = target;
    console.log(`SWITCH → ${target}`);
  }
});

// ------------------------------------------------------------
// CLOSE MODAL
// ------------------------------------------------------------
$btnClose.on('click', function () {
  $('.g_nav_bg_cont').removeClass('is-active');
  $buttons.removeClass('is-active');
  $('body').removeClass('is-nav-open');

  const tl = gsap.timeline();

  tl.to('.g_nav_modal_wrap, .g_nav_filters_cont, .g_nav_filter-item', {
      duration: ANIM_DURATION,
      ease: ANIM_EASE,
      width: navModalWidth
    })
    .to($btnClose, {
      duration: ANIM_DURATION,
      autoAlpha: 0,
      ease: ANIM_EASE,
      width: 0
    }, "<")
    .to('.g_nav_filters_cont', {
      duration: ANIM_DURATION,
      autoAlpha: 0,
      ease: ANIM_EASE,
      width: 0
    }, "<")
    .to('.g_nav_section_wrap', {
      duration: ANIM_DURATION,
      ease: ANIM_EASE,
      height: 0
    }, "<");

  if (hasSliderBg) {
    tl.to($sliderBg, { opacity: 0.95 }, "<");
  }

  tl.add(() => {
    $btnClose.css('display', 'none');
    $('.g_nav_modal_wrap').removeClass('is-active');

    isModalOpen = false;
    currentSection = null;

    resumeSwipers();
    console.log("CLOSE modal");
  });
});

// ------------------------------------------------------------
// BACKGROUND CLICK CLOSE
// ------------------------------------------------------------
$('.g_nav_bg_cont').on('click', function () { if (isModalOpen) $btnClose.trigger('click'); });
