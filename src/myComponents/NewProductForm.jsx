import api from '@/api/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CategorySelect from './CategorySelect'
import { MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom'

const NewProductForm = () => {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [categoryId, setCategoryId] = useState(null);

  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const priceRef = useRef(null)
  const formRef = useRef(null)

  const handleImagePreview = (event) => {
    const file = event.target.files && event.target.files[0]
    if (!file) {
      setImagePreview(null)
      setImageFile(null)
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    const fd = new FormData()
    fd.append('name', (nameRef.current && nameRef.current.value) || '')
    fd.append('description', (descriptionRef.current && descriptionRef.current.value) || '')
    fd.append('category', (categoryId) || '')
    fd.append('price', (priceRef.current && priceRef.current.value) || '')
    if (imageFile) fd.append('image', imageFile) // Feldname = "image"

    try {
      const res = await api.post('/products', fd)
      console.log('Produkt erfolgreich angelegt:', res.data)
      if (formRef.current) formRef.current.reset()
      setImagePreview(null)
      setImageFile(null)
      navigate('/admin/products')
    } catch (err) {
      console.error('Fehler beim Anlegen des Produkts:', err)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-100 text-gray-800">
      <div className="flex flex-col gap-4 p-6 m-4 sm:w-[800px] mx-auto justify-center mt-40 rounded-lg">
        <Link to="/admin" className="flex gap-2 text-xs hover:underline"><MoveLeft size={16} /><p>zurück zum Dashboard</p></Link>
        <h2 className="text-3xl">Neues Produkt anlegen</h2>
        <form
          ref={formRef}
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          {imagePreview &&
            <>
              <div>Vorschau</div>
              <img src={imagePreview} alt="Produktbild Vorschau" className="h-auto" />
            </>
          }

          <Label htmlFor="image">Produktbild</Label>
          <Input id="image" type="file" accept="image/*" onChange={handleImagePreview} />

          <Label htmlFor="name">Produktname</Label>
          <Input ref={nameRef} id="name" type="text" placeholder="Produktname" />

          <Label htmlFor="description">Produktbeschreibung</Label>
          <Textarea ref={descriptionRef} id="description" placeholder="Produktbeschreibung" className="h-32" />
          
          <Label htmlFor="category">Kategorie</Label>
          <CategorySelect value={categoryId} onChange={setCategoryId} />

          <Label htmlFor="price">Preis/€</Label>
          <Input ref={priceRef} type="number" id="price" placeholder="Preis" step="0.01" min="0" />

          <Button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white mt-2">Produkt speichern</Button>
        </form>
      </div>
    </div>
  )
}

export default NewProductForm