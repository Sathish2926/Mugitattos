import { motion } from 'framer-motion'
import Section from '../components/Section'
import Button from '../components/Button'
import { SCALE_UP, STAGGER_CONTAINER } from '../lib/animations'

export default function AdminHome() {
  return (
    <Section title="Admin Dashboard" subtitle="Manage your tattoo studio operations.">
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
      >
        {/* Bookings Card */}
        <motion.div
          variants={SCALE_UP}
          whileHover={{ scale: 1.05, y: -8 }}
          transition={{ duration: 0.3 }}
          className="group relative bg-gradient-to-br from-blackcurrant/60 to-grape/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-plum/20 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 overflow-hidden"
        >
          {/* Background gradient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-300" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-4 w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-plum flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
              📅
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Bookings</h3>
            <p className="text-offwhite/70 text-sm sm:text-base mb-6 flex-1">Review requests, confirm dates, reschedule, and manage manual bookings.</p>
            <a href="/admin/bookings" className="mt-auto block">
              <Button variant="primary" className="w-full">
                Manage Bookings
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Gallery Card */}
        <motion.div
          variants={SCALE_UP}
          whileHover={{ scale: 1.05, y: -8 }}
          transition={{ duration: 0.3 }}
          className="group relative bg-gradient-to-br from-blackcurrant/60 to-grape/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-plum/20 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 overflow-hidden"
        >
          {/* Background gradient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-300" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-4 w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-plum flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
              🖼️
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Gallery</h3>
            <p className="text-offwhite/70 text-sm sm:text-base mb-6 flex-1">Upload new images, add captions, and control visibility.</p>
            <a href="/admin/gallery" className="mt-auto block">
              <Button variant="primary" className="w-full">
                Manage Gallery
              </Button>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  )
}
