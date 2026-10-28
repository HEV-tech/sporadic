import { useEffect, useRef } from 'react'
import { TAGLINE } from '../data/content.js'
import { revealWords } from '../lib/motion.js'

const WORDS = TAGLINE.split(' ')

/** Слоган: слова догоняют друг друга, когда блок входит в кадр. */
export default function Tagline() {
  const copyRef = useRef(null)

  useEffect(() => {
    const el = copyRef.current
    if (!el) return

    const words = [...el.querySelectorAll('.w')]
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        revealWords(words)
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="tagline" aria-label="О клубе">
      <div className="wrap">
        <p className="tag-copy" ref={copyRef}>
          {WORDS.map((word, index) => (
            <span className="w" key={`${word}-${index}`}>
              {word}
              {index < WORDS.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
