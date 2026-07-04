import { useEffect, useState } from 'react';
import { useProducts } from '../../data/useProducts';
import { subscribeOrders, computeAnalytics } from '../../data/store';

export default function AdminOverview() {
  const products = useProducts();
  const [orders, setOrders] = useState([]);
    const fixed = await repairProductImages(ALL_FLAT);
    setRepairMsg(`تم إصلاح ${fixed} صورة من ${ALL_FLAT.length}`);
    setRepairing(false);
  };

  const cardStyle = {
    background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
    borderRadius: 'var(--radius-lg)', padding: 22, flex: 1, minWidth: 180,
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', marginBottom: 24 }}>
        نظرة عامة
      </h1>



      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <div style={cardStyle}>
          <p style={{ color: 'var(--white-muted)', fontSize: '.8rem', marginBottom: 6 }}>عدد المنتجات</p>
          <p style={{ color: 'var(--gold)', fontSize: '1.8rem', fontFamily: 'var(--font-display)' }}>{stats.totalProducts}</p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: 'var(--white-muted)', fontSize: '.8rem', marginBottom: 6 }}>إجمالي الطلبات</p>
          <p style={{ color: 'var(--gold)', fontSize: '1.8rem', fontFamily: 'var(--font-display)' }}>{stats.totalOrders}</p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: 'var(--white-muted)', fontSize: '.8rem', marginBottom: 6 }}>طلبات معلقة</p>
          <p style={{ color: 'var(--gold)', fontSize: '1.8rem', fontFamily: 'var(--font-display)' }}>{stats.pendingOrders}</p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: 'var(--white-muted)', fontSize: '.8rem', marginBottom: 6 }}>إجمالي الإيرادات</p>
          <p style={{ color: 'var(--gold)', fontSize: '1.8rem', fontFamily: 'var(--font-display)' }}>{stats.totalRevenue} EGP</p>
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', fontSize: '1.2rem', marginBottom: 14 }}>
        الأكثر مبيعاً
      </h2>
      {stats.topProducts.length === 0
        ? <p style={{ color: 'var(--white-dim)', fontFamily: 'var(--font-arabic)' }}>مفيش طلبات لسه</p>
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.topProducts.map(({ product, qty }) => (
              <div key={product.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 10,
                background: 'var(--dark-card)', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--dark-border)',
              }}>
                <img src={product.image} alt={product.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                <span style={{ color: 'var(--white)', flex: 1, fontFamily: 'var(--font-arabic)', fontSize: '.86rem' }}>{product.name}</span>
                <span style={{ color: 'var(--gold)', fontSize: '.84rem' }}>{qty} مبيعات</span>
              </div>
            ))}
          </div>
        )}
    </div>
  );
