import React from 'react'
import { motion } from 'framer-motion'
import SignupPage from '../components/Auth/SignupPage'

const Signup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <SignupPage />
    </motion.div>
  )
}

export default Signup
