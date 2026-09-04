import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { fmt } from '../lib/format'
import { haptic } from '../lib/telegram'
import { useStore } from '../store/useStore'
import { IconCheck, IconMinus, IconPlus, IconX } from './icons'

export default function ProductSheet() {
  const product = useStore((s) => s.sheet)
  const addToCart = useStore((s) => s.addToCart)
  const openSheet = useStore((s) => s.openSheet)
  const [qty, setQty] = useState(1)
  const [withAddon, setWithAddon] = useState(false)

  const close = () => {
    openSheet(null)
    setQty(1)
    setWithAddon(false)
  }

  const unit =
    (product?.price ?? 0) +
    (withAddon && product?.addon ? product.addon.price : 0)

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Yopish"
            onClick={close}
            className="absolute inset-0 bg-ink-900/45 backdrop-blur-[2px]"
          />
          <motion.div
            key={product.id}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="relative w-full max-w-[480px] rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-sheet"
          >
            <div className="relative">
              <img
                src={product.img}
                alt={product.name}
                className="h-56 w-full rounded-t-3xl object-cover"
              />
              <button
                onClick={close}
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-card"
              >
                <IconX className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-black">{product.name}</h3>
              <p className="mt-1 text-sm text-ink-500">{product.desc}</p>

              {product.addon && (
                <button
                  onClick={() => {
                    setWithAddon((v) => !v)
                    haptic('light')
                  }}
                  className={`mt-3 flex w-full items-center justify-between rounded-2xl border-2 p-3 text-left transition-colors ${
                    withAddon
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-cream-200 bg-cream-50'
                  }`}
                >
                  <span>
                    <span className="block text-sm font-extrabold">
                      + {product.addon.name}
                    </span>
                    <span className="text-xs text-ink-500">
                      {fmt(product.addon.price)} qo'shiladi
                    </span>
                  </span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      withAddon ? 'bg-brand-600 text-white' : 'bg-white text-ink-300'
                    } border border-cream-200`}
                  >
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                </button>
              )}

              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-4 rounded-full bg-cream-100 px-3 py-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="text-ink-700"
                  >
                    <IconMinus className="h-4.5 w-4.5" />
                  </button>
                  <span className="w-5 text-center font-black">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="text-brand-600"
                  >
                    <IconPlus className="h-4.5 w-4.5" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    addToCart(product, qty, withAddon)
                    haptic('success')
                    setQty(1)
                    setWithAddon(false)
                  }}
                  className="flex flex-1 items-center justify-between rounded-full bg-brand-600 px-5 py-3 font-extrabold text-white shadow-card active:scale-[0.98]"
                >
                  <span>Savatga qo'shish</span>
                  <span>{fmt(unit * qty)}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
