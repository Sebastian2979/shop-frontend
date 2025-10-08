import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import api from "@/api/api";
import { replaceCart } from "@/cartSlice";

const StripeSuccessPage = () => {

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");
  const dispatch = useDispatch();

  useEffect(() => {
    const session_id = new URLSearchParams(location.search).get("session_id");
    (async () => {
      try {
        const { data } = await api.post("/checkout/success", { session_id });
        // lokal leeren
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch(replaceCart([]));
        setOrder(data);
        setStatus("ok");
      } catch (e) {
        setStatus("error");
        console.error(e);
      }
    })();
  }, [dispatch]);

  if (status !== "ok") return <p>{status === "loading" ? "Verarbeite Zahlung..." : "Bestellung nicht gefunden."}</p>;

  return (
    <div className="min-h-screen bg-gray-800 text-teal-300 flex flex-col items-center justify-center">
      <div className="max-w-xl mx-auto p-6">
        {status === "ok" && order (<p>Test</p>)}
        <h1 className="text-2xl font-bold mb-2">Danke für deine Bestellung!</h1>
        <p className="mb-4">Bestellnummer: #{order.id}</p>
        <ul className="space-y-2">
          {order.items?.map(it => (
            <li key={it.id} className="flex justify-between">
              <span>{it.name} × {it.quantity}</span>
              <span>{(it.unit_price_cents / 100).toFixed(2)} €</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 font-semibold">Summe: {(order.total_cents / 100).toFixed(2)} €</div>

      </div>
    </div>
  );
}

export default StripeSuccessPage