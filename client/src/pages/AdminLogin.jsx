import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../components/Section'
import Button from '../components/Button'
import FormField from '../components/FormField'
import api, { setAuthToken } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { FADE_IN_UP } from '../lib/animations'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      const res = await api.post('/api/admin/login', { email, password })
      localStorage.setItem('adminToken', res.data.token)
      setAuthToken(res.data.token)
      navigate('/admin')
    } catch (err) {
      setMsg(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full min-h-[44px] rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 focus:ring-2 focus:ring-accent/30 transition-all duration-300 placeholder:text-offwhite/40'

  return (
    <Section title="Admin Access" subtitle="Secure login for studio management.">
      <motion.form
        onSubmit={submit}
        variants={FADE_IN_UP}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto w-full"
      >
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blackcurrant/60 to-grape/40 backdrop-blur-sm border border-plum/30 shadow-lg space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-plum mb-4 shadow-lg">
              <span className="text-2xl">🔐</span>
            </div>
            <p className="text-offwhite/70 text-sm">Enter your credentials to access the admin panel</p>
          </motion.div>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FormField label="Email Address">
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mugitattoo.com"
                required
              />
            </FormField>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FormField label="Password">
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </FormField>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {msg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center"
              >
                {msg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-xs text-offwhite/50 text-center pt-4 border-t border-plum/20"
          >
            ✓ Secure connection • Your credentials are encrypted
          </motion.div>
        </div>
      </motion.form>
    </Section>
  )
}
