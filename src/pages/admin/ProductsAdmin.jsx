import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { CATALOG } from '../../data/catalog';
import { saveProduct, deleteProduct } from '../../data/store';
import { useProducts } from '../../data/useProducts';

const inputStyle = {
  padding: '10px 14px', background: 'var(--dark)', border: '1px solid var(--dark-border)',
  borderRadius: 'var(--radius-sm)', color: 'var(--white)', fontSize: '.85rem', width: '100%',
};

export default function ProductsAdmin() {
  const products = useProducts();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | {} (new) | product object

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

const handleDelete = async (id) => {
    if (!confirm('متأكد إنك عايز تحذف المنتج ده؟')) return;
    await deleteProduct(id);
  };

  const handleSave = async (product) => {
    await saveProduct(product);
    setEditing(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)' }}>المنتجات ({products.length})</h1>
        <button className="btn-primary" onClick={() => setEditing({})}>
          <Plus size={16} /> إضافة منتج
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 320 }}>
        <Search size={16} style={{ position: 'absolute', top: 12, right: 12, color: 'var(--white-dim)' }} />
        <input
          style={{ ...inputStyle, paddingRight: 36 }}
          placeholder="بحث بالاسم أو الكود..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dark-border)' }}>
              {['', 'الاسم', 'الكود', 'القسم', 'السعر', ''].map((h, i) => (
                <th key={i} style={{ padding: 12, textAlign: 'right', color: 'var(--white-muted)', fontSize: '.78rem', fontFamily: 'var(--font-arabic)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--dark-border)' }}>
                <td style={{ padding: 10 }}>
                  <img src={p.image} alt={p.name} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover' }} />
                </td>
                <td style={{ padding: 10, color: 'var(--white)', fontSize: '.84rem', fontFamily: 'var(--font-arabic)' }}>{p.name}</td>
                <td style={{ padding: 10, color: 'var(--white-dim)', fontSize: '.78rem' }}>{p.code}</td>
                <td style={{ padding: 10, color: 'var(--white-muted)', fontSize: '.82rem', fontFamily: 'var(--font-arabic)' }}>{p.categoryLabel}</td>
                <td style={{ padding: 10, color: 'var(--gold)', fontSize: '.84rem' }}>{p.price} EGP</td>
                <td style={{ padding: 10, display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditing(p)} style={{ color: 'var(--white-muted)' }}><Edit2 size={15} /></button>
                  <button onClick={() => handleDelete(p.id)} style={{ color: '#e94848' }}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ padding: 30, textAlign: 'center', color: 'var(--white-dim)', fontFamily: 'var(--font-arabic)' }}>مفيش منتجات مطابقة</p>
        )}
      </div>

      {editing !== null && (
        <ProductFormModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ProductFormModal({ product, onClose, onSave }) {
  const isNew = !product.id;
  const [form, setForm] = useState({
    id: product.id || '',
    name: product.name || '',
    code: product.code || '',
    price: product.price || '',
    category: product.category || CATALOG[0].key,
    description: product.description || '',
    image: product.image || '',
    badge: product.badge || '',
    rating: product.rating || 4.5,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cat = CATALOG.find(c => c.key === form.category);
    onSave({
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
      categoryLabel: cat.label,
      group: cat.group,
      gender: cat.gender,
      isNew: form.badge === 'new',
      isBestseller: form.badge === 'hot',
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
          borderRadius: 'var(--radius-lg)', padding: 28, width: '100%', maxWidth: 480,
          maxHeight: '88vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)' }}>
            {isNew ? 'إضافة منتج جديد' : 'تعديل المنتج'}
          </h2>
          <button type="button" onClick={onClose} style={{ color: 'var(--white-muted)' }}><X size={20} /></button>
        </div>

        {form.image && (
          <img src={form.image} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: 'var(--white-muted)', fontSize: '.8rem' }} />

        <input style={inputStyle} placeholder="اسم المنتج" required
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

        <input style={inputStyle} placeholder="الكود (مثال: AN-KHA-050)" required
          value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />

        <input style={inputStyle} type="number" placeholder="السعر" required
          value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />

        <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          {CATALOG.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>

        <select style={inputStyle} value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}>
          <option value="">بدون شارة</option>
          <option value="new">جديد</option>
          <option value="hot">الأكثر مبيعاً</option>
        </select>

        <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="الوصف"
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

        <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: 8 }}>
          {isNew ? 'إضافة' : 'حفظ التعديلات'}
        </button>
      </form>
    </div>
  );
}