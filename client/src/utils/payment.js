/**
 * Initiate Midtrans payment with Snap
 * @param {string} snapToken - Token from backend
 * @param {Object} options - Payment options
 * @returns {Promise} Payment result
 */
/**
 * Load Midtrans Snap script dynamically
 */
const loadMidtransScript = () => {
  return new Promise((resolve, reject) => {
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    if (!clientKey) {
      reject(new Error('VITE_MIDTRANS_CLIENT_KEY tidak ditemukan di .env.local'));
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', clientKey);
    script.onload = () => {
      console.log('✅ Midtrans Snap script loaded');
      resolve();
    };
    script.onerror = () => reject(new Error('Gagal memuat script Midtrans Snap'));
    document.body.appendChild(script);
  });
};

/**
 * Initiate Midtrans payment with Snap
 * @param {string} snapToken - Token from backend
 * @param {Object} options - Payment options
 * @returns {Promise} Payment result
 */
export const initiateMidtransPayment = async (snapToken, options = {}) => {
  try {
    if (!window.snap) {
      console.log('⏳ Loading Midtrans Snap script...');
      await loadMidtransScript();
    }

    return new Promise((resolve, reject) => {
      if (!window.snap) {
        reject(new Error('Midtrans Snap failed to load'));
        return;
      }

      window.snap.pay(snapToken, {
        onSuccess: function(result) {
          console.log('✅ Payment success:', result);
          resolve({ status: 'success', result });
        },
        
        onPending: function(result) {
          console.log('⏳ Payment pending:', result);
          resolve({ status: 'pending', result });
        },
        
        onError: function(result) {
          console.error('❌ Payment error:', result);
          reject({ status: 'error', result });
        },
        
        onClose: function() {
          console.log('🚪 Payment popup closed');
          resolve({ status: 'closed', result: null });
        },
        
        ...options
      });
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};

/**
 * Format currency to IDR
 * @param {number} amount - Amount in IDR
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to Indonesian format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time
 * @param {string} time - Time string (HH:MM)
 * @returns {string} Formatted time
 */
export const formatTime = (time) => {
  return time;
};

/**
 * Get payment status badge color
 * @param {string} status - Payment status
 * @returns {string} Color class
 */
export const getPaymentStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    dp_paid: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get booking status badge color
 * @param {string} status - Booking status
 * @returns {string} Color class
 */
export const getBookingStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default {
  initiateMidtransPayment,
  formatCurrency,
  formatDate,
  formatTime,
  getPaymentStatusColor,
  getBookingStatusColor,
};
