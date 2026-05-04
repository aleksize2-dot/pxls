import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { Image, Video, Wrench, User } from 'lucide-react'
import { GenerationForm } from './components/GenerationForm'
import { History } from './components/History'
import { useStore } from './store'
import { supabase } from './supabase'

function Layout() {
  const credits = useStore(state => state.credits)

  return (
    <div className="app">
      <header className="header glass">
        <h1 className="logo">PXLS</h1>
        <div className="badge">💳 {credits} PX</div>
      </header>

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/generate/image" replace />} />
          <Route path="/generate/image" element={<GenerationForm type="text-to-image" />} />
          <Route path="/generate/video" element={<GenerationForm type="image-to-video" />} />
          <Route path="/tools" element={<GenerationForm type="tools" />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>

      <nav className="bottom-nav glass">
        <NavLink to="/generate/image" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Image size={24} />
          <span>Фото</span>
        </NavLink>
        <NavLink to="/generate/video" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Video size={24} />
          <span>Видео</span>
        </NavLink>
        <NavLink to="/tools" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Wrench size={24} />
          <span>Утилиты</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>История</span>
        </NavLink>
      </nav>
    </div>
  )
}

function App() {
  const setCredits = useStore(state => state.setCredits)
  const setTelegramUser = useStore(state => state.setTelegramUser)
  const updateGeneration = useStore(state => state.updateGeneration)

  useEffect(() => {
    // Attempt to load TMA env
    let tgUser: any = null
    try {
      const tg = (window as any).Telegram?.WebApp
      if (tg) {
        tg.expand()
        tg.setHeaderColor('#09090b')
        tg.setBackgroundColor('#09090b')
        if (tg.initDataUnsafe?.user) {
          tgUser = tg.initDataUnsafe.user
          setTelegramUser(tgUser)
        }
      }
    } catch (e) {
      console.warn("Not in Telegram environment")
    }

    // Load user data from Supabase using telegram_id
    // Note: For real security, API should verify initData and issue a JWT.
    // In this MVP frontend we'll do a simple select for demo.
    async function loadUser() {
      if (!tgUser) return
      const { data } = await supabase.from('users').select('id, credits').eq('telegram_id', tgUser.id).single()
      if (data) {
        setCredits(data.credits)
      }
    }
    loadUser()

    // Realtime subscription for generation statuses
    const channel = supabase.channel('public:generations')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'generations' },
        (payload) => {
          const gen = payload.new as any
          if (gen.status === 'done' || gen.status === 'failed') {
            updateGeneration(gen.id, {
              status: gen.status,
              result_urls: gen.result_urls,
              error: gen.error
            })
            // reload credits just in case
            loadUser()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App
