import { Link } from 'react-router-dom'
import { DIRECTIONS } from '../data/content.js'
import Reveal from './Reveal.jsx'
import { ArrowRight } from './icons.jsx'

export default function Directions() {
  return (
    <section className="sec" id="sport">
      <div className="wrap">
        <h2 className="h2">{DIRECTIONS.title}</h2>
        <Reveal as="p" className="lede">
          {DIRECTIONS.lede}
        </Reveal>

        <div className="dirs" style={{ marginTop: '56px' }}>
          {DIRECTIONS.items.map((item) => (
            <Reveal as="article" className="dir" key={item.title}>
              <p className="spec">{item.spec}</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link className="arrow-link" to={item.link.to}>
                {item.link.label}
                <ArrowRight />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
