import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Package, Heart, MapPin, LogOut } from 'lucide-react';
import ProfileSection from '../components/account/ProfileSection';
import OrderHistory from '../components/account/OrderHistory';
import WishlistSection from '../components/account/WishlistSection';
import AddressManagement from '../components/account/AddressManagement';
// Replace localStorage-based authService with Firebase auth service
import firebaseAuthService from '../services/firebaseAuthService';

type AccountSection = 'profile' | 'orders' | 'wishlist' | 'addresses';

interface AccountPageProps {
  onNavigate: (page: string, id?: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export default function AccountPage({ onNavigate, wishlistIds, onToggleWishlist }: AccountPageProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AccountSection>('profile');
  const [user, setUser] = useState(firebaseAuthService.getCurrentUser());

  // Check if user is authenticated
  useEffect(() => {
    const currentUser = firebaseAuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  // If no user, don't render anything (navigation will redirect)
  if (!user) {
    return null;
  }

  const sidebarItems = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'orders', label: 'Order History', icon: Package },
    { key: 'wishlist', label: 'Wishlist', icon: Heart },
    { key: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  const handleLogout = async () => {
    await firebaseAuthService.logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection user={user} />;
      case 'orders':
        return <OrderHistory onNavigate={onNavigate} />;
      case 'wishlist':
        return <WishlistSection wishlistIds={wishlistIds} onNavigate={onNavigate} onToggleWishlist={onToggleWishlist} />;
      case 'addresses':
        return <AddressManagement />;
      default:
        return <ProfileSection user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key as AccountSection)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === item.key
                          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm min-h-[600px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}