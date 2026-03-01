import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [isHoveringLink, setIsHoveringLink] = useState(false)

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)

      // Check if hovering over interactive elements
      const target = e.target
      const isInteractive = target.closest('button') || target.closest('a') || target.closest('[role="button"]')
      setIsHoveringLink(!!isInteractive)
    }

    const leave = () => setVisible(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', leave)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <motion.div
      className={`pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block`}
      animate={{
        x: pos.x - 16,
        y: pos.y - 16,
        opacity: visible ? 1 : 0,
        scale: isHoveringLink ? 1.5 : 1
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 1
      }}
    >
      {/* Outer ring */}
      <div className="relative w-8 h-8">
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
            isHoveringLink
              ? 'border-accent shadow-[0_0_20px_rgba(255,94,77,0.8)]'
              : 'border-accent/60 shadow-[0_0_15px_rgba(255,94,77,0.4)]'
          }`}
        />

        {/* Glow blur */}
        <motion.div
          className="absolute inset-1 rounded-full bg-accent/30 blur-md"
          animate={{
            opacity: isHoveringLink ? 0.5 : 0.2
          }}
        />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-accent rounded-full" />
      </div>
    </motion.div>
  )
}
