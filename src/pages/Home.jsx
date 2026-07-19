import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CATALOG } from '../data/catalog';
import { useProducts } from '../data/useProducts';
import tqbg from '../photos/tqbg.png';

/* ── Hero Slides ── */
const HERO_SLIDES = [
  {
    bg: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=85',
    eyebrow: '✦ New Collection 2026',
    title: 'Luxury',
    titleGold: 'Accessories',
    desc: 'اكتشف أرقى مجموعات الإكسسوارات المختارة بعناية لذوق راقي مميز',
    cta: { label: 'الاكثر مبيعا', to: '/best-sellers' },
    cta2: { label: 'حلقان', to: '/category/halaqan' },
  },
  {
    bg: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=85',
    eyebrow: '✦ Beauty Collection',
    title: 'Premium',
    titleGold: 'Beauty',
    desc: 'أجود منتجات العناية والجمال — بادي سبلاش، رول اون، سكين كير',
    cta: { label: 'اكتشفي الآن', to: '/category/kosmatics' },
    cta2: { label: 'Skin Care', to: '/category/kosmatics' },
  },
  {
    bg: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=85',
    eyebrow: '✦ Gold & Silver',
    title: 'Elegant',
    titleGold: 'Chains',
    desc: 'سلاسل وخواتم ذهبية وفضية بتصاميم عريقة وأنيقة',
    cta: { label: 'وصل حديثا', to: '/new-arrivals' },
    cta2: { label: 'خواتم', to: '/category/khawatim' },
  },
{
  bg: tqbg,
  eyebrow: '✦ Premium Watches',
  title: 'Luxury',
  titleGold: 'Watches',
  desc: 'اكتشف مجموعة مختارة من الساعات الفاخرة التي تجمع بين الأناقة والدقة.',
  cta: { label: 'تسوق الآن', to: 'https://michealmula.github.io/tqstore/' },
  cta2: { label: 'انسيال', to: '/category/ansyal' },
},
];

/* ── Hero Slider ── */
function HeroSlider() {
  const [cur, setCur]     = useState(0);
  const [prev, setPrev]   = useState(null);
  const [prog, setProg]   = useState(0);
  const timerRef          = useRef(null);
  const progRef           = useRef(null);
  const total             = HERO_SLIDES.length;

  const goTo = (idx) => {
    const next = ((idx % total) + total) % total;
    if (next === cur) return;
    setPrev(cur);
    setCur(next);
    setProg(0);
    setTimeout(() => setPrev(null), 900);
    restartAuto();
  };

  const startAuto = () => {
    timerRef.current = setInterval(() => {
      setCur(c => {
        const next = (c + 1) % total;
        setPrev(c);
        setTimeout(() => setPrev(null), 900);
        return next;
      });
      setProg(0);
    }, 5000);
    progRef.current = setInterval(() => setProg(p => Math.min(p + 2, 100)), 100);
  };

  const stopAuto = () => {
    clearInterval(timerRef.current);
    clearInterval(progRef.current);
  };

  const restartAuto = () => { stopAuto(); startAuto(); };

  useEffect(() => { startAuto(); return stopAuto; }, []);

  const s = HERO_SLIDES[cur];

  return (
    <section className="hero-slider" onMouseEnter={stopAuto} onMouseLeave={startAuto}>
      {/* Slides */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`hslide${i === cur ? ' active' : ''}${i === prev ? ' leaving' : ''}`}
          style={{ '--bg': `url('${slide.bg}')` }}
        >
          <div className="hslide-overlay" />
        </div>
      ))}

      {/* Content — rendered once, animates on cur change */}
      <div className="hslide-content" key={cur}>
        <span className="hslide-eyebrow">{s.eyebrow}</span>
        <h1 className="hslide-title">
          {s.title} <span className="gold-text">{s.titleGold}</span>
        </h1>
        <p className="hslide-desc">{s.desc}</p>
        <div className="hslide-actions">
          <Link to={s.cta.to} className="btn-primary">
            {s.cta.label} <ArrowRight size={14} />
          </Link>
          <Link to={s.cta2.to} className="btn-secondary">{s.cta2.label}</Link>
        </div>
      </div>

      {/* Arrows */}
      <button className="hslider-arrow hslider-prev" onClick={() => goTo(cur - 1)} aria-label="Prev">
        <ChevronLeft size={22} />
      </button>
      <button className="hslider-arrow hslider-next" onClick={() => goTo(cur + 1)} aria-label="Next">
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="hslider-dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={`hslider-dot${i === cur ? ' active' : ''}`}
            onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      {/* Progress bar */}
      <div className="hslider-progress" style={{ width: `${prog}%` }} />
    </section>
  );
}

