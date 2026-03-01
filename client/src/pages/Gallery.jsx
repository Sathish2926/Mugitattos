import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../components/Section'
import Modal from '../components/Modal'
import api from '../lib/api'
import { resolveImageUrl } from '../lib/media'
import { FADE_IN_UP, STAGGER_CONTAINER, SCALE_UP } from '../lib/animations'
import SEO from '../lib/seo'

export default function Gallery() {
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [items, setItems] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/gallery/public')
        setItems(res.data || [])
      } catch (e) {
        setItems([])
      }
    })()
  }, [])

  return (
    <>
      <SEO 
        title="Tattoo Gallery | Mugi Tattoo Studio | Custom Designs & Artwork"
        description="Explore our portfolio of custom tattoo designs and professional artwork. View galleries of our latest tattoo work and get inspired for your next piece."
        keywords="tattoo gallery, tattoo artwork, custom tattoo designs, tattoo portfolio"
        url="https://mugi-tattoo.com/gallery"
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <Section title="Gallery" subtitle="Each piece tells a story — explore our latest work.">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.1
                }
              }
            }}
          >
            {items.map((item, idx) => (
              <motion.div
                key={item._id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                      duration: 0.5
                    }
                  }
                }}
                className="group cursor-pointer"
                onClick={() => {
                  setSelectedItem(item)
                  setOpen(true)
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.08, y: -12 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  className="relative bg-gradient-to-br from-blackcurrant/50 to-grape/40 backdrop-blur-md rounded-2xl overflow-hidden border border-plum/30 hover:border-accent/60 shadow-lg hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 h-80 sm:h-96"
                >
                  {/* Image Container */}
                  <div className="relative h-full overflow-hidden">
                    <img
                      src={resolveImageUrl(item.imageUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                    />

                    {/* Premium Gradient Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-blackcurrant via-blackcurrant/40 to-transparent opacity-40 group-hover:opacity-90 transition-opacity duration-500"
                      whileHover={{ opacity: 0.9 }}
                    />
                  </div>

                  {/* Content */}
                  <motion.div
                    className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 drop-shadow-lg">
                        {item.title}
                      </h3>
                      <p className="text-sm text-offwhite/90 line-clamp-2 drop-shadow-md">
                        {item.caption || 'View this beautiful piece'}
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 bg-accent/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to View
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      </motion.div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <AnimatePresence>
          {selectedItem && (
            <motion.div initial="hidden" animate="visible" variants={FADE_IN_UP} className="flex flex-col gap-6">
              <img
                src={resolveImageUrl(selectedItem.imageUrl)}
                alt={selectedItem.title || 'Tattoo'}
                className="w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-2xl"
              />
              {(selectedItem.title || selectedItem.caption) && (
                <div>
                  {selectedItem.title && <h3 className="text-white font-semibold text-lg sm:text-xl">{selectedItem.title}</h3>}
                  {selectedItem.caption && <p className="text-offwhite/80 text-sm sm:text-base mt-2 leading-relaxed">{selectedItem.caption}</p>}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  )
}
