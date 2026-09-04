import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import BottomNav from './components/BottomNav'
import ProductSheet from './components/ProductSheet'
import Toast from './components/Toast'
import { initTelegram } from './lib/telegram'
import Account from './screens/Account'
import Cart from './screens/Cart'
import Home from './screens/Home'
import Menu from './screens/Menu'
import Orders from './screens/Orders'
import type { Tab } from './types-ui'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [menuCat, setMenuCat] = useState<string | null>(null)

  useEffect(() => {
    initTelegram()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [tab])

  const go = (t: Tab, cat?: string) => {
    setMenuCat(cat ?? null)
    setTab(t)
  }

  return (
    <div className="min-h-dvh pb-24">
      <AnimatePresence mode="wait">
        <motion.main
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {tab === 'home' && <Home go={go} />}
          {tab === 'menu' && <Menu initialCat={menuCat} />}
          {tab === 'cart' && <Cart go={go} />}
          {tab === 'orders' && <Orders go={go} />}
          {tab === 'account' && <Account go={go} />}
        </motion.main>
      </AnimatePresence>
      <BottomNav tab={tab} onChange={setTab} />
      <ProductSheet />
      <Toast />
    </div>
  )
}
