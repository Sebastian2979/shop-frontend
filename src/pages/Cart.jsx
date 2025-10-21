import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart, removeItem, addItem } from '../cartSlice';
import { SquareMinus, SquarePlus, Trash2 } from 'lucide-react';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const Cart = () => {

  const cartItems = useSelector((state) => state.cart.items)
  const dispatch = useDispatch();
  const { user } = useAuth()

  const checkoutHandler = async (e) => {
    e.preventDefault();
    try {
      // Backend liest Cart (user/guest) selbst und baut die Session
      const { data } = await api.post('/checkout'); // { id, url }

      if (!data?.url) throw new Error('Keine Checkout-URL erhalten');
      // Weiterleitung zur Stripe-Checkout-Seite
      window.location.assign(data.url); // oder: window.location.href = data.url
    } catch (error) {
      console.error('Fehler beim Checkout:', error);
      alert('Fehler beim Checkout. Bitte versuche es erneut.');
    }
  };

  const clearCartHandler = async (e) => {
    e.preventDefault();
    try {
      const cartToken = localStorage.getItem('cart_token');
      await api.post('/cart/clear', { payload: cartToken }); // Backend-Seite den Warenkorb leeren lassen
      dispatch(clearCart());
    } catch (error) {
      console.error('Fehler beim Leeren des Warenkorbs:', error);
      alert('Fehler beim Leeren des Warenkorbs. Bitte versuche es erneut.');
    }
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-100 text-gray-800">
      <h1 className="text-3xl font-bold underline mb-4">Warenkorb</h1>

      {cartItems.length === 0 ? (
        <p>Dein Warenkorb ist leer</p>
      ) : (
        <>
          <table className="table-auto md:table-fixed">
            <thead>
              <tr>
                <th className="p-2">Produkt</th>
                <th className="p-2">Preis</th>
                <th className="p-2">Menge</th>
                <th className="p-2">Total</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            {cartItems.map((item) => (
              <tbody key={item.id}>
                <tr>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{(item.price).toFixed(2)}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">{(item.quantity * item.price).toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    <div className='flex gap-1'>
                      <button onClick={() => dispatch(addItem(item))}><SquarePlus /></button>
                      <button onClick={() => dispatch(removeItem(item.id))}><SquareMinus /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
          <div className="flex gap-2">
            <button className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 cursor-pointer" onClick={clearCartHandler}><Trash2 /></button>
            {user ?
            <form onSubmit={checkoutHandler}>
              <button className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 cursor-pointer">zur Kasse</button>
            </form> : <Link to="/login" className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer">Login</Link>}
          </div>
        </>
      )}
    </div>
  )
}

export default Cart