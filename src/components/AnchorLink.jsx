import { Link, useLocation } from 'react-router-dom'

/**
 * Якорь внутри страницы. Обычный <a href="#id"> ломает HashRouter: браузер
 * меняет hash, и роутер читает его как путь. Link держит путь и добавляет
 * к нему якорь — работает в обоих режимах.
 */
export default function AnchorLink({ hash, children, ...rest }) {
  const { pathname } = useLocation()

  return (
    <Link to={`${pathname}#${hash}`} {...rest}>
      {children}
    </Link>
  )
}
