type Env = {
  BOT_TOKEN?: string
  OWNER_CHAT_ID?: string
}

type Context = {
  request: Request
  env: Env
}

const f = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

export const onRequestPost = async ({ request, env }: Context) => {
  const token = env.BOT_TOKEN
  const chatId = env.OWNER_CHAT_ID
  if (!token || !chatId) {
    return json(501, { ok: false, reason: 'BOT_TOKEN / OWNER_CHAT_ID sozlanmagan' })
  }

  let order: any
  try {
    order = await request.json()
  } catch {
    return json(400, { ok: false, reason: 'yaroqsiz JSON' })
  }

  const lines = (order.items ?? []).map(
    (it: any) =>
      `  • ${it.qty} × ${it.name}${it.size ? ` (${it.size})` : ''}${
        it.withAddon ? ' (+chisnoq sous)' : ''
      } — ${f(it.qty * it.price)} so'm`,
  )

  const text = [
    `🧾 <b>Yangi buyurtma #${order.id}</b>`,
    `👤 ${order.customer?.name ?? '—'} • ${order.customer?.phone ?? '—'}`,
    `📍 ${order.address || "Manzil ko'rsatilmagan"}`,
    ...(order.lat ? [`🗺 ${order.lat}, ${order.lng}`] : []),
    '',
    ...lines,
    '',
    `💰 Jami: ${f(order.total)} so'm (yetkazish: ${
      order.deliveryFee === 0 ? 'bepul' : f(order.deliveryFee) + " so'm"
    })`,
  ].join('\n')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })

  return json(res.ok ? 200 : 502, { ok: res.ok })
}
