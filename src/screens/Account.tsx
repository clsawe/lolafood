import { useEffect } from 'react'
import {
  IconChevron,
  IconPhone,
  IconPin,
  IconReceipt,
  IconTruck,
  IconUser,
} from '../components/icons'
import { RESTAURANT_ADDRESS } from '../config'
import { fmt } from '../lib/format'
import { getLocation, haptic, telegramUser } from '../lib/telegram'
import { useStore } from '../store/useStore'
import type { Tab } from '../types-ui'

export default function Account({ go }: { go: (t: Tab) => void }) {
  const profile = useStore((s) => s.profile)
  const setProfile = useStore((s) => s.setProfile)
  const orders = useStore((s) => s.orders)
  const showToast = useStore((s) => s.showToast)

  useEffect(() => {
    const u = telegramUser()
    if (u.name && !profile.name) setProfile({ name: u.name })
    if (u.phone && !profile.phone) setProfile({ phone: u.phone })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const spent = orders.reduce((s, o) => s + o.total, 0)
  const initials =
    profile.name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'LL'

  const locate = async () => {
    const pos = await getLocation()
    if (pos) {
      setProfile({ lat: pos.lat, lng: pos.lng })
      showToast('Joylashuv aniqlandi')
      haptic('success')
    } else {
      showToast("Joylashuvni aniqlab bo'lmadi — ruxsatni tekshiring")
    }
  }

  return (
    <div className="animate-fade-up px-4 pt-5">
      <h1 className="text-2xl font-black">Hisobim</h1>

      <div className="mt-4 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white shadow-card">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xl font-black">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-black">
              {profile.name || 'Mehmon'}
            </p>
            <p className="flex items-center gap-1.5 truncate text-xs font-bold text-brand-100">
              <IconPhone className="h-3.5 w-3.5" />
              {profile.phone || 'Raqam ulanmagan'}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/15 p-3 text-center">
            <p className="text-xl font-black">{orders.length}</p>
            <p className="text-[10px] font-bold text-brand-100">Buyurtmalar</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3 text-center">
            <p className="text-xl font-black">{fmt(spent)}</p>
            <p className="text-[10px] font-bold text-brand-100">Jami xarajat</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
        <label className="text-xs font-black text-ink-500">Ism</label>
        <input
          value={profile.name}
          onChange={(e) => setProfile({ name: e.target.value })}
          placeholder="Ismingiz"
          className="mt-1 w-full rounded-xl border-2 border-cream-200 bg-cream-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-brand-400"
        />
        <label className="mt-3 block text-xs font-black text-ink-500">
          Telefon
        </label>
        <input
          value={profile.phone}
          onChange={(e) => setProfile({ phone: e.target.value })}
          placeholder="+998 __ ___ __ __"
          inputMode="tel"
          className="mt-1 w-full rounded-xl border-2 border-cream-200 bg-cream-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-brand-400"
        />
        <label className="mt-3 block text-xs font-black text-ink-500">
          Manzil
        </label>
        <textarea
          value={profile.address}
          onChange={(e) => setProfile({ address: e.target.value })}
          rows={2}
          placeholder="Ko'cha, uy, mo'ljal"
          className="mt-1 w-full resize-none rounded-xl border-2 border-cream-200 bg-cream-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-brand-400"
        />
        <button
          onClick={locate}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-50 py-3 text-xs font-extrabold text-brand-700"
        >
          <IconPin className="h-4 w-4" />
          {profile.lat
            ? `Joylashuv: ${profile.lat.toFixed(4)}, ${profile.lng?.toFixed(4)}`
            : 'Joylashuvimni avtomatik aniqlash'}
        </button>
      </div>

      <div className="mt-4 mb-6 overflow-hidden rounded-2xl bg-white shadow-card">
        <Row
          Icon={IconReceipt}
          title="Buyurtmalarim"
          subtitle={`${orders.length} ta buyurtma`}
          onClick={() => go('orders')}
        />
        <Row
          Icon={IconTruck}
          title="Yetkazib berish hududi"
          subtitle={RESTAURANT_ADDRESS}
        />
        <Row
          Icon={IconUser}
          title="To'lov turi"
          subtitle="Naqd yoki karta — kuryerga"
        />
      </div>
    </div>
  )
}

function Row({
  Icon,
  title,
  subtitle,
  onClick,
}: {
  Icon: typeof IconUser
  title: string
  subtitle: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-cream-100 p-4 text-left last:border-0"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-extrabold">{title}</span>
        <span className="block text-xs text-ink-500">{subtitle}</span>
      </span>
      {onClick && <IconChevron className="h-4 w-4 text-ink-300" />}
    </button>
  )
}
