import { CHARTER } from '../data/charter.js'
import PageHero from '../components/PageHero.jsx'
import AnchorLink from '../components/AnchorLink.jsx'

export default function CharterPage() {
  return (
    <div className="page">
      <div className="wrap">
        <PageHero title={CHARTER.title} lede={CHARTER.lede} />

        <div className="doc">
          <nav className="doc-toc" aria-label="Разделы устава">
            {CHARTER.sections.map((section) => (
              <AnchorLink key={section.id} hash={section.id}>
                {section.title}
              </AnchorLink>
            ))}
          </nav>

          <div className="doc-body">
            {CHARTER.sections.map((section) => (
              <section className="doc-section" id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.id}-${index}`}>{paragraph}</p>
                ))}
              </section>
            ))}

            <p className="note page-note">{CHARTER.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
