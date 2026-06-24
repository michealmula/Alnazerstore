import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header      from './components/Header';
import Footer      from './components/Footer';
import ProductModal from './components/ProductModal';
import Home        from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Favorites   from './pages/Favorites';
import { StoreProvider } from './context/StoreContext';
import { ToastProvider }  from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import { useState, useCallback } from "react";
import SplashScreen from "./components/SplashScreen";

function AppShell() {

  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);



  const location = useLocation();

  // scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
          {!splashDone && <SplashScreen onFinish={handleSplashFinish} />}

      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/category/:key"     element={<CategoryPage />} />
          <Route path="/favorites"         element={<Favorites />} />
          <Route path="*"                  element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <ProductModal />
      <ScrollToTop />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
