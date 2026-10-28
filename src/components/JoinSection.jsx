import { CLUB, JOIN } from '../data/content.js'
import JoinForm from './JoinForm.jsx'
import Reveal from './Reveal.jsx'

export default function JoinSection() {
  return (
    <section className="sec" id="join">
      <div className="wrap">
        <div className="join-grid">
          <div>
            <h2 className="h2">{JOIN.title}</h2>
            <p className="lede">{JOIN.lede}</p>

            <ol className="steps">
              {JOIN.steps.map((step) => (
                <Reveal as="li" className="step" key={step.n}>
                  <b>{step.n}</b>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <div className="contact-inline">
              <a href={CLUB.phoneHref}>{CLUB.phone}</a>
              <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>
              <span className="note">{JOIN.note}</span>
            </div>
          </div>

          <Reveal>
            <JoinForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
