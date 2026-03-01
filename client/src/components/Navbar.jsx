import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NavItem = ({ to, label, onClick, className = '' }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `relative flex items-center min-h-[44px] px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive ? 'text-white' : 'text-offwhite/70 hover:text-white'} after:content-[''] after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-1 after:bg-gradient-to-r after:from-accent after:to-plum after:rounded-full after:scale-x-0 after:origin-left after:transition-transform after:duration-300 ${isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'} ${className}`}
  >
    {label}
  </NavLink>
)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-lg bg-blackcurrant/80 shadow-xl' : 'backdrop-blur-md bg-blackcurrant/50 shadow-lg'} border-b border-plum/20`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="group relative flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-white tracking-wide transition-all duration-300 hover:scale-105"
        >
          <span className="bg-gradient-to-r from-white via-offwhite to-accent bg-clip-text text-transparent">Mugi</span>{' '}
          <span className="text-accent">Tattoo</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/" label="Home" />
          <NavItem to="/gallery" label="Gallery" />
          <NavItem to="/booking" label="Booking" />
          <NavItem to="/contact" label="Contact" />
          <NavItem to="/admin/login" label="Admin" />
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          type="button"
          className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-plum/40 text-offwhite hover:text-white hover:border-accent/60 transition-all"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </motion.svg>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0 }}
              className="absolute right-0 top-14 h-screen w-72 max-w-[85vw] bg-gradient-to-b from-blackcurrant to-blackcurrant/80 border-l border-plum/30 shadow-2xl"
            >
              {/* Menu Header */}
              <div className="px-4 py-4 border-b border-plum/20">
                <span className="text-sm font-semibold text-offwhite/70 uppercase tracking-widest">Menu</span>
              </div>
              {/* Menu Items */}
              <motion.div
                className="px-4 py-4 flex flex-col gap-1"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {[
                  { to: '/', label: 'Home' },
                  { to: '/gallery', label: 'Gallery' },
                  { to: '/booking', label: 'Booking' },
                  { to: '/contact', label: 'Contact' },
                  { to: '/admin/login', label: 'Admin' }
                ].map((item) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <NavItem
                      to={item.to}
                      label={item.label}
                      onClick={() => setOpen(false)}
                      className="text-base w-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
