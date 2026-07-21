const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((card) => observer.observe(card));

const mapModalIds = Array.from({ length: 8 }, (_, index) => `map-modal-${index + 1}`);
const mapModalIndexById = new Map(mapModalIds.map((id, index) => [id, index]));
const swipeState = new WeakMap();

function resolveMapModalIdFromHash(hash) {
  if (!hash) return null;
  const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
  return mapModalIndexById.has(cleanHash) ? cleanHash : null;
}

function navigateMapModal(fromId, direction) {
  const fromIndex = mapModalIndexById.get(fromId);
  if (fromIndex == null) return;
  const nextIndex = (fromIndex + direction + mapModalIds.length) % mapModalIds.length;
  window.location.hash = mapModalIds[nextIndex];
}

function shouldIgnoreSwipeTarget(target) {
  return Boolean(target && target.closest(".map-nav-arrow, .map-dot, .founder-modal-close, .founder-modal-backdrop"));
}

document.querySelectorAll(".map-stage").forEach((stage) => {
  stage.style.touchAction = "pan-y";

  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" || shouldIgnoreSwipeTarget(event.target)) return;
    const modal = stage.closest(".map-modal");
    if (!modal) return;

    swipeState.set(stage, {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      modalId: modal.id,
      locked: false
    });
  });

  stage.addEventListener("pointerup", (event) => {
    const state = swipeState.get(stage);
    if (!state || state.pointerId !== event.pointerId || state.locked) return;
    swipeState.delete(stage);

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < 42 || absX < absY * 1.2) return;

    event.preventDefault();
    state.locked = true;
    navigateMapModal(state.modalId, deltaX < 0 ? 1 : -1);
  });

  stage.addEventListener("pointercancel", () => {
    swipeState.delete(stage);
  });
});
