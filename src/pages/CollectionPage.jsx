import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../data/useProducts';

/* ── Hero banner لكل collection ── */
const CONFIGS = {
  bestsellers: {
    eyebrow: '🔥 الأكثر مبيعاً',
    title: 'Best',
    titleGold: 'Sellers',
    desc: 'المنتجات الأكثر طلباً والأعلى تقييماً من عملائنا',
    filter: p => p.isBestseller,
    icon: <TrendingUp size={28} />,
    accent: '#e94848',
    bg: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=85',
  },
  'new-arrivals': {
    eyebrow: '✨ وصل حديثاً',
    title: 'New',
    titleGold: 'Arrivals',
    desc: 'أحدث الإضافات لمجموعاتنا — كن أول من يقتني',
    filter: p => p.isNew,
    icon: <Sparkles size={28} />,
    accent: 'var(--gold)',
    bg: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=85',
  },
};

export default function CollectionPage({ type }) {
  const config = CONFIGS[type];
  const { products, loading } = useProducts();
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = products.filter(config.filter);
  const visible  = filtered.slice(0, visibleCount);
  const hasMore  = visibleCount < filtered.length;

  /* ── Stats ── */
  const avgRating = filtered.length
    ? (filtered.reduce((s, p) => s + p.rating, 0) / filtered.length).toFixed(1)
    : 0;

  return (
    <div className="collection-page">

      {/* ── Hero Banner ── */}
      <div className="col-hero" style={{ '--col-bg': `url('${config.bg}')` }}>
        <div className="col-hero-overlay" />
        <div className="col-hero-content">
          <span className="col-hero-eyebrow">{config.eyebrow}</span>
          <h1 className="col-hero-title">
            {config.title} <span className="gold-text">{config.titleGold}</span>
          </h1>
          <p className="col-hero-desc">{config.desc}</p>

          {/* Stats row */}
          <div className="col-stats">
            <div className="col-stat">
              <span className="col-stat-num">{filtered.length}</span>
              <span className="col-stat-label">منتج</span>
            </div>
            <div className="col-stat-divider" />
            <div className="col-stat">
              <span className="col-stat-num">{avgRating}</span>
              <span className="col-stat-label">متوسط التقييم</span>
            </div>
            <div className="col-stat-divider" />
            <div className="col-stat">
              <span className="col-stat-num">{filtered.filter(p => p.badge === 'hot').length}</span>
              <span className="col-stat-label">🔥 الأكثر مبيعاً</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="col-body">

        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginBottom: 32 }}>
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{config.title} {config.titleGold}</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>جار التحميل...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h2>لا توجد منتجات حالياً</h2>
            <p>سيتم إضافة منتجات قريباً</p>
            <Link to="/" className="btn-primary">العودة للرئيسية</Link>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {visible.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {hasMore && (
              <div className="load-more-wrap">
                <button className="load-more-btn" onClick={() => setVisibleCount(c => c + 12)}>
                  عرض المزيد ({filtered.length - visibleCount} منتج متبقي)
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}