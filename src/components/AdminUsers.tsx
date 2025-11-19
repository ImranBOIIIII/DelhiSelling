import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Clock, Store } from "lucide-react";
import sellerService from "../services/sellerService";

export default function AdminUsers() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState("");

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const sellersData = await sellerService.getAllSellers();
      setSellers(sellersData);
    } catch (error) {
      console.error("Error loading sellers:", error);
      alert("Failed to load sellers");
    }
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesFilter = 
      filter === "all" || 
      (filter === "active" && seller.isActive) ||
      (filter === "inactive" && !seller.isActive);
    
    const matchesSearch =
      seller.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.ownerName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleApprove = async (sellerId: string) => {
    if (!confirm("Are you sure you want to approve and activate this seller?")) return;

    try {
      await sellerService.approveSeller(sellerId);
      await loadSellers();
      alert("Seller approved successfully!");
    } catch (error) {
      console.error("Error approving seller:", error);
      alert("Failed to approve seller");
    }
  };

  const handleDeactivate = (sellerId: string) => {
    const seller = sellers.find((s) => s.id === sellerId);
    setSelectedSeller(seller);
    setShowDeactivateModal(true);
  };

  const confirmDeactivate = async () => {
    if (!selectedSeller) return;

    try {
      await sellerService.deactivateSeller(selectedSeller.id, deactivationReason);
      await loadSellers();
      setShowDeactivateModal(false);
      setDeactivationReason("");
      setSelectedSeller(null);
      alert("Seller deactivated successfully!");
    } catch (error) {
      console.error("Error deactivating seller:", error);
      alert("Failed to deactivate seller");
    }
  };

  const handleActivate = async (sellerId: string) => {
    if (!confirm("Are you sure you want to activate this seller?")) return;

    try {
      await sellerService.activateSeller(sellerId);
      await loadSellers();
      alert("Seller activated successfully!");
    } catch (error) {
      console.error("Error activating seller:", error);
      alert("Failed to activate seller");
    }
  };

  const handleDelete = async (sellerId: string) => {
    if (!confirm("Are you sure you want to permanently delete this seller? This action cannot be undone.")) return;

    try {
      await sellerService.deleteSeller(sellerId);
      await loadSellers();
      alert("Seller deleted successfully!");
    } catch (error) {
      console.error("Error deleting seller:", error);
      alert("Failed to delete seller");
    }
  };

  const handleViewDetails = (seller: any) => {
    setSelectedSeller(seller);
    setShowDetailsModal(true);
  };



  const getStatusBadge = (seller: any) => {
    if (seller.isActive && seller.isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active & Verified
        </span>
      );
    } else if (seller.isActive && !seller.isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Active (Unverified)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </span>
      );
    }
  };

  const activeCount = sellers.filter((s) => s.isActive).length;
  const inactiveCount = sellers.filter((s) => !s.isActive).length;
  const verifiedCount = sellers.filter((s) => s.isVerified).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Seller Management
            </h3>
            <p className="text-gray-600 mt-1">
              Review and manage seller registration requests
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sellers</p>
                <p className="text-2xl font-bold text-gray-900">{sellers.length}</p>
              </div>
              <Store className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Active</p>
                <p className="text-2xl font-bold text-green-900">{activeCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Inactive</p>
                <p className="text-2xl font-bold text-red-900">{inactiveCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Verified</p>
                <p className="text-2xl font-bold text-blue-900">{verifiedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Sellers
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by store name, email, or owner..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Sellers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No sellers found
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Store className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {seller.storeName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {seller.ownerName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{seller.email}</div>
                      <div className="text-sm text-gray-500">
                        {seller.contactNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {seller.businessType}
                      </div>
                      <div className="text-sm text-gray-500">
                        GST: {seller.gstNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(seller.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(seller)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewDetails(seller)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!seller.isVerified && (
                          <button
                            onClick={() => handleApprove(seller.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve & Verify"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {seller.isActive ? (
                          <button
                            onClick={() => handleDeactivate(seller.id)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            title="Deactivate"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(seller.id)}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            title="Activate"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(seller.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Seller Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Status
                </h4>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedSeller)}
                  </div>
                  {selectedSeller.status === "approved" && selectedSeller.approvedAt && (
                    <span className="text-sm text-gray-500">
                      Approved on{" "}
                      {new Date(selectedSeller.approvedAt).toLocaleDateString()}
                    </span>
                  )}
                  {selectedSeller.status === "rejected" && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-red-900">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{selectedSeller.rejectionReason}</p>
                    </div>
                  )}
                  {selectedSeller.status === "suspended" && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-orange-900">Suspension Reason:</p>
                      <p className="text-sm text-orange-700">{selectedSeller.suspendReason}</p>
                      {selectedSeller.suspendedAt && (
                        <p className="text-xs text-orange-600 mt-1">
                          Suspended on {new Date(selectedSeller.suspendedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                  {selectedSeller.status === "terminated" && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Termination Reason:</p>
                      <p className="text-sm text-gray-700">{selectedSeller.terminateReason}</p>
                      {selectedSeller.terminatedAt && (
                        <p className="text-xs text-gray-600 mt-1">
                          Terminated on {new Date(selectedSeller.terminatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Business Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Company Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSeller.companyName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Store Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSeller.storeName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Business Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {selectedSeller.businessType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">GST Number</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSeller.gstNumber}
                    </p>
                  </div>
                  {selectedSeller.udyamCertificate && (
                    <div>
                      <p className="text-xs text-gray-500">Udyam Certificate</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedSeller.udyamCertificate}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Owner Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Owner Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSeller.ownerName}
                    </p>
                  </div>
                  {selectedSeller.ownerAadhar && (
                    <div>
                      <p className="text-xs text-gray-500">Aadhar Number</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedSeller.ownerAadhar}
                      </p>
                    </div>
                  )}
                  {selectedSeller.ownerPan && (
                    <div>
                      <p className="text-xs text-gray-500">PAN Number</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedSeller.ownerPan}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSeller.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact Number</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSeller.contactNumber}
                    </p>
                  </div>
                  {selectedSeller.alternateNumber && (
                    <div>
                      <p className="text-xs text-gray-500">Alternate Number</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedSeller.alternateNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Address
                </h4>
                <p className="text-sm text-gray-900">{selectedSeller.address}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedSeller.district}, {selectedSeller.state} -{" "}
                  {selectedSeller.pincode}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                {!selectedSeller.isVerified && (
                  <button
                    onClick={() => {
                      handleApprove(selectedSeller.id);
                      setShowDetailsModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve & Verify
                  </button>
                )}
                {selectedSeller.isActive ? (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleDeactivate(selectedSeller.id);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleActivate(selectedSeller.id);
                      setShowDetailsModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleDelete(selectedSeller.id);
                  }}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Deactivate Seller
              </h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to deactivate{" "}
                <span className="font-semibold">{selectedSeller.storeName}</span>?
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deactivation Reason (Optional)
                </label>
                <textarea
                  value={deactivationReason}
                  onChange={(e) => setDeactivationReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter reason for deactivation..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeactivateModal(false);
                    setDeactivationReason("");
                    setSelectedSeller(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeactivate}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm Deactivation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
