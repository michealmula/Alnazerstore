import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminOverview from './AdminOverview';
import ProductsAdmin from './ProductsAdmin';
import AdminOrders from './AdminOrders';
import AdminAnalytics from './AdminAnalytics';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Routes>
    </AdminLayout>
  );
}