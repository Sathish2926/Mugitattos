import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../components/Section'
import Button from '../components/Button'
import Modal from '../components/Modal'
import FormField from '../components/FormField'
import api from '../lib/api'
import { resolveImageUrl } from '../lib/media'
import { FADE_IN_UP, SCALE_UP, STAGGER_CONTAINER } from '../lib/animations'

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({ title:'', caption:'', tags:'' })
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [file, setFile] = useState(null)
  const [existingImage, setExistingImage] = useState('')
  const [preview, setPreview] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [cropMode, setCropMode] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 })

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const res = await api.get('/api/gallery')
      setItems(res.data)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load gallery')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!file) {
      setPreview(existingImage || '')
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file, existingImage])

  const openCreate = () => {
    setEditId(null)
    setForm({ title:'', caption:'', tags:'' })
    setFile(null)
    setExistingImage('')
    setOpen(true)
  }
  const openEdit = (item) => {
    setEditId(item._id)
    setForm({ title:item.title||'', caption:item.caption||'', tags:(item.tags||[]).join(', ') })
    setFile(null)
    setExistingImage(resolveImageUrl(item.imageUrl))
    setOpen(true)
  }

  const save = async () => {
    try {
      if (!editId && !file) return alert('Select an image file to upload')

      if (file) {
        setUploadProgress(0)
        const fd = new FormData()
        fd.append('image', file)
        fd.append('title', form.title || '')
        fd.append('caption', form.caption || '')
        fd.append('tags', form.tags || '')
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => (prev < 90 ? prev + Math.random() * 30 : prev))
        }, 200)
        
        if (editId) await api.patch(`/api/gallery/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        else await api.post('/api/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        
        clearInterval(progressInterval)
        setUploadProgress(100)
      } else {
        const payload = { ...form, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) }
        await api.patch(`/api/gallery/${editId}`, payload)
      }
      setOpen(false); await load()
    } catch (e) { alert(e.response?.data?.errors?.[0]?.msg || e.response?.data?.error || 'Save failed') }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this image?')) return
    try { await api.delete(`/api/gallery/${id}`); await load() } catch (e) { alert('Delete failed') }
  }

  return (
    <Section title="Admin Gallery" subtitle="Manage gallery images shown on the site.">
      {/* Header with Add Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div className="flex-1" />
        <Button variant="primary" onClick={openCreate}>
          ➕ Add Image
        </Button>
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
            <span className="ml-3 text-offwhite/70">Loading gallery...</span>
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

      {/* Gallery Grid */}
      {!loading && (
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {items.map((it) => (
            <motion.div
              key={it._id}
              variants={SCALE_UP}
              whileHover={{ scale: 1.05, y: -8 }}
              className="group relative bg-gradient-to-br from-blackcurrant/60 to-grape/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-plum/20 hover:border-accent/40 shadow-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img
                  src={resolveImageUrl(it.imageUrl)}
                  alt={it.title || 'Image'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blackcurrant/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info Section */}
              <div className="p-4 sm:p-5">
                <h4 className="font-semibold text-white text-sm sm:text-base truncate mb-1">
                  {it.title || 'Untitled'}
                </h4>
                {it.caption && (
                  <p className="text-offwhite/60 text-xs sm:text-sm line-clamp-2 mb-2">
                    {it.caption}
                  </p>
                )}
                {it.tags?.length > 0 && (
                  <p className="text-xs text-accent/70 mb-3">
                    {it.tags.join(', ')}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openEdit(it)}
                    className="flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors"
                  >
                    ✏️ Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => remove(it._id)}
                    className="flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-colors"
                  >
                    🗑️ Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-offwhite/70 mb-4">No images in gallery yet</p>
          <Button variant="primary" onClick={openCreate}>
            Add Your First Image
          </Button>
        </motion.div>
      )}

      {/* Edit/Create Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {editId ? '✏️ Edit Image' : '➕ Add Image'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload with Drag & Drop */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2"
            >
              <FormField label="Image File">
                {/* Drag & Drop Zone */}
                <motion.div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative w-full p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                    dragActive
                      ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20'
                      : 'border-plum/40 bg-blackcurrant/30 hover:border-plum/60 hover:bg-blackcurrant/50'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    onDragEnter={handleDrag}
                  />
                  
                  <div className="text-center pointer-events-none">
                    {file ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-3xl mb-2"
                        >
                          ✅
                        </motion.div>
                        <p className="text-white font-semibold text-sm">{file.name}</p>
                        <p className="text-offwhite/60 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-4xl mb-2"
                        >
                          📸
                        </motion.div>
                        <p className="text-white font-semibold">Drag & Drop your image</p>
                        <p className="text-offwhite/60 text-sm">or click to browse</p>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Preview with Zoom Control */}
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-white">Preview & Zoom</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-offwhite/60">{zoom}%</span>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-24"
                          />
                        </div>
                      </div>
                      
                      <div className="relative h-48 rounded-lg overflow-hidden bg-blackcurrant/50 border border-plum/30">
                        <motion.img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover cursor-move"
                          style={{ scale: zoom / 100 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blackcurrant/40 via-transparent to-transparent" />
                        
                        {/* Crop Overlay */}
                        {cropMode && (
                          <div
                            className="absolute border-2 border-accent pointer-events-none"
                            style={{
                              left: `${crop.x}%`,
                              top: `${crop.y}%`,
                              width: `${crop.width}%`,
                              height: `${crop.height}%`,
                              boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)'
                            }}
                          />
                        )}
                      </div>

                      {/* Crop Controls */}
                      <div className="mt-4 space-y-3 p-4 bg-blackcurrant/40 rounded-lg border border-plum/20">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-white">Crop Image</label>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setCropMode(!cropMode)}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                              cropMode
                                ? 'bg-accent/30 border border-accent text-accent'
                                : 'bg-plum/20 border border-plum/40 text-offwhite/70 hover:bg-plum/30'
                            }`}
                          >
                            {cropMode ? '✓ Crop Enabled' : '✎ Enable Crop'}
                          </motion.button>
                        </div>

                        {cropMode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-3 pt-2 border-t border-plum/20"
                          >
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-offwhite/70 mb-1">X (%)</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={crop.x}
                                  onChange={(e) => setCrop({...crop, x: Number(e.target.value)})}
                                  className="w-full"
                                />
                                <span className="text-offwhite/50">{crop.x}%</span>
                              </div>
                              <div>
                                <label className="block text-offwhite/70 mb-1">Y (%)</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={crop.y}
                                  onChange={(e) => setCrop({...crop, y: Number(e.target.value)})}
                                  className="w-full"
                                />
                                <span className="text-offwhite/50">{crop.y}%</span>
                              </div>
                              <div>
                                <label className="block text-offwhite/70 mb-1">Width (%)</label>
                                <input
                                  type="range"
                                  min="10"
                                  max="100"
                                  value={crop.width}
                                  onChange={(e) => setCrop({...crop, width: Number(e.target.value)})}
                                  className="w-full"
                                />
                                <span className="text-offwhite/50">{crop.width}%</span>
                              </div>
                              <div>
                                <label className="block text-offwhite/70 mb-1">Height (%)</label>
                                <input
                                  type="range"
                                  min="10"
                                  max="100"
                                  value={crop.height}
                                  onChange={(e) => setCrop({...crop, height: Number(e.target.value)})}
                                  className="w-full"
                                />
                                <span className="text-offwhite/50">{crop.height}%</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-offwhite/70">Uploading...</span>
                          <span className="text-accent font-semibold">{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="w-full h-1 bg-blackcurrant/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-accent to-plum"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ ease: 'linear' }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </FormField>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <FormField label="Title">
                <input
                  type="text"
                  className="w-full min-h-[44px] rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 transition-all placeholder:text-offwhite/40"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Tattoo title"
                />
              </FormField>
            </motion.div>

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2"
            >
              <FormField label="Caption">
                <textarea
                  rows="3"
                  className="w-full rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 transition-all placeholder:text-offwhite/40"
                  value={form.caption}
                  onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                  placeholder="Describe this tattoo piece..."
                />
              </FormField>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="md:col-span-2"
            >
              <FormField label="Tags (comma separated)">
                <input
                  type="text"
                  className="w-full min-h-[44px] rounded-lg bg-blackcurrant/70 text-white text-sm sm:text-base px-4 py-3 border border-plum/40 focus:border-accent/70 transition-all placeholder:text-offwhite/40"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="dragon, black & grey, fantasy"
                />
              </FormField>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-plum/20"
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={save}
              className="w-full sm:w-auto"
            >
              {editId ? 'Save Changes' : 'Create Image'}
            </Button>
          </motion.div>
        </motion.div>
      </Modal>
    </Section>
  )
}
