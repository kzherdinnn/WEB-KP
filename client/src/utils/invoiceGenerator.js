import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export const generateInvoice = (booking) => {
  try {
    if (!booking) {
      toast.error("Data booking tidak ditemukan");
      return;
    }

    const doc = new jsPDF();

    // Company Logo/Header
    doc.setFontSize(20);
    doc.setTextColor(0, 128, 128); // Teal color
    doc.text("Aan Audio Solutions", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Jalan Raya Example No. 123, Jakarta", 14, 28);
    doc.text("Telp: +62 812-3456-7890 | Email: support@aanaudio.com", 14, 33);

    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("INVOICE", 140, 22);

    // Invoice Details
    const invoiceNo = booking._id ? `INV-${booking._id.slice(-8).toUpperCase()}` : "INV-XXXX";
    const invoiceDate = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("id-ID") : new Date().toLocaleDateString("id-ID");
    
    doc.setFontSize(10);
    doc.text(`No. Invoice: ${invoiceNo}`, 140, 28);
    doc.text(`Tanggal: ${invoiceDate}`, 140, 33);
    doc.text(`Status: ${booking.paymentStatus ? booking.paymentStatus.toUpperCase() : "PENDING"}`, 140, 38);

    // Customer Info
    doc.setDrawColor(200);
    doc.line(14, 45, 196, 45);

    doc.setFontSize(12);
    doc.text("Info Pelanggan", 14, 55);
    doc.setFontSize(10);
    doc.text(`Nama: ${booking.customerName || "-"}`, 14, 62);
    doc.text(`Telepon: ${booking.customerPhone || "-"}`, 14, 67);
    doc.text(`Email: ${booking.customerEmail || "-"}`, 14, 72);

    // Vehicle Info
    const vehicleBrand = booking.vehicleInfo?.brand || booking.vehicleBrand || "-";
    const vehicleModel = booking.vehicleInfo?.model || booking.vehicleModel || "";
    const vehiclePlate = booking.vehicleInfo?.plateNumber || booking.vehiclePlate || "-";
    const vehicleYear = booking.vehicleInfo?.year || booking.vehicleYear || "-";

    doc.text(`Kendaraan: ${vehicleBrand} ${vehicleModel}`, 110, 62);
    doc.text(`Plat Nomor: ${vehiclePlate}`, 110, 67);
    doc.text(`Tahun: ${vehicleYear}`, 110, 72);

    // Table
    const tableColumn = ["Deskripsi", "Tipe", "Qty", "Harga Satuan", "Total"];
    const tableRows = [];

    // Services
    const services = booking.services || [];
    services.forEach(item => {
      const name = item.service?.name || item.name || "Service";
      const price = Number(item.price) || 0;
      tableRows.push([
        name,
        "Jasa",
        "1",
        `Rp ${price.toLocaleString("id-ID")}`,
        `Rp ${price.toLocaleString("id-ID")}`
      ]);
    });

    // Spareparts
    const spareparts = booking.spareparts || booking.spareParts || [];
    spareparts.forEach(item => {
      const name = item.sparepart?.name || item.name || "Sparepart";
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      tableRows.push([
        name,
        "Sparepart",
        qty.toString(),
        `Rp ${price.toLocaleString("id-ID")}`,
        `Rp ${(price * qty).toLocaleString("id-ID")}`
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [0, 128, 128] },
      styles: { fontSize: 9 },
    });

    // Totals
    const finalY = (doc.lastAutoTable?.finalY || 80) + 10;

    doc.setFontSize(10);
    doc.text("Subtotal Jasa:", 140, finalY);
    doc.text(`Rp ${(booking.subtotalServices || 0).toLocaleString("id-ID")}`, 196, finalY, { align: "right" });

    doc.text("Subtotal Sparepart:", 140, finalY + 5);
    doc.text(`Rp ${(booking.subtotalSpareparts || 0).toLocaleString("id-ID")}`, 196, finalY + 5, { align: "right" });

    doc.text("PPN (11%):", 140, finalY + 10);
    doc.text(`Rp ${(booking.taxAmount || 0).toLocaleString("id-ID")}`, 196, finalY + 10, { align: "right" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 140, finalY + 18);
    doc.text(`Rp ${(booking.totalPrice || 0).toLocaleString("id-ID")}`, 196, finalY + 18, { align: "right" });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Terima kasih telah mempercayakan kendaraan Anda kepada kami.", 105, 280, { align: "center" });

    doc.save(`Invoice-${booking._id || "unknown"}.pdf`);
    toast.success("Invoice berhasil didownload");
  } catch (error) {
    console.error("Error generating invoice:", error);
    toast.error("Gagal mendownload invoice");
  }
};
