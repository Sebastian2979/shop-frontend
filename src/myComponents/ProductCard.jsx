import React from 'react'
import { Link } from 'react-router-dom'
import { addItem, removeItem } from '../cartSlice';
import { useDispatch } from 'react-redux';
import { SquarePlus, SquareMinus, Heart } from 'lucide-react';

const ProductCard = (props) => {

    const dispatch = useDispatch();

    return (
        <div className="flex flex-col bg-zinc-200 p-4 text-center rounded-xl">
            <div className="flex w-full justify-between mb-4">
                <button className="text-gray-500 hover:text-gray-600" onClick={() => console.log('Funktion folgt...')}><Heart size={32} /></button>
                <button className="text-orange-600 hover:text-orange-700" onClick={() => dispatch(addItem(props.product))}><SquarePlus size={40} /></button>
                {/* <button className="text-gray-800 hover:text-gray-900" onClick={() => dispatch(removeItem(props.product.id))}><SquareMinus size={40}/></button> */}
            </div>
            <div className="flex justify-center items-center mb-4">
                <Link to={`/products/${props.product.id}`} className="">
                    <img src={`${import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')}/storage/${props.product.image}`} alt={props.product.name} className="w-48" />
                </Link>
            </div>
            <div className="flex justify-center items-center text-2xl font-bold mb-2">
                {props.product.name}
            </div>
            <div className="flex justify-center items-center text-2xl font-bold mb-8">
                {props.product.price.toFixed(2)} €
            </div>
            <div className="flex justify-center items-center font-bold">
                <Link to={`/products/${props.product.id}`} className="bg-orange-600 text-gray-100 px-12 py-2 rounded">
                    zum Produkt
                </Link>
            </div>
        </div>
    )
}

export default ProductCard