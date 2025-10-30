import { useState } from 'react';
import { Plus, CreditCard, Trash2, Star, Edit3, X, Save, Smartphone, Wallet } from 'lucide-react';
import { PaymentMethod } from '../../types';

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit',
      last4Digits: '4532',
      cardHolderName: 'John Doe',
      expiryDate: '12/27',
      isDefault: true
    },
    {
      id: '2',
      type: 'upi',
      upiId: 'john.doe@paytm',
      isDefault: false
    },
    {
      id: '3',
      type: 'wallet',
      walletName: 'PayTM',
      isDefault: false
    }
  ]);

  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'credit' as PaymentMethod['type'],
    cardHolderName: '',
    last4Digits: '',
    expiryDate: '',
    upiId: '',
    walletName: ''
  });

  const handleAddPayment = () => {
    setIsAddingPayment(true);
    setFormData({
      type: 'credit',
      cardHolderName: '',
      last4Digits: '',
      expiryDate: '',
      upiId: '',
      walletName: ''
    });
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPaymentId(payment.id);
    setFormData({
      type: payment.type,
      cardHolderName: payment.cardHolderName || '',
      last4Digits: payment.last4Digits || '',
      expiryDate: payment.expiryDate || '',
      upiId: payment.upiId || '',
      walletName: payment.walletName || ''
    });
  };

  const handleSavePayment = () => {
    // Validation
    if (formData.type === 'credit' || formData.type === 'debit') {
      if (!formData.cardHolderName || !formData.last4Digits || !formData.expiryDate) {
        alert('Please fill in all card details');
        return;
      }
    } else if (formData.type === 'upi') {
      if (!formData.upiId) {
        alert('Please enter UPI ID');
        return;
      }
    } else if (formData.type === 'wallet') {
      if (!formData.walletName) {
        alert('Please select wallet name');
        return;
      }
    }

    if (isAddingPayment) {
      const newPayment: PaymentMethod = {
        id: Date.now().toString(),
        type: formData.type,
        cardHolderName: formData.cardHolderName || undefined,
        last4Digits: formData.last4Digits || undefined,
        expiryDate: formData.expiryDate || undefined,
        upiId: formData.upiId || undefined,
        walletName: formData.walletName || undefined,
        isDefault: paymentMethods.length === 0
      };
      setPaymentMethods([...paymentMethods, newPayment]);
      setIsAddingPayment(false);
    } else if (editingPaymentId) {
      setPaymentMethods(paymentMethods.map(payment => 
        payment.id === editingPaymentId 
          ? { 
              ...payment, 
              type: formData.type,
              cardHolderName: formData.cardHolderName || undefined,
              last4Digits: formData.last4Digits || undefined,
              expiryDate: formData.expiryDate || undefined,
              upiId: formData.upiId || undefined,
              walletName: formData.walletName || undefined
            }
          : payment
      ));
      setEditingPaymentId(null);
    }

    setFormData({
      type: 'credit',
      cardHolderName: '',
      last4Digits: '',
      expiryDate: '',
      upiId: '',
      walletName: ''
    });
  };

  const handleCancelEdit = () => {
    setIsAddingPayment(false);
    setEditingPaymentId(null);
    setFormData({
      type: 'credit',
      cardHolderName: '',
      last4Digits: '',
      expiryDate: '',
      upiId: '',
      walletName: ''
    });
  };

  const handleDeletePayment = (paymentId: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      const paymentToDelete = paymentMethods.find(payment => payment.id === paymentId);
      const remainingPayments = paymentMethods.filter(payment => payment.id !== paymentId);
      
      // If we're deleting the default payment and there are other payments, make the first one default
      if (paymentToDelete?.isDefault && remainingPayments.length > 0) {
        remainingPayments[0].isDefault = true;
      }
      
      setPaymentMethods(remainingPayments);
    }
  };

  const handleSetDefault = (paymentId: string) => {
    setPaymentMethods(paymentMethods.map(payment => ({
      ...payment,
      isDefault: payment.id === paymentId
    })));
  };

  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'credit':
      case 'debit':
        return <CreditCard className="w-5 h-5" />;
      case 'upi':
        return <Smartphone className="w-5 h-5" />;
      case 'wallet':
        return <Wallet className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentDisplay = (payment: PaymentMethod) => {
    switch (payment.type) {
      case 'credit':
      case 'debit':
        return `**** **** **** ${payment.last4Digits}`;
      case 'upi':
        return payment.upiId;
      case 'wallet':
        return payment.walletName;
      default:
        return 'Unknown';
    }
  };

  const isFormMode = isAddingPayment || editingPaymentId !== null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Payment Methods</h2>
          <p className="text-gray-600 mt-2">Manage your saved payment methods</p>
        </div>
        {!isFormMode && (
          <button
            onClick={handleAddPayment}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Payment Method</span>
          </button>
        )}
      </div>

      {isFormMode && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {isAddingPayment ? 'Add Payment Method' : 'Edit Payment Method'}
            </h3>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentMethod['type'] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="upi">UPI</option>
                <option value="wallet">Digital Wallet</option>
              </select>
            </div>

            {(formData.type === 'credit' || formData.type === 'debit') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name *</label>
                  <input
                    type="text"
                    value={formData.cardHolderName}
                    onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last 4 Digits *</label>
                  <input
                    type="text"
                    value={formData.last4Digits}
                    onChange={(e) => setFormData({ ...formData, last4Digits: e.target.value.slice(0, 4) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="4532"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
              </div>
            )}

            {formData.type === 'upi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID *</label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john.doe@paytm"
                />
              </div>
            )}

            {formData.type === 'wallet' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Name *</label>
                <select
                  value={formData.walletName}
                  onChange={(e) => setFormData({ ...formData, walletName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Wallet</option>
                  <option value="PayTM">PayTM</option>
                  <option value="PhonePe">PhonePe</option>
                  <option value="Google Pay">Google Pay</option>
                  <option value="Amazon Pay">Amazon Pay</option>
                  <option value="Mobikwik">Mobikwik</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleSavePayment}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Payment Method</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {paymentMethods.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No payment methods saved</h3>
          <p className="text-gray-600 mb-6">Add your first payment method for faster checkout!</p>
          <button
            onClick={handleAddPayment}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Payment Method
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((payment) => (
            <div key={payment.id} className="bg-white border border-gray-200 rounded-xl p-6 relative">
              {payment.isDefault && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Default</span>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 mb-4">
                <div className="text-blue-600">
                  {getPaymentIcon(payment.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">{payment.type} {payment.type.includes('card') ? 'Card' : ''}</h3>
                  <p className="text-gray-600">{getPaymentDisplay(payment)}</p>
                </div>
              </div>

              {(payment.type === 'credit' || payment.type === 'debit') && (
                <div className="text-sm text-gray-600 mb-4">
                  <p>Card Holder: {payment.cardHolderName}</p>
                  <p>Expires: {payment.expiryDate}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleEditPayment(payment)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  <span className="text-sm">Edit</span>
                </button>
                
                {!payment.isDefault && (
                  <button
                    onClick={() => handleSetDefault(payment.id)}
                    className="text-green-600 hover:text-green-700 px-3 py-1 rounded border border-green-200 hover:bg-green-50 transition-colors text-sm"
                  >
                    Set as Default
                  </button>
                )}
                
                <button
                  onClick={() => handleDeletePayment(payment.id)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 bg-blue-50 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Security Notice</h3>
        <p className="text-gray-600 text-sm">
          Your payment information is encrypted and securely stored. We never store complete card numbers or sensitive details.
        </p>
      </div>
    </div>
  );
}