# 🔄 FRONTEND UPDATE GUIDE

## 📋 **Langkah-langkah Update Frontend untuk Workshop System**

---

## **STEP 1: Update Environment Variables**

Buat/Update file `.env.local` di folder `client`:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# Clerk (Authentication) - sudah ada
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Midtrans (Payment)
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-...
```

---

## **STEP 2: Buat API Configuration File**

Buat file `src/config/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  
  // User
  USER: `${API_URL}/api/user`,
};

export default API_URL;
```

---

## **STEP 3: Buat API Helper Functions**

Buat file `src/utils/api.js`:

```javascript
import { API_ENDPOINTS } from '../config/api';

// Helper untuk fetch dengan auth token dari Clerk
export const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = await window.Clerk.session.getToken();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Spareparts API
export const sparepartsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetch(`${API_ENDPOINTS.SPAREPARTS}?${params}`).then(r => r.json());
  },
  
  getById: (id) => {
    return fetch(API_ENDPOINTS.SPAREPART_BY_ID(id)).then(r => r.json());
  },
  
  checkStock: (id) => {
    return fetch(API_ENDPOINTS.SPAREPART_STOCK(id)).then(r => r.json());
  },
  
  checkCompatibility: (id, vehicleInfo) => {
    const params = new URLSearchParams(vehicleInfo);
    return fetch(`${API_ENDPOINTS.SPAREPART_COMPATIBILITY(id)}?${params}`)
      .then(r => r.json());
  },
};

// Services API
export const servicesAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetch(`${API_ENDPOINTS.SERVICES}?${params}`).then(r => r.json());
  },
  
  getById: (id) => {
    return fetch(API_ENDPOINTS.SERVICE_BY_ID(id)).then(r => r.json());
  },
};

// Technicians API
export const techniciansAPI = {
  getAll: () => {
    return fetch(API_ENDPOINTS.TECHNICIANS).then(r => r.json());
  },
  
  getAvailable: (date, time) => {
    const params = new URLSearchParams({ date, time });
    return fetch(`${API_ENDPOINTS.TECHNICIANS_AVAILABLE}?${params}`)
      .then(r => r.json());
  },
};

// Workshop API
export const workshopAPI = {
  getInfo: () => {
    return fetch(API_ENDPOINTS.WORKSHOP).then(r => r.json());
  },
  
  getTimeSlots: (date) => {
    const params = new URLSearchParams({ date });
    return fetch(`${API_ENDPOINTS.WORKSHOP_TIMESLOTS}?${params}`)
      .then(r => r.json());
  },
};

// Bookings API
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
  
  getById: (id) => {
    return fetchWithAuth(API_ENDPOINTS.BOOKING_BY_ID(id));
  },
  
  initiatePayment: (id, paymentType) => {
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
};
```

---

## **STEP 4: Update Pages**

### **A. Ganti `Hotels.jsx` → `Spareparts.jsx`**

Buat file `src/pages/Spareparts.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { sparepartsAPI } from '../utils/api';

export default function Spareparts() {
  const [spareparts, setSpareparts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    search: '',
    inStock: 'true',
  });

  useEffect(() => {
    loadSpareparts();
  }, [filters]);

  const loadSpareparts = async () => {
    try {
      setLoading(true);
      const response = await sparepartsAPI.getAll(filters);
      setSpareparts(response.data || []);
    } catch (error) {
      console.error('Error loading spareparts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sparepart Audio Mobil</h1>
      
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="px-4 py-2 border rounded"
        />
        
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="speaker">Speaker</option>
          <option value="amplifier">Amplifier</option>
          <option value="subwoofer">Subwoofer</option>
          <option value="headunit">Head Unit</option>
        </select>
        
        <input
          type="text"
          placeholder="Brand..."
          value={filters.brand}
          onChange={(e) => setFilters({...filters, brand: e.target.value})}
          className="px-4 py-2 border rounded"
        />
      </div>
      
      {/* Spareparts Grid */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spareparts.map((item) => (
            <div key={item._id} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-gray-600">{item.brand}</p>
              <p className="text-xl font-bold mt-2">
                Rp {item.price.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-gray-500">
                Stock: {item.stock} units
              </p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### **B. Ganti `RoomDetails.jsx` → `SparepartDetails.jsx`**

Buat file `src/pages/SparepartDetails.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sparepartsAPI } from '../utils/api';

export default function SparepartDetails() {
  const { id } = useParams();
  const [sparepart, setSparepart] = useState(null);
  const [stockStatus, setStockStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSparepart();
    checkStock();
  }, [id]);

  const loadSparepart = async () => {
    try {
      const response = await sparepartsAPI.getById(id);
      setSparepart(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkStock = async () => {
    try {
      const response = await sparepartsAPI.checkStock(id);
      setStockStatus(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!sparepart) return <div>Sparepart not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">{sparepart.name}</h1>
          <p className="text-gray-600 mb-4">{sparepart.description}</p>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">Specifications:</h3>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(sparepart.specifications, null, 2)}
            </pre>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">Stock Status:</h3>
            <p className={`text-lg ${
              stockStatus?.status === 'available' ? 'text-green-600' :
              stockStatus?.status === 'low_stock' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {stockStatus?.message}
            </p>
          </div>
        </div>
        
        <div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-3xl font-bold mb-4">
              Rp {sparepart.price.toLocaleString('id-ID')}
            </p>
            
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
              Add to Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## **STEP 5: Update Routing**

Update `src/App.jsx` atau router file:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Spareparts from './pages/Spareparts';
import SparepartDetails from './pages/SparepartDetails';
import Services from './pages/Services';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spareparts" element={<Spareparts />} />
        <Route path="/spareparts/:id" element={<SparepartDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## **STEP 6: Integrate Midtrans Snap**

Tambahkan Midtrans script di `index.html`:

```html
<!-- Add before </head> -->
<script
  type="text/javascript"
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="YOUR_MIDTRANS_CLIENT_KEY"
></script>
```

Buat payment handler `src/utils/payment.js`:

```javascript
export const initiateMidtransPayment = async (snapToken) => {
  return new Promise((resolve, reject) => {
    window.snap.pay(snapToken, {
      onSuccess: function(result) {
        console.log('Payment success:', result);
        resolve(result);
      },
      onPending: function(result) {
        console.log('Payment pending:', result);
        resolve(result);
      },
      onError: function(result) {
        console.log('Payment error:', result);
        reject(result);
      },
      onClose: function() {
        console.log('Payment popup closed');
        reject(new Error('Payment cancelled'));
      }
    });
  });
};
```

---

## **SUMMARY PERUBAHAN FRONTEND:**

### **Files yang perlu DIBUAT:**
1. ✅ `src/config/api.js` - API endpoints configuration
2. ✅ `src/utils/api.js` - API helper functions
3. ✅ `src/utils/payment.js` - Midtrans payment handler
4. ✅ `src/pages/Spareparts.jsx` - List spareparts
5. ✅ `src/pages/SparepartDetails.jsx` - Detail sparepart
6. ✅ `src/pages/Services.jsx` - List services
7. ✅ `src/pages/Booking.jsx` - Booking form
8. ✅ `.env.local` - Environment variables

### **Files yang perlu DIUPDATE:**
1. ✅ `src/App.jsx` - Update routing
2. ✅ `index.html` - Add Midtrans script
3. ✅ Navigation component - Update menu items

### **Files yang bisa DIHAPUS:**
1. ❌ `src/pages/Hotels.jsx`
2. ❌ `src/pages/RoomDetails.jsx`

---

**Silakan mulai implementasi step by step!** 🚀
