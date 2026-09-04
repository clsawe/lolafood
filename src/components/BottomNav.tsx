import { motion } from 'framer-motion'
import { useCartCount, useStore } from '../store/useStore'
import { haptic } from '../lib/telegram'
import { IconCart, IconHome, IconMenu, IconReceipt, IconUser } from './icons'
import type { Tab } from '../types-ui'

const TABS: { id: Tab; label: string; Icon: typeof IconHome }[] = [
  { id: 'home', label: 'Bosh sahifa', Icon: IconHome },
  { id: 'menu', label: 'Menu', Icon: IconMenu },
  { id: 'cart', label: 'Savat', Icon: IconCart },
  { id: 'orders', label: 'Buyurtmalarim', Icon: IconReceipt },
  { id: 'account', label: 'Hisobim', Icon: IconUser },
]

export default function BottomNav({
  tab,
  onChange,
}: {
  tab: Tab
  onChange: (t: Tab) => void
}) {
  const count = useCartCount()
  const openSheet = useStore((s) => s.openSheet)

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-cream-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="grid grid-cols-5">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => {
                onChange(id)
                haptic('light')
                openSheet(null)
              }}
              className="relative flex flex-col items-center gap-1 py-2.5"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-x-3 top-1.5 bottom-1.5 rounded-2xl bg-brand-50"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">
                <Icon
                  className={`relative z-10 h-6 w-6 ${active ? 'text-brand-600' : 'text-ink-500'}`}
                />
                {id === 'cart' && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 z-10 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-extrabold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </span>
              <span
                className={`relative z-10 text-[10px] font-bold ${active ? 'text-brand-600' : 'text-ink-500'}`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
