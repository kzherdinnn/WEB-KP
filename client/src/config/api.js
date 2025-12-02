const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
console.log('🔍 DEBUG API_URL Raw:', rawUrl);

// Remove trailing slash and ensure no double slashes in path
const API_URL = rawUrl.replace(/\/$/, '').replace(/([^:]\/)\/+/g, "$1");
console.log('✅ DEBUG API_URL Final:', API_URL);

export const API_ENDPOINTS = {
  // Spareparts
  SPAREPARTS: `${API_URL}/api/spareparts`,
  SPAREPART_BY_ID: (id) => `${API_URL}/api/spareparts/${id}`,
  SPAREPART_STOCK: (id) => `${API_URL}/api/spareparts/${id}/stock`,
  SPAREPART_COMPATIBILITY: (id) => `${API_URL}/api/spareparts/${id}/compatibility`,
  
  // Services
  SERVICES: `${API_URL}/api/services`,
  SERVICE_BY_ID: (id) => `${API_URL}/api/services/${id}`,
  
  // Technicians
  TECHNICIANS: `${API_URL}/api/technicians`,
  TECHNICIANS_AVAILABLE: `${API_URL}/api/technicians/available`,
  TECHNICIAN_BY_ID: (id) => `${API_URL}/api/technicians/${id}`,
  
  // Workshop
  WORKSHOP: `${API_URL}/api/workshop`,
  WORKSHOP_TIMESLOTS: `${API_URL}/api/workshop/timeslots`,
  
  // Bookings
  BOOKINGS: `${API_URL}/api/bookings`,
  MY_BOOKINGS: `${API_URL}/api/bookings/my-bookings`,
  BOOKING_BY_ID: (id) => `${API_URL}/api/bookings/${id}`,
  BOOKING_PAYMENT: (id) => `${API_URL}/api/bookings/${id}/payment`,
  BOOKING_CANCEL: (id) => `${API_URL}/api/bookings/${id}/cancel`,
  BOOKING_STATISTICS: `${API_URL}/api/bookings/statistics/dashboard`,
  
  // User
  USER: `${API_URL}/api/user`,
};

export default API_URL;
