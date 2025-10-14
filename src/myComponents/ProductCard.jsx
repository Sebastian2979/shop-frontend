import React from 'react'
import { Link } from 'react-router-dom'
import { addItem, removeItem } from '../cartSlice';
import { useDispatch } from 'react-redux';
import { SquarePlus, SquareMinus } from 'lucide-react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const ProductCard = (props) => {

    const dispatch = useDispatch();

    return (
        <div>
            <Card>
                <CardHeader>
                    <Link to={`/products/${props.product.id}`} className="w-full h-full z-10">
                        <img src={`${import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')}/storage/${props.product.image}`} alt={props.product.name} className="w-full h-[300px] rounded-t-xl" />
                    </Link>
                </CardHeader>
                <CardContent>
                    <CardTitle>{props.product.name}</CardTitle>
                    <p className="text-xs">{props.product.category?.name ?? 'DEBUG'}</p>
                    {/* <p>{props.product.description}</p> */}
                    <div className='text-xl mt-2 mb-4'>{props.product.price} €</div>
                </CardContent>
                <CardFooter>
                    <div className="flex w-full justify-end">
                        {/* <button className="bg-teal-500 text-white py-2 px-4 cursor-pointer rounded hover:bg-teal-600" onClick={() => dispatch(addItem(props.product))}>zum Warenkorb</button> */}
                        <button className="text-gray-800 hover:text-gray-900" onClick={() => dispatch(addItem(props.product))}><SquarePlus size={40}/></button>
                        {/* <button className="text-gray-800 hover:text-gray-900" onClick={() => dispatch(removeItem(props.product.id))}><SquareMinus size={40}/></button> */}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ProductCard