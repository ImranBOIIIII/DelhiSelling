import { useState, useEffect } from 'react';
import { Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Category, Product } from '../types';
import firebaseAdminService from '../services/firebaseAdminService';

interface CategoriesPageProps {
  categories?: Category[];
  onNavigate: (page: string, id?: string) => void;
}

const bagCategories = [
  {
    id: 'ladies-purse',
    name: 'Ladies Purse',
    slug: 'ladies-purse',
    description: 'Elegant purses and handbags for women',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 45
  },
  {
    id: 'gents-wallet',
    name: 'Gents Wallet',
    slug: 'gents-wallet', 
    description: 'Premium wallets for men',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 32
  },
  {
    id: 'school-bags',
    name: 'School Bags',
    slug: 'school-bags',
    description: 'Durable school bags for students',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 68
  },
  {
    id: 'laptop-bags',
    name: 'Laptop Bags',
    slug: 'laptop-bags',
    description: 'Protective laptop and computer bags',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 29
  },
  {
    id: 'tiffin-bags',
    name: 'Tiffin Bags',
    slug: 'tiffin-bags',
    description: 'Insulated lunch and tiffin carriers',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 23
  },
  {
    id: 'summer-bags',
    name: 'Summer Bags',
    slug: 'summer-bags',
    description: 'Light and breezy bags for summer',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 34
  },
  {
    id: 'trolly-bags',
    name: 'Trolly Bags',
    slug: 'trolly-bags',
    description: 'Wheeled trolley bags for travel',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 18
  },
  {
    id: 'suitcase',
    name: 'Suitcase',
    slug: 'suitcase',
    description: 'Hard and soft shell suitcases',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 41
  },
  {
    id: 'slider-bags',
    name: 'Slider Bags',
    slug: 'slider-bags',
    description: 'Convenient slider compartment bags',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 27
  },
  {
    id: 'gym-bags',
    name: 'Gym Bags',
    slug: 'gym-bags',
    description: 'Sports and fitness equipment bags',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 35
  },
  {
    id: 'office-bags',
    name: 'Office Bags',
    slug: 'office-bags',
    description: 'Professional bags for office use',
    imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 52
  }
];

export default function CategoriesPage({ categories, onNavigate }: CategoriesPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products to calculate counts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await firebaseAdminService.getAdminProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Calculate product count for each category
  const getCategoryProductCount = (categoryId: string): number => {
    return products.filter(product => product.categoryId === categoryId).length;
  };

  // Use passed categories or fallback to hardcoded ones
  const displayCategories = categories && categories.length > 0 ? categories : bagCategories;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our extensive range of bag categories. Each category offers bulk pricing and minimum order quantities perfect for retailers and businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
                onClick={() => onNavigate('category', category.id)}
              >
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    {loading ? '...' : `${getCategoryProductCount(category.id)} Products`}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Bulk Available
                    </span>
                    <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Place a Bulk Order?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us for custom quotes and special bulk pricing. We serve retailers, institutions, and businesses nationwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>Contact for Quote</span>
            </Link>
            <Link
              to="/products"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all inline-flex items-center justify-center space-x-2"
            >
              <span>View All Products</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}