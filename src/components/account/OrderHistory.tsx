import { useEffect, useState } from "react";
import { Package, Eye, RefreshCw, Star, Calendar, Truck } from "lucide-react";
import { Order } from "../../types";
// Replace localStorage-based services with Firebase services
import firebaseAdminService from '../../services/firebaseAdminService';
import firebaseAuthService from '../../services/firebaseAuthService';

interface OrderHistoryProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function OrderHistory({ onNavigate }: OrderHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const user = firebaseAuthService.getCurrentUser();
      if (!user?.email) {
        setOrders([]);
        return;
      }

      // Get orders from Firebase
      const adminOrders = await firebaseAdminService.getAdminOrders();
      const userOrders = adminOrders
        .filter(
          (o) => o.customerEmail?.toLowerCase() === user.email.toLowerCase(),
        )
        .map<Order>((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          status: o.status,
          totalAmount: o.totalAmount,
          shippingAddress: o.shippingAddress,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          items: o.items,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
        }));
      setOrders(userOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleReorder = (order: Order) => {
    // In a real app, this would add the order items to cart
    alert(`Reordering items from order ${order.orderNumber}`);
  };

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const openTrack = (order: Order) => {
    setSelectedOrder(order);
    setShowTrack(true);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Order History</h2>
        <div className="flex space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="shipped">Shipped</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 mb-6">
            Start shopping to see your orders here!
          </p>
          <button
            onClick={() => onNavigate("products")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} item(s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => openDetails(order)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>

                  {order.status === "delivered" && (
                    <>
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Reorder</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                        <Star className="w-4 h-4" />
                        <span>Rate & Review</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => openTrack(order)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Track Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs text-blue-600 font-medium">
                    Order Number
                  </div>
                  <div className="text-sm font-mono font-bold text-blue-900">
                    {selectedOrder.orderNumber}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="text-sm font-medium capitalize">
                    {selectedOrder.status}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-sm font-medium">
                    ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500">Items</div>
                  <div className="text-sm font-medium">
                    {selectedOrder.items.length}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Shipping Address
                </h4>
                <div className="text-sm text-gray-700">
                  <div>{selectedOrder.shippingAddress.fullName}</div>
                  <div>{selectedOrder.shippingAddress.addressLine1}</div>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <div>{selectedOrder.shippingAddress.addressLine2}</div>
                  )}
                  <div>
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state}{" "}
                    {selectedOrder.shippingAddress.pincode}
                  </div>
                  <div>{selectedOrder.shippingAddress.phone}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-14 h-14 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </div>
                        <div className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        ₹{item.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Track Order Modal */}
      {showTrack && selectedOrder && (
        <TrackOrderModal
          order={selectedOrder}
          onClose={() => setShowTrack(false)}
        />
      )}
    </div>
  );
}

const TrackOrderModal = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => {
  const [logs, setLogs] = useState<{ label: string; time: string }[]>([]);

  useEffect(() => {
    // Using Firebase admin service
    const loadOrderLogs = async () => {
      try {
        // In a real implementation, you would fetch logs from Firebase
        // For now, we'll simulate with sample data
        const sampleLogs = [
          { label: "Order Placed", time: order.createdAt },
          {
            label: "Order Confirmed",
            time: new Date(
              new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            label: "Order Shipped",
            time: new Date(
              new Date(order.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            label: "Out for Delivery",
            time: new Date(
              new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ];
        setLogs(sampleLogs);
      } catch (error) {
        console.error("Error loading order logs:", error);
      }
    };

    loadOrderLogs();
  }, [order.id]);

  // Define the checkpoints with their labels and status mappings
  const checkpoints = [
    { label: "Placed", status: "pending" },
    { label: "Confirmed", status: "confirmed" },
    { label: "Shipped", status: "shipped" },
    { label: "Out for Delivery", status: "out" },
    { label: "Delivered", status: "delivered" },
  ];

  // Determine which checkpoint the order is currently at
  const getCurrentCheckpointIndex = () => {
    const statusMap: Record<string, number> = {
      pending: 0,
      processing: 1,
      confirmed: 1,
      shipped: 2,
      out: 3,
      delivered: 4,
      cancelled: 0,
    };

    return statusMap[order.status] ?? 0;
  };

  const currentCheckpointIndex = getCurrentCheckpointIndex();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Track Order #{order.orderNumber}
            </h3>
            <p className="text-sm text-gray-600">
              Real-time journey of your package
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Route progress with van icon at checkpoints */}
          <div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-3 bg-blue-500"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentCheckpointIndex / (checkpoints.length - 1)) * 100))}%`,
                }}
              ></div>

              {/* Checkpoint markers */}
              {checkpoints.map((_, index) => (
                <div
                  key={index}
                  className="absolute top-0 h-3 w-3 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${(index / (checkpoints.length - 1)) * 100}%`,
                    backgroundColor:
                      index <= currentCheckpointIndex ? "#3b82f6" : "#d1d5db",
                  }}
                ></div>
              ))}

              {/* Van icon positioned at current checkpoint */}
              <div
                className="absolute -top-3 transform -translate-x-1/2"
                style={{
                  left: `${Math.min(100, Math.max(0, (currentCheckpointIndex / (checkpoints.length - 1)) * 100))}%`,
                }}
              >
                <span className="text-2xl">🚚</span>
              </div>
            </div>

            {/* Checkpoint labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {checkpoints.map((checkpoint, index) => (
                <span
                  key={index}
                  className={
                    index <= currentCheckpointIndex
                      ? "text-blue-600 font-medium"
                      : ""
                  }
                >
                  {checkpoint.label}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${idx <= currentCheckpointIndex ? "bg-blue-600" : "bg-gray-300"}`}
                  ></div>
                  {idx < logs.length - 1 && (
                    <div
                      className={`w-[2px] flex-1 ${idx < currentCheckpointIndex ? "bg-blue-200" : "bg-gray-200"}`}
                    ></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{log.label}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(log.time).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Removed the add tracking note input since this should only be done by admin */}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
