
(() => {
  const container = document.querySelector('.home_hero_logo-container');

  if (!container) {
    console.warn('[morph-svg] container not found');
    return;
  }

  fetch('./assets/morph-svg.svg')
    .then(res => {
      if (!res.ok) throw new Error('SVG fetch failed');
      return res.text();
    })
    .then(svg => {
      container.innerHTML = `
        <div class="home_hero_logo-morph">
          ${svg}
        </div>
      `;
      console.log('[morph-svg] SVG injected');
    })
    .catch(err => {
      console.error('[morph-svg] fetch error', err);
    });
})();





// // Inject the SVG wrapper into the container
// document.querySelector('.home_hero_logo-container').innerHTML = morphSVG;

// // Add classes and IDs
// $(".home_hero_logo-morph path").each(function (index) {
//   $(this).addClass("logo-morph").attr("id", "morph-" + index);
// });

// // Create GSAP timeline (no looping)
// let morphTimeline = gsap.timeline();

// // Get total number of morph targets
// let totalMorphs = $(".home_hero_logo-morph path").length;

// // Morph animation sequence
// for (let i = 1; i < totalMorphs; i++) {
//   morphTimeline.to("#morph-0", {
//     duration: 4,
//     morphSVG: `#morph-${i}`,
//     ease: "power1.inOut"
//   });
// }

// // Add the overall scale animation to play alongside morphs
// //morphTimeline.to(".home_hero_logo-morph", {
// //  scale: 2.5,
// //  transformOrigin: "center center",
// //  ease: "power2.inOut",
// //  duration: morphTimeline.duration()
// //}, 0); // start at same time as morphs

// // Pause timeline initially so we can drive it manually
// morphTimeline.pause();

// // Get screen centre
// let centerX = window.innerWidth / 2;
// let centerY = window.innerHeight / 2;

// // Minimum "dead zone" radius (in pixels)
// const MIN_RADIUS_PX = 100; // adjust for sensitivity

// // --------------------------------------------------
// // SCRUB-LIKE SMOOTHING SETUP (ScrollTrigger-style)
// // --------------------------------------------------
// let targetProgress = 0;
// let currentProgress = 0;

// // lower = more lag / smoothing (try 0.05–0.15)
// const SMOOTHING = 0.04;

// // Drive timeline + scale from a smoothed value
// gsap.ticker.add(() => {
//   currentProgress += (targetProgress - currentProgress) * SMOOTHING;

//   morphTimeline.progress(currentProgress);

//   gsap.set(".home_hero_logo-morph", {
//     scale: 1 + (currentProgress * 2.5),
//     transformOrigin: "center center"
//   });
// });

// // --------------------------------------------------
// // INPUT ONLY: mouse updates targetProgress
// // --------------------------------------------------
// $(document).on("mousemove", function (e) {
//   let dx = e.clientX - centerX;
//   let dy = e.clientY - centerY;
//   let distance = Math.sqrt(dx * dx + dy * dy);
//   let maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

//   let effectiveDistance = Math.max(distance, MIN_RADIUS_PX);
//   let adjustedDistance = effectiveDistance - MIN_RADIUS_PX;
//   let adjustedMaxDistance = maxDistance - MIN_RADIUS_PX;

//   targetProgress = gsap.utils.clamp(
//     0,
//     1,
//     adjustedDistance / adjustedMaxDistance
//   );
// });

// $(function () {
//   // --- Helpers ---
//   const rootStyles = getComputedStyle(document.documentElement);

//   const getCssVar = (name) =>
//     rootStyles.getPropertyValue(name).trim();

//   // --- Colours pulled from CSS variables ---
//   const COLOURS = [
//     getCssVar('--_components---morph--colour-1'),
//     getCssVar('--_components---morph--colour-2'),
//     getCssVar('--_components---morph--colour-3'),
//     getCssVar('--_components---morph--colour-4'),
//     getCssVar('--_components---morph--colour-5')
//   ].filter(Boolean); // safety: removes empty vars

//   const COLOUR_DURATION = 5;

//   // --- Timeline ---
//   const tl = gsap.timeline({
//     repeat: -1,
//     yoyo: true,
//     defaults: {
//       ease: "power2.inOut",
//       duration: COLOUR_DURATION
//     }
//   });

//   // --- Build timeline dynamically ---
//   COLOURS.forEach(colour => {
//     tl.to(".logo-morph", { fill: colour });
//   });
// });

// // Recalculate screen centre on resize
// $(window).on("resize", () => {
//   centerX = window.innerWidth / 2;
//   centerY = window.innerHeight / 2;
// });

