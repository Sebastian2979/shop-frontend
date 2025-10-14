import { React, useState, useEffect } from 'react'
import api from '../api/api'
import {Link, useNavigate} from 'react-router-dom'

const CategoryTabs = ({onChange}) => {

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const ac = new AbortController();

        (async () => {
            try {
                const res = await api.get("/category", { signal: ac.signal })
                const payload = Array.isArray(res.data)
                    ? res.data
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


    return (
        <div className="overflow-x-auto overflow-y-hidden whitespace-nowrap [--tw-scroll:touch] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] flex space-x-2 mb-4">
            <button onClick={() => navigate(0)} className="bg-gray-900 text-teal-300 p-4 rounded hover:cursor-pointer">Alle</button>
            {categories.map((c) => (
                <button key={c.id} onClick={() => onChange(c.id)} className="bg-gray-900 text-teal-300 p-4 rounded hover:cursor-pointer">{c.name}</button>
            ))}
        </div>
    )
}

export default CategoryTabs