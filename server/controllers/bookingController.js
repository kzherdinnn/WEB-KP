import bookingModel from "../models/booking.models.js";
import sparepartModel from "../models/sparepart.models.js";
import serviceModel from "../models/service.models.js";
import technicianModel from "../models/technician.models.js";
import midtransClient from "midtrans-client";
import { sendCustomerBookingStatusUpdate } from "../utils/whatsappService.js";

// ===== CREATE BOOKING =====
export const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      vehicleInfo,
      bookingType,
      spareparts,
      services,
      scheduledDate,
      scheduledTime,
      serviceLocation,
      onsiteAddress,
      paymentMethod,
    } = req.body;

    const userId = req.auth.userId;

    // Validate booking type
    if (!["sparepart_only", "service_only", "sparepart_and_service"].includes(bookingType)) {
      return res.status(400).json({ success: false, message: "Invalid booking type" });
    }

    // Calculate prices
    let subtotalSpareparts = 0;
    let subtotalServices = 0;
    let sparepartsData = [];
    let servicesData = [];

    // Process spareparts
    if (spareparts && spareparts.length > 0) {
      for (const item of spareparts) {
        const sparepart = await sparepartModel.findById(item.sparepart);
        
        if (!sparepart) {
          return res.status(404).json({ 
            success: false, 
            message: `Sparepart ${item.sparepart} not found` 
          });
        }

        // Check stock
        if (sparepart.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${sparepart.name}. Available: ${sparepart.stock}`
          });
        }

        // Update stock
        sparepart.stock -= item.quantity;
        await sparepart.save();

        // Use price from frontend if available (for discounts), otherwise DB price
        const priceToUse = item.price !== undefined ? item.price : sparepart.price;
        const itemTotal = priceToUse * item.quantity;
        subtotalSpareparts += itemTotal;

        sparepartsData.push({
          sparepart: sparepart._id,
          quantity: item.quantity,
          price: priceToUse
        });
      }
    }

    // Process services
    if (services && services.length > 0) {
      for (const item of services) {
        const service = await serviceModel.findById(item.service);
        
        if (!service) {
          return res.status(404).json({ 
            success: false, 
            message: `Service ${item.service} not found` 
          });
        }

        if (!service.isAvailable) {
          return res.status(400).json({
            success: false,
            message: `Service ${service.name} is currently unavailable`
          });
        }

        // Use price from frontend if available (for discounts), otherwise DB price
        const priceToUse = item.price !== undefined ? item.price : service.price;
        subtotalServices += priceToUse;

        servicesData.push({
          service: service._id,
          price: priceToUse
        });
      }
    }

    const subtotal = subtotalSpareparts + subtotalServices;
    const taxAmount = Math.round(subtotal * 0.11); // PPN 11%
    const totalPrice = subtotal + taxAmount;

    // Create booking
    const newBooking = await bookingModel.create({
      user: userId,
      customerName,
      customerPhone,
      customerEmail,
      vehicleInfo,
      bookingType,
      spareparts: sparepartsData,
      services: servicesData,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      serviceLocation,
      onsiteAddress: serviceLocation === "onsite" ? onsiteAddress : undefined,
      subtotalSpareparts,
      subtotalServices,
      taxAmount,
      totalPrice,
      paymentMethod,
      paymentStatus: "pending",
      bookingStatus: "pending"
    });

    // Populate the booking
    await newBooking.populate("spareparts.sparepart services.service");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: newBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET ALL BOOKINGS (USER) =====
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    const bookings = await bookingModel
      .find({ user: userId })
      .populate("spareparts.sparepart services.service technician")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET ALL BOOKINGS (ADMIN) =====
export const getAllBookings = async (req, res) => {
  try {
    const { status, paymentStatus, date } = req.query;
    
    let filter = {};
    if (status) filter.bookingStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (date) filter.scheduledDate = new Date(date);

    const bookings = await bookingModel
      .find(filter)
      .populate("spareparts.sparepart services.service technician user")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET BOOKING BY ID =====
export const getBookingById = async (req, res) => {
  try {
    const booking = await bookingModel
      .findById(req.params.id)
      .populate("spareparts.sparepart services.service technician");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== ASSIGN TECHNICIAN (ADMIN) =====
export const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    
    const technician = await technicianModel.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, message: "Technician not found" });
    }

    const booking = await bookingModel.findByIdAndUpdate(
      req.params.id,
      { 
        technician: technicianId,
        bookingStatus: "confirmed"
      },
      { new: true }
    ).populate("technician");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Technician assigned successfully",
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== UPDATE BOOKING STATUS (ADMIN) =====
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updateData = { bookingStatus: status };

    // Check payment status before allowing progress
    if (["confirmed", "in_progress", "completed"].includes(status)) {
      const currentBooking = await bookingModel.findById(req.params.id);
      if (!currentBooking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      
      const allowedPaymentStatuses = ["paid", "dp_paid", "settlement", "capture"];
      if (!allowedPaymentStatuses.includes(currentBooking.paymentStatus)) {
        return res.status(400).json({ 
          success: false, 
          message: "Cannot update status. Payment not completed yet." 
        });
      }
    }
    
    // If completed, set completedAt
    if (status === "completed") {
      updateData.completedAt = new Date();
      
      // Update technician stats
      const booking = await bookingModel.findById(req.params.id);
      if (booking && booking.technician) {
        await technicianModel.findByIdAndUpdate(booking.technician, {
          $inc: { totalJobs: 1 }
        });
      }
      
      // Reduce stock for spareparts
      if (booking && booking.spareparts) {
        for (const item of booking.spareparts) {
          await sparepartModel.findByIdAndUpdate(item.sparepart, {
            $inc: { stock: -item.quantity }
          });
        }
      }
    }

    const booking = await bookingModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("spareparts.sparepart services.service technician");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // ===== SEND WHATSAPP NOTIFICATION TO CUSTOMER =====
    // Send notification in background (don't wait for it)
    sendCustomerBookingStatusUpdate(booking, status).catch(error => {
      console.error("❌ Error mengirim notifikasi status update ke customer:", error.message);
    });

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== ADD WORK NOTE (TECHNICIAN/ADMIN) =====
export const addWorkNote = async (req, res) => {
  try {
    const { note, photos } = req.body;
    const userId = req.auth.userId;

    const booking = await bookingModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          workNotes: {
            note,
            addedBy: userId,
            photos: photos || [],
            addedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Work note added successfully",
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== ADD ADDITIONAL COST (ADMIN) =====
export const addAdditionalCost = async (req, res) => {
  try {
    const { description, amount } = req.body;

    const booking = await bookingModel.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.additionalCosts.push({
      description,
      amount,
      addedAt: new Date()
    });

    // Recalculate total
    const additionalTotal = booking.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0);
    const tax = booking.taxAmount || 0;
    booking.totalPrice = booking.subtotalSpareparts + booking.subtotalServices + tax + additionalTotal;
    
    // Update remaining payment if DP was paid
    if (booking.dpAmount > 0) {
      booking.remainingPayment = booking.totalPrice - booking.dpAmount;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Additional cost added successfully",
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== CANCEL BOOKING =====
export const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.auth.userId;

    const booking = await bookingModel.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check if user owns this booking
    if (booking.user !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Can't cancel if already in progress or completed
    if (["in_progress", "completed"].includes(booking.bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel booking that is in progress or completed"
      });
    }

    booking.bookingStatus = "cancelled";
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    booking.cancelledBy = userId;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== INITIATE PAYMENT (MIDTRANS) =====
export const initiatePayment = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { paymentType } = req.body; // "full" or "dp"

    const booking = await bookingModel.findById(bookingId).populate("user");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ 
        success: false, 
        message: "Booking already paid" 
      });
    }

    // Calculate amount
    let paymentAmount = booking.totalPrice;
    if (paymentType === "dp") {
      paymentAmount = Math.round(booking.totalPrice * 0.5); // 50% DP
      booking.dpAmount = paymentAmount;
      booking.remainingPayment = booking.totalPrice - paymentAmount;
    }

    // ===== HANDLE FREE BOOKING (TOTAL = 0) =====
    if (paymentAmount === 0 || booking.totalPrice === 0) {
      // Skip Midtrans for free bookings, mark as paid immediately
      booking.paymentStatus = "paid";
      booking.paymentMethod = "free";
      booking.midtransOrderId = `FREE-${bookingId}-${Date.now()}`;
      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Free booking confirmed",
        data: {
          snapToken: null, // No Midtrans needed
          isFree: true,
          orderId: booking.midtransOrderId,
          amount: 0
        }
      });
    }

    // Initialize Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const orderId = `BOOKING-${bookingId}-${Date.now()}`;
    
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: paymentAmount,
      },
      customer_details: {
        first_name: booking.customerName,
        email: booking.customerEmail || "customer@bengkel.com",
        phone: booking.customerPhone,
      },
      item_details: [
        {
          id: bookingId,
          price: paymentAmount,
          quantity: 1,
          name: `Booking - ${booking.bookingType}`,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    // Update booking with Midtrans info
    booking.midtransOrderId = orderId;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      data: {
        snapToken: transaction.token,
        snapRedirectUrl: transaction.redirect_url,
        orderId: orderId,
        amount: paymentAmount,
        isFree: false
      }
    });
  } catch (error) {
    console.error("Midtrans Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET BOOKING STATISTICS (ADMIN) =====
export const getBookingStatistics = async (req, res) => {
  try {
    const totalBookings = await bookingModel.countDocuments();
    const pendingBookings = await bookingModel.countDocuments({ bookingStatus: "pending" });
    const confirmedBookings = await bookingModel.countDocuments({ bookingStatus: "confirmed" });
    const inProgressBookings = await bookingModel.countDocuments({ bookingStatus: "in_progress" });
    const completedBookings = await bookingModel.countDocuments({ bookingStatus: "completed" });
    const cancelledBookings = await bookingModel.countDocuments({ bookingStatus: "cancelled" });

    const totalRevenue = await bookingModel.aggregate([
      { $match: { paymentStatus: "paid", bookingStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
