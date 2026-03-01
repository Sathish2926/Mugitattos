import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminHome from './pages/AdminHome'
import AdminDashboard from './pages/AdminDashboard'
import AdminGallery from './pages/AdminGallery'
import RequireAuth from './components/RequireAuth'
import { PAGE_TRANSITION } from './lib/animations'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={PAGE_TRANSITION}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-blackcurrant text-offwhite relative overflow-x-hidden cursor-default md:cursor-none">
      <CustomCursor />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20 mix-blend-soft-light"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 viewBox=%220 0 120 120%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22 width=%22100%25%22 height=%22100%25%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%221%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')"
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
              <Route path="/booking" element={<PageWrapper><Booking /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/admin/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />
              <Route path="/admin" element={<RequireAuth><PageWrapper><AdminHome /></PageWrapper></RequireAuth>} />
              <Route path="/admin/bookings" element={<RequireAuth><PageWrapper><AdminDashboard /></PageWrapper></RequireAuth>} />
              <Route path="/admin/gallery" element={<RequireAuth><PageWrapper><AdminGallery /></PageWrapper></RequireAuth>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        <FloatingWhatsApp />
        <Footer />
      </div>
    </div>
  )
}
