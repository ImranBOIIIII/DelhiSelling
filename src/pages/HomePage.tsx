import {
  Package,
  TrendingUp,
  Shield,
  Truck,
  Megaphone,
  Sparkles,
  Loader,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Product, Category } from "../types";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";
import { getPageSEO } from "../utils/seo";
import DoodleUnderline from "../components/DoodleUnderline";
import firebaseAdminService from "../services/firebaseAdminService";
import firebaseService from "../services/firebaseService";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

interface HomePageProps {
  products: Product[];
  categories: Category[];
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
}

export default function HomePage({
  products: _,
  categories,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}: HomePageProps) {
  const [homepageContent, setHomepageContent] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const observer = useRef<IntersectionObserver>();

  // Fetch products with pagination
  const fetchProducts = useCallback(async (isReset = false) => {
    if (loadingMore && !isReset) return;

    if (isReset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const currentLastDoc = isReset ? null : lastDoc;

      const { products: newProducts, lastVisible } = await firebaseService.getProductsPaginated(
        currentLastDoc,
        12, // Load 12 items at a time
        {
          sortBy: "featured" // Show featured products first
        }
      );

      setProducts((prev) => {
        if (isReset) return newProducts;
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNew = newProducts.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });

      setLastDoc(lastVisible);
      setHasMore(newProducts.length >= 12);

    } catch (error) {
      console.error("Error loading products", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [loadingMore, lastDoc]);

  // Initial load
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await firebaseAdminService.getHomepageContent();
        if (content) {
          setHomepageContent(content);
        }
      } catch (error) {
        console.error("Error loading homepage content:", error);
      }
    };

    loadContent();
    fetchProducts(true);

    // Set up real-time listener for homepage content
    const unsubscribeHomepage = firebaseService.onHomepageContentChange(
      (content) => {
        if (content) {
          setHomepageContent(content);
        }
      },
    );

    return () => {
      unsubscribeHomepage();
    };
  }, []);

  // Infinite scroll observer
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchProducts(false);
      }
    });

    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, fetchProducts]);

  const showCategories = homepageContent?.showCategories ?? true;
  const showFeatures = homepageContent?.showFeatures ?? true;

  // Use banners from admin or fallback to default
  const bannerSlides = homepageContent?.banners?.filter(
    (b: any) => b.isActive,
  ) || [
      {
        id: "1",
        image:
          "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1920",
        title: "Quality Bags in",
        subtitle: "Bulk Quantities",
        description:
          "Wholesale bags for retailers. School bags, office bags, travel gear and more.",
        isActive: true,
        order: 1,
      },
    ];

  // Use news from admin or fallback to default
  const newsItems = homepageContent?.marqueeNews?.filter(
    (n: any) => n.isActive,
  ) || [
      {
        id: "1",
        icon: "sparkles" as const,
        text: "New winter collection just dropped — bulk discounts available",
        isActive: true,
        order: 1,
      },
      {
        id: "2",
        icon: "megaphone" as const,
        text: "Free delivery on bulk orders above ₹50,000 across India",
        isActive: true,
        order: 2,
      },
    ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerSlides.length]);

  // Show loading state while initializing data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading homepage...</p>
        </div>
      </div>
    );
  }

  const homeSEO = getPageSEO('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO {...homeSEO} />
      {/* Sliding Image Banner */}
      <section className="relative h-56 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
        <div className="relative w-full h-full">
          {bannerSlides.map((slide: any, index: number) => (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                  ? "-translate-x-full"
                  : "translate-x-full"
                }`}
            >
              <img
                src={slide.image}
                alt={`${slide.title} ${slide.subtitle}`}
                className="w-full h-full object-cover object-center"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20 sm:from-black/60 sm:via-black/40 sm:to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-full sm:max-w-2xl text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight transform transition-all duration-700 delay-300">
                      {slide.title}
                      <span className="block text-cyan-300">
                        {slide.subtitle}
                      </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 sm:mb-8 leading-relaxed transform transition-all duration-700 delay-500 px-2 sm:px-0">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerSlides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
            />
          ))}
        </div>
      </section>

      {/* News Ticker */}
      <section className="border-y border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="relative overflow-hidden group">
          {/* Seamless scrolling container */}
          <div className="whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
            {[...newsItems, ...newsItems].map((item: any, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 text-sm text-gray-800/90 px-6 py-3"
              >
                {item.icon === "megaphone" ? (
                  <Megaphone className="w-4 h-4 text-blue-600" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-500" />
                )}
                <span className="font-medium">{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Show/Hide based on admin settings */}
      {showCategories && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Shop by{" "}
                  <span className="inline-block relative">
                    Category
                    <DoodleUnderline className="absolute left-0 right-0 -bottom-1" />
                  </span>
                </h2>
                <p className="text-gray-600 mt-2">
                  Explore our collection of premium bag categories
                </p>
              </div>
            </div>

            {/* Horizontal Scrolling Categories for Mobile */}
            <div className="md:hidden">
              <div className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onNavigate("category", category.id)}
                    className="flex-shrink-0 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group w-32"
                  >
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors text-xs leading-tight">
                      {category.name}
                    </h3>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onNavigate("category", category.id)}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section with Infinite Scroll */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Our{" "}
              <span className="inline-block relative">
                Products
                <DoodleUnderline className="absolute left-0 right-0 -bottom-1" />
              </span>
            </h2>
            <p className="text-gray-600 mt-2">
              Discover our complete collection of premium bags
            </p>
          </div>

          {products.length === 0 && !loadingMore ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product, index) => {
                  const isLast = index === products.length - 1;
                  return (
                    <div key={product.id} ref={isLast ? lastElementRef : null}>
                      <ProductCard
                        product={product}
                        onNavigate={onNavigate}
                        onAddToCart={onAddToCart}
                        onToggleWishlist={onToggleWishlist}
                        isInWishlist={wishlistIds.includes(product.id)}
                      />
                    </div>
                  );
                })}
              </div>

              {loadingMore && (
                <div className="py-8 flex justify-center w-full">
                  <Loader className="animate-spin text-blue-600 w-8 h-8" />
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div className="py-8 text-center text-gray-500 text-sm">
                  You have reached the end of the list
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section - Show/Hide based on admin settings */}
      {showFeatures && (
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Free Delivery</h3>
                  <p className="text-sm text-gray-600">
                    On bulk orders above ₹50,000
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Secure Payment
                  </h3>
                  <p className="text-sm text-gray-600">100% secure checkout</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Quality Products
                  </h3>
                  <p className="text-sm text-gray-600">100% genuine bags</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Bulk Pricing</h3>
                  <p className="text-sm text-gray-600">Wholesale rates</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
