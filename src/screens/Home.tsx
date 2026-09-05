import { motion } from 'framer-motion'
import { DELIVERY_TIME, FREE_DELIVERY_FROM, RESTAURANT_ADDRESS } from '../config'
import { CATEGORIES, PRODUCTS, productsByCategory } from '../data/menu'
import { IMAGES } from '../data/images'
import { fmt } from '../lib/format'
import { useStore } from '../store/useStore'
import type { Tab } from '../types-ui'
import ProductCard from '../components/ProductCard'
import { IconChevron, IconClock, IconFlame, IconPin, IconStar, IconTruck } from '../components/icons'

const CATEGORY_IMG: Record<string, string> = {
  lavash: IMAGES.lavashOddiy,
  tandir: IMAGES.tandirOddiy,
  donar: IMAGES.donarOddiy,
  hotdog: IMAGES.hotdog1,
  kfc: IMAGES.kfc1,
  setlar: IMAGES.setLavash,
  fri: IMAGES.friOddiy,
  ichimliklar: IMAGES.cola,
}

export default function Home({ go }: { go: (t: Tab, cat?: string) => void }) {
  const name = useStore((s) => s.profile.name)
  const popular = PRODUCTS.filter((p) => p.popular)
  const recommended = PRODUCTS.filter((p) => p.recommended)

  return (
    <div className="animate-fade-up">
      <header className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 px-4 pt-5 pb-8 text-white">
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute top-24 -left-10 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between">
          <button
            onClick={() => go('account')}
            className="flex items-center gap-1.5 text-left"
          >
            <IconPin className="h-4.5 w-4.5 text-brand-200" />
            <span>
              <span className="block text-[10px] text-brand-200">
                Yetkazib berish
              </span>
              <span className="block text-xs font-extrabold">
                {RESTAURANT_ADDRESS}
              </span>
            </span>
          </button>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <IconStar className="h-4.5 w-4.5 text-amber-300" />
          </span>
        </div>

        <div className="relative mt-6 flex items-end justify-between gap-3">
          <div>
            <span className="inline-block rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black tracking-wide text-brand-800 uppercase">
              Endi ochiq
            </span>
            <h1 className="mt-2 text-3xl leading-tight font-black">
              LAVASHLAR
              <br />
              <span className="text-brand-200">SIZ UCHUNI</span>
            </h1>
            {name && (
              <p className="mt-1 text-sm font-bold text-brand-100">
                Xush kelibsiz, {name}!
              </p>
            )}
            <button
              onClick={() => go('menu')}
              className="mt-4 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-brand-700 shadow-card active:scale-[0.97]"
            >
              Buyurtma berish
              <IconChevron className="h-4 w-4" />
            </button>
          </div>
          <motion.img
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            src={IMAGES.lavashZakaznoy}
            alt="Lola lavash"
            className="h-28 w-28 shrink-0 rounded-2xl border-4 border-white/25 object-cover shadow-card"
          />
        </div>
      </header>

      <div className="relative z-10 -mt-5 grid grid-cols-3 gap-2 px-4">
        {[
          { Icon: IconClock, text: DELIVERY_TIME },
          { Icon: IconTruck, text: 'Bepul yetkazish' },
          { Icon: IconFlame, text: 'Tandirdan yangi' },
        ].map(({ Icon, text }) => (
          <div
            key={text}
            className="flex flex-col items-center gap-1 rounded-2xl bg-white px-1 py-2.5 text-center shadow-card"
          >
            <Icon className="h-4.5 w-4.5 text-brand-600" />
            <span className="text-[10px] font-extrabold text-ink-700">
              {text}
            </span>
          </div>
        ))}
      </div>

      <section className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">Kategoriyalar</h2>
          <button
            onClick={() => go('menu')}
            className="flex items-center gap-1 text-xs font-extrabold text-brand-600"
          >
            Barchasini ko'rish <IconChevron className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {CATEGORIES.slice(0, 6).map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileTap={{ scale: 0.97 }}
              onClick={() => go('menu', c.id)}
              className="relative h-24 overflow-hidden rounded-2xl text-left shadow-card"
            >
              <img
                src={CATEGORY_IMG[c.id]}
                alt={c.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent" />
              <span className="absolute bottom-2 left-3">
                <span className="block text-sm font-black text-white">
                  {c.title}
                </span>
                <span className="text-[10px] font-bold text-white/75">
                  {productsByCategory(c.id).length} ta mahsulot
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mt-5 px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-4 text-white shadow-card">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <IconTruck className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-black">
              Bepul yetkazib berish
            </span>
            <span className="text-xs text-brand-100">
              {fmt(FREE_DELIVERY_FROM)}dan yuqori buyurtmalarga
            </span>
          </span>
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-lg font-black">
            <IconFlame className="h-5 w-5 text-brand-600" /> Mashhur mahsulotlar
          </h2>
        </div>
        <div className="mt-3 flex flex-col gap-2.5">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} layout="row" />
          ))}
        </div>
      </section>

      <section className="mt-6 px-4 pb-6">
        <h2 className="flex items-center gap-1.5 text-lg font-black">
          <IconStar className="h-5 w-5 text-amber-400" /> Tavsiya etamiz
        </h2>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
          {recommended
            .concat(
              PRODUCTS.filter(
                (p) => p.category === 'setlar' && !p.recommended,
              ),
            )
            .slice(0, 6)
            .map((p) => (
            <div key={p.id} className="w-40 shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
