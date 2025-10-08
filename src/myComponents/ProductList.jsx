import { useEffect, useState } from 'react';
import api from '../api/api';
import ProductCard from './ProductCard';



function ProductList() {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

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

  if (error) {
    return <div>{error}</div>;
  }

  if (products.length === 0) {
    return <div className="min-h-screen bg-gray-800 text-teal-300">Lade Produkte...</div>;
  }

  return (
    <div>
      <h2 className='text-3xl mb-4 text-teal-300'>Produkte</h2>
      <ul className='sm:grid sm:grid-cols-3 sm:gap-4 sm:max-w-6xl'>
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
