import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate } from 'animejs'
import { FAQ } from '../data/content.js'
import { motionAllowed } from '../lib/motion.js'

/**
 * Пункт вопросов. Раскрытие анимируется по реальной высоте содержимого:
 * details остаётся нативным (клавиатура, поиск по странице), но переключение
 * перехватывается, чтобы не было мгновенного щелчка.
 */
function FaqItem({ item }) {
  const detailsRef = useRef(null)
  const bodyRef = useRef(null)
  const animationRef = useRef(null)

  const handleToggle = (event) => {
    event.preventDefault()

    const details = detailsRef.current
    const body = bodyRef.current
    if (!details || !body) return

    const willOpen = !details.open
    animationRef.current?.cancel?.()

    if (!motionAllowed()) {
      details.open = willOpen
      return
    }

    if (willOpen) {
      details.open = true
      const height = body.scrollHeight
      body.style.overflow = 'hidden'
      body.style.height = '0px'
      body.style.opacity = '0'

      animationRef.current = animate(body, {
        height: [0, height],
        opacity: [0, 1],
        duration: 460,
        ease: 'out(3)',
        onComplete: () => {
          body.style.height = 'auto'
          body.style.overflow = ''
          body.style.opacity = ''
        },
      })
      return
    }

    const height = body.scrollHeight
    body.style.overflow = 'hidden'
    body.style.height = `${height}px`

    animationRef.current = animate(body, {
      height: [height, 0],
      opacity: [1, 0],
      duration: 320,
      ease: 'in(2)',
      onComplete: () => {
        details.open = false
        body.style.height = ''
        body.style.overflow = ''
        body.style.opacity = ''
      },
    })
  }

  return (
    <details ref={detailsRef}>
      <summary onClick={handleToggle}>
        {item.q}
        <span className="pm" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="faq-body" ref={bodyRef}>
        <p>
          {item.a}
          {item.link && (
            <>
              {' '}
              <Link to={item.link.to}>{item.link.label}</Link>
              .
            </>
          )}
        </p>
      </div>
    </details>
  )
}

export default function Faq() {
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <h2 className="h2">{FAQ.title}</h2>

        <div className="faq-list">
          {FAQ.items.map((item) => (
            <FaqItem item={item} key={item.q} />
          ))}
        </div>
      </div>
    </section>
  )
}
