type TgWebApp = {
  ready: () => void
  expand: () => void
  setHeaderColor?: (c: string) => void
  setBackgroundColor?: (c: string) => void
  initData?: string
  initDataUnsafe?: {
    user?: {
      first_name?: string
      last_name?: string
      username?: string
      phone_number?: string
    }
  }
  HapticFeedback?: { impactOccurred: (s: string) => void }
}

const tg: TgWebApp | undefined = (window as any).Telegram?.WebApp

export const isTelegram = () => Boolean(tg?.initData)

export function initTelegram() {
  if (!tg) return
  tg.ready()
  tg.expand()
  tg.setHeaderColor?.('#D6001F')
  tg.setBackgroundColor?.('#FFFAF6')
}

export function telegramUser() {
  const u = tg?.initDataUnsafe?.user
  if (!u) return { name: '', phone: '', username: '' }
  return {
    name: [u.first_name, u.last_name].filter(Boolean).join(' '),
    phone: u.phone_number ?? '',
    username: u.username ?? '',
  }
}

export function getLocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 60000 },
    )
  })
}

export function haptic(style: 'light' | 'medium' | 'success' = 'light') {
  try {
    tg?.HapticFeedback?.impactOccurred(style)
  } catch {
    /* brauzerda haptika yo'q */
  }
}
