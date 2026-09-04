export type CategoryId =
  | 'hotdog'
  | 'lavash'
  | 'tandir'
  | 'donar'
  | 'kfc'
  | 'setlar'
  | 'fri'
  | 'ichimliklar'

export interface Category {
  id: CategoryId
  title: string
  emoji: string
}

export interface Product {
  id: string
  category: CategoryId
  name: string
  desc: string
  price: number
  oldPrice?: number
  img: string
  popular?: boolean
  recommended?: boolean
  addon?: { id: string; name: string; price: number }
}

export interface CartLine {
  product: Product
  qty: number
  withAddon: boolean
}

export interface OrderItem {
  name: string
  qty: number
  price: number
  withAddon: boolean
}

export interface Order {
  id: string
  createdAt: number
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  address: string
  customer: { name: string; phone: string }
  status: 'yuborildi' | 'qabul qilindi' | 'yetkazildi'
  sentToTelegram: boolean
}
