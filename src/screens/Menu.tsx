import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, PRODUCTS } from '../data/menu'

export default function Menu({ initialCat }: { initialCat: string | null }) {
  const [cat, setCat] = useState<string | null>(initialCat)
  const [query, setQuery] = useState('')

  useEffect(() => setCat(initialCat), [initialCat])

  const list = PRODUCTS.filter(
    (p) =>
      (!cat || p.category === cat) &&
      (!query || p.name.toLowerCase().includes(query.toLowerCase())),
  )

  return (
    <div className="animate-fade-up px-4 pt-5">
      <h1 className="text-2xl font-black">Menu</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Mahsulot qidirish..."
        className="mt-3 w-full rounded-2xl border-2 border-cream-200 bg-white px-4 py-3 text-sm font-bold outline-none placeholder:text-ink-300 focus:border-brand-400"
      />

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => setCat(null)}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-colors ${
            cat === null
              ? 'bg-brand-600 text-white shadow-card'
              : 'bg-white text-ink-700 shadow-card'
          }`}
        >
          Barchasi
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-colors ${
              cat === c.id
                ? 'bg-brand-600 text-white shadow-card'
                : 'bg-white text-ink-700 shadow-card'
            }`}
          >
            {c.emoji} {c.title}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-sm font-bold text-ink-500">
          Hech narsa topilmadi
        </p>
      ) : (
        <motion.div layout className="mt-4 grid grid-cols-2 gap-3 pb-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
