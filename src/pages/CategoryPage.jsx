import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CATALOG } from '../data/catalog';
import { useProducts } from '../data/useProducts';
const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'default',    label: 'الترتيب الافتراضي' },
  { value: 'price_asc',  label: 'السعر: من الأقل' },
  { value: 'price_desc', label: 'السعر: من الأعلى' },
  { value: 'rating',     label: 'الأعلى تقييماً' },
  { value: 'new',        label: 'الأحدث' },
];

export default function CategoryPage() {
  const { key } = useParams();
const cat          = CATALOG.find(c => c.key === key);
const { products: allProducts, loading } = useProducts();
const products = useMemo(() => allProducts.filter(p => p.category === key), [allProducts, key]);

  const [page,         setPage]         = useState(1);
  const [sort,         setSort]         = useState('default');
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [priceRange,   setPriceRange]   = useState([0, 2000]);
  const [badgeFilter,  setBadgeFilter]  = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOpen,     setSortOpen]     = useState(false);

  // reset page when filters change
  useEffect(() => setPage(1), [sort, priceRange, badgeFilter, ratingFilter, key]);

  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  const filtered = useMemo(() => {
    let arr = [...products];
    // price
    arr = arr.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    // badge
    if (badgeFilter.length > 0) arr = arr.filter(p => badgeFilter.includes(p.badge));
    // rating
    if (ratingFilter > 0) arr = arr.filter(p => p.rating >= ratingFilter);
    // sort
    if (sort === 'price_asc')  arr.sort((a,b) => a.price - b.price);
    if (sort === 'price_desc') arr.sort((a,b) => b.price - a.price);
    if (sort === 'rating')     arr.sort((a,b) => b.rating - a.rating);
    if (sort === 'new')        arr = arr.filter(p => p.isNew).concat(arr.filter(p => !p.isNew));
    return arr;
  }, [products, priceRange, badgeFilter, ratingFilter, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const toggleBadge = (b) => {
    setBadgeFilter(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const clearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setBadgeFilter([]);
    setRatingFilter(0);
    setSort('default');
  };

  const activeFiltersCount = [
    priceRange[0] > minPrice || priceRange[1] < maxPrice,
    badgeFilter.length > 0,
    ratingFilter > 0,
  ].filter(Boolean).length;

if (loading) return (
  <div className="loading-state">
    <div className="loading-spinner" />
    <p>جار التحميل...</p>
  </div>
);



  if (!cat) return (
    <div className="not-found">
      <h2>القسم غير موجود</h2>
      <Link to="/" className="btn-primary">الرئيسية</Link>
    </div>
  );

  return (
    <div className="cat-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{cat.label}</span>
      </div>

      {/* Page header */}
      <div className="cat-page-header">
        <div>
          <span className="cat-page-icon">{cat.icon}</span>
          <h1 className="cat-page-title">{cat.label} <span className="gold-text">— {cat.labelEn}</span></h1>
          <p className="cat-page-count">{filtered.length} منتج</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="cat-toolbar">
        {/* Filter toggle */}
        <button className={`toolbar-btn${filterOpen ? ' active' : ''}`}
          onClick={() => setFilterOpen(v => !v)}>
          <SlidersHorizontal size={15} />
          الفلاتر
          {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>}
        </button>

        {/* Sort */}
        <div className="sort-wrap">
          <button className="toolbar-btn" onClick={() => setSortOpen(v => !v)}>
            {SORT_OPTIONS.find(o => o.value === sort)?.label}
            <ChevronDown size={13} className={sortOpen ? 'rotated' : ''} />
          </button>
          {sortOpen && (
            <div className="sort-dropdown">
              {SORT_OPTIONS.map(o => (
                <button key={o.value}
                  className={`sort-option${sort === o.value ? ' active' : ''}`}
                  onClick={() => { setSort(o.value); setSortOpen(false); }}>
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="toolbar-count">{filtered.length} نتيجة</span>
      </div>

      <div className="cat-layout">
        {/* Filters sidebar */}
{filterOpen && (
  <>
    {/* Overlay — الضغط عليه يقفل الفلتر */}
    <div
      className="filter-overlay"
      onClick={() => setFilterOpen(false)}
    />
    <aside className="filters-sidebar">
      <div className="filter-header">
        <h3>الفلاتر</h3>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <button onClick={clearFilters} className="filter-clear">مسح الكل</button>
          <button onClick={() => setFilterOpen(false)} className="filter-close-btn">
            <X size={16} />
          </button>
        </div>
      </div>

            {/* Price range */}
            <div className="filter-group">
              <h4>السعر (EGP)</h4>
              <div className="price-range-labels">
                <span>{priceRange[0]}</span>
                <span>{priceRange[1]}</span>
              </div>
              <input type="range" min={minPrice} max={maxPrice}
                value={priceRange[0]}
                onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                className="price-slider" />
              <input type="range" min={minPrice} max={maxPrice}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                className="price-slider" />
            </div>

            {/* Badge */}
            <div className="filter-group">
              <h4>النوع</h4>
              {['new', 'hot'].map(b => (
                <label key={b} className="filter-check">
                  <input type="checkbox" checked={badgeFilter.includes(b)}
                    onChange={() => toggleBadge(b)} />
                  <span className={`badge-chip badge-${b}`}>{b === 'new' ? 'NEW' : 'HOT'}</span>
                </label>
              ))}
            </div>

            {/* Rating */}
            <div className="filter-group">
              <h4>التقييم</h4>
              {[4, 3, 2].map(r => (
                <label key={r} className="filter-check">
                  <input type="radio" name="rating" checked={ratingFilter === r}
                    onChange={() => setRatingFilter(r)} />
                  <span>{'★'.repeat(r)}{'☆'.repeat(5-r)} فأكثر</span>
                </label>
              ))}
              {ratingFilter > 0 && (
                <button className="filter-clear-small" onClick={() => setRatingFilter(0)}>
                  <X size={11} /> مسح التقييم
                </button>
              )}
            </div>
          </aside>
          </>
        )}

        {/* Products grid */}
        <div className="cat-products">
          {visible.length === 0
            ? (
              <div className="no-results">
                <p>لا توجد منتجات بهذه الفلاتر</p>
                <button onClick={clearFilters} className="btn-primary">مسح الفلاتر</button>
              </div>
            )
            : (
              <div className={`products-grid${filterOpen ? ' grid-narrow' : ''}`}>
                {visible.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )
          }

          {/* Load More */}
          {hasMore && (
            <div className="load-more-wrap">
              <button className="load-more-btn" onClick={() => setPage(p => p + 1)}>
                عرض المزيد ({filtered.length - visible.length} منتج متبقي)
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
