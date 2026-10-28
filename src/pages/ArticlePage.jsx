import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { ARTICLES, ARTICLE_LIST, GROUPS } from '../data/articles.js'

/** Страница материала: текст, навигация по разделу и общий список материалов. */
export default function ArticlePage({ slug }) {
  const article = ARTICLES[slug]
  if (!article) return null

  const siblings = ARTICLE_LIST.filter((item) => item.group === article.group)

  return (
    <div className="page">
      <div className="wrap">
        <PageHero title={article.title} lede={article.lede} />

        <div className="article">
          <div className="article-body">
            {article.sections.map((section, index) => (
              <Reveal as="section" className="article-section" key={`${slug}-${index}`}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs?.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul className="article-list">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>

          <aside className="article-aside">
            <p className="aside-title">{GROUPS[article.group]}</p>
            <ul>
              {siblings.map((item) => (
                <li key={item.slug}>
                  <Link to={item.path} aria-current={item.slug === slug ? 'page' : undefined}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <section className="materials">
          <h2 className="h2">Материалы клуба</h2>
          <div className="materials-grid">
            {Object.entries(GROUPS).map(([groupKey, groupTitle]) => (
              <div key={groupKey}>
                <p className="materials-group">{groupTitle}</p>
                <ul>
                  {ARTICLE_LIST.filter((item) => item.group === groupKey).map((item) => (
                    <li key={item.slug}>
                      <Link to={item.path}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
