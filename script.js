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

document.querySelectorAll(".founder-card-expand").forEach((card) => {
  card.addEventListener("toggle", () => {
    if (!card.open) return;

    document.querySelectorAll(".founder-card-expand").forEach((otherCard) => {
      if (otherCard !== card) otherCard.open = false;
    });
  });
});
