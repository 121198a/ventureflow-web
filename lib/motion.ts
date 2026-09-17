import type { Transition, Variants } from "framer-motion";

/**
 * VentureFlow Motion Design System
 * Subtle, organic, high-end venture/fintech animation curves and variants.
 */

// Premium easing curves
export const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_SUBTLE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

// Timing presets (seconds)
export const DURATION = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.45,
  slow: 0.65,
  deliberate: 0.85,
} as const;

// Transition presets
export const transitionFast: Transition = {
  duration: DURATION.fast,
  ease: EASE_EXPO,
};

export const transitionNormal: Transition = {
  duration: DURATION.normal,
  ease: EASE_PREMIUM,
};

export const transitionSlow: Transition = {
  duration: DURATION.slow,
  ease: EASE_EXPO,
};

// Standard Variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionNormal,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionNormal,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionNormal,
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionNormal,
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionNormal,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionNormal,
  },
};

export const staggerContainer = (
  staggerChildren = 0.08,
  delayChildren = 0.05
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionNormal,
  },
};

export const cardHoverMotion = {
  rest: { y: 0, transition: transitionFast },
  hover: {
    y: -4,
    transition: { duration: 0.3, ease: EASE_EXPO },
  },
};

export const buttonPress = {
  hover: { scale: 1.02, transition: { duration: 0.18, ease: EASE_EXPO } },
  tap: { scale: 0.98, transition: { duration: 0.1, ease: EASE_EXPO } },
};

// Navbar & Drawer animations
export const navbarMotion: Variants = {
  hidden: { y: -24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: EASE_EXPO },
  },
};

export const mobileMenuBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.28, ease: EASE_EXPO },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: EASE_EXPO },
  },
};

export const mobileMenuDrawer: Variants = {
  hidden: { opacity: 0, y: -16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      ease: EASE_EXPO,
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.2, ease: EASE_EXPO },
  },
};

export const mobileMenuItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: EASE_EXPO },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.15 },
  },
};

// Overlay & Dialog Transitions
export const modalOverlayMotion: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: EASE_EXPO },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: EASE_EXPO },
  },
};

export const modalContentMotion: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: EASE_PREMIUM },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 6,
    transition: { duration: 0.18, ease: EASE_EXPO },
  },
};

// Dropdown & Popover Transitions
export const dropdownMotion: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: EASE_EXPO },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.12, ease: EASE_EXPO },
  },
};

// Micro-interaction presets
export const hoverLiftSubtle = {
  rest: { y: 0, transition: { duration: 0.2, ease: EASE_EXPO } },
  hover: { y: -2, transition: { duration: 0.2, ease: EASE_EXPO } },
};

export const iconHoverRotate = {
  rest: { rotate: 0 },
  hover: { rotate: 12, transition: { duration: 0.2, ease: EASE_EXPO } },
};
