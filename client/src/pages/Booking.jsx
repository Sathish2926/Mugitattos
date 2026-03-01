import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../components/Section'
import Button from '../components/Button'
import FormField from '../components/FormField'
import api from '../lib/api'
import { FADE_IN_UP, TIMING } from '../lib/animations'
import SEO from '../lib/seo'

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
]

const STEPS = ['Details', 'Date & Time', 'Review']

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState({
    customerName: '', 
    email: '', 
    phone: '', 
    tattooDescription: '', 
    preferredDate: '', 
    preferredTime: '',
    notes: ''
  })
  const [status, setStatus] = useState({ loading: false, success: null, error: null })

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const inputClass = 'w-full min-h-[44px] rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 focus:ring-2 focus:ring-accent/30 transition-all duration-300 ease-out placeholder:text-offwhite/40'
  const textareaClass = 'w-full rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 focus:ring-2 focus:ring-accent/30 transition-all duration-300 ease-out placeholder:text-offwhite/40'

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const canProceedFromStep = (step) => {
    if (step === 0) {
      return form.customerName && form.email && form.phone && form.tattooDescription
    }
    if (step === 1) {
      return form.preferredDate && form.preferredTime
    }
    return true
  }

  const submit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, success: null, error: null })
    try {
      const dateTime = new Date(`${form.preferredDate}T${convertTo24Hour(form.preferredTime)}`)
      const payload = {
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        tattooDescription: form.tattooDescription,
        preferredDate: dateTime.toISOString(),
        notes: form.notes
      }
      await api.post('/api/bookings', payload)
      setStatus({ loading: false, success: 'Booking request submitted! We\'ll contact you soon.', error: null })
      setForm({ customerName: '', email: '', phone: '', tattooDescription: '', preferredDate: '', preferredTime: '', notes: '' })
      setCurrentStep(0)
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || err.message
      setStatus({ loading: false, success: null, error: msg })
    }
  }

  const convertTo24Hour = (time12h) => {
    const [time, period] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    hours = parseInt(hours)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return `${hours.toString().padStart(2, '0')}:${minutes}:00`
  }

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  return (
    <>
      <SEO 
        title="Book a Tattoo Appointment | Mugi Tattoo Studio"
        description="Book your tattoo appointment online at Mugi Tattoo Studio. Easy booking process for custom tattoo designs and professional tattooing services."
        keywords="book tattoo, tattoo appointment, tattoo booking online"
        url="https://mugi-tattoo.com/booking"
      />
      <Section title="Book a Session" subtitle="Tell us about your tattoo idea and preferred time.">
      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={FADE_IN_UP}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div 
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      idx <= currentStep 
                        ? 'bg-accent text-white shadow-[0_0_20px_rgba(255,94,77,0.5)]' 
                        : 'bg-blackcurrant/50 text-offwhite/50 border border-plum/30'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {idx + 1}
                  </motion.div>
                  <span className={`mt-2 text-xs sm:text-sm font-medium ${idx <= currentStep ? 'text-accent' : 'text-offwhite/50'}`}>
                    {step}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`hidden sm:block w-10 lg:w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                    idx < currentStep ? 'bg-accent' : 'bg-plum/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={FADE_IN_UP}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={submit} className="p-5 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-plum/30 shadow-premium">
              <AnimatePresence mode="wait">
                {/* Step 1: Details */}
                {currentStep === 0 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-offwhite mb-6">Your Details</h3>
                    
                    <FormField label="Full Name">
                      <input 
                        className={inputClass} 
                        value={form.customerName} 
                        onChange={(e)=>update('customerName', e.target.value)} 
                        placeholder="John Doe"
                        required 
                      />
                    </FormField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField label="Email">
                        <input 
                          type="email" 
                          className={inputClass} 
                          value={form.email} 
                          onChange={(e)=>update('email', e.target.value)} 
                          placeholder="john@example.com"
                          required 
                        />
                      </FormField>
                      <FormField label="Phone">
                        <input 
                          className={inputClass} 
                          value={form.phone} 
                          onChange={(e)=>update('phone', e.target.value)} 
                          placeholder="+91 98765 43210"
                          required 
                        />
                      </FormField>
                    </div>

                    <FormField label="Tattoo Description">
                      <textarea 
                        rows="5" 
                        className={textareaClass} 
                        value={form.tattooDescription} 
                        onChange={(e)=>update('tattooDescription', e.target.value)} 
                        placeholder="Describe your tattoo idea, style, and any reference images you have..."
                        required 
                      />
                    </FormField>

                    <FormField label="Additional Notes (Optional)">
                      <textarea 
                        rows="3" 
                        className={textareaClass} 
                        value={form.notes} 
                        onChange={(e)=>update('notes', e.target.value)} 
                        placeholder="Any special requests or concerns?"
                      />
                    </FormField>
                  </motion.div>
                )}

                {/* Step 2: Date & Time */}
                {currentStep === 1 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-offwhite mb-6">Choose Date & Time</h3>
                    
                    <FormField label="Preferred Date">
                      <input 
                        type="date" 
                        className={inputClass} 
                        value={form.preferredDate} 
                        onChange={(e)=>update('preferredDate', e.target.value)}
                        min={getTodayDate()}
                        required 
                      />
                    </FormField>

                    <FormField label="Preferred Time">
                      <div className="max-h-64 overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {TIME_SLOTS.map((slot) => (
                            <motion.button
                              key={slot}
                              type="button"
                              onClick={() => update('preferredTime', slot)}
                              className={`min-h-[44px] p-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
                                form.preferredTime === slot
                                  ? 'bg-accent text-white shadow-[0_0_20px_rgba(255,94,77,0.5)] scale-105'
                                  : 'bg-blackcurrant/50 text-offwhite border border-plum/30 hover:border-accent/50 hover:scale-105'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {slot}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </FormField>
                  </motion.div>
                )}

                {/* Step 3: Review */}
                {currentStep === 2 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-offwhite mb-6">Review Your Booking</h3>
                    
                    <div className="space-y-4 p-6 rounded-xl bg-blackcurrant/50 border border-plum/30">
                      <div>
                        <p className="text-offwhite/60 text-sm">Name</p>
                        <p className="text-offwhite font-medium">{form.customerName}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-offwhite/60 text-sm">Email</p>
                          <p className="text-offwhite font-medium">{form.email}</p>
                        </div>
                        <div>
                          <p className="text-offwhite/60 text-sm">Phone</p>
                          <p className="text-offwhite font-medium">{form.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-offwhite/60 text-sm">Tattoo Description</p>
                        <p className="text-offwhite font-medium">{form.tattooDescription}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-offwhite/60 text-sm">Date</p>
                          <p className="text-accent font-medium">{new Date(form.preferredDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-offwhite/60 text-sm">Time</p>
                          <p className="text-accent font-medium">{form.preferredTime}</p>
                        </div>
                      </div>
                      {form.notes && (
                        <div>
                          <p className="text-offwhite/60 text-sm">Notes</p>
                          <p className="text-offwhite font-medium">{form.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-lg bg-plum/10 border border-plum/30">
                      <p className="text-offwhite/80 text-sm">
                        <span className="font-semibold">Please note:</span> This is a booking request. 
                        We'll contact you within 24 hours to confirm your appointment.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mt-8 pt-6 border-t border-plum/30">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
                    currentStep === 0 
                      ? 'opacity-0 pointer-events-none' 
                      : 'bg-blackcurrant/50 text-offwhite border border-plum/30 hover:border-accent/50'
                  }`}
                  whileHover={currentStep !== 0 ? { scale: 1.05 } : {}}
                  whileTap={currentStep !== 0 ? { scale: 0.95 } : {}}
                >
                  ← Previous
                </motion.button>

                {currentStep < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceedFromStep(currentStep)}
                  >
                    Next →
                  </Button>
                ) : (
                  <Button type="submit" disabled={status.loading}>
                    {status.loading ? 'Submitting...' : 'Confirm Booking'}
                  </Button>
                )}
              </div>

              {status.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                >
                  <p className="text-red-300">{status.error}</p>
                </motion.div>
              )}
              {status.success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30"
                >
                  <p className="text-green-300">{status.success}</p>
                </motion.div>
              )}
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-24 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-plum/20 to-accent/10 backdrop-blur-md border border-plum/30 shadow-premium"
            >
              <h3 className="text-lg sm:text-xl font-bold text-offwhite mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Booking Summary
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blackcurrant/50 border border-plum/20">
                  <p className="text-offwhite/60 text-sm mb-1">Name</p>
                  <p className="text-offwhite font-medium">
                    {form.customerName || <span className="text-offwhite/40">Not provided</span>}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-blackcurrant/50 border border-plum/20">
                  <p className="text-offwhite/60 text-sm mb-1">Date & Time</p>
                  <p className="text-accent font-medium">
                    {form.preferredDate && form.preferredTime 
                      ? `${new Date(form.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${form.preferredTime}`
                      : <span className="text-offwhite/40">Not selected</span>
                    }
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-blackcurrant/50 border border-plum/20">
                  <p className="text-offwhite/60 text-sm mb-1">Status</p>
                  <p className="text-offwhite font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      currentStep === 2 ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                    }`}></span>
                    {currentStep === 0 && 'Entering details'}
                    {currentStep === 1 && 'Selecting time'}
                    {currentStep === 2 && 'Ready to submit'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-plum/30">
                <h4 className="text-offwhite font-semibold mb-3">What's Next?</h4>
                <ul className="space-y-2 text-sm text-offwhite/80">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>We'll review your request within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>You'll receive email & WhatsApp confirmation</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-offwhite/90 text-sm font-medium">
                  📞 Need help? <br/>
                  <a href="https://wa.me/919080719253" className="text-accent hover:underline">WhatsApp us</a>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
    </>
  )
}
