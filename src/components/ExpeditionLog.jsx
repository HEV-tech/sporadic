import { Link } from 'react-router-dom'
import { LOG } from '../data/content.js'
import { ArrowRight } from './icons.jsx'

export default function ExpeditionLog() {
  return (
    <section className="sec" id="log">
      <div className="wrap">
        <div className="log-head">
          <div>
            <h2 className="h2">{LOG.title}</h2>
          </div>
          <p className="lede">{LOG.lede}</p>
        </div>

        <ul className="log-list">
          {LOG.rows.map((row) => (
            <li className="log-row" key={`${row.iso}-${row.title}`}>
              <time dateTime={row.iso}>{row.date}</time>
              <span className="t">{row.title}</span>
              <span className="k">{row.kind}</span>
            </li>
          ))}
        </ul>

        <div className="log-foot">
          <p className="note">{LOG.note}</p>
          <Link className="arrow-link" to={LOG.link.to}>
            {LOG.link.label}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
