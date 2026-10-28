import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="wrap">
        <PageHero
          title="Страница не найдена"
          lede="Адрес мог измениться. Вернитесь на главную — там направления клуба, журнал выездов и заявка в актив."
        />
        <p>
          <Link className="btn btn-primary" to="/">
            На главную
          </Link>
        </p>
      </div>
    </div>
  )
}
