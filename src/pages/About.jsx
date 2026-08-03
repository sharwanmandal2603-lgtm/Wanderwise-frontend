import React from 'react'
import Navbar from '../components/landingComponents/Navbar'
import Footer from '../components/landingComponents/Footer'
import AboutSection from '../components/landingComponents/About'
import Testimonials from '../components/landingComponents/Testimonials'

const About = () => {
  return (
    <div>
      <Navbar />

      <div className="pt-20">
        <AboutSection />
        <Testimonials />
      </div>

      <Footer />
    </div>
  )
}

export default About
