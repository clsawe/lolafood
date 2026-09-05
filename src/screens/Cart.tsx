import { motion } from 'framer-motion'
import { useState } from 'react'
import { IconBag, IconMinus, IconPin, IconPlus, IconTruck, IconX } from '../components/icons'
import { DELIVERY_FEE, FREE_DELIVERY_FROM, PROMO_CODES } from '../config'
import { fmt } from '../lib/format'
import { sendOrderToTelegram } from '../lib/sendOrder'
import { getLocation, haptic, isTelegram, telegramUser } from '../lib/telegram'
import { lineKey, linePrice, useStore } from '../store/useStore'
import type { Tab } from '../types-ui'

export default function Cart({ go }: { go: (t: Tab) => void }) {
  const cart = useStore((s) => s.cart)
  const changeQty = useStore((s) => s.changeQty)
  const removeLine = useStore((s) => s.removeLine)
  const promo = useStore((s) => s.promo)
  const setPromo = useStore((s) => s.setPromo)
  const profile = useStore((s) => s.profile)
  const setProfile = useStore((s) => s.setProfile)
  const placeOrder = useStore((s) => s.placeOrder)
  const markOrderSent = useStore((s) => s.markOrderSent)
  const showToast = useStore((s) => s.showToast)

  const [promoInput, setPromoInput] = useState('')
  const [sending, setSending] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')

  const subtotal = cart.reduce((s, l) => s + linePrice(l), 0)
  const discountPct = promo ? (PROMO_CODES[promo] ?? 0) : 0
  const discount = Math.round((subtotal * discountPct) / 100)
  const afterDiscount = subtotal - discount
  const deliveryFee =
    afterDiscount >= FREE_DELIVERY_FROM || cart.length === 0 ? 0 : DELIVERY_FEE
  const total = afterDiscount + deliveryFee

  if (cart.length === 0) {
    return (
      <div className="animate-fade-up flex flex-col items-center px-4 pt-24 text-center">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-50"
        >
          <IconBag className="h-10 w-10 text-brand-400" />
        </motion.span>
        <h1 className="mt-4 text-xl font-black">Savat bo'sh</h1>
        <p className="mt-1 text-sm text-ink-500">
          Mazali taomlarni tanlang — biz tez yetkazamiz
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

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setPromo(code)
      showToast(`Promokod ${code} qo'llanildi`)
    } else {
      showToast("Bunday promokod yo'q")
    }
  }

  const locate = async () => {
    setLocating(true)
    const pos = await getLocation()
    setLocating(false)
    if (pos) {
      setProfile({ lat: pos.lat, lng: pos.lng })
      showToast('Joylashuv aniqlandi')
      haptic('success')
    } else {
      showToast("Joylashuvni aniqlab bo'lmadi")
    }
  }

  const checkout = async () => {
    if (!profile.name.trim() || !profile.phone.trim() || !profile.address.trim()) {
      setError("Ism, telefon va manzilni to'ldiring")
      return
    }
    setError('')
    setSending(true)
    const order = placeOrder()
    const sent = await sendOrderToTelegram(order)
    markOrderSent(order.id, sent)
    setSending(false)
    haptic('success')
    showToast(
      sent
        ? `Buyurtma ${order.id} qabul qilindi`
        : `Buyurtma ${order.id} saqlandi (botga yuborilmadi)`,
    )
    go('orders')
  }

  return (
    <div className="animate-fade-up px-4 pt-5">
      <h1 className="text-2xl font-black">Savat</h1>

      <div className="mt-4 flex flex-col gap-2.5">
        {cart.map((l) => {
          const key = lineKey(l)
          return (
            <motion.div
              layout
              key={key}
              className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-card"
            >
              <img
                src={l.product.img}
                alt={l.product.name}
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold">{l.product.name}</p>
                {l.size && (
                  <p className="text-[11px] font-bold text-ink-500">{l.size}</p>
                )}
                {l.withAddon && l.product.addon && (
                  <p className="text-[11px] font-bold text-brand-600">
                    + {l.product.addon.name}
                  </p>
                )}
                <p className="mt-0.5 text-sm font-black text-brand-600">
                  {fmt(linePrice(l))}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeLine(key)}
                  className="text-ink-300"
                  aria-label="O'chirish"
                >
                  <IconX className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3 rounded-full bg-cream-100 px-2.5 py-1.5">
                  <button onClick={() => changeQty(key, -1)}>
                    <IconMinus className="h-3.5 w-3.5 text-ink-700" />
                  </button>
                  <span className="w-4 text-center text-sm font-black">
                    {l.qty}
                  </span>
                  <button onClick={() => changeQty(key, 1)}>
                    <IconPlus className="h-3.5 w-3.5 text-brand-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
        <h2 className="text-sm font-black">Yetkazib berish ma'lumotlari</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            value={profile.name}
            onChange={(e) => setProfile({ name: e.target.value })}
            placeholder="Ismingiz"
            className="rounded-xl border-2 border-cream-200 bg-cream-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-brand-400"
          />
          <input
            value={profile.phone}
            onChange={(e) => setProfile({ phone: e.target.value })}
            placeholder="+998 __ ___ __ __"
            inputMode="tel"
            className="rounded-xl border-2 border-cream-200 bg-cream-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-brand-400"
          />
        </div>
        <textarea
          value={profile.address}
          onChange={(e) => setProfile({ address: e.target.value })}
          placeholder="Manzil: ko'cha, uy, mo'ljal"
          rows={2}
          className="mt-2 w-full resize-none rounded-xl border-2 border-cream-200 bg-cream-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-brand-400"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <button
            onClick={locate}
            disabled={locating}
            className="flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2 text-xs font-extrabold text-brand-700 disabled:opacity-60"
          >
            <IconPin className="h-4 w-4" />
            {locating
              ? 'Aniqlanmoqda...'
              : profile.lat
                ? `Joylashuv: ${profile.lat.toFixed(4)}, ${profile.lng?.toFixed(4)}`
                : 'Joylashuvimni aniqlash'}
          </button>
          {isTelegram() && !telegramUser().phone && (
            <span className="text-[10px] font-bold text-ink-500">
              Raqamni qo'lda kiriting
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-4 shadow-card">
        {promo ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-green-600">
              Promokod {promo} (−{discountPct}%)
            </span>
            <button
              onClick={() => setPromo(null)}
              className="text-ink-300"
              aria-label="Promokodni olib tashlash"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Promokod"
              className="flex-1 rounded-xl border-2 border-cream-200 bg-cream-50 px-3 py-2.5 text-sm font-bold uppercase outline-none focus:border-brand-400"
            />
            <button
              onClick={applyPromo}
              className="rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-extrabold text-white"
            >
              Qo'llash
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 rounded-2xl bg-white p-4 shadow-card">
        <Row label="Mahsulotlar" value={fmt(subtotal)} />
        {discount > 0 && (
          <Row label="Chegirma" value={'−' + fmt(discount)} green />
        )}
        <Row
          label="Yetkazib berish"
          value={deliveryFee === 0 ? 'Bepul' : fmt(deliveryFee)}
          green={deliveryFee === 0}
        />
        {deliveryFee > 0 && (
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-ink-500">
            <IconTruck className="h-3.5 w-3.5" />
            {fmt(FREE_DELIVERY_FROM - afterDiscount)} qo'shsangiz — bepul bo'ladi
          </p>
        )}
        <div className="mt-2 flex items-center justify-between border-t border-cream-200 pt-2">
          <span className="text-sm font-black">Jami</span>
          <span className="text-lg font-black text-brand-600">{fmt(total)}</span>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-xl bg-brand-50 px-4 py-2.5 text-xs font-extrabold text-brand-700">
          {error}
        </p>
      )}

      <button
        onClick={checkout}
        disabled={sending}
        className="mt-4 mb-6 w-full rounded-full bg-brand-600 py-4 text-sm font-black text-white shadow-card active:scale-[0.98] disabled:opacity-60"
      >
        {sending ? 'Yuborilmoqda...' : `Buyurtmani rasmiylashtirish • ${fmt(total)}`}
      </button>
    </div>
  )
}

function Row({
  label,
  value,
  green,
}: {
  label: string
  value: string
  green?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-bold text-ink-500">{label}</span>
      <span
        className={`text-sm font-extrabold ${green ? 'text-green-600' : 'text-ink-900'}`}
      >
        {value}
      </span>
    </div>
  )
}
