import CategoryTabs from '@/myComponents/CategoryTabs'
import ProductList from '@/myComponents/ProductList'
import { React, useState } from 'react'

const Home = () => {

  const [categorieId, setCategorieId] = useState();

  return (
    <>
      {/* <div className="relative"> */}
      <section className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-zinc-100 text-gray-800">
        <div className="md:w-md space-y-3 text-center mb-8 md:mb-0 md:mr-8 p-4">
          <p className="font-black md:text-6xl text-3xl">Gutes <span className="text-orange-600">Essen</span> beginnt hier.</p>
          <p className="antialiased">Entdecke Lebensmittel, die mit Sorgfalt hergestellt und mit Liebe ausgewählt wurden.
            Für mehr Geschmack – und ein gutes Gefühl bei jedem Einkauf.</p>
          <button className="bg-orange-600 text-white px-12 py-4">Jetzt shoppen</button>
        </div>
        <div className="md:w-2xl">
          <img src={"grocery.png"} alt="Gemüsekorb" />
        </div>
      </section>
      {/*alte Hero section*/}
      {/* <img src={"beetroot.jpg"} alt="Background Image" className="w-full h-[700px] object-cover" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className='flex flex-col gap-2'>
            <h1 className="text-white text-center text-3xl sm:text-6xl">Mein Shop</h1>
            <p className='text-white text-center text-sm'>Minimum Viable Product (MVP) Online Shop Projekt</p>
          </div>
        </div> 
      </div>*/}
      <div className='flex flex-col justify-center bg-zinc-100 p-8'>
        <div className="sm:w-6xl sm:mx-auto">
          <CategoryTabs value={categorieId} onChange={setCategorieId} />
          <ProductList categoryId={categorieId} />
        </div>
      </div>
    </>
  )
}

export default Home