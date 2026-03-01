import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MODAL_FADE, MODAL_CONTENT } from '../lib/animations'

export default function Modal({ open, onClose, children, title }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            {...MODAL_FADE}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            {...MODAL_CONTENT}
            className="relative bg-gradient-to-br from-blackcurrant/95 to-blackcurrant/90 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-plum/30"
          >
            {/* Close button */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-plum/20 bg-blackcurrant/80 backdrop-blur-sm rounded-t-3xl z-10">
              {title && <h3 className="text-xl font-bold text-white">{title}</h3>}
              <button
                type="button"
                onClick={onClose}
                className="ml-auto inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-plum/40 text-offwhite hover:text-white hover:border-accent/60 transition-all"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
