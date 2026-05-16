import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'labdock-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return localStorage.getItem(THEME_STORAGE_KEY) || 'light'
}

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme }
}
