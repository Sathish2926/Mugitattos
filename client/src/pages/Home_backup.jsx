import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/Section'
import Button from '../components/Button'
import AnimatedCounter from '../components/AnimatedCounter'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { resolveImageUrl, getImageTransformVars } from '../lib/media'

export default function Home() {
  const [items, setItems] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/gallery/public')
        setItems(res.data)
      } catch (e) {
        setItems([])
      }
    })()
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  }

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } }
  }


  return (
    <>
      {/* Hero Section with Parallax & Gradient Overlay */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-scroll md:bg-fixed overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blackcurrant/90 via-blackcurrant/70 to-grape/80" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse hidden sm:block" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-plum/20 rounded-full blur-3xl animate-pulse hidden sm:block" style={{ animationDelay: '1s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-24 lg:py-32 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="backdrop-blur-sm bg-blackcurrant/40 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-plum/30"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-offwhite to-accent bg-clip-text text-transparent">
                Memories Fade.
              </span>
              <br />
              <span className="text-accent">Ink Doesn't.</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-offwhite/90 max-w-2xl mx-auto font-light tracking-wide"
            >
              Mugi Tattoos – Where Stories Become Permanent.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6"
            >
              <Link to="/booking" className="w-full sm:w-auto">
                <Button className="group relative overflow-hidden transition-all duration-300 ease-out sm:hover:scale-105 sm:hover:shadow-[0_0_30px_rgba(255,94,77,0.6)] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                  <span className="relative z-10">Book a Session</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-plum opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
              <Link to="/gallery" className="w-full sm:w-auto">
                <Button className="group bg-plum hover:bg-plum/80 transition-all duration-300 ease-out sm:hover:scale-105 sm:hover:shadow-[0_0_30px_rgba(107,70,193,0.6)] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                  View Gallery
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
            className="mt-10 sm:mt-16"
          >
            <svg className="w-8 h-8 mx-auto text-offwhite/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 sm:h-24 fill-blackcurrant" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
          </svg>
        </div>
      </section>

      {/* Latest Work Section with Stagger Animation */}
      <div className="relative bg-[radial-gradient(circle_at_20%_20%,rgba(255,94,77,0.08),transparent_45%)]">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-blackcurrant/80" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="relative z-10"
        >
          <Section title="Latest Work" subtitle="Follow us @mugi.tattoo">
          {items.length === 0 ? (
            <motion.p variants={fadeInUp} className="text-offwhite/70 text-center py-12">No images yet.</motion.p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {items.slice(0, 6).map((it) => (
                <motion.div
                  key={it._id}
                  variants={scaleUp}
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="group relative overflow-hidden rounded-xl shadow-premium cursor-pointer"
                >
                  <img 
                    alt={it.title || 'Tattoo'} 
                    className="w-full h-52 sm:h-64 lg:h-72 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    src={resolveImageUrl(it.imageUrl)} 
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blackcurrant via-blackcurrant/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      {it.title && <h3 className="font-bold text-lg">{it.title}</h3>}
                      {it.caption && <p className="text-sm text-offwhite/90 mt-1">{it.caption}</p>}
                    </div>
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 ring-2 ring-accent/0 group-hover:ring-accent/50 rounded-xl transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          )}
          </Section>
        </motion.div>
      </div>

      {/* Gradient Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-plum/50 to-transparent my-12" />

      {/* Instagram Section with Enhanced Cards */}
      <div className="relative bg-[radial-gradient(circle_at_80%_30%,rgba(107,70,193,0.12),transparent_50%)]">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-blackcurrant/80" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="relative z-10"
        >
          
        </motion.div>
      </div>
    </>
  )
}
