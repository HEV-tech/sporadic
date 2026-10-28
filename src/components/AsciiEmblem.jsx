import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SAMPLES_PER_CELL, buildRows, rasterize } from '../lib/asciiEmblem.js'
import { printEmblem } from '../lib/motion.js'

const MAX_FONT_SIZE = 96

/**
 * Эмблема клуба, набранная символами.
 *
 * Строки считаются в браузере из картинки логотипа: меняется картинка — меняется
 * эмблема, отдельной сборки арта не нужно. Кегль подбирается замером ширины
 * строки: у разных моноширинных шрифтов разная ширина знака.
 */
export default function AsciiEmblem({ src, label, columns = 115 }) {
  const [rows, setRows] = useState([])
  const preRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const image = new Image()
    image.decoding = 'async'

    image.onload = () => {
      if (cancelled) return
      try {
        const raster = rasterize(image, columns * SAMPLES_PER_CELL)
        if (!raster) return
        setRows(buildRows(raster.context, raster.width, raster.height, { columns }))
      } catch {
        // Canvas может оказаться «испорченным» (например, при открытии по file://).
        // Тогда оставляем заглушку вместо падения всей страницы.
      }
    }

    image.src = src

    return () => {
      cancelled = true
      image.onload = null
    }
  }, [src, columns])

  // Кегль: только замер даёт точное попадание в колонку.
  useLayoutEffect(() => {
    const pre = preRef.current
    if (!pre || rows.length === 0) return

    const fit = () => {
      const available = pre.parentElement?.clientWidth ?? 0
      if (!available) return

      pre.style.fontSize = '100px'
      const natural = pre.getBoundingClientRect().width
      if (!natural) return

      pre.style.fontSize = `${Math.min((available / natural) * 100, MAX_FONT_SIZE).toFixed(2)}px`
    }

    fit()

    const observer = new ResizeObserver(fit)
    if (pre.parentElement) observer.observe(pre.parentElement)
    window.addEventListener('load', fit)
    document.fonts?.ready.then(fit)

    return () => {
      observer.disconnect()
      window.removeEventListener('load', fit)
    }
  }, [rows])

  // Печать: строки проявляются каскадом, до кадра с анимацией прячем их.
  useLayoutEffect(() => {
    const pre = preRef.current
    if (!pre || rows.length === 0) return

    const rowElements = [...pre.querySelectorAll('.row')]
    rowElements.forEach((row) => {
      row.style.opacity = '0'
    })
    printEmblem(rowElements)
  }, [rows])

  if (rows.length === 0) {
    return <div className="emblem-skeleton" aria-hidden="true" />
  }

  return (
    <pre ref={preRef} className="emblem-art" role="img" aria-label={label}>
      {rows.map((row, index) => (
        <span className="row" key={index}>
          {row}
        </span>
      ))}
    </pre>
  )
}
