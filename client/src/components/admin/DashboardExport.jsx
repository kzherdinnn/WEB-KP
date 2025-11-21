import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  FaDownload as Download,
  FaFileAlt as FileText,
  FaCalendarAlt as Calendar,
  FaChartLine as TrendingUp,
  FaDollarSign as DollarSign,
  FaUsers as Users,
  FaHotel as Hotel,
  FaCheckCircle as CheckCircle,
  FaTimesCircle as XCircle,
  FaClock as Clock,
  FaExclamationCircle as AlertCircle,
} from 'react-icons/fa';

const DashboardExport = ({ bookings, stats }) => {
  const { getToken } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('bookings');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [showModal, setShowModal] = useState(false);

  const exportTypes = [
    {
      id: 'bookings',
      label: 'Bookings Report',
      icon: FileText,
      description: 'Export all booking data with guest and payment information',
    },
    {
      id: 'revenue',
      label: 'Revenue Report',
      icon: DollarSign,
      description: 'Export revenue summary by date and room type',
    },
    {
      id: 'rooms',
      label: 'Room Occupancy',
      icon: Hotel,
      description: 'Export room availability and occupancy statistics',
    },
    {
      id: 'summary',
      label: 'Dashboard Summary',
      icon: TrendingUp,
      description: 'Export complete dashboard statistics and metrics',
    },
  ];

  const generateBookingsCSV = () => {
    const headers = [
      'Booking ID',
      'Guest Name',
      'Email',
      'Phone',
      'Room Type',
      'Number of Rooms',
      'Number of Guests',
      'Check-in Date',
      'Check-out Date',
      'Nights',
      'Price per Night',
      'Total Price',
      'Payment Status',
      'Booking Date',
      'Payment Method',
    ];

    let filteredBookings = bookings || [];

    // Apply date filter
    if (dateRange.startDate) {
      filteredBookings = filteredBookings.filter(
        (b) => new Date(b.createdAt) >= new Date(dateRange.startDate)
      );
    }
    if (dateRange.endDate) {
      filteredBookings = filteredBookings.filter(
        (b) => new Date(b.createdAt) <= new Date(dateRange.endDate)
      );
    }

    const rows = filteredBookings.map((booking) => [
      booking._id,
      booking.guestName || 'N/A',
      booking.guestEmail || 'N/A',
      booking.guestPhone || 'N/A',
      booking.room?.type || 'N/A',
      booking.numberOfRooms || 1,
      booking.numberOfGuests || 1,
      new Date(booking.checkInDate).toLocaleDateString('id-ID'),
      new Date(booking.checkOutDate).toLocaleDateString('id-ID'),
      booking.nights || 0,
      `Rp ${booking.pricePerNight?.toLocaleString('id-ID') || 0}`,
      `Rp ${booking.totalPrice?.toLocaleString('id-ID') || 0}`,
      booking.paymentStatus || 'Pending',
      new Date(booking.createdAt).toLocaleString('id-ID'),
      booking.paymentMethod || 'Midtrans',
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
  };

  const generateRevenueCSV = () => {
    const headers = [
      'Date',
      'Room Type',
      'Number of Bookings',
      'Rooms Booked',
      'Total Revenue',
      'Average Price',
    ];

    let filteredBookings = bookings?.filter((b) => b.paymentStatus === 'success') || [];

    // Apply date filter
    if (dateRange.startDate) {
      filteredBookings = filteredBookings.filter(
        (b) => new Date(b.createdAt) >= new Date(dateRange.startDate)
      );
    }
    if (dateRange.endDate) {
      filteredBookings = filteredBookings.filter(
        (b) => new Date(b.createdAt) <= new Date(dateRange.endDate)
      );
    }

    // Group by date and room type
    const revenueByDateAndRoom = {};
    filteredBookings.forEach((booking) => {
      const date = new Date(booking.createdAt).toLocaleDateString('id-ID');
      const roomType = booking.room?.type || 'Unknown';
      const key = `${date}_${roomType}`;

      if (!revenueByDateAndRoom[key]) {
        revenueByDateAndRoom[key] = {
          date,
          roomType,
          count: 0,
          roomsBooked: 0,
          revenue: 0,
        };
      }

      revenueByDateAndRoom[key].count += 1;
      revenueByDateAndRoom[key].roomsBooked += booking.numberOfRooms || 1;
      revenueByDateAndRoom[key].revenue += booking.totalPrice || 0;
    });

    const rows = Object.values(revenueByDateAndRoom).map((item) => [
      item.date,
      item.roomType,
      item.count,
      item.roomsBooked,
      `Rp ${item.revenue.toLocaleString('id-ID')}`,
      `Rp ${Math.round(item.revenue / item.count).toLocaleString('id-ID')}`,
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
  };

  const generateSummaryCSV = () => {
    const headers = ['Metric', 'Value'];

    const rows = [
      ['Report Generated', new Date().toLocaleString('id-ID')],
      ['Date Range', `${dateRange.startDate || 'All'} to ${dateRange.endDate || 'All'}`],
      ['', ''],
      ['OVERVIEW STATISTICS', ''],
      ['Total Bookings', stats?.totalBookings || 0],
      ['Total Revenue', `Rp ${(stats?.totalRevenue || 0).toLocaleString('id-ID')}`],
      ['Pending Bookings', stats?.pendingBookings || 0],
      ['Confirmed Bookings', stats?.confirmedBookings || 0],
      ['', ''],
      ['BOOKING STATUS BREAKDOWN', ''],
      [
        'Success',
        bookings?.filter((b) => b.paymentStatus === 'success').length || 0,
      ],
      [
        'Pending',
        bookings?.filter((b) => b.paymentStatus === 'pending').length || 0,
      ],
      [
        'Failed',
        bookings?.filter((b) => b.paymentStatus === 'failed').length || 0,
      ],
      ['', ''],
      ['REVENUE METRICS', ''],
      [
        'Average Booking Value',
        `Rp ${Math.round((stats?.totalRevenue || 0) / (stats?.totalBookings || 1)).toLocaleString('id-ID')}`,
      ],
      [
        'Total Rooms Booked',
        bookings?.reduce((sum, b) => sum + (b.numberOfRooms || 1), 0) || 0,
      ],
    ];

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
  };

  const handleExport = async (format) => {
    try {
      setExporting(true);

      let csvContent = '';
      let filename = '';

      switch (exportType) {
        case 'bookings':
          csvContent = generateBookingsCSV();
          filename = `bookings-report-${Date.now()}`;
          break;
        case 'revenue':
          csvContent = generateRevenueCSV();
          filename = `revenue-report-${Date.now()}`;
          break;
        case 'summary':
          csvContent = generateSummaryCSV();
          filename = `dashboard-summary-${Date.now()}`;
          break;
        default:
          csvContent = generateBookingsCSV();
          filename = `export-${Date.now()}`;
      }

      if (format === 'csv') {
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else if (format === 'json') {
        // Download JSON
        let jsonData = {};
        switch (exportType) {
          case 'bookings':
            jsonData = {
              exportType: 'bookings',
              exportDate: new Date().toISOString(),
              dateRange,
              data: bookings || [],
            };
            break;
          case 'summary':
            jsonData = {
              exportType: 'summary',
              exportDate: new Date().toISOString(),
              dateRange,
              statistics: stats,
              bookings: bookings || [],
            };
            break;
          default:
            jsonData = { data: bookings || [] };
        }

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
          type: 'application/json',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
      >
        <Download className="w-4 h-4" />
        Export Data
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Export Dashboard Data</h2>
                  <p className="text-green-100 mt-1">
                    Download reports and analytics in your preferred format
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Export Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Report Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setExportType(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          exportType === type.id
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              exportType === type.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{type.label}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="mb-6 bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Range Filter (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Preview Stats */}
              <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Export Preview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">Total Bookings</p>
                    <p className="text-xl font-bold text-gray-900">
                      {bookings?.length || 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600">
                      Rp {((stats?.totalRevenue || 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center flex flex-col items-center">
                    <p className="text-xs text-gray-600 mb-1">Success</p>
                    <div className="flex items-center gap-1">
                      {getStatusIcon('success')}
                      <p className="text-xl font-bold text-gray-900">
                        {bookings?.filter((b) => b.paymentStatus === 'success').length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center flex flex-col items-center">
                    <p className="text-xs text-gray-600 mb-1">Pending</p>
                    <div className="flex items-center gap-1">
                      {getStatusIcon('pending')}
                      <p className="text-xl font-bold text-gray-900">
                        {bookings?.filter((b) => b.paymentStatus === 'pending').length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={exporting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:bg-gray-400 font-semibold shadow-lg"
                >
                  <Download className={`w-5 h-5 ${exporting ? 'animate-bounce' : ''}`} />
                  {exporting ? 'Exporting...' : 'Export as CSV'}
                </button>
                <button
                  onClick={() => handleExport('json')}
                  disabled={exporting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-semibold shadow-lg"
                >
                  <FileText className={`w-5 h-5 ${exporting ? 'animate-bounce' : ''}`} />
                  {exporting ? 'Exporting...' : 'Export as JSON'}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Files will be downloaded to your default downloads folder
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardExport;
