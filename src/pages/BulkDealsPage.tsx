import { useMemo, useState } from 'react';
import { Package, TrendingUp, Shield, Truck, Mail, Phone } from 'lucide-react';
import { redirectToWhatsApp } from '../utils/whatsappUtils';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface BulkDealsPageProps {
  products: Product[];
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
}

export default function BulkDealsPage({
  products,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}: BulkDealsPageProps) {
  // Derive top bulk offers (prioritize featured, then lowest min order qty)
  const topBulkOffers = useMemo(() => {
    const withScore = products.map(p => {
      const minTier = p.bulkPricing && p.bulkPricing.length > 0
        ? Math.min(...p.bulkPricing.map(t => t.quantity))
        : p.minOrderQuantity;
      const score = (p.isFeatured ? 0 : 1000) + minTier; // lower is better
      return { product: p, score };
    });
    return withScore
      .sort((a, b) => a.score - b.score)
      .slice(0, 6)
      .map(x => x.product);
  }, [products]);

  // Simple inquiry form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [productInterest, setProductInterest] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare form data for WhatsApp
    const formDataForWhatsApp = {
      name,
      email,
      phone,
      company,
      quantity: quantity || 'Not specified',
      productInterest: productInterest || 'Not specified',
      message: message || 'No additional message',
      timestamp: new Date().toLocaleString()
    };
    
    // Redirect to WhatsApp with form data
    redirectToWhatsApp(formDataForWhatsApp, 'Bulk Order Inquiry');
    
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setQuantity('');
    setProductInterest('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Bulk Deals & Wholesale Pricing</h1>
              <p className="mt-3 text-gray-600">
                Buy premium bags in bulk at wholesale rates. Ideal for retailers, corporates, and institutions.
                Flexible MOQ, reliable fulfillment, and Pan-India delivery.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onNavigate('contact')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Contact Sales
                </button>
                <button
                  onClick={() => onNavigate('products')}
                  className="bg-white border border-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Browse All Products
                </button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>Pan-India Delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span>Wholesale Rates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span>Large Stock Availability</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Top Bulk Offers */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Bulk Offers</h2>
              <p className="text-gray-600 mt-1">Best-sellers with attractive bulk pricing</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="hidden md:inline text-blue-600 hover:text-blue-700 font-medium"
            >
              View all products
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {topBulkOffers.map((product) => (
              <div key={product.id} className="relative">
                {/* Badge */}
                <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  Bulk Pricing
                </div>
                <ProductCard
                  product={product}
                  onNavigate={onNavigate}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isInWishlist={wishlistIds.includes(product.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold text-gray-900">Request a Bulk Quote</h3>
              <p className="mt-2 text-gray-600">
                Tell us what you need and our team will get back with the best pricing and delivery timelines.
              </p>
              <div className="mt-6 space-y-3 text-gray-700">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>support@delhiselling.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company (optional)</label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product of Interest</label>
                    <input
                      type="text"
                      placeholder="e.g., School Bags, Office Briefcase"
                      value={productInterest}
                      onChange={e => setProductInterest(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share any specific requirements like materials, colors, branding, or delivery timelines."
                  />
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Request Quote via Email
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="bg-white border border-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
