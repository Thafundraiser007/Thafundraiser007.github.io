// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Typing effect for the hero name — respects prefers-reduced-motion
const nameEl = document.getElementById('typed-name');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (nameEl) {
  const fullText = nameEl.textContent.trim();
  if (!prefersReducedMotion && fullText.length > 0) {
    nameEl.textContent = '';
    let i = 0;
    const type = () => {
      nameEl.textContent = fullText.slice(0, i);
      i++;
      if (i <= fullText.length) {
        setTimeout(type, 90);
      } else {
        nameEl.style.borderRight = '2px solid transparent';
      }
    };
    type();
  }
}
