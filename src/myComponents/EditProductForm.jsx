import api from '@/api/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CategorySelect from './CategorySelect'
import { MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom'

const hostFromEnv = () =>
  import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')

const buildImageUrl = (p) => {
  if (!p) return null
  if (/^https?:\/\//i.test(p)) return p
  const host = hostFromEnv()
  const path = p.replace(/^\/+/, '')
  return path.startsWith('storage/')
    ? `${host}/${path}`
    : `${host}/storage/${path}`
}

const EditProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [image, setImage] = useState(null)
  const [newImage, setNewImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryId, setCategoryId] = useState(null);

  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const priceRef = useRef(null)
  const formRef = useRef(null)


  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        console.log(res.data);
        const product = res.data.data || res.data
        // bestehendes Bild nur als URL anzeigen
        const url = product.image_url || buildImageUrl(product.image_path || product.image)
        setImage(url || null)
        if (nameRef.current) nameRef.current.value = product.name || ''
        if (descriptionRef.current) descriptionRef.current.value = product.description || ''
        setCategoryId(product.category.id)
        if (priceRef.current) priceRef.current.value = product.price ?? ''
      } catch (e) {
        console.error("Fehler beim Abrufen des Produktes:", e);
        setError("Fehler beim Laden des Produktes.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // useEffect(() => {
  //   let cancelled = false
  //   api.get(`/products/${id}`)
  //     .then((res) => {
  //       if (cancelled) return
  //       const product = res.data.data || res.data
  //       setCategoryId(product.category.id)
  //       console.log(categoryId)
  //       if (nameRef.current) nameRef.current.value = product.name || ''
  //       if (descriptionRef.current) descriptionRef.current.value = product.description || ''
  //       if (priceRef.current) priceRef.current.value = product.price ?? ''
  //       // bestehendes Bild nur als URL anzeigen
  //       const url = product.image_url || buildImageUrl(product.image_path || product.image)
  //       setImage(url || null)
  //     })
  //     .catch(() => setError('Produkt konnte nicht geladen werden.'))
  //     .finally(() => setLoading(false))
  //   return () => { cancelled = true }
  // }, [id])

  // ObjectURL sauber aufräumen
  useEffect(() => {
    return () => {
      if (image && image.startsWith('blob:')) URL.revokeObjectURL(image)
    }
  }, [image])

  const handleNewImage = (event) => {
    const file = event.target.files && event.target.files[0]
    if (!file) return
    // alte Blob-URL freigeben
    if (image && image.startsWith('blob:')) URL.revokeObjectURL(image)
    setNewImage(file) // Datei fürs Backend
    setImage(URL.createObjectURL(file)) // Vorschau aktualisieren
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError(null);

    const fd = new FormData();

    const name = nameRef.current?.value?.trim();
    const desc = descriptionRef.current?.value?.trim();
    const catId = categoryId;
    const priceVal = priceRef.current?.value;

    if (name) fd.append("name", name);
    if (desc) fd.append("description", desc);
    if (catId) fd.append("category_id", catId);
    if (priceVal !== "" && priceVal != null) fd.append("price", String(priceVal));
    if (newImage) fd.append("image", newImage);

    // WICHTIG: POST + Method Spoofing
    fd.append("_method", "PATCH");

    try {
      await api.post(`/products/${id}`, fd);
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setError("Speichern fehlgeschlagen.");
    }
  };

  if (loading) return <p>Lade…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="flex bg-zinc-100 text-gray-800">
      <div className="flex flex-col w-2xl mx-auto my-35 p-4 sm:p-0">
        <Link to="/admin" className="flex gap-2 text-xs hover:underline mb-2"><MoveLeft size={16} /><p>zurück zum Dashboard</p></Link>
        <h2 className="text-3xl mb-8">Produkt bearbeiten</h2>

        <form
          ref={formRef}
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-4 justify-center items-center"
          encType="multipart/form-data"
        >
          {image && <img src={image} alt="Produktbild" className="w-80 h-80 object-cover rounded" />}

          <Label htmlFor="image">Neues Produktbild (optional)</Label>
          <Input id="image" type="file" accept="image/*" onChange={handleNewImage} />

          <Label htmlFor="name">Produktname</Label>
          <Input ref={nameRef} id="name" type="text" placeholder="Produktname" />

          <Label htmlFor="description">Produktbeschreibung</Label>
          <Textarea ref={descriptionRef} id="description" placeholder="Produktbeschreibung" className="h-32" />

          <Label htmlFor="category">Kategorie</Label>
          <CategorySelect value={categoryId} onChange={setCategoryId} />

          <Label htmlFor="price">Preis/€</Label>
          <Input ref={priceRef} type="number" id="price" placeholder="Preis" step="0.01" min="0" />

          <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 cursor-pointer mt-2">Produkt speichern</Button>
        </form>
      </div>
    </div>
  )
}

export default EditProductForm
