import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { useProducts } from '../data/useProducts';

export default function Favorites() {
  const { favorites } = useStore();
  const allProducts = useProducts();
  const favProducts = allProducts.filter(p => favorites.includes(p.id));
  

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <Heart size={28} className="gold-text" />
        <h1>المفضلة</h1>
        <p>{favProducts.length} منتج</p>
      </div>

      {favProducts.length === 0 ? (
        <div className="empty-state">
          <Heart size={60} strokeWidth={1} />
          <h2>المفضلة فاضية</h2>
          <p>أضف منتجات للمفضلة للوصول إليها بسهولة</p>
          <Link to="/" className="btn-primary">تسوق الآن</Link>
        </div>
      ) : (
        <div className="products-grid">
          {favProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
