import { useEffect, useState } from 'react';
import { subscribeOrders, updateOrderStatus } from '../../data/store';

const statusColors = {
  pending:   { bg: 'rgba(233,165,72,.12)', color: 'var(--gold)' },
  confirmed: { bg: 'rgba(37,211,102,.12)', color: '#25D366' },
  cancelled: { bg: 'rgba(233,72,72,.12)',  color: '#e94848' },
};
const statusLabels = { pending: 'معلق', confirmed: 'مؤكد', cancelled: 'ملغي' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = subscribeOrders(setOrders);
    return unsubscribe;
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', marginBottom: 20 }}>
        الطلبات ({orders.length})
      </h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--dark-border)',
              background: filter === f ? 'rgba(233,165,72,.1)' : 'transparent',
              color: filter === f ? 'var(--gold)' : 'var(--white-muted)',
              fontSize: '.82rem', fontFamily: 'var(--font-arabic)',
            }}
          >
            {f === 'all' ? 'الكل' : statusLabels[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--white-dim)', fontFamily: 'var(--font-arabic)', textAlign: 'center', padding: 40 }}>
          مفيش طلبات
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(order => (
            <div key={order.id} style={{
              background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
              borderRadius: 'var(--radius-lg)', padding: 18,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ color: 'var(--white)', fontSize: '.84rem' }}>
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleString('ar-EG')
                      : 'جاري التحميل...'}
                  </span>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: '.74rem', fontFamily: 'var(--font-arabic)',
                  background: statusColors[order.status].bg, color: statusColors[order.status].color,
                }}>
                  {statusLabels[order.status]}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {order.items.map(i => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem' }}>
                    <span style={{ color: 'var(--white-muted)', fontFamily: 'var(--font-arabic)' }}>{i.name} × {i.qty}</span>
                    <span style={{ color: 'var(--white-dim)' }}>{i.price * i.qty} EGP</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--dark-border)', paddingTop: 10 }}>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>الإجمالي: {order.total} EGP</span>
                {order.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleStatus(order.id, 'confirmed')} style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '.78rem',
                      background: 'rgba(37,211,102,.1)', color: '#25D366', fontFamily: 'var(--font-arabic)',
                    }}>تأكيد</button>
                    <button onClick={() => handleStatus(order.id, 'cancelled')} style={{
                      padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '.78rem',
                      background: 'rgba(233,72,72,.1)', color: '#e94848', fontFamily: 'var(--font-arabic)',
                    }}>إلغاء</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}