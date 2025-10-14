import { React, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '@/api/api';
import CategoryList from '@/myComponents/CategoryList';

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
    <div className="flex min-h-screen bg-gray-800 text-teal-300 justify-center items-center p-4">
      <div className="w-2xl mx-auto space-y-2">
        <Link to="/admin" className="hover:underline text-xs">zurück zum Admin Dashboard</Link>
        <p className="text-3xl">Kategorien</p>
        <form onSubmit={createCategoryHandler} className="space-y-2">
          <div>
            <input
              ref={categoryInputRef}
              type="text"
              placeholder="Neue Kategorie"
              className="w-full p-2 border rounded text-teal-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 disabled:opacity-60"
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