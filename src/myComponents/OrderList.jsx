import { useEffect, useState, Fragment } from "react";
import api from "../api/api";

const formatMoney = (cents) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })
    .format((Number(cents ?? 0)) / 100);

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState({});      // { [orderId]: true|false }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Backend sollte Orders inkl. items liefern: Order::with('items')->get()
        const { data } = await api.get("/orders");
        // falls dein Backend {orders: [...] } zurückgibt:
        const list = Array.isArray(data) ? data : (data?.orders ?? []);
        setOrders(list);
      } catch (e) {
        console.error("Fehler beim Abrufen der Bestellungen:", e);
        setError("Fehler beim Laden der Bestellungen.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800 text-teal-300">
        Lade Bestellungen...
      </div>
    );
  }
  if (error) return <div className="text-red-400">{error}</div>;
  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800 text-teal-300">
        Keine Bestellungen vorhanden.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-teal-300">
      <h2 className="text-3xl mb-4">Bestellungen</h2>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-gray-800">
          <thead className="bg-gray-700 text-left">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Datum</th>
              <th className="px-4 py-2">E-Mail</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Artikel</th>
              <th className="px-4 py-2">Summe</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{formatDateTime(order.created_at)}</td>
                  <td className="px-4 py-2">{order.email ?? "—"}</td>
                  <td className="px-4 py-2 capitalize">{order.status ?? "—"}</td>
                  <td className="px-4 py-2">
                    {order.items?.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0) ?? 0}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {formatMoney(order.total_cents)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => toggle(order.id)}
                      aria-expanded={!!open[order.id]}
                      className="text-sm bg-teal-600 hover:bg-teal-500 text-white px-3 py-1 rounded"
                    >
                      {open[order.id] ? "Details ausblenden" : "Details"}
                    </button>
                  </td>
                </tr>

                {open[order.id] && (
                  <tr className="bg-gray-900">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="text-teal-400">
                            <tr>
                              <th className="px-3 py-2 text-left">Produkt</th>
                              <th className="px-3 py-2 text-left">Menge</th>
                              <th className="px-3 py-2 text-left">Einzelpreis</th>
                              <th className="px-3 py-2 text-left">Zwischensumme</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items?.map((item) => (
                              <tr
                                key={item.id ?? `${order.id}-${item.product_id}`}
                                className="border-t border-gray-700"
                              >
                                <td className="px-3 py-2">
                                  {item.name ?? item.product?.name ?? "—"}
                                </td>
                                <td className="px-3 py-2">{item.quantity}</td>
                                <td className="px-3 py-2">
                                  {formatMoney(item.unit_price_cents)}
                                </td>
                                <td className="px-3 py-2">
                                  {formatMoney((item.unit_price_cents ?? 0) * (item.quantity ?? 0))}
                                </td>
                              </tr>
                            ))}
                            {(!order.items || order.items.length === 0) && (
                              <tr>
                                <td className="px-3 py-2" colSpan={4}>Keine Artikel</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
