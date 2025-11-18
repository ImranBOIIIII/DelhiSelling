import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import Lottie from "lottie-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import ScrollToTop from "./components/ScrollToTop";
import SEO from "./components/SEO";
import UpdateNotification from "./components/UpdateNotification";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginScreen from "./pages/LoginScreen";
import AccountPage from "./pages/AccountPage";

import ContactPage from "./pages/ContactPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import BulkDealsPage from "./pages/BulkDealsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import AdminLayout from "./components/AdminLayout";
import SellerRegistrationPage from "./pages/SellerRegistrationPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import SellerLoginPage from "./pages/SellerLoginPage";
import { categories as mockCategories } from "./data/mockData";
import { Product, CartItem, Category } from "./types";
import { getPageSEO } from "./utils/seo";
import error404Animation from "./animations/Error 404.json";
// Use Firebase services
import firebaseAdminService from "./services/firebaseAdminService";
import firebaseAuthService from "./services/firebaseAuthService";

type Page =
  | "home"
  | "products"
  | "product"
  | "categories"
  | "deals"
  | "cart"
  | "about"
  | "contact"
  | "account"
  | "wishlist"
  | "faq"
  | "shipping"
  | "returns"
  | "privacy"
  | "terms"
  | "sitemap"
  | "category"
  | "checkout"
  | "login";

// AppContent component that uses hooks
function AppContent() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth service
    firebaseAuthService.initializeDefaultUsers();

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlistIds(JSON.parse(savedWishlist));
    }

    // Load products and categories from Firebase admin service
    loadProductsAndCategories();
  }, []);

  const loadProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [adminProducts, adminCategories, adminAllCategories] =
        await Promise.all([
          firebaseAdminService.getAdminProducts(),
          firebaseAdminService.getCategories(),
          firebaseAdminService.getAllActiveCategories(),
        ]);

      setProducts(adminProducts);
      setCategories(
        adminCategories.length > 0 ? adminCategories : mockCategories,
      );
      setAllCategories(
        adminAllCategories.length > 0 ? adminAllCategories : mockCategories,
      );
    } catch (error) {
      console.error("Error loading products and categories:", error);
      // Fallback to mock data
      setCategories(mockCategories);
      setAllCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const handleNavigate = (page: string, id?: string) => {
    if (page === "product" && id) {
      navigate(`/product/${id}`);
    } else if (page === "category" && id) {
      navigate(`/category/${id}`);
    } else if (page === "checkout") {
      navigate("/checkout");
    } else if (page === "login") {
      navigate("/login");
    } else if (page === "account") {
      navigate("/account");
    } else {
      navigate(`/${page === "home" ? "" : page}`);
    }

    // Refresh products and categories when navigating to home, products, or categories page
    if (page === "home" || page === "products" || page === "categories") {
      loadProductsAndCategories();
    }
  };

  const handleToggleCartSidebar = () => {
    setIsCartSidebarOpen(!isCartSidebarOpen);
  };

  const handleCloseCartSidebar = () => {
    setIsCartSidebarOpen(false);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.stockQuantity),
              }
            : item,
        );
      }
      // Use minimum order quantity when adding product for the first time
      const initialQuantity = Math.max(product.minOrderQuantity, 1);
      return [
        ...prev,
        { id: crypto.randomUUID(), product, quantity: initialQuantity },
      ];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  // Show loading state while initializing data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route
            path="/admin/*"
            element={
              <AdminLayout
                onNavigateToSite={() => {
                  loadProductsAndCategories();
                  handleNavigate("home");
                }}
              />
            }
          />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/seller-registration" element={<SellerRegistrationPage />} />
          <Route path="/seller-login" element={<SellerLoginPage />} />
          <Route path="/seller/dashboard" element={<Navigate to="/seller/dashboard/home" replace />} />
          <Route path="/seller/dashboard/:tab" element={<SellerDashboardPage />} />
          <Route
            path="/404"
            element={
              <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="w-full max-w-2xl mx-auto px-4">
                    <Lottie
                      animationData={error404Animation}
                      loop={true}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <button
                    onClick={() => handleNavigate("home")}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg mt-8"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            }
          />
          <Route
            path="/*"
            element={
              <>
                <Header
                  onNavigate={handleNavigate}
                  onToggleCart={handleToggleCartSidebar}
                  cartItemCount={cartItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  )}
                  products={products}
                />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage
                        products={products}
                        categories={categories}
                        onNavigate={handleNavigate}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        wishlistIds={wishlistIds}
                      />
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <ProductListingPage
                        products={products}
                        onNavigate={handleNavigate}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        wishlistIds={wishlistIds}
                      />
                    }
                  />
                  <Route
                    path="/product/:slug"
                    element={
                      <ProductDetailRoute
                        onNavigate={handleNavigate}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        wishlistIds={wishlistIds}
                      />
                    }
                  />
                  <Route
                    path="/categories"
                    element={
                      <CategoriesPage
                        categories={allCategories}
                        onNavigate={handleNavigate}
                      />
                    }
                  />
                  <Route
                    path="/category/:categoryId"
                    element={
                      <CategoryProductsRoute
                        onNavigate={handleNavigate}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        wishlistIds={wishlistIds}
                      />
                    }
                  />
                  <Route
                    path="/deals"
                    element={
                      <BulkDealsPage
                        products={products}
                        onNavigate={handleNavigate}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        wishlistIds={wishlistIds}
                      />
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <SearchResultsPage
                        products={products}
                        onNavigate={handleNavigate}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        wishlistIds={wishlistIds}
                      />
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <CartPage
                        cartItems={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveFromCart}
                        onNavigate={handleNavigate}
                      />
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <CheckoutPage
                        cartItems={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveFromCart}
                      />
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <AccountPage
                        onNavigate={handleNavigate}
                        wishlistIds={wishlistIds}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    }
                  />

                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <Footer onNavigate={handleNavigate} />
              </>
            }
          />
        </Routes>
      </main>
      <CartSidebar
        isOpen={isCartSidebarOpen}
        onClose={handleCloseCartSidebar}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

