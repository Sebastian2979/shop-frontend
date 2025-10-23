import React, { useEffect, useState } from 'react'
import api from '@/api/api'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { MoveLeft } from 'lucide-react';

const Products = () => {

    const [products, setProducts] = useState([])

    const formatPrice = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n.toFixed(2) : '0.00';
    };

    useEffect(() => {
        // Produktliste vom Backend laden
        api.get(`/products`, {
        })
            .then((res) => setProducts(res.data.data || res.data))
            .catch((err) => console.error('Fehler beim Laden der Produkte:', err))
    }, [])

    const handleDelete = (productId) => {
        const warn = confirm('Produkt wirklich löschen?')
        if (warn) {
            // Produkt löschen
            api.delete(`/products/${productId}`)  // nur der Pfad reicht
                .then(() => {
                    // funktionales Update vermeidet Stale-Closure
                    setProducts(prev => prev.filter(p => p.id !== productId));
                })
                .catch(err => {
                    console.error('Fehler beim Löschen des Produkts:', err);
                });
        }
    };


    return (
        <div className="bg-zinc-100 pt-32 px-4">
            <div className="sm:w-2xl mx-auto mb-4">
                <Link to="/admin" className="flex gap-2 text-xs hover:underline mb-2"><MoveLeft size={16} /><p>zurück zum Dashboard</p></Link>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Produktverwaltung</h1>
                </div>
                <ul className="space-y-2 sm:mt-0 mt-16">
                    {products.length === 0 && (
                        <p className="text-gray-600">Keine Produkte gefunden.</p>
                    )}
                    {products.map((product) => (
                        <li key={product.id} className="sm:flex items-center justify-between bg-zinc-200 p-4">
                            <div className="sm:flex sm:items-center sm:gap-4">
                                <img src={`${import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')}/storage/${product.image}`} alt={product.name} className="sm:w-32 sm:h-32 object-cover sm:mb-0 mb-4" />
                                <div className="flex flex-col gap-2 text-gray-800">
                                    <h2 className="font-semibold">{product.name}</h2>
                                    {/* <p className="max-w-lg">{product.description}</p> */}
                                    <p className="font-semibold">Preis: {formatPrice(product.price)} EUR</p>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <Link to={`/admin/products/${product.id}`} className="mt-2">
                                    <Button className="w-full mt-2 bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-4 py-2 rounded">Bearbeiten</Button>
                                </Link>
                                <Button onClick={() => handleDelete(product.id)} className="mt-2 bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded">Löschen</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Products