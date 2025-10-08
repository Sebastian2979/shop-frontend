import AdminDropDown from '@/myComponents/AdminDropDown'
import React from 'react'

const AdminHome = () => {
  return (
      <div className="bg-gray-800 text-teal-300 h-screen flex items-center justify-center p-4">
        <div className="h-[500px] min-w-[300px] md:min-w-[600px] lg:min-w-[800px] bg-gray-950 border flex flex-col">
          <AdminDropDown />
        </div>
      </div>
  )
}

export default AdminHome