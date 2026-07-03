import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Menu, ShoppingBag, Heart, ChevronDown, MessageCircle } from 'lucide-react';
import { CATALOG, WHATSAPP_NUMBER } from '../data/catalog';
import { useProducts } from '../data/useProducts';
import { useStore } from '../context/StoreContext';
import Logoimg from '../photos/logo.png'
import { FaWhatsapp } from "react-icons/fa";

import { addOrder } from '../data/store';


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [atTop, setAtTop]       = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQ, setSearchQ]         = useState('');
  const [catOpen, setCatOpen]         = useState(false);
  const [cartOpen, setCartOpen]       = useState(false);
  const searchRef                     = useRef(null);const catRef = useRef(null);
  const navigate                      = useNavigate();
  const location                      = useLocation();
  const { favorites, cart, cartCount, removeFromCart } = useStore();

const [headerState, setHeaderState] = useState('top'); // 'top' | 'scrolled'

useEffect(() => {
  const onScroll = () => {
    setHeaderState(window.scrollY > 10 ? 'scrolled' : 'top');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);

  // close mobile nav on route change
  useEffect(() => { setMobileOpen(false); setCartOpen(false); }, [location]);

  // focus search input on open
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.cat-dropdown-wrap')) setCatOpen(false);
      if (!e.target.closest('.cart-dropdown-wrap')) setCartOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  /* ── search results ── */
const results = searchQ.trim().length > 0
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQ.toLowerCase()) ||
        p.categoryLabel.includes(searchQ)
      ).slice(0, 7)
    : [];

  const handleResultClick = (p) => {
    setSearchOpen(false);
    setSearchQ('');
    navigate(`/category/${p.category}`, { state: { highlight: p.id } });
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
<header className={`header ${headerState === 'scrolled' ? 'scrolled' : 'at-top'}`}>
        <div className="header-inner">

          {/* Logo */}
          <Link to="/" className="header-logo">
            <div className="logo-icon">
              <img src={Logoimg} alt="Alnazer" className="logo-img"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              <span className="logo-fallback">N</span>
            </div>
            <div className="logo-text">
              <span className="logo-main">Alnazer</span>
              <span className="logo-sub">Store</span>
            </div>
          </Link>

{/* ── Desktop Nav ── */}
<nav className="header-nav">
  <Link to="/"
    className={`nav-link${location.pathname === '/' ? ' active' : ''}`}>
    Home
  </Link>

  {/* Categories Mega Dropdown */}
  <div className="cat-dropdown-wrap" ref={catRef}>
    <button
      className={`nav-link cat-trigger${catOpen ? ' active' : ''}`}
      onClick={() => setCatOpen(v => !v)}
    >
      Categories
      <ChevronDown size={13} style={{ transition:'transform .25s', transform: catOpen ? 'rotate(180deg)' : 'none' }} />
    </button>
    {catOpen && (
      <div className="cat-dropdown">
        <div className="cat-dropdown-grid">
          {CATALOG.map(cat => (
            <Link key={cat.key} to={`/category/${cat.key}`}
              className="cat-drop-item" onClick={() => setCatOpen(false)}>
              <span className="cat-drop-icon">{cat.icon}</span>
              <div>
                <div className="cat-drop-label">{cat.label}</div>
                <div className="cat-drop-en">{cat.labelEn}</div>
              </div>
            </Link>
          ))}
          <a href="https://michealmula.github.io/tqstore/" className="cat-drop-item cat-drop-ext"
            target="_blank" rel="noreferrer" onClick={() => setCatOpen(false)}>
            <span className="cat-drop-icon">⌚</span>
            <div>
              <div className="cat-drop-label">ساعات رجالي</div>
              <div className="cat-drop-en" style={{ color:'var(--gold)' }}>Men's Watches ↗</div>
            </div>
          </a>
        </div>
      </div>
    )}
  </div>

  {/* Best Sellers — بيسكرول للسيكشن في الهوم */}
  <Link to="/" className="nav-link"
    onClick={e => {
      if (location.pathname === '/') {
        e.preventDefault();
        document.getElementById('best-sellers')?.scrollIntoView({ behavior:'smooth' });
      }
    }}>
    Best Sellers
  </Link>

  {/* Special Deals */}
  <Link to="/" className="nav-link"
    onClick={e => {
      if (location.pathname === '/') {
        e.preventDefault();
        document.getElementById('special-deals')?.scrollIntoView({ behavior:'smooth' });
      }
    }}>
    Special Deals
  </Link>

  {/* New Arrivals */}
  <Link to="/" className="nav-link"
    onClick={e => {
      if (location.pathname === '/') {
        e.preventDefault();
        document.getElementById('new-arrivals')?.scrollIntoView({ behavior:'smooth' });
      }
    }}>
    New Arrivals
  </Link>

  {/* تواصل معنا — بيسكرول للفوتر */}
  <button className="nav-link"
    onClick={() => document.querySelector('.footer')?.scrollIntoView({ behavior:'smooth' })}>
    تواصل معنا
  </button>
</nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Search */}
            <button className="header-btn" aria-label="Search" onClick={() => setSearchOpen(v => !v)}>
              <Search size={18} />
            </button>

            {/* WhatsApp */}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
               className="header-btn wa-btn" aria-label="WhatsApp">
              <FaWhatsapp size={18} />
            </a>

            {/* Favorites */}
            <Link to="/favorites" className="header-btn" aria-label="Favorites">
              <Heart size={18} />
              {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </Link>

            {/* Cart */}
            <div className="cart-dropdown-wrap">
              <button className="header-btn" aria-label="Cart" onClick={() => setCartOpen(v => !v)}>
                <ShoppingBag size={18} />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </button>

              {cartOpen && (
                <div className="cart-dropdown">
                  <h3 className="cart-drop-title">سلة التسوق</h3>
                  {cart.length === 0
                    ? <p className="cart-empty">السلة فاضية</p>
                    : <>
                        <div className="cart-items">
                          {cart.map(item => (
                            <div key={item.id} className="cart-item">
                              <img src={item.image} alt={item.name} />
                              <div className="cart-item-info">
                                <span className="cart-item-name">{item.name}</span>
                                <span className="cart-item-price">{item.price * item.qty} EGP</span>
                              </div>
                              <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                                <X size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="cart-total">
                          <span>الإجمالي</span>
                          <span className="gold">{cartTotal} EGP</span>
                        </div>
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                              'مرحباً! أود طلب:\n\n' +
                              cart.map(i => `• ${i.name} (${i.code}) x${i.qty} — ${i.price * i.qty} EGP`).join('\n') +
                              `\n\nالإجمالي: ${cartTotal} EGP`
                            )}`}
                            target="_blank" rel="noreferrer"
                            className="btn-primary cart-wa-btn"
                            onClick={() => {
                              addOrder({
                                items: cart.map(i => ({ id: i.id, name: i.name, code: i.code, price: i.price, qty: i.qty })),
                                total: cartTotal,
                              });
                            }}
                          >
                            اطلب عبر واتساب
                          </a>
                      </>
                  }
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button className={`hamburger-btn${mobileOpen ? ' active' : ''}`}
              onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="search-bar-wrapper open">
            <div className="search-bar-inner">
              <Search size={16} className="search-icon" />
              <input
                ref={searchRef}
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="ابحث عن منتج أو قسم..."
                className="search-input"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQ(''); }} className="search-close">
                <X size={15} />
              </button>
            </div>
            {results.length > 0 && (
              <div className="search-dropdown open">
                {results.map(p => (
                  <div key={p.id} className="search-result-item" onClick={() => handleResultClick(p)}>
                    <img src={p.image} alt={p.name} className="search-result-img" loading="lazy" />
                    <div className="search-result-info">
                      <h4>{p.name}</h4>
                      <span>{p.code} — EGP {p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {searchQ.trim() && results.length === 0 && (
              <div className="search-dropdown open">
                <div className="search-no-results">لا نتائج لـ &ldquo;{searchQ}&rdquo;</div>
              </div>
            )}
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="mobile-nav open">
            <Link to="/" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>🏠 Home</Link>
            {CATALOG.map(cat => (
              <Link key={cat.key} to={`/category/${cat.key}`}
                className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                {cat.icon} {cat.label} — {cat.labelEn}
              </Link>
            ))}
            <a href="https://michealmula.github.io/tqstore/" className="mobile-nav-link" target="_blank" rel="noreferrer">
              ⌚ ساعات رجالي — Men's Watches ↗
            </a>
            <Link to="/favorites" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
              ❤️ المفضلة ({favorites.length})
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
