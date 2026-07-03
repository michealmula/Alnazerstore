// import { NavLink, useNavigate } from 'react-router-dom';
// import { LayoutDashboard, Package, ShoppingCart, BarChart3, LogOut } from 'lucide-react';
// import { useAdminAuth } from '../../context/AdminAuthContext';

// const links = [
//   { to: '/admin',           label: 'نظرة عامة', icon: LayoutDashboard, end: true },
//   { to: '/admin/products',  label: 'المنتجات',   icon: Package },
//   { to: '/admin/orders',    label: 'الطلبات',    icon: ShoppingCart },
//   { to: '/admin/analytics', label: 'التحليلات',  icon: BarChart3 },
// ];

// export default function AdminLayout({ children }) {
//   const { logout } = useAdminAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/admin/login');
//   };

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>
//       {/* Sidebar */}
//       <aside style={{
//         width: 230, flexShrink: 0, background: 'var(--dark-card)',
//         borderRight: '1px solid var(--dark-border)', padding: '24px 14px',
//         display: 'flex', flexDirection: 'column', gap: 6,
//       }}>
//         <div style={{ padding: '0 10px 24px', fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--gold)' }}>
//           Alnazer Admin
//         </div>
//         {links.map(({ to, label, icon: Icon, end }) => (
//           <NavLink
//             key={to}
//             to={to}
//             end={end}
//             style={({ isActive }) => ({
//               display: 'flex', alignItems: 'center', gap: 10,
//               padding: '11px 12px', borderRadius: 'var(--radius-sm)',
//               color: isActive ? 'var(--gold)' : 'var(--white-muted)',
//               background: isActive ? 'rgba(233,165,72,.08)' : 'transparent',
//               fontFamily: 'var(--font-arabic)', fontSize: '.88rem',
//             })}
//           >
//             <Icon size={17} />
//             {label}
//           </NavLink>
//         ))}
//         <button
//           onClick={handleLogout}
//           style={{
//             marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10,
//             padding: '11px 12px', borderRadius: 'var(--radius-sm)',
//             color: '#e94848', fontFamily: 'var(--font-arabic)', fontSize: '.88rem',
//           }}
//         >
//           <LogOut size={17} />
//           تسجيل خروج
//         </button>
//       </aside>

//       {/* Content */}
//       <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
//         {children}
//       </main>
//     </div>
//   );
// }