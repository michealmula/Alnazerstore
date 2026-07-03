import { useState, useEffect, useCallback } from 'react';
import { getProducts } from './store';

export function useProducts() {
  const [products, setProducts] = useState(() => getProducts());

  const refresh = useCallback(() => setProducts(getProducts()), []);

  useEffect(() => {
    window.addEventListener('alnazer-products-updated', refresh);
    return () => window.removeEventListener('alnazer-products-updated', refresh);
  }, [refresh]);

  return products;
}