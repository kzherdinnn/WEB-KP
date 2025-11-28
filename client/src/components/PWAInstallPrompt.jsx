import { useState, useEffect } from "react";
import { FiX, FiDownload, FiSmartphone } from "react-icons/fi";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const checkStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(checkStandalone);

    // Check if iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    const dismissedTime = localStorage.getItem("pwa-prompt-dismissed-time");

    // Show prompt again after 7 days
    if (dismissed && dismissedTime) {
      const daysSinceDismissed =
        (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log("📱 PWA: beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);

      // Show the prompt after 3 seconds
      setTimeout(() => {
        if (!checkStandalone) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show iOS prompt if on iOS and not in standalone
    if (iOS && !checkStandalone && !dismissed) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("❌ PWA: No deferred prompt available");
      // Show a manual instructions panel so user can follow steps for their device
      setShowManualInstructions(true);
      setInstallError("");
      return;
    }

    console.log("✅ PWA: Showing install prompt");
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`👤 PWA: User choice: ${outcome}`);

    if (outcome === "accepted") {
      console.log("✅ PWA: User accepted the install prompt");
    } else {
      console.log("❌ PWA: User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const [installError, setInstallError] = useState("");
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  const manualInstructionsText =
    'Untuk iOS: tekan tombol Share -> pilih "Add to Home Screen".\nUntuk Android/Chrome: buka menu browser -> pilih "Add to Home screen".';

  const copyManualInstructions = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(manualInstructionsText);
        setInstallError("Instruksi telah disalin ke clipboard.");
      } else {
        setInstallError("Clipboard tidak tersedia pada browser ini.");
      }
    } catch (e) {
      setInstallError("Gagal menyalin instruksi ke clipboard.");
    }
  };

  const closeManualInstructions = () => {
    setShowManualInstructions(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
    localStorage.setItem("pwa-prompt-dismissed-time", Date.now().toString());
  };


  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  // If the prompt is not open, show only the small floating opener button
  if (!showPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <div>
          <button
            type="button"
            onClick={() => setShowPrompt(true)}
            aria-label="Open install prompt"
            className="bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-500 transition-all"
          >
            <FiSmartphone className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // iOS Prompt
  if (isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-slide-up">
        <div className="max-w-md mx-auto bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>


          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <img src="https://ik.imagekit.io/dzlzhxcdo/d-removebg-preview_sep4qr.svg?updatedAt=1763701230874" alt="StayZa" className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Install StayZa</h3>
                <p className="text-sm text-teal-100">Quick access to booking</p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
              <p className="text-sm mb-3 font-medium">
                📱 Install aplikasi StayZa di iPhone Anda:
              </p>
              <ol className="text-sm space-y-2 text-teal-50">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>
                    Tap tombol <strong>Share</strong> di bawah
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>
                    Scroll dan pilih <strong>"Add to Home Screen"</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>Tap "Add" di pojok kanan atas</span>
                </li>
              </ol>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full bg-white text-teal-600 font-semibold py-3 rounded-xl hover:bg-teal-50 transition-all shadow-lg"
            >
              Mengerti
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop Prompt
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[9999] animate-slide-up">
      <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>


        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <img src="https://ik.imagekit.io/dzlzhxcdo/d-removebg-preview_sep4qr.svg?updatedAt=1763701230874" alt="StayZa" className="w-9 h-9" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Install StayZa</h3>
              <p className="text-sm text-teal-100">
                Akses cepat & booking lebih mudah!
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span>Akses lebih cepat tanpa browser</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">📱</span>
                <span>Tampilan seperti aplikasi native</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">🔔</span>
                <span>Notifikasi booking & promo</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">💾</span>
                <span>Bekerja offline untuk beberapa fitur</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 font-semibold py-3 rounded-xl transition-all"
            >
              Nanti
            </button>
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex-1 bg-white text-teal-600 font-semibold py-3 rounded-xl hover:bg-teal-50 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              Install
            </button>
          </div>

          {showManualInstructions && (
            <div className="mt-4 bg-white/10 rounded-lg p-4 text-sm text-teal-50">
              <p className="font-semibold mb-2">Instruksi pemasangan manual</p>
              <ol className="list-decimal pl-5 space-y-2 mb-3">
                <li>Untuk iOS: tekan tombol <strong>Share</strong> lalu pilih <strong>Add to Home Screen</strong>.</li>
                <li>Untuk Android/Chrome: buka menu browser lalu pilih <strong>Add to Home screen</strong>.</li>
              </ol>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyManualInstructions}
                  className="flex-1 bg-white/20 text-white py-2 rounded-md hover:bg-white/30"
                >
                  Salin Instruksi
                </button>
                <button
                  type="button"
                  onClick={closeManualInstructions}
                  className="flex-1 bg-white text-teal-600 py-2 rounded-md hover:bg-teal-50"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          {installError && (
            <div className="mt-3 text-sm text-yellow-100 bg-white/10 rounded-md p-2">
              {installError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
