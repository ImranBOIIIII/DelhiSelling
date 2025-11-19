import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Store, MapPin, User, Lock, Building } from "lucide-react";
import sellerService from "../services/sellerService";

export default function SellerRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Company/Business Details
    companyName: "",
    storeName: "",
    gstNumber: "",
    udyamCertificate: "",
    businessType: "individual",
    
    // Contact Information
    contactNumber: "",
    alternateNumber: "",
    email: "",
    
    // Owner/Personal Details
    ownerName: "",
    ownerAadhar: "",
    ownerPan: "",
    
    // Address Details
    address: "",
    district: "",
    state: "",
    pincode: "",
    

    // Account Security
    password: "",
    confirmPassword: "",
    
    // Additional
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Company Details
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.storeName.trim()) newErrors.storeName = "Store name is required";
    if (!formData.gstNumber.trim()) newErrors.gstNumber = "GST number is required";
    
    // Contact Information
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = "Contact must be 10 digits";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    
    // Owner Details
    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
    
    // Address Details
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.district.trim()) newErrors.district = "District is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits";
    

    // Password
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Register seller in Firebase
      await sellerService.registerSeller({
        email: formData.email,
        ownerName: formData.ownerName,
        storeName: formData.storeName,
        phone: formData.contactNumber,
        address: formData.address,
        city: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        gstNumber: formData.gstNumber,
        panNumber: formData.ownerPan,
        businessType: formData.businessType,
        isActive: true,
        isVerified: false,
      });
      
      setIsSubmitting(false);
      alert("Registration successful! Your account is pending admin approval. You will be able to login once an administrator verifies your account.");
      navigate("/seller-login");
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.message.includes("already exists")) {
        setErrors({ email: "Email already registered" });
      } else {
        alert("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <Store className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Become a Seller</h1>
          <p className="text-lg text-gray-600">Join thousands of sellers and grow your business with us</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company/Business Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Company/Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.companyName ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter company name"
                  />
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.storeName ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter store name"
                  />
                  {errors.storeName && <p className="text-red-500 text-xs mt-1">{errors.storeName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number *</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.gstNumber ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter GST number"
                  />
                  {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Udyam Certificate Number</label>
                  <input
                    type="text"
                    name="udyamCertificate"
                    value={formData.udyamCertificate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Udyam certificate number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="individual">Individual</option>
                    <option value="proprietorship">Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="company">Private Limited Company</option>
                    <option value="llp">Limited Liability Partnership (LLP)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Store className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.contactNumber ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter 10-digit contact number"
                  />
                  {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
                  <input
                    type="tel"
                    name="alternateNumber"
                    value={formData.alternateNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter alternate number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email ID *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Owner/Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Owner/Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ownerName ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter owner full name"
                  />
                  {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Aadhar Number</label>
                  <input
                    type="text"
                    name="ownerAadhar"
                    value={formData.ownerAadhar}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength={12}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner PAN Number</label>
                  <input
                    type="text"
                    name="ownerPan"
                    value={formData.ownerPan}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter PAN number"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Address Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter complete business address"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.district ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter district"
                    />
                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.state ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">Select State</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.pincode ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-blue-600" />
                Account Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter password (min 8 characters)"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Registering..." : "Register as Seller"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have a seller account?{" "}
              <Link to="/seller-login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
