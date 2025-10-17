import { useEffect, useState } from 'react';
import api from '../api/api';
import ProductCard from './ProductCard';

function ProductList(props) {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const categorieId = props.categoryId

  useEffect(() => {

    api.get('/products')
      .then((response) => {
        // Wenn paginiert: response.data.data, sonst: response.data
        const data = response.data.data ?? response.data;
        setProducts(data);
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen der Produkte:', error);
        setError('Fehler beim Laden der Produkte.');
      });
  }, []);

  useEffect(() => {
    if(categorieId){
      api.get(`/products/category/${categorieId}`)
      .then((response) => {
        // Wenn paginiert: response.data.data, sonst: response.data
        const data = response.data.data ?? response.data;
        setProducts(data);
      })
    }
  },[categorieId])

  if (error) {
    return <div>{error}</div>;
  }

  if (products.length === 0) {
    return <div className="min-h-screen bg-zinc-100 text-gray-800">Keine Produkte vorhanden</div>;
  }

  return (
    <div>
      <h2 className='text-3xl mb-4 text-gray-800'>Produkte</h2>
      <ul className='sm:grid sm:grid-cols-4 sm:gap-4 sm:max-w-6xl'>
        {products.map((product) => (
          <li key={product.id} className="mb-2">
            <ProductCard product={product}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
