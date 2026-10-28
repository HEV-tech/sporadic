import { createElement, useEffect, useRef } from 'react'
import { revealElement } from '../lib/motion.js'

/**
 * Появление блока при прокрутке: IntersectionObserver запускает anime.js,
 * дальше элемент живёт своей жизнью. as — тег, чтобы не ломать сетку лишним div.
 */
export default function Reveal({ as = 'div', className = '', delay = 0, distance = 28, children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      el.style.opacity = '1'
      return
    }

    let animation = null
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        animation = revealElement(el, { delay, distance })
      },
      { rootMargin: '120% 0px -8% 0px', threshold: 0.12 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      animation?.revert?.()
    }
  }, [delay, distance])

  const classes = ['reveal', className].filter(Boolean).join(' ')

  return createElement(as, { ref, className: classes, ...rest }, children)
}
