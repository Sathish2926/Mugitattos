import { motion } from 'framer-motion'
import { SCROLL_VISIBLE } from '../lib/animations'

export default function Section({ title, subtitle, children, className = '' }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={SCROLL_VISIBLE}
      className={`relative border-b border-plum/20 bg-gradient-to-b from-transparent via-blackcurrant/20 to-transparent backdrop-blur-sm overflow-hidden ${className}`}
    >
      {/* Premium background grain effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%221%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')",
        backgroundSize: '120px 120px',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {title}
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 h-1 bg-gradient-to-r from-accent via-plum to-transparent rounded-full"
            />
          </motion.div>
        )}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg text-offwhite/75 mb-10 max-w-2xl leading-relaxed font-light"
          >
            {subtitle}
          </motion.p>
        )}
        {children}
      </div>
    </motion.section>
  )
}
