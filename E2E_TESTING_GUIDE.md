# 🧪 END-TO-END TESTING GUIDE

## 📋 **Complete Booking Flow Testing**

Testing lengkap dari awal sampai akhir untuk Workshop Booking System.

---

## **TEST SCENARIO 1: Browse & Check Spareparts** ✅

### **Prerequisites:**
- ✅ Backend running: `http://localhost:3000`
- ✅ Database seeded
- ✅ Postman/Thunder Client installed

---

### **Test 1.1: Get All Spareparts**

**Request:**
```http
GET http://localhost:3000/api/spareparts
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Pioneer TS-G1620F 6.5\" Speaker",
      "category": "speaker",
      "brand": "Pioneer",
      "price": 500000,
      "stock": 15,
      "isAvailable": true
    }
  ],
  "total": 5
}
```

**Validation:**
- ✅ Status 200
- ✅ Returns array of spareparts
- ✅ Total count is 5

---

### **Test 1.2: Check Stock Status**

**Request:**
```http
GET http://localhost:3000/api/spareparts/{sparepartId}/stock
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "sparepartId": "...",
    "name": "Pioneer TS-G1620F 6.5\" Speaker",
    "stock": 15,
    "status": "available",
    "message": "Stock available"
  }
}
```

**Validation:**
- ✅ Status shows correct (available/low_stock/out_of_stock)

---

### **Test 1.3: Check Vehicle Compatibility**

**Request:**
```http
GET http://localhost:3000/api/spareparts/{sparepartId}/compatibility?brand=Toyota&model=Avanza&year=2020
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "isCompatible": true,
    "message": "This sparepart is compatible with your vehicle"
  }
}
```

---

## **TEST SCENARIO 2: Browse Services** ✅

### **Test 2.1: Get All Services**

**Request:**
```http
GET http://localhost:3000/api/services
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Pasang Speaker (Depan + Belakang)",
      "category": "installation",
      "price": 300000,
      "estimatedDuration": 120,
      "isAvailable": true
    }
  ],
  "total": 6
}
```

---

## **TEST SCENARIO 3: Check Schedule Availability** ✅

### **Test 3.1: Get Available Time Slots**

**Request:**
```http
GET http://localhost:3000/api/workshop/timeslots?date=2025-12-15
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "time": "09:00",
      "bookingsCount": 0,
      "maxBookings": 3,
      "isAvailable": true
    },
    {
      "time": "10:00",
      "bookingsCount": 0,
      "maxBookings": 3,
      "isAvailable": true
    }
  ]
}
```

**Validation:**
- ✅ Shows available slots
- ✅ `isAvailable` true jika `bookingsCount < maxBookings`

---

### **Test 3.2: Get Available Technicians**

**Request:**
```http
GET http://localhost:3000/api/technicians/available?date=2025-12-15&time=09:00
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Budi Santoso",
      "specialization": ["audio", "installation"],
      "rating": 4.8,
      "totalJobs": 150
    }
  ],
  "total": 3
}
```

---

## **TEST SCENARIO 4: Create Booking** 🔐

**⚠️ REQUIRES: Clerk Authentication Token**

### **Test 4.1: Create New Booking**

**Request:**
```http
POST http://localhost:3000/api/bookings
Authorization: Bearer {CLERK_TOKEN}
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerPhone": "08123456789",
  "customerEmail": "john@example.com",
  "vehicleInfo": {
    "brand": "Toyota",
    "model": "Avanza",
    "year": "2020",
    "plateNumber": "B 1234 XYZ"
  },
  "bookingType": "sparepart_and_service",
  "spareparts": [
    {
      "sparepartId": "{SPAREPART_ID_FROM_STEP_1}",
      "quantity": 2
    }
  ],
  "services": [
    {
      "serviceId": "{SERVICE_ID_FROM_STEP_2}"
    }
  ],
  "scheduledDate": "2025-12-15",
  "scheduledTime": "09:00",
  "serviceLocation": "workshop",
  "paymentMethod": "ewallet"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "...",
    "customerName": "John Doe",
    "totalPrice": 1300000,
    "subtotalSpareparts": 1000000,
    "subtotalServices": 300000,
    "paymentStatus": "pending",
    "bookingStatus": "pending"
  }
}
```

