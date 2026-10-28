import { HISTORY } from '../data/history.js'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'

export default function HistoryPage() {
  return (
    <div className="page">
      <div className="wrap">
        <PageHero title={HISTORY.title} lede={HISTORY.lede} />

        <div className="page-facts">
          {HISTORY.facts.map((fact) => (
            <div key={fact.label}>
              <b>{fact.value}</b>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>

        <ol className="timeline">
          {HISTORY.timeline.map((item) => (
            <Reveal as="li" key={item.year + item.title}>
              <span className="year">{item.year}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <section className="page-section">
          <h2 className="h2">{HISTORY.callsigns.title}</h2>
          <ul className="callsigns">
            {HISTORY.callsigns.items.map((item) => (
              <li key={item.call}>
                <b>{item.call}</b>
                <span>{item.note}</span>
              </li>
            ))}
          </ul>
          <p className="note page-note">{HISTORY.note}</p>
        </section>
      </div>
    </div>
  )
}
