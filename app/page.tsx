import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Despre from './components/Despre'
import Servicii from './components/Servicii'
import Proces from './components/Proces'
import Preturi from './components/Preturi'
import CTA from './components/CTA'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Despre />
      <Servicii />
      <Proces />
      <Preturi />
      <CTA />
      <Footer />
      <WhatsAppButton />
    </>
  )
}
