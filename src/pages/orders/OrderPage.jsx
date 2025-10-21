import React from 'react'
import OrderList from '../../myComponents/OrderList'

const OrderPage = () => {
  return (
    <div className="min-h-screen bg-zinc-100 text-gray-800 flex flex-col items-center justify-center">
        <OrderList />
    </div>
  )
}

export default OrderPage