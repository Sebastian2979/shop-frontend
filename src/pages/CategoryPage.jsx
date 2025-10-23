import { React, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/api';
import CategoryList from '@/myComponents/CategoryList';
import { MoveLeft } from 'lucide-react';

const CategoryPage = () => {

  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const categoryInputRef = useRef(null)

  const createCategoryHandler = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post('/category', {name:category})
      console.log('Kategorie erfolgreich angelegt:', res.data)
      setCategory('')
      categoryInputRef.current?.focus();
      setRefreshKey(k => k + 1)
    } catch (err) {
      console.error('Fehler beim Anlegen der Kategorie:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 text-gray-800 justify-center items-center p-4">
      <div className="w-2xl mx-auto space-y-2">
        <Link to="/admin" className="flex gap-2 text-xs hover:underline mb-2"><MoveLeft size={16} /><p>zurück zum Dashboard</p></Link>
        <p className="text-3xl">Kategorien</p>
        <form onSubmit={createCategoryHandler} className="space-y-2">
          <div>
            <input
              ref={categoryInputRef}
              type="text"
              placeholder="Neue Kategorie"
              className="w-full p-2 border rounded text-gray-800"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-60"
          >
            {submitting ? "Sende…" : "Absenden"}
          </button>
        </form>
        {/* CategoryList bekommt einen refreshKey von der Parent Komponente CategoryPage, wenn neue Kategorie erfolgreich angelegt, dann wird der Wert von refreshKey verändert und damit ausgelöst */}
        <CategoryList refreshKey={refreshKey} />
      </div>
    </div>
  )
}

export default CategoryPage