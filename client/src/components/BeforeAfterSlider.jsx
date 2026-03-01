import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BeforeAfterSlider({ before, after, labelBefore = 'Before', labelAfter = 'After' }) {
  const [value, setValue] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleChange = (e) => setValue(Number(e.target.value))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full overflow-hidden rounded-2xl shadow-lg border border-plum/30 bg-gradient-to-br from-blackcurrant/60 to-grape/40 backdrop-blur-sm cursor-col-resize"
    >
      <div className="relative h-64 sm:h-80 lg:h-96 bg-blackcurrant/80 group">
        {/* After Image */}
        {after && (
          <img
            src={after}
            alt={labelAfter}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Before Image with Clip */}
        {before && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${value}%`, transition: isDragging ? 'none' : 'width 0.1s ease-out' }}
          >
            <img
              src={before}
              alt={labelBefore}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blackcurrant/70 via-transparent to-transparent" />

        {/* Labels */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 left-4 text-xs sm:text-sm font-bold text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-accent/50 transition-colors"
        >
          {labelBefore}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 right-4 text-xs sm:text-sm font-bold text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-accent/50 transition-colors"
        >
          {labelAfter}
        </motion.div>

        {/* Divider Line and Handle */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-accent/80 via-white to-accent/80 shadow-[0_0_20px_rgba(255,94,77,0.6)]"
          style={{ left: `${value}%` }}
          animate={{
            boxShadow: isDragging
              ? '0 0 30px rgba(255, 94, 77, 0.8)'
              : '0 0 20px rgba(255, 94, 77, 0.6)'
          }}
        />

        {/* Handle Circle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border-2 border-accent flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform"
          style={{ left: `${value}%` }}
          animate={{
            scale: isDragging ? 1.2 : 1,
            boxShadow: isDragging
              ? '0 0 40px rgba(255, 94, 77, 0.8)'
              : '0 0 25px rgba(255, 94, 77, 0.6)'
          }}
        >
          {/* Arrow Icons */}
          <div className="flex items-center justify-center gap-1">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>

        {/* Instruction Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-white/70 font-medium pointer-events-none"
        >
          Drag to compare
        </motion.div>
      </div>

      {/* Range Slider */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-blackcurrant/50 to-grape/50 border-t border-plum/20">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="w-full h-2 bg-blackcurrant/60 rounded-lg appearance-none cursor-pointer accent-accent shadow-[0_0_15px_rgba(255,94,77,0.3)]"
          aria-label="Before and after comparison slider"
        />
        <div className="mt-3 flex items-center justify-between text-xs text-offwhite/60">
          <span>← {labelBefore}</span>
          <span>{labelAfter} →</span>
        </div>
      </div>
    </motion.div>
  )
}
