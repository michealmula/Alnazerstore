import { useState, useEffect } from 'react';
import { subscribeProducts } from './store';

export function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeProducts(setProducts);
    return unsubscribe;
  }, []);

  return products;
}