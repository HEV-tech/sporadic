import { ARCHIVE } from '../data/archive.js'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'

export default function ArchivePage() {
  return (
    <div className="page">
      <div className="wrap">
        <PageHero title={ARCHIVE.title} lede={ARCHIVE.lede} />

        <div className="archive">
          {ARCHIVE.entries.map((entry) => (
            <Reveal as="div" className="archive-row" key={`${entry.date}-${entry.title}`}>
              <time>{entry.date}</time>
              <span className="t">{entry.title}</span>
              <span className="k">{entry.kind}</span>
            </Reveal>
          ))}
        </div>

        <p className="page-source note">{ARCHIVE.note}</p>
      </div>
    </div>
  )
}
