import { motion } from 'framer-motion'
import { IconCheck, IconReceipt } from '../components/icons'
import { fmt, fmtDate } from '../lib/format'
import { useStore } from '../store/useStore'
import type { Tab } from '../types-ui'

export default function Orders({ go }: { go: (t: Tab) => void }) {
  const orders = useStore((s) => s.orders)

  if (orders.length === 0) {
    return (
      <div className="animate-fade-up flex flex-col items-center px-4 pt-24 text-center">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-50"
        >
          <IconReceipt className="h-10 w-10 text-brand-400" />
        </motion.span>
        <h1 className="mt-4 text-xl font-black">Buyurtmalar yo'q</h1>
        <p className="mt-1 text-sm text-ink-500">
          Hozircha buyurtma bermagansiz — birinchi buyurtmangizni bering!
        </p>
        <button
          onClick={() => go('menu')}
          className="mt-5 rounded-full bg-brand-600 px-6 py-3 text-sm font-black text-white shadow-card active:scale-[0.97]"
        >
          Menyuga o'tish
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-up px-4 pt-5">
      <h1 className="text-2xl font-black">Buyurtmalarim</h1>
      <div className="mt-4 flex flex-col gap-3 pb-6">
        {orders.map((o) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-4 shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-black">#{o.id}</span>
              <span
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                  o.sentToTelegram
                    ? 'bg-green-50 text-green-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {o.sentToTelegram ? (
                  <>
                    <IconCheck className="h-3 w-3" /> Restoranga yuborildi
                  </>
                ) : (
                  'Kutilmoqda (offline)'
                )}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] font-bold text-ink-500">
              {fmtDate(o.createdAt)} • {o.address || "Manzil ko'rsatilmagan"}
            </p>
            <div className="mt-2 flex flex-col gap-1 border-t border-cream-100 pt-2">
              {o.items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs font-bold text-ink-700"
                >
                  <span>
                    {it.qty} × {it.name}
                    {it.withAddon && ' + sous'}
                  </span>
                  <span>{fmt(it.qty * it.price)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-cream-100 pt-2">
              <span className="text-xs font-bold text-ink-500">
                Yetkazish: {o.deliveryFee === 0 ? 'bepul' : fmt(o.deliveryFee)}
              </span>
              <span className="text-sm font-black text-brand-600">
                {fmt(o.total)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
