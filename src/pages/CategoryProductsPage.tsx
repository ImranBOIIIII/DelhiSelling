import { useState, useEffect } from "react";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
// Replace localStorage-based adminService with Firebase admin service
import firebaseAdminService from "../services/firebaseAdminService";
import firebaseService from "../services/firebaseService";

interface CategoryProductsPageProps {
  categoryId: string;
  categoryName: string;
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
}

export default function CategoryProductsPage({
  categoryId,
  categoryName,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}: CategoryProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load products for this category
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await firebaseAdminService.getAdminProducts();
        const categoryProducts = allProducts.filter(
          (product) => product.categoryId === categoryId,
        );
        setProducts(categoryProducts);
      } catch (error) {
        console.error("Error loading category products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();

    // Set up real-time listener for products
    const unsubscribe = firebaseService.onProductsChange((updatedProducts) => {
      const categoryProducts = updatedProducts.filter(
        (product) => product.categoryId === categoryId,
      );
      setProducts(categoryProducts);
    });

    // Clean up listener
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate("categories")}
              className="text-blue-600 hover:text-blue-800 flex items-center mr-4"
            >
              <span className="text-lg">←</span>
              <span className="ml-2">Back to Categories</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
          </div>
          <p className="mt-2 text-gray-600">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            found in this category
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={wishlistIds.includes(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No products found
            </h3>
            <p className="text-gray-500">
              There are currently no products in the {categoryName} category.
            </p>
            <button
              onClick={() => onNavigate("categories")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Browse Other Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
