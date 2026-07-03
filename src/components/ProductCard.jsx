  import { Heart, ShoppingBag, Eye } from 'lucide-react';
  import { useStore } from '../context/StoreContext';
  import { useToast } from '../context/ToastContext';
  import { WHATSAPP_NUMBER } from '../data/catalog';

  function Stars({ rating }) {
    return (
      <div className="stars">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={`star${i <= Math.round(rating) ? ' filled' : ''}`}>★</span>
        ))}
      </div>
    );
  }

  export default function ProductCard({ product, size = 'normal' }) {
    const { toggleFav, isFav, addToCart, setModal } = useStore();
    const { showToast } = useToast();
    const fav = isFav(product.id);

    const handleFav = (e) => {
      e.stopPropagation();
      toggleFav(product.id);
      showToast(
        fav ? 'حُذف من المفضلة' : `أُضيف للمفضلة: <strong>${product.name}</strong>`,
        fav ? '🤍' : '❤️'
      );
    };

    const handleCart = (e) => {
      e.stopPropagation();
      addToCart(product);
      showToast(`أُضيف للسلة: <strong>${product.name}</strong>`, '🛍️');
    };

    const handleBuy = (e) => {
      e.stopPropagation();
      const msg =
        `مرحباً! 👋\n\nأود الاستفسار عن:\n\n` +
        `🏷️ *الاسم:* ${product.name}\n` +
        `🔖 *الكود:* ${product.code}\n` +
        `💰 *السعر:* EGP ${product.price}\n\nهل هو متاح؟ 😊`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
      <div className={`product-card pc-${size}`} onClick={() => setModal(product)}>
        {/* Image — 4:5 ratio */}
        <div className="pc-img-wrap">
          {product.badge && (
            <span className={`pc-badge badge-${product.badge}`}>
              {product.badge === 'new' ? 'NEW' : 'HOT'}
            </span>
          )}
          <button className={`pc-fav${fav ? ' active' : ''}`} onClick={handleFav} aria-label="Favorite">
            <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
          </button>
          <img src={product.image} alt={product.name} loading="lazy" />
          {/* Hover overlay */}
          <div className="pc-overlay">
            <button className="pc-overlay-btn" onClick={e => { e.stopPropagation(); setModal(product); }}>
              <Eye size={15} /> عرض سريع
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="pc-body">
          <p className="pc-code">{product.code}</p>
          <h3 className="pc-name">{product.name}</h3>
          <Stars rating={product.rating} />
          <div className="pc-price-row">
            <span className="pc-price">{product.price} <small>EGP</small></span>
          </div>
          <div className="pc-actions">
            <button className="pc-btn-cart" onClick={handleCart}>
              <ShoppingBag size={13} /> سلة
            </button>
            <button className="pc-btn-buy" onClick={handleBuy}>
              اشتري
            </button>
          </div>
        </div>
      </div>
    );
  }
