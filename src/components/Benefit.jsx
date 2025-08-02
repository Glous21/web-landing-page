// src/components/Benefit.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'
import axios from 'axios'

const variants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
    scale: 0.95,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5 },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100,
    scale: 0.95,
    transition: { duration: 0.5 },
  }),
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

const Benefit = () => {
  const [[index, direction], setIndex] = useState([0, 1])
  const [benefits, setBenefits] = useState([])

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVICE_CONTEND_URL}/api/benefits`)
        setBenefits(response.data)
      } catch (error) {
        console.error('Gagal memuat benefits:', error)
      }
    }

    fetchBenefits()
  }, [])

  useEffect(() => {
    if (benefits.length === 0) return
    const interval = setInterval(() => {
      setIndex(([prev]) => [(prev + 1) % benefits.length, 1])
    }, 4000)
    return () => clearInterval(interval)
  }, [benefits])

  const paginate = (newIndex) => {
    const dir = newIndex > index ? 1 : -1
    setIndex([newIndex, dir])
  }

  if (benefits.length === 0) return null

  return (
    <motion.section
      id="keuntungan"
      className="py-20 bg-orange-50 text-center overflow-hidden"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-orange-600 mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Kenapa Pilih Kapten Naratel?
      </motion.h2>

      <div className="relative max-w-3xl mx-auto px-6 min-h-[160px]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-orange-500 flex items-center gap-4 justify-center absolute w-full"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <FaCheckCircle className="text-orange-500 text-3xl shrink-0" />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-800">
                {benefits[index]?.title}
              </p>
              <p className="text-sm text-gray-600">
                {benefits[index]?.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {benefits.map((_, i) => (
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === index ? 'bg-orange-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </motion.section>
  )
}

export default Benefit
