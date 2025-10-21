import CategoryTabs from '@/myComponents/CategoryTabs'
import ProductList from '@/myComponents/ProductList'
import { React, useState } from 'react'

const Home = () => {

  const [categorieId, setCategorieId] = useState();

  return (
    <>
      <section className="flex flex-col-reverse md:flex-row justify-center items-center min-h-screen bg-zinc-100 text-gray-800">
        <div className="md:w-md space-y-3 text-center mb-8 md:mb-0 md:mr-8 p-4">
          <p className="font-black md:text-6xl text-3xl">Gutes <span className="text-orange-600">Essen</span> beginnt hier.</p>
          <p className="antialiased">Entdecke Lebensmittel, die mit Sorgfalt hergestellt und mit Liebe ausgewählt wurden.
            Für mehr Geschmack – und ein gutes Gefühl bei jedem Einkauf.</p>
          <button className="bg-orange-600 text-white px-12 py-4">Jetzt shoppen</button>
        </div>
        <div className="md:w-2xl">
          <img src={"grocery.png"} alt="Gemüsekorb" className="w-64 h-64 md:w-full md:h-full"/>
        </div>
      </section>
      <div className='flex flex-col justify-center bg-zinc-100 p-8'>
        <div className="sm:w-6xl sm:mx-auto md:w-7xl md:mx-auto">
          <CategoryTabs value={categorieId} onChange={setCategorieId} />
          <ProductList categoryId={categorieId} />
        </div>
      </div>
    </>
  )
}

export default Home