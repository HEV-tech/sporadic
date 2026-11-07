import { MoonIcon, SunIcon } from './icons.jsx'

/**
 * Переключатель материалов: лист (бумага) и ночь (ночной чертёж).
 * Акцент в системе один, поэтому выбора палитры больше нет.
 */
export default function ThemeControls({ theme, onToggleTheme, className = '' }) {
  const isDark = theme === 'dark'

  return (
    <div className={`theme-controls ${className}`.trim()}>
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={isDark ? 'Переключить на бумагу' : 'Переключить на ночной чертёж'}
        title={isDark ? 'Лист' : 'Ночь'}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  )
}
