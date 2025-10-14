import CategoryTabs from '@/myComponents/CategoryTabs'
import ProductList from '@/myComponents/ProductList'
import { React, useState } from 'react'

const Home = () => {

  const [categorieId, setCategorieId] = useState();

  return (
    <>
      <div className="relative">
        <img src={"beetroot.jpg"} alt="Background Image" className="w-full h-[700px] object-cover" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className='flex flex-col gap-2'>
            <h1 className="text-white text-center text-3xl sm:text-6xl">Mein Shop</h1>
            <p className='text-white text-center text-sm'>Minimum Viable Product (MVP) Online Shop Projekt</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-center bg-gray-800 p-8'>
        <div className="sm:w-6xl sm:mx-auto">
          <CategoryTabs value={categorieId} onChange={setCategorieId} />
          <ProductList categoryId={categorieId} />
        </div>
      </div>
    </>
  )
}

export default Home