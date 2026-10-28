import { useLayoutEffect, useRef } from 'react'
import { BANDS, CLUB, HERO, STATS } from '../data/content.js'
import { heroIntro } from '../lib/motion.js'
// Логотип попадает в бандл как data:URL (см. vite.config.js): из него считается
// эмблема, и canvas остаётся «чистым» даже при открытии с диска.
import logoMark from '../assets/sporadic-logo-9f3c.png'
import AsciiEmblem from './AsciiEmblem.jsx'
import AnchorLink from './AnchorLink.jsx'
import UtcClock from './UtcClock.jsx'
import { ArrowRight } from './icons.jsx'

export default function Hero() {
  const captionRef = useRef(null)
  const titleRef = useRef(null)
  const ledeRef = useRef(null)
  const actionsRef = useRef(null)
  const footRef = useRef(null)
  const played = useRef(false)

  useLayoutEffect(() => {
    if (played.current) return
    played.current = true

    heroIntro({
      caption: captionRef.current,
      title: titleRef.current,
      lede: ledeRef.current,
      actions: actionsRef.current,
      foot: footRef.current,
    })
  }, [])

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-meta">
          <span className="coords">{CLUB.coords}</span>
          <span className="live">
            <i aria-hidden="true" />
            <UtcClock />
          </span>
        </div>

        <div className="hero-main">
          <figure className="emblem">
            <AsciiEmblem
              src={logoMark}
              label="Эмблема клуба «Спорадик»: глобус в наушниках, собранный из символов"
            />
            <figcaption className="emblem-cap" ref={captionRef}>
              <span>Спорадик</span>
              <span className="sep">·</span>
              <span>радиоклуб ЮЗГУ</span>
              <span className="sep">·</span>
              <span>
                с 1965 года
                <span className="cursor" aria-hidden="true" />
              </span>
            </figcaption>
          </figure>

          <div className="hero-copy">
            <h1 ref={titleRef}>{HERO.title}</h1>
            <p className="lede" ref={ledeRef}>
              {HERO.lede}
            </p>
            <div className="hero-cta" ref={actionsRef}>
              <AnchorLink className="btn btn-primary" hash={HERO.primaryCta.hash}>
                {HERO.primaryCta.label}
              </AnchorLink>
              <AnchorLink className="arrow-link" hash={HERO.secondaryCta.hash}>
                {HERO.secondaryCta.label}
                <ArrowRight />
              </AnchorLink>
            </div>
          </div>
        </div>

        <div className="hero-foot" ref={footRef}>
          <div className="stats">
            {STATS.map((item) => (
              <div className="stat" key={item.label}>
                <b>{item.value}</b>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="bands">
            <span className="bank-label">Диапазоны</span>
            {BANDS.map((item) => (
              <span className="band" key={item.band}>
                {item.band} <em>{item.freq}</em>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
