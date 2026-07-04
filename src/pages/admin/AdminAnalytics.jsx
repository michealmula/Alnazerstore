import { useEffect, useState } from 'react';
import { useProducts } from '../../data/useProducts';
import { subscribeOrders, computeAnalytics } from '../../data/store';

export default function AdminAnalytics() {
  const products = useProducts();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeOrders(setOrders);
    return unsubscribe;
  }, []);

  const stats = computeAnalytics(products, orders);
  const categories = Object.entries(stats.categoryCount).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...categories.map(c => c[1]), 1);

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', marginBottom: 24 }}>
        التحليلات
      </h1>

      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', fontSize: '1.1rem', marginBottom: 14 }}>
        توزيع المنتجات على الأقسام
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {categories.map(([label, count]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 110, color: 'var(--white-muted)', fontSize: '.8rem', fontFamily: 'var(--font-arabic)' }}>{label}</span>
            <div style={{ flex: 1, height: 10, background: 'var(--dark)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{
                width: `${(count / maxCount) * 100}%`, height: '100%',
                background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))',
              }} />
            </div>
            <span style={{ width: 30, color: 'var(--gold)', fontSize: '.8rem', textAlign: 'left' }}>{count}</span>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', fontSize: '1.1rem', marginBottom: 14 }}>
        الأكثر مبيعاً
      </h2>
      {stats.topProducts.length === 0
        ? <p style={{ color: 'var(--white-dim)', fontFamily: 'var(--font-arabic)' }}>مفيش طلبات مسجلة لسه</p>
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.topProducts.map(({ product, qty }, idx) => (
              <div key={product.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                background: 'var(--dark-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--dark-border)',
              }}>
                <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.1rem', width: 24 }}>{idx + 1}</span>
                <img src={product.image} alt={product.name} style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }} />
                <span style={{ color: 'var(--white)', flex: 1, fontFamily: 'var(--font-arabic)', fontSize: '.86rem' }}>{product.name}</span>
                <span style={{ color: 'var(--white-muted)', fontSize: '.82rem' }}>{qty} قطعة مباعة</span>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}