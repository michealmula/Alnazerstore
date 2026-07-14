import { db } from '../firebase';
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  setDoc, query, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore';

const productsCol = collection(db, 'products');
const ordersCol   = collection(db, 'orders');

/* ============================================================
   PRODUCTS
   ============================================================ */

// اشتراك لحظي — أي تغيير في Firestore هيوصل لكل الأجهزة فوراً
export function subscribeProducts(callback) {
  return onSnapshot(productsCol, (snapshot) => {
    const list = snapshot.docs.map(d => ({
      ...d.data(),
      id: d.id,        // ← Firestore document ID دايماً يغلب أي field تاني
    }));
    callback(list);
  });
}

export async function saveProduct(product) {
  if (product.id) {
    const ref = doc(db, 'products', product.id);
    const { id, ...data } = product;
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } else {
    await addDoc(productsCol, { ...product, createdAt: serverTimestamp() });
  }
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id));
}

/* ============================================================
   ORDERS
   ============================================================ */

export function subscribeOrders(callback) {
  const q = query(ordersCol, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(list);
  });
}

export async function addOrder(order) {
  await addDoc(ordersCol, {
    items: order.items,
    total: order.total,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, 'orders', orderId), { status });
}

/* ============================================================
   ANALYTICS — بتاخد الداتا الحالية وتحسب منها
   ============================================================ */
export function computeAnalytics(products, orders) {
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

/* ============================================================
   MIGRATION — نستخدمها مرة واحدة بس عشان ننقل منتجاتك القديمة
   ============================================================ */
export async function migrateInitialProducts(allFlatProducts) {
  const existing = await getDocs(productsCol);
  if (!existing.empty) {
    return { skipped: true, message: 'فيه منتجات موجودة بالفعل في Firestore، مش هنكرر النقل' };
  }
  for (const product of allFlatProducts) {
    const { id, ...data } = product;
    await setDoc(doc(db, 'products', id), { ...data, createdAt: serverTimestamp() });
  }
  return { skipped: false, message: `تم نقل ${allFlatProducts.length} منتج بنجاح` };
}
export async function repairProductImages(allFlatProducts) {
  let fixed = 0;
  for (const product of allFlatProducts) {
    try {
      const response = await fetch(product.image);
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      await updateDoc(doc(db, 'products', product.id), { image: base64 });
      fixed++;
    } catch (err) {
      console.error(`فشل تحديث صورة ${product.id}:`, err);
    }
  }
  return fixed;
}