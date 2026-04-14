'use client'

import { useEffect, useState } from 'react'
import { HiSun, HiMoon } from 'react-icons/hi2'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved === 'dark' || (!saved && prefersDark)
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
      className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-all"
    >
      {dark
        ? <HiSun  className="w-5 h-5" />
        : <HiMoon className="w-5 h-5" />
      }
    </button>
  )
}
