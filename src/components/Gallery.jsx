import { GALLERY } from '../data/content.js'
import Reveal from './Reveal.jsx'

export default function Gallery() {
  return (
    <section className="sec" id="photo" aria-label="Фотографии экспедиций">
      <div className="wrap">
        <div className="gal">
          {GALLERY.map((photo) => (
            <Reveal
              as="figure"
              key={photo.key}
              className={photo.wide ? 'wide' : undefined}
            >
              <div className="shot">
                <img src={photo.src} alt={photo.alt} loading="lazy" width="1600" height="1200" />
              </div>
              <figcaption>
                <b>{photo.place}</b>
                <span>{photo.date}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
