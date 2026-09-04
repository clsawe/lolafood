import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { IconCheck } from './icons'

export default function Toast() {
  const toast = useStore((s) => s.toast)
  const showToast = useStore((s) => s.showToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => showToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast, showToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink-900/90 px-4 py-2.5 text-sm font-bold text-white shadow-card"
        >
          <IconCheck className="h-4 w-4 text-brand-300" />
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
