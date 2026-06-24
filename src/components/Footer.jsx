import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { CATALOG, WHATSAPP_NUMBER } from '../data/catalog';
import Logoimg from '../photos/logo.png'
// import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
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
          <div className="footer-social">
            <a href="https://www.instagram.com/alnazer_store1" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram">
              <FaInstagram size={15} />
            </a>
            <a href="https://www.facebook.com/share/18fSoCGSQd/" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook">
              <FaFacebook size={15} />
            </a>
            <a href={`https://wa.me/${+201032231491}`} target="_blank" rel="noreferrer" className="social-link" aria-label="WhatsApp">
              <FaWhatsapp size={15} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          {CATALOG.slice(0, 7).map(cat => (
            <Link key={cat.key} to={`/category/${cat.key}`}>{cat.label}</Link>
          ))}
        </div>

        {/* More */}
        <div className="footer-col">
          <h4>المزيد</h4>
          {CATALOG.slice(7).map(cat => (
            <Link key={cat.key} to={`/category/${cat.key}`}>{cat.label}</Link>
          ))}
          <a href="https://michealmula.github.io/tq/" target="_blank" rel="noreferrer">ساعات رجالي ↗</a>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>تواصل معنا</h4>
          <p>📞 +20 103 223 1491</p>
          <p>📧 AlnazerSt@gmail.com</p>
          <p>📍 elkenesa street, Qus, Qena</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="footer-wa-btn">
            <FaWhatsapp size={14} /> تحدث معنا
          </a>
        </div>

      </div>
      <div className="footer-bottom">
        <p>© 2026 <span className="gold">Alnazer Store — الناظر ستور</span> · All Rights Reserved</p>
        <p>Crafted by <span className="gold">Michael</span></p>
      </div>
    </footer>
  );
}