**Validation:**
- ✅ Status 201
- ✅ Booking created with correct total
- ✅ Status is pending

**Save booking ID** untuk test selanjutnya!

---

## **TEST SCENARIO 5: Payment Flow** 💳

### **Test 5.1: Initiate Payment**

**Request:**
```http
POST http://localhost:3000/api/bookings/{bookingId}/payment
Authorization: Bearer {CLERK_TOKEN}
Content-Type: application/json

{
  "paymentType": "full"
}
```

**OR untuk DP:**
```json
{
  "paymentType": "dp"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "snapToken": "abc123xyz...",
    "snapRedirectUrl": "https://app.sandbox.midtrans.com/snap/...",
    "orderId": "BOOKING-xxx-123456789",
    "amount": 1300000
  }
}
```

**Validation:**
- ✅ Returns snap token
- ✅ Amount is correct

---

### **Test 5.2: Simulate Payment (Manual)**

**Option A: Via Browser**
1. Copy `snapRedirectUrl`
2. Open di browser
3. Pilih payment method
4. Use test credentials:
   ```
   Card: 4811 1111 1111 1114
   CVV: 123
   Exp: 01/25
   3DS: 112233
   ```
5. Complete payment

**Option B: Test Webhook Directly**

Simulate webhook dari Midtrans:

```http
POST http://localhost:3000/api/payment/webhook
Content-Type: application/json

{
  "order_id": "BOOKING-{bookingId}-123456789",
  "transaction_status": "settlement",
  "fraud_status": "accept",
  "transaction_id": "test-123",
  "status_code": "200",
  "gross_amount": "1300000.00"
}
```

**Check Server Logs:**
```
=============================================================
🔔 WEBHOOK MIDTRANS DITERIMA (WORKSHOP BOOKING)
=============================================================
✅ Status akan diupdate menjadi: PAID
✅ WEBHOOK BERHASIL DIPROSES
=============================================================
```

---

### **Test 5.3: Verify Booking Status Updated**

**Request:**
```http
GET http://localhost:3000/api/bookings/{bookingId}
Authorization: Bearer {CLERK_TOKEN}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "paymentStatus": "paid",
    "bookingStatus": "confirmed",
    "paidAt": "2025-12-01T...",
    "midtransOrderId": "BOOKING-xxx-123456789",
    "midtransTransactionId": "test-123"
  }
}
```

**Validation:**
- ✅ `paymentStatus` changed to "paid"
- ✅ `bookingStatus` auto-updated to "confirmed"
- ✅ `paidAt` timestamp set

---

## **TEST SCENARIO 6: Admin Operations** 👨‍💼

### **Test 6.1: Get All Bookings (Admin)**

**Request:**
```http
GET http://localhost:3000/api/bookings
Authorization: Bearer {ADMIN_CLERK_TOKEN}
```

---

### **Test 6.2: Assign Technician**

**Request:**
```http
POST http://localhost:3000/api/bookings/{bookingId}/assign-technician
Authorization: Bearer {ADMIN_CLERK_TOKEN}
Content-Type: application/json

{
  "technicianId": "{TECHNICIAN_ID}"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Technician assigned successfully",
  "data": {
    "_id": "...",
    "technician": {
      "_id": "...",
      "name": "Budi Santoso"
    }
  }
}
```

---

### **Test 6.3: Update Booking Status to In Progress**

**Request:**
```http
PATCH http://localhost:3000/api/bookings/{bookingId}/status
Authorization: Bearer {ADMIN_CLERK_TOKEN}
Content-Type: application/json

{
  "status": "in_progress"
}
```

**Validation:**
- ✅ Status updated
- ✅ Valid transition (confirmed → in_progress)

---

### **Test 6.4: Add Work Note**

**Request:**
```http
POST http://localhost:3000/api/bookings/{bookingId}/work-notes
Authorization: Bearer {ADMIN_CLERK_TOKEN}
Content-Type: application/json

{
  "note": "Speaker depan sudah terpasang dengan baik",
  "photos": ["https://example.com/photo1.jpg"]
}
```

---

### **Test 6.5: Add Additional Cost**

