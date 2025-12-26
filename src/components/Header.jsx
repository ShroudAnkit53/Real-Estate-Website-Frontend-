import React from 'react'
import Navbar from './Navbar'
import { motion } from 'framer-motion'
import headerVideo from "../assets/4770380-hd_1920_1080_30fps.mp4";


const Header = () => {
  return (
  <div
  className="relative min-h-screen mb-4 flex flex-col w-full overflow-hidden"
  id="Header"
>
  {/* Background video */}
  <video
    className="absolute inset-0 w-full h-full object-cover"
    src={headerVideo}
    autoPlay
    muted
    loop
    playsInline
  />

  {/* Dark overlay for readability */}
  <div className="absolute inset-0 bg-black/60" />

  {/* Navbar & Content on top */}
  <div className="relative z-10 w-full">
    <Navbar />

    <motion.div
      initial={{ opacity: 0, y: 100 }}
      transition={{ duration: 1.5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container text-center mx-auto py-4 px-6 md:px-20 lg:px-32 text-white mt-24"
    >
      <h2 className="text-4xl sm:text-5xl md:text-[82px] inline-block max-w-3xl font-semibold pt-20">
        Explore homes that fits your dream
      </h2>

      <div className="space-x-6 mt-16">
        <a href="#Projects" className="border border-white px-8 py-3 rounded">
          Projects
        </a>
        <a href="#Contact" className="bg-blue-500 px-8 py-3 rounded">
          Contact Us
        </a>
      </div>
    </motion.div>
  </div>
</div>

  )
}

export default Header