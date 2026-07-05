import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const links = [
  { to: '/admin',           label: 'نظرة عامة', icon: LayoutDashboard, end: true },
  { to: '/admin/products',  label: 'المنتجات',   icon: Package },
  { to: '/admin/orders',    label: 'الطلبات',    icon: ShoppingCart },
  { to: '/admin/analytics', label: 'التحليلات',  icon: BarChart3 },
];

export default function AdminLayout({ children }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-shell">
      {/* Top bar — تظهر بس في الموبايل */}
      <div className="admin-topbar">
        <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="فتح القائمة">
          <Menu size={19} />
        </button>
        <span className="admin-topbar-logo">Alnazer Admin</span>
        <div style={{ width: 40 }} /> {/* عشان اللوجو يفضل في النص */}
      </div>

      {/* Overlay خلفية سودا لما السايدبار مفتوح في الموبايل */}
      <div className={`admin-overlay${sidebarOpen ? ' open' : ''}`} onClick={closeSidebar} />

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 10px 24px',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--gold)' }}>
            Alnazer Admin
          </span>
          <button onClick={closeSidebar} className="admin-sidebar-close" aria-label="قفل القائمة">
            <X size={17} />
          </button>
        </div>

        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={closeSidebar}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 12px', borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--gold)' : 'var(--white-muted)',
              background: isActive ? 'rgba(233,165,72,.08)' : 'transparent',
              fontFamily: 'var(--font-arabic)', fontSize: '.88rem',
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          style={{
            marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 12px', borderRadius: 'var(--radius-sm)',
            color: '#e94848', fontFamily: 'var(--font-arabic)', fontSize: '.88rem',
          }}
        >
          <LogOut size={17} />
          تسجيل خروج
        </button>
      </aside>

      {/* Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}