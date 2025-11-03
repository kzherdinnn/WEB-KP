import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PaymentLoadingOverlay from './PaymentLoadingOverlay';

const MIDTRANS_SNAP_URL = "https://app.sandbox.midtrans.com/snap/snap.js";
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

const MidtransPaymentHandler = ({
  children,
  onPaymentSuccess,
  onPaymentPending,
  onPaymentError,
  onPaymentClose
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('processing');
  const [processingMessage, setProcessingMessage] = useState('');
  const navigate = useNavigate();

  // Load Midtrans Snap Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = MIDTRANS_SNAP_URL;
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
    script.async = true;

    script.onload = () => {
      console.log('✅ Midtrans Snap script loaded successfully');
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error('❌ Failed to load Midtrans Snap script');
      toast.error('Gagal memuat sistem pembayaran. Silakan refresh halaman.');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle Payment Process
  const handlePayment = useCallback(async (snapToken, options = {}) => {
    if (!isScriptLoaded) {
      toast.error('Sistem pembayaran belum siap. Mohon tunggu sebentar.');
      return;
    }

    if (!window.snap) {
      toast.error('Sistem pembayaran tidak tersedia. Silakan refresh halaman.');
      return;
    }

    if (!snapToken) {
      toast.error('Token pembayaran tidak valid.');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStatus('processing');
      setProcessingMessage('Membuka halaman pembayaran...');

      // Open Midtrans Snap Payment
      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          console.log('✅ Payment Success:', result);
          setProcessingStatus('verifying');
          setProcessingMessage('Memverifikasi pembayaran Anda...');

          setTimeout(() => {
            setProcessingStatus('success');
            setProcessingMessage('Pembayaran berhasil dikonfirmasi!');

            toast.success('Pembayaran berhasil! Booking Anda telah dikonfirmasi.', {
              duration: 4000,
              icon: '✅'
            });

            setTimeout(() => {
              setIsProcessing(false);
              if (onPaymentSuccess) {
                onPaymentSuccess(result);
              } else {
                navigate('/my-bookings');
              }
            }, 1500);
          }, 2000);
        },

        onPending: (result) => {
          console.log('⏳ Payment Pending:', result);
          setProcessingStatus('verifying');
          setProcessingMessage('Pembayaran sedang diproses...');

          setTimeout(() => {
            toast('Pembayaran Anda sedang diproses. Kami akan mengkonfirmasi dalam beberapa saat.', {
              icon: '⏳',
              duration: 5000
            });

            setIsProcessing(false);

            if (onPaymentPending) {
              onPaymentPending(result);
            } else {
              navigate('/my-bookings');
            }
          }, 2000);
        },

        onError: (error) => {
          console.error('❌ Payment Error:', error);
          setProcessingStatus('processing');
          setIsProcessing(false);

          toast.error('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.', {
            duration: 4000
          });

          if (onPaymentError) {
            onPaymentError(error);
          }
        },

        onClose: () => {
          console.log('🚪 Payment popup closed');
          setIsProcessing(false);

          const message = options.closeMessage || 'Anda menutup popup pembayaran.';
          toast(message, {
            icon: 'ℹ️',
            duration: 3000
          });

          if (onPaymentClose) {
            onPaymentClose();
          }
        }
      });
    } catch (error) {
      console.error('❌ Error opening payment:', error);
      setIsProcessing(false);
      toast.error('Gagal membuka halaman pembayaran. Silakan coba lagi.');

      if (onPaymentError) {
        onPaymentError(error);
      }
    }
  }, [isScriptLoaded, navigate, onPaymentSuccess, onPaymentPending, onPaymentError, onPaymentClose]);

  return (
    <>
      {children({ handlePayment, isScriptLoaded, isProcessing })}

      <PaymentLoadingOverlay
        isVisible={isProcessing}
        status={processingStatus}
        message={processingMessage}
      />
    </>
  );
};

export default MidtransPaymentHandler;
