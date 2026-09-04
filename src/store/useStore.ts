import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DELIVERY_FEE, FREE_DELIVERY_FROM, PROMO_CODES } from '../config'
import type { CartLine, Order, Product } from '../types'

export const lineKey = (l: { product: Product; withAddon: boolean }) =>
  l.product.id + (l.withAddon ? '+sous' : '')

export const linePrice = (l: CartLine) =>
  (l.product.price + (l.withAddon && l.product.addon ? l.product.addon.price : 0)) *
  l.qty

interface Profile {
  name: string
  phone: string
  address: string
  lat: number | null
  lng: number | null
}

interface State {
  cart: CartLine[]
  orders: Order[]
  profile: Profile
  promo: string | null
  sheet: Product | null
  toast: string | null
  addToCart: (p: Product, qty: number, withAddon: boolean) => void
  changeQty: (key: string, delta: number) => void
  removeLine: (key: string) => void
  clearCart: () => void
  setPromo: (code: string | null) => void
  setProfile: (patch: Partial<Profile>) => void
  openSheet: (p: Product | null) => void
  showToast: (msg: string | null) => void
  placeOrder: () => Order
  markOrderSent: (id: string, sent: boolean) => void
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],
      profile: { name: '', phone: '', address: '', lat: null, lng: null },
      promo: null,
      sheet: null,
      toast: null,

      addToCart: (p, qty, withAddon) => {
        const key = p.id + (withAddon ? '+sous' : '')
        const cart = [...get().cart]
        const found = cart.find((l) => lineKey(l) === key)
        if (found) found.qty += qty
        else cart.push({ product: p, qty, withAddon })
        set({ cart, sheet: null, toast: `${p.name} savatga qo'shildi` })
      },

      changeQty: (key, delta) =>
        set({
          cart: get()
            .cart.map((l) =>
              lineKey(l) === key ? { ...l, qty: l.qty + delta } : l,
            )
            .filter((l) => l.qty > 0),
        }),

      removeLine: (key) =>
        set({ cart: get().cart.filter((l) => lineKey(l) !== key) }),

      clearCart: () => set({ cart: [], promo: null }),

      setPromo: (code) => set({ promo: code }),

      setProfile: (patch) => set({ profile: { ...get().profile, ...patch } }),

      openSheet: (p) => set({ sheet: p }),

      showToast: (msg) => set({ toast: msg }),

      placeOrder: () => {
        const { cart, promo, profile } = get()
        const subtotal = cart.reduce((s, l) => s + linePrice(l), 0)
        const discountPct = promo ? (PROMO_CODES[promo] ?? 0) : 0
        const discount = Math.round((subtotal * discountPct) / 100)
        const afterDiscount = subtotal - discount
        const deliveryFee =
          afterDiscount >= FREE_DELIVERY_FROM || afterDiscount === 0
            ? 0
            : DELIVERY_FEE
        const order: Order = {
          id: 'LL-' + Date.now().toString().slice(-6),
          createdAt: Date.now(),
          items: cart.map((l) => ({
            name: l.product.name,
            qty: l.qty,
            price: l.product.price,
            withAddon: l.withAddon,
          })),
          subtotal: afterDiscount,
          deliveryFee,
          total: afterDiscount + deliveryFee,
          address: profile.address,
          customer: { name: profile.name, phone: profile.phone },
          status: 'yuborildi',
          sentToTelegram: false,
        }
        set({ orders: [order, ...get().orders], cart: [], promo: null })
        return order
      },

      markOrderSent: (id, sent) =>
        set({
          orders: get().orders.map((o) =>
            o.id === id ? { ...o, sentToTelegram: sent } : o,
          ),
        }),
    }),
    {
      name: 'lola-lavash-v1',
      partialize: (s) => ({
        cart: s.cart,
        orders: s.orders,
        profile: s.profile,
        promo: s.promo,
      }),
    },
  ),
)

export const useCartCount = () =>
  useStore((s) => s.cart.reduce((n, l) => n + l.qty, 0))

export const useCartSubtotal = () =>
  useStore((s) => s.cart.reduce((sum, l) => sum + linePrice(l), 0))
