import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import api from "@/api/api";
import { replaceCart } from "@/cartSlice";

const StripeSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");
  const dispatch = useDispatch();
  const didRun = useRef(false); // verhindert Doppel-Request im StrictMode (Dev)

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      try {
        if (!sessionId) {
          setStatus("error");
          return;
        }

        const { data } = await api.post("/checkout/success", { session_id: sessionId });

        // Warenkorb lokal leeren
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch(replaceCart([]));

        setOrder(data);
        setStatus("ok");
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    })();
  }, [dispatch, sessionId]);

  const money = (cents) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })
      .format(Number(cents ?? 0) / 100);

  if (status !== "ok") {
    return (
      <div className="min-h-screen bg-gray-800 text-teal-300 flex items-center justify-center">
        <p>{status === "loading" ? "Verarbeite Zahlung..." : "Bestellung nicht gefunden."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-teal-300 flex flex-col items-center justify-center">
      <div className="max-w-xl mx-auto p-6">
        {/* nur als Beispielanzeige */}
        {order && <p>Test</p>}

        <h1 className="text-2xl font-bold mb-2">Danke für deine Bestellung!</h1>
        <p className="mb-4">Bestellnummer: #{order?.id ?? "—"}</p>

        <ul className="space-y-2">
          {order?.items?.map((it, idx) => (
            <li key={it?.id ?? it?.product_id ?? idx} className="flex justify-between">
              <span>{it?.name ?? "Artikel"} × {it?.quantity ?? 1}</span>
              <span>{money(it?.unit_price_cents)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 font-semibold">Summe: {money(order?.total_cents)}</div>
      </div>
    </div>
  );
};

export default StripeSuccessPage;