/* ── Section Header ── */
function SectionHead({ eyebrow, title, gold, link, linkLabel }) {
  return (
    <div className="section-header">
      <div className="section-header-text">
        <span className="section-eyebrow">{eyebrow}</span>
        <h2 className="section-title">{title} <span className="gold-text">{gold}</span></h2>
      </div>
      {link && (
        <Link to={link} className="section-link">
          {linkLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

/* ── Categories Grid ── */
function CategoriesSection() {
  return (
    <section className="home-section categories-section">
      <SectionHead eyebrow="Browse by Category" title="Our" gold="Collections" />
      <div className="categories-grid">
        {CATALOG.map((cat, i) => (
          <Link key={cat.key} to={`/category/${cat.key}`}
            className="category-card"
            style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="cat-icon">{cat.icon}</div>
            <h3 className="cat-name">{cat.label}</h3>
            <p className="cat-en">{cat.labelEn}</p>
            <span className="cat-count">{cat.count} منتج</span>
          </Link>
        ))}
        {/* Men's Watches — external */}
        <a href="https://michealmula.github.io/tqstore/" target="_blank" rel="noreferrer" className="category-card cat-external">
          <div className="cat-icon">⌚</div>
          <h3 className="cat-name">ساعات رجالي</h3>
          <p className="cat-en">Men's Watches ↗</p>
          <span className="cat-count">موقع منفصل</span>
        </a>
      </div>
    </section>
  );
}

/* ── Featured Tabs ── */
function FeaturedSection() {
  const [tab, setTab] = useState('bestseller');
  const { products: allFlat } = useProducts();

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const pools = {
    bestseller: shuffle(allFlat.filter(p => p.isBestseller)).slice(0, 8),
    offers: shuffle(allFlat).slice(0, 8).map(p => ({ ...p, oldPrice: Math.round(p.price * 1.3 / 5) * 5 })),
    new: allFlat.filter(p => p.isNew).slice(0, 8),
  };

  const TABS = [
    { key: 'bestseller', label: '🔥 الأكثر مبيعاً' },
    { key: 'offers',     label: '🏷️ العروض' },
    { key: 'new',        label: '✨ الجديد' },
  ];

  return (
    <section className="home-section featured-section">
      <div className="ftabs-bar">
        {TABS.map(t => (
          <button key={t.key} className={`ftab${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="products-grid">
        {(pools[tab] || []).map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

/* ── Deals Banner ── */
function DealsBanner() {
  const { products: allProducts } = useProducts();
  return (
    <section className="deals-banner">
      <div className="deals-banner-inner">
        <div className="deals-left">
          <span className="deals-eyebrow">✦ عروض حصرية</span>
          <h2>Special <span className="gold-text">Deals</span></h2>
          <p>خصومات تصل لـ 40% على مجموعات مختارة</p>
          <Link to="/category/aswera" className="btn-primary">تسوق الآن <ArrowRight size={14} /></Link>
        </div>
        <div className="deals-cards">
          {[
            { label: 'أسورة', cat: 'aswera', color: '#E9A548' },
            { label: 'انسيال', cat: 'ansyal', color: '#C4842A' },
          ].map(d => (
            <Link key={d.cat} to={`/category/${d.cat}`} className="deals-card"
              style={{ '--accent': d.color }}>
<img src={allProducts.find(p => p.category === d.cat)?.image} alt={d.label} />
              <div className="deals-card-overlay">
                <span>{d.label}</span>
                <span className="deals-off">خصم 30%</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Products Row ── */
function ProductsRow({ title, titleGold, eyebrow, products, link, linkLabel }) {
  return (
    <section className="home-section">
      <SectionHead eyebrow={eyebrow} title={title} gold={titleGold} link={link} linkLabel={linkLabel} />
      <div className="products-grid">
        {products.slice(0, 8).map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

/* ── Promo Banner ── */
function PromoBanner() {
  return (
    <div className="promo-banner">
      <div className="promo-inner">
        <span className="promo-icon">🚚</span>
        <span>شحن سريع لجميع محافظات مصر</span>
        <span className="promo-divider">|</span>
        <span className="promo-icon">💯</span>
        <span>ضمان جودة 100%</span>
        <span className="promo-divider">|</span>
        <span className="promo-icon">💬</span>
        <span>دعم واتساب 24/7</span>
      </div>
    </div>
  );
}

/* ── Main Home ── */
export default function Home() {
  const { products: allProducts, loading } = useProducts();

  const newArrivals = allProducts.filter(p => p.isNew).slice(0, 8);
  const bestsellers = allProducts.filter(p => p.isBestseller).slice(0, 8);

  if (loading) return (
    <>
      <HeroSlider />
      <PromoBanner />
      <CategoriesSection />
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>جار التحميل...</p>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Hero */}
      <HeroSlider />

      {/* 2. Promo Bar */}
      <PromoBanner />

      {/* 3. Categories */}
      <CategoriesSection />

      {/* 4. Best Sellers */}
      <section id="best-sellers">
        <ProductsRow
          eyebrow="الأكثر طلباً"
          title="Best"
          titleGold="Sellers"
          products={bestsellers}
          link="/best-sellers"
          linkLabel="عرض الكل"
        />
      </section>

      {/* 5. New Arrivals */}
      <section id="new-arrivals">
        <ProductsRow
          eyebrow="أحدث الوافدين"
          title="New"
          titleGold="Arrivals"
          products={newArrivals}
          link="/new-arrivals"
          linkLabel="عرض الكل"
        />
      </section>

      {/* 6. Special Deals — كـ Categories مش Products */}
      <section id="special-deals">
        <DealsBanner />
      </section>
    </>
  );
}
