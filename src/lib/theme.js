import { useCallback, useEffect, useState } from 'react'

export const THEMES = [
  { id: 'dark', label: 'Тёмная' },
  { id: 'light', label: 'Светлая' },
]

/** Основные палитры. Акцент подобран отдельно для тёмной и светлой темы. */
export const PALETTES = [
  { id: 'amber', label: 'Янтарь', dark: '#FFB020', light: '#A85B00' },
  { id: 'mint', label: 'Фосфор', dark: '#6EE7A8', light: '#0B7A4B' },
  { id: 'azure', label: 'Ионосфера', dark: '#7CC4FF', light: '#0B62A8' },
  { id: 'copper', label: 'Медь', dark: '#FF8A5B', light: '#A63A12' },
]

const STORAGE_KEY = 'sporadic-theme'

function readInitial() {
  if (typeof document === 'undefined') return { theme: 'dark', palette: 'amber' }
  const { theme, palette } = document.documentElement.dataset
  return { theme: theme || 'dark', palette: palette || 'amber' }
}

/** Тема и палитра живут на <html data-theme data-palette>, выбор запоминается. */
export function useTheme() {
  const [state, setState] = useState(readInitial)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = state.theme
    root.dataset.palette = state.palette
    root.style.colorScheme = state.theme
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // приватный режим — просто не запоминаем выбор
    }
  }, [state])

  const toggleTheme = useCallback(() => {
    setState((current) => ({
      ...current,
      theme: current.theme === 'dark' ? 'light' : 'dark',
    }))
  }, [])

  const setPalette = useCallback((palette) => {
    setState((current) => ({ ...current, palette }))
  }, [])

  return { theme: state.theme, palette: state.palette, toggleTheme, setPalette }
}
