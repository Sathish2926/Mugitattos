import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/Section'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { resolveImageUrl } from '../lib/media'
import { FADE_IN_UP, STAGGER_CONTAINER, SCALE_UP } from '../lib/animations'
import SEO from '../lib/seo'

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

  const fadeInUp = FADE_IN_UP
  const staggerContainer = STAGGER_CONTAINER
  const scaleUp = SCALE_UP

  return (
    <>
      <SEO 
        title="Mugi Tattoo Studio | Professional Tattoo Artist & Custom Designs"
        description="Premium tattoo studio specializing in custom tattoo designs. Bold, clean artwork with personalized consultation. Book your tattoo appointment online today."
        keywords="tattoo studio, tattoo artist, custom tattoos, professional tattooing"
        url="https://mugi-tattoo.com/"
      />
      {/* Cinematic Hero Section with Parallax */}
      <section className="relative min-h-[100vh] bg-[url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-scroll md:bg-fixed overflow-hidden">
        {/* Premium Background Overlays */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blackcurrant/95 via-blackcurrant/80 to-grape/85" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
          
          {/* Animated Glow Orbs */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl hidden sm:block"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-32 right-1/4 w-96 h-96 bg-plum/15 rounded-full blur-3xl hidden sm:block"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 min-h-[100vh] max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } } }}
            className="w-full max-w-3xl"
          >
            {/* Main Heading */}
            <motion.h1
              variants={FADE_IN_UP}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight leading-tight"
            >
              <motion.span className="block bg-gradient-to-r from-white via-offwhite to-accent bg-clip-text text-transparent">
                Memories Fade.
              </motion.span>
              <motion.span variants={FADE_IN_UP} className="block text-accent mt-3">
                Ink Doesn't.
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={FADE_IN_UP}
              className="mt-8 text-lg sm:text-xl md:text-2xl text-offwhite/85 max-w-2xl mx-auto font-light tracking-wide leading-relaxed"
            >
              Mugi Tattoos – Where Stories Become Permanent.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={FADE_IN_UP}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            >
              <Link to="/booking" className="w-full sm:w-auto">
                <Button variant="primary">Book a Session</Button>
              </Link>
              <Link to="/gallery" className="w-full sm:w-auto">
                <Button variant="secondary">View Gallery</Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <svg className="w-8 h-8 text-accent/60 hover:text-accent transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>

        {/* Wave SVG Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg className="w-full h-16 sm:h-24 fill-blackcurrant" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
          </svg>
        </div>
      </section>

      {/* Latest Work Gallery */}
      <Section title="Our Latest Work" subtitle="Each tattoo tells a story">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {items.slice(0, 6).map((item, i) => (
            <motion.div key={item._id} variants={scaleUp}>
              <Link to={`/gallery?id=${item._id}`}>
                <div className="group relative bg-blackcurrant/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-plum/20 hover:border-accent/40 transition-all duration-300 cursor-pointer h-80 sm:h-96">
                  {/* Image */}
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blackcurrant via-blackcurrant/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-offwhite/70 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {item.description || 'View this beautiful piece'}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-12 sm:mt-16"
        >
          <Link to="/gallery">
            <Button>View Full Gallery</Button>
          </Link>
        </motion.div>
      </Section>

      {/* Why Choose Us */}
      <Section title="Why Choose Mugi" subtitle="Trusted by hundreds for exceptional ink">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {[
            { icon: '🎨', title: 'Expert Artists', desc: 'Years of experience and refined skills' },
            { icon: '✨', title: 'Premium Results', desc: 'Flawless execution every single time' },
            { icon: '🛡️', title: 'Safety First', desc: 'Sterile equipment and proper hygiene' },
            { icon: '⏱️', title: 'Quick Booking', desc: 'Simple, fast, and transparent process' }
          ].map((feature, i) => (
            <motion.div key={i} variants={scaleUp}>
              <div className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blackcurrant/80 to-grape/80 border border-plum/20 hover:border-accent/40 hover:from-blackcurrant/90 hover:to-plum/80 transition-all duration-300">
                <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-offwhite/70">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CTA Section */}
      <Section title="Ready to Get Inked?" subtitle="Let's create something amazing together">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link to="/booking" className="w-full sm:w-auto">
            <Button variant="primary">Book Your Appointment</Button>
          </Link>
          <Link to="/contact" className="w-full sm:w-auto">
            <Button variant="secondary">Start a Conversation</Button>
          </Link>
        </motion.div>
      </Section>
    </>
  )
}
