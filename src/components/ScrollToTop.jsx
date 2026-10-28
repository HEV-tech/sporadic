import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Новая страница — наверх; если в адресе есть якорь, ведём к нужному блоку. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const timer = setTimeout(() => {
        const target = document.getElementById(id)
        if (target) target.scrollIntoView({ block: 'start', behavior: 'auto' })
      }, 80)
      return () => clearTimeout(timer)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return undefined
  }, [pathname, hash])

  return null
}
