import { useState } from "react";
import { Bell, Mail, Smartphone, Save, Check } from "lucide-react";
import { NotificationPreferences } from "../../types";

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    promotionalEmails: false,
    smsNotifications: true,
    newArrivals: true,
    priceDropAlerts: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, this would make an API call to save preferences

    setIsSaving(false);
    setSaved(true);

    // Reset saved state after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  const notificationOptions = [
    {
      key: "orderUpdates" as keyof NotificationPreferences,
      title: "Order Updates",
      description:
        "Get notified about order status changes, shipping updates, and delivery confirmations",
      icon: <Bell className="w-5 h-5 text-blue-600" />,
      category: "Essential",
    },
    {
      key: "smsNotifications" as keyof NotificationPreferences,
      title: "SMS Notifications",
      description:
        "Receive important order updates and delivery notifications via SMS",
      icon: <Smartphone className="w-5 h-5 text-green-600" />,
      category: "Essential",
    },
    {
      key: "promotionalEmails" as keyof NotificationPreferences,
      title: "Promotional Emails",
      description:
        "Receive newsletters, special offers, and marketing communications",
      icon: <Mail className="w-5 h-5 text-purple-600" />,
      category: "Marketing",
    },
    {
      key: "newArrivals" as keyof NotificationPreferences,
      title: "New Arrivals",
      description:
        "Be the first to know about new products and latest collections",
      icon: <Bell className="w-5 h-5 text-orange-600" />,
      category: "Marketing",
    },
    {
      key: "priceDropAlerts" as keyof NotificationPreferences,
      title: "Price Drop Alerts",
      description:
        "Get notified when items in your wishlist go on sale or have price drops",
      icon: <Bell className="w-5 h-5 text-red-600" />,
      category: "Marketing",
    },
  ];

  const essentialOptions = notificationOptions.filter(
    (option) => option.category === "Essential",
  );
  const marketingOptions = notificationOptions.filter(
    (option) => option.category === "Marketing",
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Notification Preferences
          </h2>
          <p className="text-gray-600 mt-2">
            Manage how you want to receive updates from us
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || saved}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            saved
              ? "bg-green-600 text-white"
              : isSaving
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-8">
        {/* Essential Notifications */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Essential Notifications
          </h3>
          <p className="text-gray-600 mb-6">
            These notifications help you stay updated about your orders and
            account security.
          </p>

          <div className="space-y-4">
            {essentialOptions.map((option) => (
              <div
                key={option.key}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">{option.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {option.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleToggle(option.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences[option.key] ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences[option.key]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Notifications */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Marketing & Promotional
          </h3>
          <p className="text-gray-600 mb-6">
            Control how you receive marketing communications and promotional
            content.
          </p>

          <div className="space-y-4">
            {marketingOptions.map((option) => (
              <div
                key={option.key}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">{option.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {option.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleToggle(option.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences[option.key] ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences[option.key]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setPreferences({
                  orderUpdates: true,
                  promotionalEmails: true,
                  smsNotifications: true,
                  newArrivals: true,
                  priceDropAlerts: true,
                });
                setSaved(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Enable All
            </button>
            <button
              onClick={() => {
                setPreferences({
                  orderUpdates: true,
                  promotionalEmails: false,
                  smsNotifications: true,
                  newArrivals: false,
                  priceDropAlerts: false,
                });
                setSaved(false);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Essential Only
            </button>
            <button
              onClick={() => {
                setPreferences({
                  orderUpdates: false,
                  promotionalEmails: false,
                  smsNotifications: false,
                  newArrivals: false,
                  priceDropAlerts: false,
                });
                setSaved(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Disable All
            </button>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📧 Email Preferences
          </h3>
          <div className="text-blue-800 text-sm space-y-2">
            <p>
              • You can unsubscribe from promotional emails at any time using
              the link in our emails
            </p>
            <p>
              • Essential order and security notifications cannot be disabled
              for account safety
            </p>
            <p>
              • Changes to your notification preferences may take up to 24 hours
              to take effect
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