**Request:**
```http
POST http://localhost:3000/api/bookings/{bookingId}/additional-cost
Authorization: Bearer {ADMIN_CLERK_TOKEN}
Content-Type: application/json

{
  "description": "Kabel tambahan",
  "amount": 50000
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Additional cost added successfully",
  "data": {
    "_id": "...",
    "totalPrice": 1350000,
    "additionalCosts": [
      {
        "description": "Kabel tambahan",
        "amount": 50000,
        "addedAt": "..."
      }
    ]
  }
}
```

**Validation:**
- ✅ `totalPrice` recalculated
- ✅ Additional cost added to array

---

### **Test 6.6: Complete Booking**

**Request:**
```http
PATCH http://localhost:3000/api/bookings/{bookingId}/status
Authorization: Bearer {ADMIN_CLERK_TOKEN}
Content-Type: application/json

{
  "status": "completed"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking status updated to completed",
  "data": {
    "_id": "...",
    "bookingStatus": "completed",
    "completedAt": "..."
  }
}
```

**Validation:**
- ✅ Status updated to completed
- ✅ `completedAt` timestamp set
- ✅ Sparepart stock reduced automatically
- ✅ Technician `totalJobs` incremented

**Verify Stock Reduction:**
```http
GET http://localhost:3000/api/spareparts/{sparepartId}/stock
```
Stock should be reduced by quantity ordered.

---

## **TEST SCENARIO 7: Get My Bookings** 👤

**Request:**
```http
GET http://localhost:3000/api/bookings/my-bookings
Authorization: Bearer {USER_CLERK_TOKEN}
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "customerName": "John Doe",
      "totalPrice": 1350000,
      "paymentStatus": "paid",
      "bookingStatus": "completed",
      "scheduledDate": "2025-12-15",
      "scheduledTime": "09:00"
    }
  ],
  "total": 1
}
```

---

## **TEST SCENARIO 8: Cancel Booking** ❌

**Request:**
```http
POST http://localhost:3000/api/bookings/{bookingId}/cancel
Authorization: Bearer {USER_CLERK_TOKEN}
Content-Type: application/json

{
  "reason": "Berubah pikiran"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "_id": "...",
    "bookingStatus": "cancelled",
    "cancellationReason": "Berubah pikiran",
    "cancelledAt": "...",
    "cancelledBy": "..."
  }
}
```

**Validation:**
- ✅ Can only cancel if status is pending/confirmed
- ✅ Cannot cancel if in_progress or completed

---

## **✅ COMPLETE TEST CHECKLIST**

### **Backend API Tests:**
- [ ] Get all spareparts
- [ ] Check stock status
- [ ] Check vehicle compatibility
- [ ] Get all services
- [ ] Get available time slots
- [ ] Get available technicians
- [ ] Create booking (with auth)
- [ ] Initiate payment
- [ ] Webhook updates booking status
- [ ] Get booking by ID
- [ ] Assign technician (admin)
- [ ] Update booking status (admin)
- [ ] Add work notes (admin)
- [ ] Add additional costs (admin)
- [ ] Complete booking (admin)
- [ ] Stock auto-reduced on completion
- [ ] Get my bookings
- [ ] Cancel booking

### **Payment Flow Tests:**
- [ ] Full payment works
- [ ] DP payment works (50%)
- [ ] Webhook received correctly
- [ ] Status auto-updates
- [ ] Failed payment handled correctly
- [ ] Pending payment handled

### **Edge Cases:**
- [ ] Insufficient stock validation
- [ ] Invalid vehicle compatibility
- [ ] Double booking prevention
- [ ] Unauthorized access blocked
- [ ] Invalid status transitions blocked

---

## **📊 Test Results Template**

```
=== WORKSHOP BOOKING SYSTEM TEST RESULTS ===

Date: 2025-12-01
Tester: [Your Name]

SCENARIO 1: Browse Spareparts ✅ PASSED
SCENARIO 2: Browse Services ✅ PASSED
SCENARIO 3: Check Availability ✅ PASSED
SCENARIO 4: Create Booking ✅ PASSED
SCENARIO 5: Payment Flow ✅ PASSED
SCENARIO 6: Admin Operations ✅ PASSED
SCENARIO 7: Get My Bookings ✅ PASSED
SCENARIO 8: Cancel Booking ✅ PASSED

TOTAL: 8/8 PASSED

Notes:
- All endpoints working correctly
- Webhook integration successful
- Stock management working
- Payment flow smooth
```

---

**Happy Testing! 🧪🚀**
