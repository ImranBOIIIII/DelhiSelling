import { Users, Award, Truck, Heart, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo.webp';

export default function AboutPage() {
  const navigate = useNavigate();
  
  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About Delhi Selling</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
           
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in the heart of New Delhi, Delhi Selling started with a simple mission: to make premium smartphones accessible to everyone while maintaining the highest standards of quality and customer service.
              </p>
              <p>
                Over the years, we've grown from a small local store to one of India's most trusted online mobile phone retailers. Our commitment to authenticity, competitive pricing, and customer satisfaction has earned us the trust of over 10,000 happy customers.
              </p>
              <p>
                We carefully curate our product selection, working directly with authorized distributors and manufacturers to ensure every device we sell is 100% genuine and comes with proper warranty coverage.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="About Delhi Selling"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Authentic</h3>
              <p className="text-gray-600">
                All products are sourced from authorized distributors with proper warranty
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Free and fast delivery on all orders above ₹500 across India
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Dedicated customer support team ready to help you 24/7
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority with easy returns and refunds
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Our Numbers Speak</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Products Available</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.8★</div>
              <div className="text-blue-200">Average Rating</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4+</div>
              <div className="text-blue-200">Years of Service</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only footer section */}
      <div className="md:hidden bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={logo} alt="Delhi Selling logo" className="w-10 h-10 rounded-lg object-contain bg-white" />
                <span className="text-xl font-bold text-white">
                  <span 
                    onClick={handleAdminClick}
                    style={{ cursor: 'text' }}
                  >
                    Delhi Selling
                  </span>
                </span>
              </div>
              <p className="text-sm mb-4">
                Your trusted destination for premium mobile phones. Quality products, unbeatable prices, and exceptional service.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-pink-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-red-400 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="hover:text-blue-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-blue-400 transition-colors">
                    Shop Now
                  </Link>
                </li>
                <li>
                  <button className="hover:text-blue-400 transition-colors">
                    Deals & Offers
                  </button>
                </li>
                <li>
                  <button className="hover:text-blue-400 transition-colors">
                    Brands
                  </button>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="hover:text-blue-400 transition-colors">
                    FAQs
                  </button>
                </li>
                <li>
                  <button className="hover:text-blue-400 transition-colors">
                    Shipping & Delivery
                  </button>
                </li>
                <li>
                  <button className="hover:text-blue-400 transition-colors">
                    Returns & Refunds
                  </button>
                </li>
                <li>
                  <button className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="hover:text-blue-400 transition-colors">
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Connaught Place, New Delhi, Delhi 110001, India</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span>support@delhiselling.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col justify-between items-center space-y-4">
              <p className="text-sm text-gray-400 text-center">
                © 2025 <span 
                  onClick={handleAdminClick}
                  style={{ cursor: 'text' }}
                >
                  Delhi Selling
                </span>. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <button className="hover:text-blue-400 transition-colors">
                  Privacy
                </button>
                <button className="hover:text-blue-400 transition-colors">
                  Terms
                </button>
                <button className="hover:text-blue-400 transition-colors">
                  Sitemap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}