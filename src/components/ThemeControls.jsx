import { PALETTES } from '../lib/theme.js'
import { MoonIcon, SunIcon } from './icons.jsx'

/**
 * Переключатель оформления: палитра и тема.
 * Стоит в шапке на десктопе и в меню на мобильном.
 */
export default function ThemeControls({ theme, palette, onToggleTheme, onPalette, className = '' }) {
  const isDark = theme === 'dark'

  return (
    <div className={`theme-controls ${className}`.trim()}>
      <div className="swatches" role="group" aria-label="Палитра">
        {PALETTES.map((item) => (
          <button
            key={item.id}
            type="button"
            className="swatch"
            style={{ '--swatch': isDark ? item.dark : item.light }}
            aria-label={`Палитра «${item.label}»`}
            aria-pressed={palette === item.id}
            title={item.label}
            onClick={() => onPalette(item.id)}
          />
        ))}
      </div>

      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
        title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  )
}
