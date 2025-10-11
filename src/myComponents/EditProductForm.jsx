import api from '@/api/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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

  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const priceRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    api.get(`/products/${id}`)
      .then((res) => {
        if (cancelled) return
        const product = res.data.data || res.data
        if (nameRef.current) nameRef.current.value = product.name || ''
        if (descriptionRef.current) descriptionRef.current.value = product.description || ''
        if (priceRef.current) priceRef.current.value = product.price ?? ''
        // bestehendes Bild nur als URL anzeigen
        const url = product.image_url || buildImageUrl(product.image_path || product.image)
        setImage(url || null)
      })
      .catch(() => setError('Produkt konnte nicht geladen werden.'))
      .finally(() => setLoading(false))
    return () => { cancelled = true }
  }, [id])

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
    const priceVal = priceRef.current?.value;

    if (name) fd.append("name", name);
    if (desc) fd.append("description", desc);
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
    <div className=" flex justify-center items-center min-h-screen bg-gray-800 text-teal-300">
      <div className="flex flex-col gap-4 p-6 m-4 sm:w-[800px] mx-auto bg-gray-800 justify-center mt-8 rounded-lg">
        <h2 className="text-3xl">Produkt bearbeiten</h2>

        <form
          ref={formRef}
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          {image && <img src={image} alt="Produktbild" className="h-auto max-h-60 object-cover rounded" />}

          <Label htmlFor="image">Neues Produktbild (optional)</Label>
          <Input id="image" type="file" accept="image/*" onChange={handleNewImage} />

          <Label htmlFor="name">Produktname</Label>
          <Input ref={nameRef} id="name" type="text" placeholder="Produktname" />

          <Label htmlFor="description">Produktbeschreibung</Label>
          <Textarea ref={descriptionRef} id="description" placeholder="Produktbeschreibung" className="h-32" />

          <Label htmlFor="price">Preis/€</Label>
          <Input ref={priceRef} type="number" id="price" placeholder="Preis" step="0.01" min="0" />

          <Button className="bg-teal-500 text-white hover:bg-teal-600 cursor-pointer mt-2">Produkt speichern</Button>
        </form>
      </div>
    </div>
  )
}

export default EditProductForm
