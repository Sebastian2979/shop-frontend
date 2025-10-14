import { React, useEffect, useState } from 'react'
import api from "../api/api"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const CategorySelect = ({ value, onChange }) => {

    const [categories, setCategories] = useState([])

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
        <Select value={value?.toString() ?? ""} onValueChange={(v) => onChange?.(Number(v))}>
            <SelectTrigger>
                <SelectValue placeholder="Wähle eien Kategorie" />
            </SelectTrigger>
            <SelectContent>
                {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default CategorySelect