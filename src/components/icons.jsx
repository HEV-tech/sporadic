import {
  ArrowRight as PhArrowRight,
  Moon as PhMoon,
  Sun as PhSun,
  VideoCamera as PhVideoCamera,
} from '@phosphor-icons/react'

/**
 * Иконки одной семьёй — Phosphor, вес regular (~1.5 px штриха).
 * Свои SVG больше не рисуем: набор из нескольких глифов не стоит
 * расхождения в толщине линий рядом с обводкой 2 px.
 */

export function ArrowRight(props) {
  return <PhArrowRight size={14} aria-hidden="true" {...props} />
}

export function SunIcon(props) {
  return <PhSun size={16} aria-hidden="true" {...props} />
}

export function MoonIcon(props) {
  return <PhMoon size={16} aria-hidden="true" {...props} />
}

export function VideoIcon(props) {
  return <PhVideoCamera size={16} aria-hidden="true" {...props} />
}
