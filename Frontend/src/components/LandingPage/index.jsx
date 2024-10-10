import Footer from './footer'
import Navbar from './navbar'
import MiddleInfo from './MiddleInfo'
import HelpCenter from './HelpCenter'
import Testimonials from './Testimonial'
import HeroSection from './HeroSection'

function MainPage() {
  return (
    <>
      <Navbar/>
      <HeroSection />
      <MiddleInfo />
      <Testimonials />
      <HelpCenter />
      <Footer/>
    </>
  )
}

export default MainPage;