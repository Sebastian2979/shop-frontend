import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="bg-zinc-900 text-white text-end p-4">
      <Link to="/admin" className="font-medium hover:underline">Admin</Link>
    </div>
  )
}

export default Footer