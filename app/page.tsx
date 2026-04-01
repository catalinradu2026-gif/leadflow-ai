import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Despre from './components/Despre'
import Probleme from './components/Probleme'
import Servicii from './components/Servicii'
import Proces from './components/Proces'
import Portofoliu from './components/Portofoliu'
import DeceNoi from './components/DeceNoi'
import Comparatie from './components/Comparatie'
import Preturi from './components/Preturi'
import Testimoniale from './components/Testimoniale'
import CTA from './components/CTA'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Despre />
      <Probleme />
      <Servicii />
      <Proces />
      <Portofoliu />
      <DeceNoi />
      <Comparatie />
      <Preturi />
      <Testimoniale />
      <CTA />
      <Footer />
      <WhatsAppButton />
    </>
  )
}
