import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { CLUB, FOOTER } from '../data/content.js'

const SiteFooter = forwardRef(function SiteFooter(_props, ref) {
  return (
    <footer id="contacts" ref={ref}>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-brand">
              <i aria-hidden="true" />
              {CLUB.name}
            </div>
            <p className="foot-org">
              {CLUB.org}. Коллективная радиостанция ЮЗГУ работает с августа 1965 года.
            </p>
          </div>

          <div>
            <h4>Контакты</h4>
            <ul>
              {FOOTER.contacts.map((item) => (
                <li key={item.text}>
                  {item.href ? <a href={item.href}>{item.text}</a> : item.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Разделы</h4>
            <ul>
              {FOOTER.sections.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Документы</h4>
            <ul>
              {FOOTER.documents.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>{FOOTER.copyright}</span>
          <span>{CLUB.callsigns}</span>
        </div>
      </div>
    </footer>
  )
})

export default SiteFooter
