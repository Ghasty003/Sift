// Sift's motion language. Three durations, purpose-matched easing —
// nothing animates without going through one of these.
export const MOTION = {
  micro: { duration: 0.12, ease: [0.4, 0, 0.2, 1] }, // favorite toggle, button press
  ui: { duration: 0.18, ease: [0.4, 0, 0.2, 1] }, // menus, tags, hover reveal
  layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, // card exit, collection transitions
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
