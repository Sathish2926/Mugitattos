import { motion } from 'framer-motion'
import { FADE_IN_UP } from '../lib/animations'

export default function Footer() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={FADE_IN_UP}
      className="border-t border-plum/20 bg-gradient-to-b from-blackcurrant/50 to-blackcurrant/80 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-bold bg-gradient-to-r from-white to-accent bg-clip-text text-transparent mb-2">Mugi Tattoo</h3>
            <p className="text-offwhite/60 text-sm">Premium ink. Bold style. Permanent stories.</p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-sm text-offwhite/60">
              <li><a href="/" className="hover:text-accent transition">Home</a></li>
              <li><a href="/gallery" className="hover:text-accent transition">Gallery</a></li>
              <li><a href="/booking" className="hover:text-accent transition">Booking</a></li>
              <li><a href="/contact" className="hover:text-accent transition">Contact</a></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Connect</h4>
            <ul className="space-y-2 text-sm text-offwhite/60">
              <li><a href="https://instagram.com/mugi_tattoos" className="hover:text-accent transition">Instagram</a></li>
              <li><a href="mailto:mugitattoos@gmail.com" className="hover:text-accent transition">Email</a></li>
              <li><a href="https://wa.me/919080719253" className="hover:text-accent transition">WhatsApp</a></li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-plum/30 to-transparent my-8 origin-left"
        />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-offwhite/50"
        >
          <p>© {new Date().getFullYear()} Mugi Tattoo Studio. All rights reserved.</p>
          <p className="italic">Where Stories Become Permanent Ink.</p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
