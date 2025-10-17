import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from '@/api/api'
import { SquarePlus, SquareMinus, Heart } from 'lucide-react';
import { addItem, removeItem } from '../../cartSlice';
import { useDispatch } from 'react-redux';

const ProductPage = () => {

  const [product, setProduct] = useState([])
  const { id } = useParams()
  const dispatch = useDispatch();

  const formatPrice = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n.toFixed(2) : '0.00';
    };

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data.data || res.data))
      .catch((err) => console.error('Fehler beim Laden des Produktes:', err))
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-100 text-gray-800 pt-32 p-4 sm:p-0">
      <div className="w-5xl bg-zinc-200 text-center p-4">
        <div className="flex justify-between">
          <button className="text-gray-500 hover:text-gray-600" onClick={() => console.log('Funktion folgt...')}><Heart size={40} /></button>
          <div>{console.log(product)}</div>
          <button className="text-orange-600 hover:text-orange-700" onClick={() => dispatch(addItem(product))}><SquarePlus size={48} /></button>
        </div>
        <div className="flex justify-center items-center">
          <img src={`${import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')}/storage/${product.image}`} alt={product.name} className="object-cover w-64 h-64" />
        </div>
        <div className="flex flex-col space-y-6 p-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-lg">{product.description}</p>
          <p className="text-3xl font-semibold">{formatPrice(product.price)} €</p>
          {/* <button className="bg-teal-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-teal-600 transition duration-300" onClick={() => alert('in den Warenkorb')}>In den Warenkorb</button> */}
        </div>
      </div>
    </div>
  )
}

export default ProductPage