/**
 * Unified Animation System & Constants
 * Ensures consistent, premium feel across the entire app
 */

// Animation timing presets (ease-out for smooth, responsive feel)
export const TIMING = {
  fast: 0.2,
  normal: 0.3,
  smooth: 0.4,
  slow: 0.6,
  slower: 0.8,
}

// Easing functions for premium feel
export const EASING = 'easeOut'

// Stagger configuration for cascading animations
export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

// Fade In & Up (primary reveal animation)
export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.smooth, ease: EASING },
  },
}

// Scale Up (card/image entrance)
export const SCALE_UP = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: TIMING.normal, ease: EASING },
  },
}

// Slide In From Left
export const SLIDE_LEFT = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: TIMING.smooth, ease: EASING },
  },
}

// Slide In From Right
export const SLIDE_RIGHT = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: TIMING.smooth, ease: EASING },
  },
}

// Staggered List Item
export const LIST_ITEM = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.normal, ease: EASING },
  },
}

// Hover Scale (for cards and buttons)
export const HOVER_SCALE = {
  scale: 1.02,
  transition: { duration: TIMING.normal, ease: EASING },
}

// Tap Animation (for mobile)
export const TAP_SCALE = {
  scale: 0.98,
  transition: { duration: TIMING.fast, ease: EASING },
}

// Page Transition (route change)
export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: TIMING.normal, ease: EASING } },
  exit: { opacity: 0, y: -10, transition: { duration: TIMING.fast, ease: EASING } },
}

// Smooth Scroll Trigger (for sections visible in viewport)
export const SCROLL_VISIBLE = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.smooth, ease: EASING },
  },
}

// Image Load Fade (lazy loaded images)
export const IMAGE_FADE = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: TIMING.smooth, ease: EASING },
  },
}

// Modal Backdrop Fade
export const MODAL_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: TIMING.normal } },
  exit: { opacity: 0, transition: { duration: TIMING.fast } },
}

// Modal Content Scale
export const MODAL_CONTENT = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: TIMING.smooth } },
  exit: { opacity: 0, scale: 0.9, y: 10, transition: { duration: TIMING.fast } },
}

// Rotate 3D (subtle premium effect)
export const ROTATE_3D = {
  hidden: { opacity: 0, rotateY: -15, y: 20 },
  visible: {
    opacity: 1,
    rotateY: 0,
    y: 0,
    transition: { duration: TIMING.smooth, ease: EASING },
  },
}
