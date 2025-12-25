import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../logo.webp";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const navigate = useNavigate();

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
    <footer className="hidden md:block bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={logo}
                alt="Delhi Selling logo"
                className="w-10 h-10 rounded-lg object-contain bg-white"
              />
              <span className="text-xl font-bold text-white">
                Delhi Selling
              </span>
            </div>
            <p className="text-sm mb-4">
              Your trusted partner for bulk bag solutions. Premium quality,
              competitive pricing, and reliable service for all your business
              needs.
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
                <Link
                  to="/products"
                  className="hover:text-blue-400 transition-colors"
                >
                  Shop Now
                </Link>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("deals")}
                  className="hover:text-blue-400 transition-colors"
                >
                  Deals & Offers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("categories")}
                  className="hover:text-blue-400 transition-colors"
                >
                  Brands
                </button>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate("faq")}
                  className="hover:text-blue-400 transition-colors"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("shipping")}
                  className="hover:text-blue-400 transition-colors"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("returns")}
                  className="hover:text-blue-400 transition-colors"
                >
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("privacy")}
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("terms")}
                  className="hover:text-blue-400 transition-colors"
                >
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
                <span>+91 92052 500690</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>support@delhiselling.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025{" "}
              <span onClick={handleAdminClick} style={{ cursor: "text" }}>
                Delhi Selling
              </span>
              . All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <button
                onClick={() => onNavigate("privacy")}
                className="hover:text-blue-400 transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={() => onNavigate("terms")}
                className="hover:text-blue-400 transition-colors"
              >
                Terms
              </button>
              <button
                onClick={() => onNavigate("sitemap")}
                className="hover:text-blue-400 transition-colors"
              >
                Sitemap
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
