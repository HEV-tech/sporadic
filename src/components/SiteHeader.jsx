import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CLUB, NAV } from '../data/content.js'
import { closeMenuTimeline, openMenuTimeline } from '../lib/motion.js'
import ThemeControls from './ThemeControls.jsx'

export default function SiteHeader({
  open,
  onToggle,
  onClose,
  theme,
  palette,
  onToggleTheme,
  onPalette,
}) {
  const burgerRef = useRef(null)
  const overlayRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [keyGroup, setKeyGroup] = useState(null)

  // Слой меню существует в разметке всегда; показываем его перед анимацией.
  useEffect(() => {
    if (open) setVisible(true)
  }, [open])

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay || !visible) return
    const links = [...overlay.querySelectorAll('.menu-links a')]

    if (open) {
      const timeline = openMenuTimeline(overlay, links)
      // Фокус переносим только при открытии с клавиатуры — иначе остаётся лишняя рамка.
      const keyboard = burgerRef.current?.matches(':focus-visible')
      const focusTimer = keyboard
        ? setTimeout(() => links[0]?.focus({ preventScroll: true }), 170)
        : null
      return () => {
        clearTimeout(focusTimer)
        timeline?.revert?.()
      }
    }

    closeMenuTimeline(overlay, links, () => setVisible(false))
    return undefined
  }, [open, visible])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      onClose()
      burgerRef.current?.focus({ preventScroll: true })
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <>
      <div className="nav-shell">
        <nav className="nav" aria-label="Основная навигация">
          <Link className="brand" to="/">
            <i aria-hidden="true" />
            {CLUB.name}
          </Link>

          <ul className="nav-links">
            {NAV.map((group) => (
              <li
                className={`nav-group${keyGroup === group.to ? ' is-open' : ''}`}
                key={group.to}
                onFocus={(event) => {
                  // Раскрываем только при навигации с клавиатуры, не после клика мышью.
                  if (event.target.matches?.(':focus-visible')) setKeyGroup(group.to)
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setKeyGroup(null)
                }}
              >
                <Link className="nav-link" to={group.to}>
                  {group.label}
                </Link>

                <div className="nav-dropdown">
                  <ul>
                    {group.children.map((child) => (
                      <li key={`${group.to}-${child.to}-${child.label}`}>
                        <Link to={child.to}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          <ThemeControls
            className="nav-theme"
            theme={theme}
            palette={palette}
            onToggleTheme={onToggleTheme}
            onPalette={onPalette}
          />

          <Link className="btn btn-primary btn-sm" to="/#join">
            Вступить
          </Link>

          <button
            ref={burgerRef}
            className="burger"
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={onToggle}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </div>

      <div
        id="menu"
        ref={overlayRef}
        className={visible ? 'menu is-visible' : 'menu'}
        aria-hidden={!open}
      >
        <div className="menu-links">
          {NAV.map((group) => (
            <div className="menu-group" key={group.to}>
              <Link to={group.to} onClick={onClose}>
                {group.label}
              </Link>
              <div className="menu-sub">
                {group.children.map((child) => (
                  <Link key={`${group.to}-${child.to}`} to={child.to} onClick={onClose}>
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link to="/#contacts" onClick={onClose}>
            Контакты
          </Link>
        </div>

        <div className="menu-tail">
          <ThemeControls
            className="menu-theme"
            theme={theme}
            palette={palette}
            onToggleTheme={onToggleTheme}
            onPalette={onPalette}
          />
          <p className="menu-note">Курск · RW3WW · RC3W</p>
        </div>
      </div>
    </>
  )
}
