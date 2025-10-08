import React from 'react'
import { Link } from 'react-router-dom'
import { addItem } from '../cartSlice';
import { useDispatch } from 'react-redux';
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
                    <small>{props.product.description}</small>
                    <div className='text-xl mt-2 mb-4'>{props.product.price} €</div>
                </CardContent>
                <CardFooter>
                    <button className="bg-teal-500 text-white py-2 px-4 w-full cursor-pointer rounded hover:bg-teal-600" onClick={() => dispatch(addItem(props.product))}>zum Warenkorb</button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ProductCard