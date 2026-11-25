import { useState, useEffect } from 'react'

export const ACCENTS = {
  blue: '#2563eb',
  green: '#16a34a',
  purple: '#7c3aed',
  rose: '#e11d48',
}

const THEME_KEY = 'theme'
const ACCENT_KEY = 'accent'

const read = (key, fallback) => localStorage.getItem(key) || fallback

export default function useTheme() {
  const [theme, setTheme] = useState(() => read(THEME_KEY, 'light'))
  const [accent, setAccent] = useState(() => read(ACCENT_KEY, 'blue'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', ACCENTS[accent] || ACCENTS.blue)
    localStorage.setItem(ACCENT_KEY, accent)
  }, [accent])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, accent, accents: Object.keys(ACCENTS), setAccent, toggleTheme }
}
