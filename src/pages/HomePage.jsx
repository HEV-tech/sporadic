import Hero from '../components/Hero.jsx'
import Tagline from '../components/Tagline.jsx'
import Directions from '../components/Directions.jsx'
import ExpeditionLog from '../components/ExpeditionLog.jsx'
import Gallery from '../components/Gallery.jsx'
import JoinSection from '../components/JoinSection.jsx'
import Faq from '../components/Faq.jsx'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Tagline />
      <Directions />
      <ExpeditionLog />
      <Gallery />
      <JoinSection />
      <Faq />
    </>
  )
}
