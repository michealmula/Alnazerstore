import { createContext, useContext, useState, useCallback } from 'react';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alnazer_fav') || '[]'); }
    catch { return []; }
  });

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alnazer_cart') || '[]'); }
    catch { return []; }
  });

  const [modal, setModal] = useState(null); // product object or null

  const saveFav = (list) => {
    setFavorites(list);
    localStorage.setItem('alnazer_fav', JSON.stringify(list));
  };

  const saveCart = (list) => {
    setCart(list);
    localStorage.setItem('alnazer_cart', JSON.stringify(list));
  };

  const toggleFav = useCallback((productId) => {
    setFavorites(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('alnazer_fav', JSON.stringify(next));
      return next;
    });
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      const next = exists
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
      localStorage.setItem('alnazer_cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => {
      const next = prev.filter(i => i.id !== productId);
      localStorage.setItem('alnazer_cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isFav = (id) => favorites.includes(id);

  return (
    <StoreContext.Provider value={{
      favorites, toggleFav, isFav,
      cart, addToCart, removeFromCart, cartCount,
      modal, setModal,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
