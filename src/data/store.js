import { ALL_PRODUCTS } from './catalog';

const PRODUCTS_KEY = 'alnazer_admin_products';
const ORDERS_KEY    = 'alnazer_admin_orders';
const SEEDED_KEY     = 'alnazer_admin_seeded';

/* ── تحويل ALL_PRODUCTS (منتجات ثابتة) لمصفوفة واحدة أول مرة بس ── */
function seedIfNeeded() {
  if (localStorage.getItem(SEEDED_KEY)) return;
  const flat = Object.values(ALL_PRODUCTS).flat().map(p => ({
    ...p,
    // بما إن الصور imports ثابتة، هنحتفظ بالـ image زي ما هي (URL/blob من Vite)
    createdAt: new Date().toISOString(),
  }));
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(flat));
  localStorage.setItem(SEEDED_KEY, '1');
}

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ============================================================
   PRODUCTS
   ============================================================ */
export function getProducts() {
  seedIfNeeded();
  return read(PRODUCTS_KEY, []);
}

export function saveProduct(product) {
  const list = getProducts();
  const idx = list.findIndex(p => p.id === product.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...product, updatedAt: new Date().toISOString() };
  } else {
    const newProduct = {
      ...product,
      id: product.id || `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newProduct);
  }
  write(PRODUCTS_KEY, list);
  window.dispatchEvent(new Event('alnazer-products-updated')); // ← جديد
  return list;
}



export function deleteProduct(id) {
  const list = getProducts().filter(p => p.id !== id);
  write(PRODUCTS_KEY, list);
  return list;
}

/* ============================================================
   ORDERS — هنسجل الطلب لما حد يدوس "اطلب واتساب"
   ============================================================ */
export function getOrders() {
  return read(ORDERS_KEY, []);
}

export function addOrder(order) {
  const list = getOrders();
  const newOrder = {
    id: `order-${Date.now()}`,
    items: order.items,           // [{id,name,code,price,qty}]
    total: order.total,
    createdAt: new Date().toISOString(),
    status: 'pending',            // pending | confirmed | cancelled
  };
  list.unshift(newOrder);
  write(ORDERS_KEY, list);
  return list;
}

export function updateOrderStatus(orderId, status) {
  const list = getOrders().map(o => o.id === orderId ? { ...o, status } : o);
  write(ORDERS_KEY, list);
  return list;
}

/* ============================================================
   ANALYTICS — محسوبة من نفس الداتا
   ============================================================ */
export function getAnalytics() {
  const products = getProducts();
  const orders   = getOrders();

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);

  const productSales = {};
  orders.forEach(o => {
    if (o.status === 'cancelled') return;
    o.items.forEach(i => {
      productSales[i.id] = (productSales[i.id] || 0) + i.qty;
    });
  });

  const topProducts = Object.entries(productSales)
    .map(([id, qty]) => ({ product: products.find(p => p.id === id), qty }))
    .filter(x => x.product)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const categoryCount = {};
  products.forEach(p => {
    categoryCount[p.categoryLabel] = (categoryCount[p.categoryLabel] || 0) + 1;
  });

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue,
    topProducts,
    categoryCount,
  };
}