import AdminDropDown from '@/myComponents/AdminDropDown'
import React from 'react'
import { Link } from 'react-router-dom'

const AdminHome = () => {
  return (
      <div className="bg-zinc-100 text-gray-800 h-screen flex items-center justify-center p-4">
        {/* <div className="h-[500px] min-w-[300px] md:min-w-[600px] lg:min-w-[800px] bg-gray-950 border flex flex-col">
          <AdminDropDown />
        </div> */}
        <div className="flex flex-col w-2xl gap-2">
          <Link to="/admin/orders" className="bg-zinc-400 text-white px-6 py-4 rounded">Bestellungen</Link>
          <Link to="/admin/category" className="bg-zinc-400 text-white px-6 py-4 rounded">Kategorien</Link>
          <Link to="/admin/products" className="bg-zinc-400 text-white px-6 py-4 rounded">Produkte</Link>
          <Link to="/admin/products/new" className="bg-zinc-400 text-white px-6 py-4 rounded">Neues Produkt</Link>
        </div>
      </div>
  )
}

export default AdminHome