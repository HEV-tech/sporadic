import { animate, createTimeline, stagger } from 'animejs'

/** Общий характер движения: мягкий разгон и долгий выкат. */
export const EASE = 'out(3)'
const EASE_SOFT = 'out(2)'

export function motionAllowed() {
  return typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Появление одного блока: сдвиг + прозрачность. */
export function revealElement(el, { delay = 0, distance = 28, duration = 900 } = {}) {
  if (!el) return null
  if (!motionAllowed()) {
    el.style.opacity = '1'
    el.style.transform = 'none'
    return null
  }

  return animate(el, {
    opacity: [0, 1],
    y: [distance, 0],
    duration,
    delay,
    ease: EASE,
    // Снимаем inline-трансформацию: иначе она перебивает hover-эффекты карточек.
    onComplete: () => {
      el.style.transform = ''
    },
  })
}

/** Печать эмблемы: строки проявляются одна за другой. */
export function printEmblem(rows, { delay = 0 } = {}) {
  if (!rows.length) return null
  if (!motionAllowed()) {
    rows.forEach((row) => {
      row.style.opacity = '1'
    })
    return null
  }

  return animate(rows, {
    opacity: [0, 1],
    y: [8, 0],
    duration: 520,
    delay: stagger(9, { start: delay }),
    ease: EASE_SOFT,
  })
}

/** Слоган: слова догоняют друг друга. */
export function revealWords(words, { delay = 0 } = {}) {
  if (!words.length) return null
  if (!motionAllowed()) {
    words.forEach((word) => {
      word.style.opacity = '1'
    })
    return null
  }

  return animate(words, {
    opacity: [0.16, 1],
    y: [12, 0],
    duration: 760,
    delay: stagger(62, { start: delay }),
    ease: EASE,
  })
}

/** Открытие мобильного меню: подложка, затем ссылки лесенкой. */
export function openMenuTimeline(overlay, links) {
  if (!motionAllowed()) {
    overlay.style.opacity = '1'
    links.forEach((link) => {
      link.style.opacity = '1'
      link.style.transform = 'none'
    })
    return null
  }

  const timeline = createTimeline({ defaults: { ease: EASE } })
  timeline
    .add(overlay, { opacity: [0, 1], duration: 380 })
    .add(links, { opacity: [0, 1], y: [30, 0], duration: 560, delay: stagger(48) }, 120)

  return timeline
}

/** Закрытие меню: коротко и без каскада. */
export function closeMenuTimeline(overlay, links, onDone) {
  if (!motionAllowed()) {
    overlay.style.opacity = '0'
    onDone?.()
    return null
  }

  return animate(overlay, {
    opacity: [1, 0],
    duration: 260,
    ease: 'in(2)',
    onComplete: () => onDone?.(),
  })
}

/** Первый экран: эмблема, затем текст. */
export function heroIntro({ emblem, caption, title, lede, actions, foot }) {
  if (!motionAllowed()) return null

  const timeline = createTimeline({ defaults: { ease: EASE } })
  timeline
    .add(emblem, { opacity: [0, 1], scale: [0.97, 1], duration: 1000 }, 0)
    .add(caption, { opacity: [0, 1], y: [10, 0], duration: 640 }, 260)
    .add(title, { opacity: [0, 1], y: [22, 0], duration: 900 }, 180)
    .add(lede, { opacity: [0, 1], y: [18, 0], duration: 820 }, 320)
    .add(actions, { opacity: [0, 1], y: [16, 0], duration: 760 }, 440)
    .add(foot, { opacity: [0, 1], y: [14, 0], duration: 760 }, 560)

  return timeline
}
