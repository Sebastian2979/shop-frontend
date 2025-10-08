import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from '@/api/api'
import ProductCard from "@/myComponents/ProductCard"

const ProductPage = () => {

  const [product, setProduct] = useState([])
  const { id } = useParams()

  useEffect(() => {
    api.get(`/products/${id}`, {
    })
      .then((res) => setProduct(res.data.data || res.data))
      .catch((err) => console.error('Fehler beim Laden des Produktes:', err))
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-teal-300 p-6 sm:p-0">
      <div className="sm:grid sm:grid-cols-2 max-w-6xl mt-18 sm:mt-0 bg-gray-800 rounded">
        <div>
          <img src={`${import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')}/${product.image}`} alt={product.name} className="object-cover rounded" />
        </div>
        <div className="flex flex-col space-y-6 p-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-lg">{product.description}</p>
          <p className="text-3xl font-semibold">{product.price} €</p>
          <button className="bg-teal-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-teal-600 transition duration-300" onClick={() => alert('in den Warenkorb')}>In den Warenkorb</button>
        </div>
      </div>
    </div>
  )
}

export default ProductPage