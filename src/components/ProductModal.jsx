import { useEffect } from 'react';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { WHATSAPP_NUMBER } from '../data/catalog';

function Stars({ rating }) {
  return (
    <div className="stars modal-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star${i <= Math.round(rating) ? ' filled' : ''}`}>★</span>
      ))}
      <span className="modal-rating-num">({rating})</span>
    </div>
  );
}

export default function ProductModal() {
  const { modal, setModal, toggleFav, isFav, addToCart } = useStore();
  const { showToast } = useToast();

  useEffect(() => {
    if (modal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setModal(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setModal]);

  if (!modal) return null;

  const fav = isFav(modal.id);

  const handleFav = () => {
    toggleFav(modal.id);
    showToast(
      fav ? 'حُذف من المفضلة' : `أُضيف للمفضلة: <strong>${modal.name}</strong>`,
      fav ? '🤍' : '❤️'
    );
  };

  const handleCart = () => {
    addToCart(modal);
    showToast(`أُضيف للسلة: <strong>${modal.name}</strong>`, '🛍️');
  };

  const handleBuy = () => {
    const msg =
      `مرحباً! 👋\n\nأود الاستفسار عن:\n\n` +
      `🏷️ *الاسم:* ${modal.name}\n` +
      `🔖 *الكود:* ${modal.code}\n` +
      `💰 *السعر:* EGP ${modal.price}\n\nهل هو متاح؟ 😊`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="modal-overlay open" onClick={() => setModal(null)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setModal(null)}>
          <X size={16} />
        </button>
        <div className="modal-body">
          {/* Image */}
          <div className="modal-img-side">
            <img src={modal.image} alt={modal.name} />
            {modal.badge && (
              <span className={`pc-badge badge-${modal.badge}`}>
                {modal.badge === 'new' ? 'NEW' : 'HOT'}
              </span>
            )}
          </div>
          {/* Info */}
          <div className="modal-info-side">
            <p className="modal-code">{modal.code}</p>
            <h2 className="modal-name">{modal.name}</h2>
            <Stars rating={modal.rating} />
            <p className="modal-desc">{modal.description}</p>
            <div className="modal-price-row">
              <span className="modal-price">{modal.price}</span>
              <span className="modal-currency">EGP</span>
            </div>
            <div className="modal-actions">
              <button className="btn-primary modal-buy-btn" onClick={handleBuy}>
                اشتري عبر واتساب
              </button>
              <button className={`modal-fav-btn${fav ? ' active' : ''}`} onClick={handleFav}>
                <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
                {fav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              </button>
              <button className="modal-cart-btn" onClick={handleCart}>
                <ShoppingBag size={16} /> أضف للسلة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
