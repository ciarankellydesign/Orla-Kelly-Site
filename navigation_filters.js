// Initialise all filter groups (About + Projects)
document.querySelectorAll('[data-filter-root]').forEach(initFilterGroup);

function initFilterGroup(root) {
  const buttons = Array.from(root.querySelectorAll('[data-filter-btn]'));
  const items = Array.from(root.querySelectorAll('[data-filter-item]'));

  // ----------------------------
  // GSAP HELPERS
  // ----------------------------

  function expandItem(el) {
    gsap.fromTo(
      el, { height: 0, autoAlpha: 0 },
      {
        height: "auto",
        autoAlpha: 1,
        duration: 0.2,
        ease: "power2.out"
      }
    );
  }

  function collapseItem(el) {
    gsap.to(el, {
      height: 0,
      autoAlpha: 0,
      duration: 0.2,
      ease: "power2.in"
    });
  }

  // ----------------------------
  // BUTTON CLICK HANDLER
  // ----------------------------

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filterValue; // "all", "bio", "client", etc.

      // 1) Update active button state (scoped)
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // 2) Show / hide items with height animation
      items.forEach(item => {
        const cat = item.dataset.category;
        const shouldShow = filterValue === 'all' || cat === filterValue;

        if (shouldShow && !item.classList.contains('is-active')) {
          item.classList.add('is-active');
          expandItem(item);
        }

        if (!shouldShow && item.classList.contains('is-active')) {
          item.classList.remove('is-active');
          collapseItem(item);
        }
      });
    });
  });

  // ----------------------------
  // INITIAL STATE
  // ----------------------------

  const initialBtn =
    root.querySelector('[data-filter-btn].is-active') || buttons[0];

  if (initialBtn) {
    initialBtn.click();
  }
}
