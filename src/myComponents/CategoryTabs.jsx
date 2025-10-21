import { React, useState, useEffect } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'

const CategoryTabs = ({ onChange, value }) => {

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                const res = await api.get("/category", { signal: ac.signal })
                const payload = Array.isArray(res.data) ? res.data
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : [];
                setCategories(payload)
            } catch (e) {
                if (e.name === "CanceledError") return
                console.error("Fehler beim Abrufen der Kategorien:", e)
            }
        })();

        return () => ac.abort()
    }, []);

    const isActive = (id) => {
        return String(value) === String(id);
    };

    const base = "px-4 py-2 rounded hover:cursor-pointer";
    const active = "bg-orange-600 text-white";
    const inactive = "bg-zinc-300 text-gray-800";


    return (
        <div className="overflow-x-auto overflow-y-hidden whitespace-nowrap [&::-webkit-scrollbar]:hidden [scrollbar-width:none] -webkit-overflow-scrolling-touch flex gap-2 mb-4">
            <button
                type="button"
                onClick={() => onChange(null)}
                aria-pressed={value == null}
                className={`${base} ${value == null ? active : inactive}`}
            >
                Alle
            </button>

            {categories.map((c) => (
                <button
                    key={c.id}
                    type="button"
                    onClick={() => onChange(c.id)}
                    aria-pressed={isActive(c.id)}
                    className={`${base} ${isActive(c.id) ? active : inactive}`}
                >
                    {c?.name ?? "Unbenannt"}
                </button>
            ))}
        </div>
    );
}

export default CategoryTabs