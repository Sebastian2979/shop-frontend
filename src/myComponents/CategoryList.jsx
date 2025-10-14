import { useEffect, useState } from "react"
import api from "../api/api"
import {Trash2} from 'lucide-react'

export default function CategoryList({ refreshKey }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await api.get("/category", { signal: ac.signal });
        const payload = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        setCategories(payload);
      } catch (e) {
        if (e.name === "CanceledError") return;
        console.error("Fehler beim Abrufen der Kategorien:", e);
        setError("Fehler beim Laden der Kategorien.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [refreshKey]);


  const deleteCategoryHandler = async (id) => {
    const warn = confirm('Kategorie wirklich löschen?')
    if (warn) {
      try {
        await api.delete(`/category/${id}`)
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (e) {
        console.log('Fehler beim Löschen der Kategorie', e)
      } finally {
        console.log('Alles hat reibungslos funktioniert')
      }
    }
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800 text-teal-300">
        Lade Kategorien...
      </div>
    );
  }
  if (error) return <div className="text-red-400">{error}</div>;
  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800 text-teal-300">
        Keine Kategorien vorhanden.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-teal-300 space-y-2">
      {categories.map((c) => (
        <div key={c.id} className="flex justify-between border border-teal-700/40 rounded-xl p-3">
          <p className="font-medium text-sm">{c.name}</p>
          <button onClick={() => deleteCategoryHandler(c.id)} className="text-red-600 cursor-pointer" title="Löschen"><Trash2 /></button>
        </div>
      ))}
    </div>
  );
}
