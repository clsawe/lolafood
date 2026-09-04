const f = (n: number) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

export const handler = async (event: any) => {
  const token = process.env.BOT_TOKEN
  const chatId = process.env.OWNER_CHAT_ID
  if (!token || !chatId) {
    return {
      statusCode: 501,
      body: JSON.stringify({ ok: false, reason: 'BOT_TOKEN / OWNER_CHAT_ID sozlanmagan' }),
    }
  }

  let order: any
  try {
    order = JSON.parse(event.body ?? '{}')
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false }) }
  }

  const lines = (order.items ?? []).map(
    (it: any) =>
      `  • ${it.qty} × ${it.name}${it.withAddon ? ' (+chisnoq sous)' : ''} — ${f(it.qty * it.price)} so'm`,
  )

  const text = [
    `🧾 <b>Yangi buyurtma #${order.id}</b>`,
    `👤 ${order.customer?.name ?? '—'} • ${order.customer?.phone ?? '—'}`,
    `📍 ${order.address || 'Manzil ko'rsatilmagan'}`,
    ...(order.lat ? [`🗺 ${order.lat}, ${order.lng}`] : []),
    '',
    ...lines,
    '',
    `💰 Jami: ${f(order.total)} so'm (yetkazish: ${order.deliveryFee === 0 ? 'bepul' : f(order.deliveryFee) + " so'm"})`,
  ].join('\n')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })

  return { statusCode: res.ok ? 200 : 502, body: JSON.stringify({ ok: res.ok }) }
}
