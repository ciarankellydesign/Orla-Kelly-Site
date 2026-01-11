const DESKTOP_MIN_WIDTH = 992;
const MOBILE_OSCILLATION_DURATION = 22; // seconds

const MIN_RADIUS_PX = 100;
const SCALE_MULTIPLIER = 2.5; 

const COLOUR_DURATION = 5;



window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
const container = document.querySelector('.home_hero_logo-container');
const rootStyles = getComputedStyle(document.documentElement);
const rawSmoothing = parseFloat(
  rootStyles.getPropertyValue('--_components---morph--morph-smoothing')
);
const SMOOTHING = gsap.utils.clamp(0.01, 0.2, rawSmoothing || 0.04);


// Safari blend-mode repaint fix
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
  let ticking = false;

  function forceRepaint() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const el = document.querySelector('.home_hero_logo-container');
        if (el) {
          el.style.transform = 'scale(1.0001)';
          setTimeout(() => {
            el.style.transform = 'scale(1)';
          }, 30);
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('mousemove', forceRepaint);
}


  if (!container) {
    console.warn('[morph-svg] container not found');
    return;
  }

  fetch('https://cdn.jsdelivr.net/gh/ciarankellydesign/orla-kelly-site@v15/assets/morph-svg.svg')
    .then(res => {
      if (!res.ok) throw new Error('SVG fetch failed');
      return res.text();
    })
    .then(svg => {
      console.log('[morph-svg] SVG length:', svg.length);

      // ----------------------------------
      // Inject SVG
      // ----------------------------------
      container.innerHTML = `
        <div class="home_hero_logo-morph">
          ${svg}
        </div>
      `;

      const $paths = $(".home_hero_logo-morph path");

      console.log('[morph-svg] path count:', $paths.length);

      // ----------------------------------
      // Add classes + IDs
      // ----------------------------------
      $paths.each(function (index) {
        $(this)
          .addClass("logo-morph")
          .attr("id", "morph-" + index);
      });

      // ----------------------------------
      // GSAP MORPH TIMELINE
      // ----------------------------------
      const morphTimeline = gsap.timeline({ paused: true });

      const totalMorphs = $paths.length;

      for (let i = 1; i < totalMorphs; i++) {
        morphTimeline.to("#morph-0", {
          duration: 4,
          morphSVG: `#morph-${i}`,
          ease: "power1.inOut"
        });
      }

      // ----------------------------------
      // Screen centre
      // ----------------------------------
      let centerX = window.innerWidth / 2;
      let centerY = window.innerHeight / 2;

      let targetProgress = 0;
      let currentProgress = 0;



      // ----------------------------------
      // Drive timeline + scale
      // ----------------------------------
      gsap.ticker.add(() => {
        currentProgress += (targetProgress - currentProgress) * SMOOTHING;

        morphTimeline.progress(currentProgress);

        gsap.set(".home_hero_logo-morph", {
          scale: 1 + (currentProgress * SCALE_MULTIPLIER),
          transformOrigin: "center center"
        });
      });

      // ----------------------------------
      // Mouse input
      // ----------------------------------
      if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
      $(document).on("mousemove", function (e) {
        let dx = e.clientX - centerX;
        let dy = e.clientY - centerY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

        let effectiveDistance = Math.max(distance, MIN_RADIUS_PX);
        let adjustedDistance = effectiveDistance - MIN_RADIUS_PX;
        let adjustedMaxDistance = maxDistance - MIN_RADIUS_PX;

        targetProgress = gsap.utils.clamp(
          0,
          1,
          adjustedDistance / adjustedMaxDistance
        );
      });
    }

      // ----------------------------------
      // Mobile oscillation
      // ----------------------------------

    if (window.innerWidth < DESKTOP_MIN_WIDTH) {
  gsap.to({}, {
    duration: MOBILE_OSCILLATION_DURATION,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    onUpdate: function () {
      targetProgress = this.progress();
    }
  });
}

      // ----------------------------------
      // Colour cycling
      // ----------------------------------

      const getCssVar = (name) =>
        rootStyles.getPropertyValue(name).trim();

      const COLOURS = [
getCssVar('--_components---morph--colour-1'),
getCssVar('--_components---morph--colour-2'),
getCssVar('--_components---morph--colour-3'),
getCssVar('--_components---morph--colour-4'),
getCssVar('--_components---morph--colour-5')
].filter(Boolean);

      const colourTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: {
          ease: "power2.inOut",
          duration: COLOUR_DURATION
        }
      });

      COLOURS.forEach(colour => {
        colourTl.to(".logo-morph", { fill: colour });
      });

      // ----------------------------------
      // Resize handling
      // ----------------------------------
      $(window).on("resize", () => {
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;
      });

      console.log('[morph-svg] Morph system initialised');
    })
    .catch(err => {
      console.error('[morph-svg] fetch error', err);
    });
});
