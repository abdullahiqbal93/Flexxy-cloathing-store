import { Route, Routes, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@/lib/store/features/user/userSlice.js';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { ArrowUp } from 'lucide-react';
import UnauthPage from '@/pages/client/unauth-page.jsx';
import AuthPage from '@/pages/login.jsx';
import ForgotPassword from '@/pages/client/forgot-password.jsx';
import ResetPasswordPage from '@/pages/client/reset-password.jsx';
import CheckAuth from '@/components/check-auth.jsx';
import AdminDashboard from '@/pages/admin/dashboard.jsx';
import AdminProductPage from '@/pages/admin/product.jsx';
import HomePage from '@/pages/client/home.jsx';
import ShoppingPage from '@/pages/client/shop.jsx';
import CheckoutPage from '@/pages/client/checkout.jsx';
import ProductDetailPage from '@/pages/client/product.jsx';
import ProductListPage from '@/pages/admin/product_list.jsx';
import AdminUserListPage from '@/pages/admin/userList.jsx';
import AdminOrderListPage from "@/pages/admin/order.jsx";
import AdminLayout from '@/components/admin/adminLayout.jsx';
import AdminSettings from '@/components/admin/adminSettings.jsx';
import ProfilePage from '@/pages/client/profile.jsx';
import PaypalReturnPage from '@/pages/client/paypal-return.jsx';
import PaymentSuccessPage from '@/pages/client/payment-success.jsx';
import PaypalCancelPage from '@/pages/client/paypal-cancel.jsx';
import NotFound from '@/pages/client/not-found.jsx';
import PaymentFailedPage from '@/pages/client/payment-failed.jsx';
import NewsletterManagement from './pages/admin/newsletter.jsx';
import ScrollToTop from '@/components/scrollToTop.js';
import { fetchWishlist } from '@/lib/store/features/wishlist/wishlistSlice';

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken')
    dispatch(checkAuth(token));

    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <Skeleton className="w-[100px] h-[20px] rounded-full" />;

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route
          path="/login"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthPage />
            </CheckAuth>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <HomePage />
            </CheckAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="product" element={<AdminProductPage />} />
          <Route path="product/:id" element={<AdminProductPage />} />
          <Route path="productList" element={<ProductListPage />} />
          <Route path="userList" element={<AdminUserListPage />} />
          <Route path="order" element={<AdminOrderListPage />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="newsletter" element={<NewsletterManagement />} />

        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Outlet />
            </CheckAuth>
          }
        >
          <Route path="home" element={<HomePage />} />
          <Route path="listing" element={<ShoppingPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path='paypal-return' element={<PaypalReturnPage />} />
          <Route path='paypal-cancel' element={<PaypalCancelPage />} />
          <Route path='payment-success' element={<PaymentSuccessPage />} />
          <Route path='payment-failed' element={<PaymentFailedPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center w-12 h-12"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
}

export default App;
