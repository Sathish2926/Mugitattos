import { motion } from 'framer-motion'

export default function FormField({ label, children, error, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-2 ${className}`}
    >
      <label className="block text-sm font-semibold text-white tracking-wide">
        {label}
      </label>
      <div className="relative">
        {children}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm text-red-300 font-medium flex items-center gap-1"
        >
          <span>⚠️</span> {error}
        </motion.p>
      )}
    </motion.div>
  )
}
