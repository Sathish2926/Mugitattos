import { motion } from 'framer-motion'
import { TIMING } from '../lib/animations'

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyles = `
    group
    relative
    inline-flex w-full sm:w-auto
    items-center justify-center
    min-h-[48px] px-6 sm:px-8 py-3 sm:py-4
    rounded-xl
    font-semibold text-sm sm:text-base
    shadow-lg
    transition-all duration-${Math.round(TIMING.normal * 1000)}
    active:scale-95
    disabled:opacity-60 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blackcurrant
    motion-reduce:transition-none motion-reduce:transform-none
  `

  const variantStyles = {
    primary: `
      bg-accent text-white
      hover:shadow-[0_0_30px_rgba(255,94,77,0.6)]
      focus:ring-accent/50
      sm:hover:scale-105
    `,
    secondary: `
      bg-plum text-white
      hover:shadow-[0_0_30px_rgba(107,70,193,0.6)]
      focus:ring-plum/50
      sm:hover:scale-105
    `,
    ghost: `
      bg-transparent text-offwhite
      border border-plum/40
      hover:border-accent/70 hover:text-white
      focus:ring-accent/50
    `,
    success: `
      bg-green-600 text-white
      hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]
      focus:ring-green-500/50
      sm:hover:scale-105
    `,
  }

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: TIMING.fast }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant === 'primary' || variant === 'secondary' ? (
        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-accent/20 to-plum/20 rounded-xl" />
      ) : null}
    </motion.button>
  )
}