// Product detail route component to handle URL params
function ProductDetailRoute({
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}: {
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
}) {
  const { slug } = useParams<{ slug: string }>();

  // Get products from Firebase admin service
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const products = await firebaseAdminService.getAdminProducts();
        const product = products.find((p) => p.slug === slug) || null;
        setSelectedProduct(product);

        if (product) {
          const related = products.filter(
            (p) => p.slug !== product.slug && p.brand === product.brand,
          );
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!selectedProduct) {
    // Navigate to 404 page
    window.location.href = "/404";
    return null;
  }

  return (
    <ProductDetailPage
      product={selectedProduct}
      relatedProducts={relatedProducts}
      onNavigate={onNavigate}
      onAddToCart={onAddToCart}
      onToggleWishlist={onToggleWishlist}
      isInWishlist={wishlistIds.includes(selectedProduct.id)}
    />
  );
}

// Category products route component to handle URL params
function CategoryProductsRoute({
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}: {
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
}) {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Get category name from Firebase admin service
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        const categories = await firebaseAdminService.getAllActiveCategories();
        const category = categories.find((c) => c.id === categoryId) || null;
        setSelectedCategory(category);
      } catch (error) {
        console.error("Error loading category:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!selectedCategory) {
    // Navigate to 404 page
    window.location.href = "/404";
    return null;
  }

  return (
    <CategoryProductsPage
      categoryId={selectedCategory.id}
      categoryName={selectedCategory.name}
      onNavigate={onNavigate}
      onAddToCart={onAddToCart}
      onToggleWishlist={onToggleWishlist}
      wishlistIds={wishlistIds}
    />
  );
}

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
