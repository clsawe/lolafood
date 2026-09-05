import { motion } from 'framer-motion'
import { fmt } from '../lib/format'
import { useStore } from '../store/useStore'
import type { Product } from '../types'
import { IconPlus } from './icons'

export default function ProductCard({
  product,
  layout = 'grid',
}: {
  product: Product
  layout?: 'grid' | 'row'
}) {
  const openSheet = useStore((s) => s.openSheet)
  const base = product.sizes?.[0]?.price ?? product.price

  if (layout === 'row') {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => openSheet(product)}
        className="flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 text-left shadow-card"
      >
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-xl object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-extrabold">
            {product.name}
          </span>
          <span className="mt-0.5 line-clamp-1 block text-xs text-ink-500">
            {product.desc}
          </span>
          <span className="mt-1 block text-sm font-black text-brand-600">
            {fmt(base)}
          </span>
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-card">
          <IconPlus className="h-4.5 w-4.5" />
        </span>
      </motion.button>
    )
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => openSheet(product)}
      className="overflow-hidden rounded-2xl bg-white text-left shadow-card"
    >
      <span className="relative block h-28 w-full overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {product.popular && (
          <span className="absolute top-2 left-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
            Xit
          </span>
        )}
      </span>
      <span className="block p-2.5">
        <span className="line-clamp-1 block text-[13px] font-extrabold">
          {product.name}
        </span>
        <span className="mt-1 flex items-center justify-between">
          <span className="text-[13px] font-black text-brand-600">
            {fmt(base)}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <IconPlus className="h-3.5 w-3.5" />
          </span>
        </span>
      </span>
    </motion.button>
  )
}
