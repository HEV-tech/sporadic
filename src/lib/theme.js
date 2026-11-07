import { useCallback, useEffect, useState } from 'react'

export const THEMES = [
  { id: 'light', label: 'Лист' },
  { id: 'dark', label: 'Ночь' },
]

const STORAGE_KEY = 'sporadic-theme'

function readInitial() {
  if (typeof document === 'undefined') return { theme: 'light' }
  return { theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light' }
}

/** Тема живёт на <html data-theme>. По умолчанию — бумага, ночь по выбору. */
export function useTheme() {
  const [state, setState] = useState(readInitial)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = state.theme
    root.style.colorScheme = state.theme
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: state.theme }))
    } catch {
      // приватный режим — просто не запоминаем выбор
    }
  }, [state])

  const toggleTheme = useCallback(() => {
    setState((current) => ({ theme: current.theme === 'dark' ? 'light' : 'dark' }))
  }, [])

  return { theme: state.theme, toggleTheme }
}
