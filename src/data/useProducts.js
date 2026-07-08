import { useState, useEffect } from 'react';
import { subscribeProducts } from './store';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { products, loading };
}