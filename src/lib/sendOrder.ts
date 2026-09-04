import type { Order } from '../types'

export async function sendOrderToTelegram(order: Order): Promise<boolean> {
  try {
    const res = await fetch('/send-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    return res.ok
  } catch {
    return false
  }
}
