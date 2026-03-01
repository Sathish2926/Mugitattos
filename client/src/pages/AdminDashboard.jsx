import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../components/Section'
import Button from '../components/Button'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import api from '../lib/api'
import { FADE_IN_UP, STAGGER_CONTAINER } from '../lib/animations'

function DateInput({ value, onChange }) {
  return (
    <input
      type="datetime-local"
      className="w-full min-h-[44px] rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 focus:ring-2 focus:ring-accent/30 transition-all placeholder:text-offwhite/40"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [confirmModal, setConfirmModal] = useState({ open: false, booking: null, date: '' })
  const [reschedModal, setReschedModal] = useState({ open: false, booking: null, date: '', reason: '' })
  const [manualModal, setManualModal] = useState({ open: false })
  const [altModal, setAltModal] = useState({ open: false, booking: null, alt1: '', alt2: '', alt3: '', message: '' })

  const fetchBookings = async () => {
    setLoading(true); setError(null)
    try {
      const params = filter ? { status: filter } : {}
      const res = await api.get('/api/bookings', { params })
      setBookings(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [filter])

  const openConfirm = (b) => setConfirmModal({ open: true, booking: b, date: '' })
  const openResched = (b) => setReschedModal({ open: true, booking: b, date: '', reason: '' })
  const openAlt = (b) => setAltModal({ open: true, booking: b, alt1: '', alt2: '', alt3: '', message: '' })

  const doConfirm = async () => {
    try {
      // optional scheduledDate update then status confirm
      if (confirmModal.date) {
        await api.patch(`/api/bookings/${confirmModal.booking._id}`, { scheduledDate: new Date(confirmModal.date).toISOString() })
      }
      await api.patch(`/api/bookings/${confirmModal.booking._id}/status`, { status: 'confirmed' })
      setConfirmModal({ open: false, booking: null, date: '' })
      alert('✅ Booking confirmed!\n\n📧 Email confirmation sent to customer\n💬 WhatsApp message sent to customer')
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.error || 'Confirm failed')
    }
  }

  const doReschedule = async () => {
    try {
      await api.post(`/api/bookings/${reschedModal.booking._id}/reschedule`, {
        scheduledDate: new Date(reschedModal.date).toISOString(),
        rescheduleReason: reschedModal.reason
      })
      setReschedModal({ open: false, booking: null, date: '', reason: '' })
      alert('✅ Booking rescheduled!\n\n📧 Email notification sent to customer\n💬 WhatsApp message sent to customer')
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.error || 'Reschedule failed')
    }
  }

  const doAlternatives = async () => {
    const alts = [altModal.alt1, altModal.alt2, altModal.alt3].filter(Boolean).map(d => new Date(d).toISOString())
    if (!alts.length) return alert('Provide at least one alternative time')
    try {
      await api.post(`/api/bookings/${altModal.booking._id}/alternatives`, {
        alternatives: alts,
        message: altModal.message
      })
      setAltModal({ open: false, booking: null, alt1: '', alt2: '', alt3: '', message: '' })
    } catch (err) {
      alert(err.response?.data?.error || 'Sending alternatives failed')
    }
  }

  const [manual, setManual] = useState({ customerName:'', email:'', phone:'', tattooDescription:'', preferredDate:'', scheduledDate:'', status:'pending', notes:'' })
  const doManual = async () => {
    try {
      const payload = { ...manual }
      if (payload.preferredDate) payload.preferredDate = new Date(payload.preferredDate).toISOString()
      if (payload.scheduledDate) payload.scheduledDate = new Date(payload.scheduledDate).toISOString()
      await api.post('/api/bookings/manual', payload)
      setManualModal({ open: false }); setManual({ customerName:'', email:'', phone:'', tattooDescription:'', preferredDate:'', scheduledDate:'', status:'pending', notes:'' })
      if (manual.status === 'confirmed') {
        alert('✅ Manual booking created and confirmed!\n\n📧 Email confirmation sent to customer\n💬 WhatsApp message sent to customer')
      } else {
        alert('✅ Manual booking created successfully!')
      }
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.error || 'Manual booking failed')
    }
  }

  return (
    <Section title="Admin Dashboard" subtitle="Manage all tattoo studio bookings.">
      {/* Filter and Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 space-y-4 sm:space-y-0"
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['', 'pending', 'confirmed', 'reschedule'].map((s) => (
            <motion.button
              key={s || 'all'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === s
                  ? 'bg-gradient-to-r from-accent to-plum text-white shadow-lg'
                  : 'bg-blackcurrant/50 text-offwhite border border-plum/30 hover:border-accent/50'
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : '📋 All'}
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <a href="/admin">
            <Button variant="secondary" size="sm">← Admin Home</Button>
          </a>
          <a href="/admin/gallery">
            <Button variant="secondary" size="sm">📷 Gallery</Button>
          </a>
          <Button
            variant="primary"
            onClick={() => setManualModal({ open: true })}
            size="sm"
          >
            ➕ Manual Booking
          </Button>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-offwhite/70">Loading bookings...</span>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-4"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookings Table */}
      {!loading && (
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="overflow-x-auto rounded-xl border border-plum/20 shadow-lg"
        >
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gradient-to-r from-blackcurrant/80 to-grape/50 border-b border-plum/30">
              <tr>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-white">Customer</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-white hidden sm:table-cell">Email</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-white hidden md:table-cell">Phone</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-white hidden lg:table-cell">Preferred</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-white">Status</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-bold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plum/20">
              {bookings.map((b, idx) => (
                <motion.tr
                  key={b._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-blackcurrant/40 hover:bg-blackcurrant/80 transition-colors"
                >
                  <td className="px-3 sm:px-4 py-3 sm:py-4 font-medium text-white">{b.customerName}</td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-offwhite/70 hidden sm:table-cell text-xs">{b.email}</td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-offwhite/70 hidden md:table-cell text-xs">{b.phone}</td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-offwhite/70 hidden lg:table-cell text-xs">
                    {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                        b.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : b.status === 'reschedule'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {b.status !== 'confirmed' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openConfirm(b)}
                          className="px-2 py-1 text-xs rounded bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 transition-colors"
                        >
                          ✓ Confirm
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openResched(b)}
                        className="px-2 py-1 text-xs rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors"
                      >
                        📅 Resched
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openAlt(b)}
                        className="px-2 py-1 text-xs rounded bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-colors"
                      >
                        ⏱️ Alts
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Confirm Modal */}
      <Modal open={confirmModal.open} onClose={() => setConfirmModal({ open: false, booking: null, date: '' })}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-white">✅ Confirm Booking</h3>
          <p className="text-offwhite/70 text-sm">Confirm the booking for <strong>{confirmModal.booking?.customerName}</strong></p>
          <div>
            <FormField label="Scheduled Date/Time (Optional)">
              <DateInput
                value={confirmModal.date}
                onChange={(v) => setConfirmModal((m) => ({ ...m, date: v }))}
              />
            </FormField>
          </div>
          <p className="text-xs text-offwhite/50 bg-plum/10 border border-plum/30 rounded p-2">
            📧 Email confirmation will be sent to customer
          </p>
          <div className="flex gap-3 justify-end pt-4 border-t border-plum/20">
            <Button
              variant="ghost"
              onClick={() => setConfirmModal({ open: false, booking: null, date: '' })}
            >
              Cancel
            </Button>
            <Button variant="success" onClick={doConfirm}>
              Confirm Booking
            </Button>
          </div>
        </motion.div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal open={reschedModal.open} onClose={() => setReschedModal({ open: false, booking: null, date: '', reason: '' })}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-white">📅 Reschedule Booking</h3>
          <p className="text-offwhite/70 text-sm">Reschedule for <strong>{reschedModal.booking?.customerName}</strong></p>
          <div className="space-y-4">
            <FormField label="New Date/Time">
              <DateInput
                value={reschedModal.date}
                onChange={(v) => setReschedModal((m) => ({ ...m, date: v }))}
              />
            </FormField>
            <FormField label="Reason (Optional)">
              <textarea
                rows="3"
                className="w-full rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 transition-all placeholder:text-offwhite/40"
                placeholder="Why is the booking being rescheduled?"
                value={reschedModal.reason}
                onChange={(e) => setReschedModal((m) => ({ ...m, reason: e.target.value }))}
              />
            </FormField>
          </div>
          <p className="text-xs text-offwhite/50 bg-plum/10 border border-plum/30 rounded p-2">
            📧 Rescheduling notice will be sent to customer
          </p>
          <div className="flex gap-3 justify-end pt-4 border-t border-plum/20">
            <Button
              variant="ghost"
              onClick={() => setReschedModal({ open: false, booking: null, date: '', reason: '' })}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={doReschedule}>
              Reschedule
            </Button>
          </div>
        </motion.div>
      </Modal>

      {/* Alternatives Modal */}
      <Modal open={altModal.open} onClose={() => setAltModal({ open: false, booking: null, alt1: '', alt2: '', alt3: '', message: '' })}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-white">⏱️ Send Alternative Slots</h3>
          <p className="text-offwhite/70 text-sm">Offer alternative dates to <strong>{altModal.booking?.customerName}</strong></p>
          <div className="space-y-3">
            <FormField label="Alternative 1">
              <DateInput
                value={altModal.alt1}
                onChange={(v) => setAltModal((m) => ({ ...m, alt1: v }))}
              />
            </FormField>
            <FormField label="Alternative 2">
              <DateInput
                value={altModal.alt2}
                onChange={(v) => setAltModal((m) => ({ ...m, alt2: v }))}
              />
            </FormField>
            <FormField label="Alternative 3">
              <DateInput
                value={altModal.alt3}
                onChange={(v) => setAltModal((m) => ({ ...m, alt3: v }))}
              />
            </FormField>
            <FormField label="Custom Message (Optional)">
              <textarea
                rows="3"
                className="w-full rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 transition-all placeholder:text-offwhite/40"
                placeholder="Any additional message for the customer?"
                value={altModal.message}
                onChange={(e) => setAltModal((m) => ({ ...m, message: e.target.value }))}
              />
            </FormField>
          </div>
          <p className="text-xs text-offwhite/50 bg-plum/10 border border-plum/30 rounded p-2">
            📧 Options will be sent via email and WhatsApp
          </p>
          <div className="flex gap-3 justify-end pt-4 border-t border-plum/20">
            <Button
              variant="ghost"
              onClick={() => setAltModal({ open: false, booking: null, alt1: '', alt2: '', alt3: '', message: '' })}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={doAlternatives}>
              Send Options
            </Button>
          </div>
        </motion.div>
      </Modal>

      {/* Manual Booking Modal */}
      <Modal open={manualModal.open} onClose={() => setManualModal({ open: false })}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-2">📞 Manual Booking</h3>
            <p className="text-offwhite/70 text-sm">Create a booking for customers who called or walked in.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Customer Name *">
              <input
                className="w-full min-h-[44px] rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 focus:ring-2 focus:ring-accent/30 transition-all placeholder:text-offwhite/40"
                placeholder="John Doe"
                value={manual.customerName}
                onChange={(e) => setManual((m) => ({ ...m, customerName: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Phone *">
              <input
                className="w-full min-h-[44px] rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 focus:ring-2 focus:ring-accent/30 transition-all placeholder:text-offwhite/40"
                placeholder="+91 98765 43210"
                value={manual.phone}
                onChange={(e) => setManual((m) => ({ ...m, phone: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Email *" className="md:col-span-2">
              <input
                type="email"
                className="w-full min-h-[44px] rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 focus:ring-2 focus:ring-accent/30 transition-all placeholder:text-offwhite/40"
                placeholder="john@example.com"
                value={manual.email}
                onChange={(e) => setManual((m) => ({ ...m, email: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Preferred Date/Time">
              <DateInput
                value={manual.preferredDate}
                onChange={(v) => setManual((m) => ({ ...m, preferredDate: v }))}
              />
            </FormField>
            <FormField label="Confirmed Date/Time">
              <DateInput
                value={manual.scheduledDate}
                onChange={(v) => setManual((m) => ({ ...m, scheduledDate: v }))}
              />
            </FormField>
            <FormField label="Status *" className="md:col-span-2">
              <select
                className="w-full min-h-[44px] rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 transition-all"
                value={manual.status}
                onChange={(e) => setManual((m) => ({ ...m, status: e.target.value }))}
              >
                <option value="pending">Pending (needs confirmation)</option>
                <option value="confirmed">Confirmed (send notifications)</option>
              </select>
            </FormField>
            <FormField label="Tattoo Description *" className="md:col-span-2">
              <textarea
                rows="4"
                className="w-full rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 focus:ring-2 focus:ring-accent/30 transition-all placeholder:text-offwhite/40"
                placeholder="Describe the tattoo design, style, size, placement..."
                value={manual.tattooDescription}
                onChange={(e) => setManual((m) => ({ ...m, tattooDescription: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Additional Notes" className="md:col-span-2">
              <textarea
                rows="3"
                className="w-full rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 focus:ring-2 focus:ring-accent/30 transition-all placeholder:text-offwhite/40"
                placeholder="Special requests, allergies, preferences..."
                value={manual.notes}
                onChange={(e) => setManual((m) => ({ ...m, notes: e.target.value }))}
              />
            </FormField>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-sm text-offwhite/80">
              💡 <strong>Tip:</strong> If you set status to "Confirmed", email and WhatsApp notifications will be sent immediately.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-plum/20">
            <Button variant="ghost" onClick={() => setManualModal({ open: false })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={doManual}>
              Create Booking
            </Button>
          </div>
        </motion.div>
      </Modal>
    </Section>
  )
}

