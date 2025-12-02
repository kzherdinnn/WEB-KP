import { API_ENDPOINTS } from '../config/api';

// Helper untuk fetch dengan auth token dari Clerk
export const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = await window.Clerk?.session?.getToken();
    
    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper untuk fetch tanpa auth (public endpoints)
export const fetchPublic = async (url, options = {}) => {
  try {
    console.log('🌐 Fetching URL:', url); // DEBUG LOG
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ===== Spareparts API =====
export const sparepartsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchPublic(`${API_ENDPOINTS.SPAREPARTS}?${params}`);
  },
  
  getById: (id) => {
    return fetchPublic(API_ENDPOINTS.SPAREPART_BY_ID(id));
  },
  
  checkStock: (id) => {
    return fetchPublic(API_ENDPOINTS.SPAREPART_STOCK(id));
  },
  
  checkCompatibility: (id, vehicleInfo) => {
    const params = new URLSearchParams(vehicleInfo);
    return fetchPublic(`${API_ENDPOINTS.SPAREPART_COMPATIBILITY(id)}?${params}`);
  },
};

// ===== Services API =====
export const servicesAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchPublic(`${API_ENDPOINTS.SERVICES}?${params}`);
  },
  
  getById: (id) => {
    return fetchPublic(API_ENDPOINTS.SERVICE_BY_ID(id));
  },
};

// ===== Technicians API =====
export const techniciansAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchPublic(`${API_ENDPOINTS.TECHNICIANS}?${params}`);
  },
  
  getAvailable: (date, time) => {
    const params = new URLSearchParams({ date, time });
    return fetchPublic(`${API_ENDPOINTS.TECHNICIANS_AVAILABLE}?${params}`);
  },
  
  getById: (id) => {
    return fetchPublic(API_ENDPOINTS.TECHNICIAN_BY_ID(id));
  },

  create: (data) => {
    return fetchWithAuth(API_ENDPOINTS.TECHNICIANS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (id, data) => {
    return fetchWithAuth(API_ENDPOINTS.TECHNICIAN_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: (id) => {
    return fetchWithAuth(API_ENDPOINTS.TECHNICIAN_BY_ID(id), {
      method: 'DELETE',
    });
  },
};

// ===== Workshop API =====
export const workshopAPI = {
  getInfo: () => {
    return fetchPublic(API_ENDPOINTS.WORKSHOP);
  },
  
  getTimeSlots: (date) => {
    const params = new URLSearchParams({ date });
    return fetchPublic(`${API_ENDPOINTS.WORKSHOP_TIMESLOTS}?${params}`);
  },
};

// ===== Bookings API =====
export const bookingsAPI = {
  create: (bookingData) => {
    return fetchWithAuth(API_ENDPOINTS.BOOKINGS, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
  
  getMyBookings: () => {
    return fetchWithAuth(API_ENDPOINTS.MY_BOOKINGS);
  },
  
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchWithAuth(`${API_ENDPOINTS.BOOKINGS}?${params}`);
  },
  
  getById: (id) => {
    return fetchWithAuth(API_ENDPOINTS.BOOKING_BY_ID(id));
  },
  
  initiatePayment: (id, paymentType = 'full') => {
    return fetchWithAuth(API_ENDPOINTS.BOOKING_PAYMENT(id), {
      method: 'POST',
      body: JSON.stringify({ paymentType }),
    });
  },
  
  cancel: (id, reason) => {
    return fetchWithAuth(API_ENDPOINTS.BOOKING_CANCEL(id), {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
  
  getStatistics: () => {
    return fetchWithAuth(API_ENDPOINTS.BOOKING_STATISTICS);
  },
};

export default {
  spareparts: sparepartsAPI,
  services: servicesAPI,
  technicians: techniciansAPI,
  workshop: workshopAPI,
  bookings: bookingsAPI,
};
