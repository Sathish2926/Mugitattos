/**
 * Premium Design System
 * Reusable style classes for consistent luxury aesthetic
 */

// Spacing scale (8px base unit for consistency)
export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  '2xl': '4rem',   // 64px
}

// Premium shadow system
export const shadows = {
  sm: 'shadow-lg',
  md: 'shadow-xl',
  lg: 'shadow-2xl',
  premium: 'shadow-[0_20px_60px_rgba(0,0,0,0.4)]',
  glow: 'shadow-[0_0_40px_rgba(255,94,77,0.3)]',
  glowPlum: 'shadow-[0_0_40px_rgba(107,70,193,0.3)]',
  glowGreen: 'shadow-[0_0_40px_rgba(34,197,94,0.3)]',
  inset: 'shadow-inset shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]',
}

// Border radius system
export const radius = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
}

// Backdrop blur for glassmorphism
export const glass = 'backdrop-blur-md bg-white/5 border border-white/10'

// Gradient overlays
export const gradientOverlay = 'bg-gradient-to-t from-blackcurrant via-blackcurrant/30 to-transparent'

// Card base styles (reusable across components)
export const cardBase = `
  relative
  rounded-2xl
  bg-white/5
  backdrop-blur-md
  border border-plum/30
  shadow-xl
  hover:shadow-[0_0_40px_rgba(255,94,77,0.2)]
  transition-all duration-300
`

// Primary button style
export const buttonPrimary = `
  min-h-[44px]
  px-6 sm:px-8
  py-3 sm:py-4
  rounded-lg
  bg-accent
  text-white
  font-semibold
  shadow-lg
  hover:shadow-[0_0_30px_rgba(255,94,77,0.5)]
  active:scale-95
  disabled:opacity-60 disabled:cursor-not-allowed
  transition-all duration-300
`

// Secondary button style
export const buttonSecondary = `
  min-h-[44px]
  px-6 sm:px-8
  py-3 sm:py-4
  rounded-lg
  bg-plum
  text-white
  font-semibold
  shadow-lg
  hover:shadow-[0_0_30px_rgba(107,70,193,0.5)]
  active:scale-95
  disabled:opacity-60 disabled:cursor-not-allowed
  transition-all duration-300
`

// Input field style (consistent across form)
export const inputBase = `
  w-full
  min-h-[44px]
  rounded-lg
  bg-blackcurrant/70
  text-white
  text-sm sm:text-base
  px-4 py-3
  border border-plum/40
  focus:border-accent/70
  focus:ring-2 focus:ring-accent/30
  transition-all duration-300
  placeholder:text-offwhite/40
`

// Textarea style
export const textareaBase = `
  w-full
  rounded-lg
  bg-blackcurrant/70
  text-white
  text-sm sm:text-base
  px-4 py-3
  border border-plum/40
  focus:border-accent/70
  focus:ring-2 focus:ring-accent/30
  transition-all duration-300
  placeholder:text-offwhite/40
`

// Badge/label style
export const badge = `
  inline-flex
  items-center
  px-3 py-1
  rounded-full
  bg-accent/20
  border border-accent/40
  text-accent
  text-xs sm:text-sm
  font-semibold
`

// Section divider (subtle gradient line)
export const sectionDivider = 'h-px bg-gradient-to-r from-transparent via-plum/50 to-transparent'

// Text gradient (premium heading effect)
export const textGradient = 'bg-gradient-to-r from-white via-offwhite to-accent bg-clip-text text-transparent'

// Staggered delay helpers (for Tailwind CSS)
export const delayMap = {
  0: 'delay-0',
  1: 'delay-100',
  2: 'delay-200',
  3: 'delay-300',
  4: 'delay-500',
  5: 'delay-700',
}

// Responsive text sizes for consistency
export const textSizes = {
  xs: 'text-xs sm:text-sm',
  sm: 'text-sm sm:text-base',
  base: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl md:text-4xl',
  '3xl': 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  '4xl': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
}
