import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import HomePage from './pages/HomePage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import CharterPage from './pages/CharterPage.jsx'
import ArchivePage from './pages/ArchivePage.jsx'
import ArticlePage from './pages/ArticlePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { ARTICLES } from './data/articles.js'
import { useTheme } from './lib/theme.js'

// На хостинге — обычные адреса вида /history. Если файл открыт прямо с диска
// (file://), история браузера недоступна, поэтому там переключаемся на хеш-роутер.
const Router = typeof window !== 'undefined' && window.location.protocol === 'file:' ? HashRouter : BrowserRouter

function Site() {
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef(null)
  const footerRef = useRef(null)
  const { theme, palette, toggleTheme, setPalette } = useTheme()

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((value) => !value), [])

  // Открытое меню блокирует страницу под собой: скролл и фокус.
  useEffect(() => {
    const main = mainRef.current
    const footer = footerRef.current

    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (main) main.inert = menuOpen
    if (footer) footer.inert = menuOpen

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <a
        className="skip"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          const main = document.getElementById('main-content')
          if (!main) return
          main.focus({ preventScroll: true })
          main.scrollIntoView({ block: 'start' })
        }}
      >
        Перейти к содержанию
      </a>

      <SiteHeader
        open={menuOpen}
        onToggle={toggleMenu}
        onClose={closeMenu}
        theme={theme}
        palette={palette}
        onToggleTheme={toggleTheme}
        onPalette={setPalette}
      />

      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/charter" element={<CharterPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          {Object.entries(ARTICLES).map(([slug, article]) => (
            <Route key={slug} path={article.path} element={<ArticlePage slug={slug} />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <SiteFooter ref={footerRef} />
      <ScrollToTop />
    </>
  )
}

export default function App() {
  return (
    <Router>
      <Site />
    </Router>
  )
}
