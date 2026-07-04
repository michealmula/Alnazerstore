import { useEffect, useState } from 'react';
import { useProducts } from '../../data/useProducts';
import { subscribeOrders, computeAnalytics, migrateInitialProducts } from '../../data/store';
import { ALL_FLAT } from '../../data/catalog';

export default function AdminOverview() {
  const products = useProducts();
  const [orders, setOrders] = useState([]);
  const [migrating, setMigrating] = useState(false);
  const [migrateMsg, setMigrateMsg] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeOrders(setOrders);
    return unsubscribe;
  }, []);

  const stats = computeAnalytics(products, orders);

  const handleMigrate = async () => {
    setMigrating(true);
    setMigrateMsg('');
    try {
      const result = await migrateInitialProducts(ALL_FLAT);
      setMigrateMsg(result.message);
    } catch (err) {
      setMigrateMsg('حصل خطأ: ' + err.message);
    }
    setMigrating(false);
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

      {/* زرار الـ Migration — مؤقت، هنمسحه بعد الاستخدام */}
      {products.length === 0 && (
        <div style={{
          background: 'rgba(233,165,72,.08)', border: '1px solid rgba(233,165,72,.3)',
          borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 24,
        }}>
          <p style={{ color: 'var(--white)', fontFamily: 'var(--font-arabic)', marginBottom: 12 }}>
            مفيش منتجات في قاعدة البيانات لسه. دوس الزرار ده مرة واحدة بس عشان تنقل كل منتجاتك القديمة.
          </p>
          <button className="btn-primary" onClick={handleMigrate} disabled={migrating}>
            {migrating ? 'جاري النقل...' : 'نقل المنتجات القديمة'}
          </button>
          {migrateMsg && <p style={{ color: 'var(--gold)', marginTop: 10, fontSize: '.85rem' }}>{migrateMsg}</p>}
        </div>
      )}

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
}