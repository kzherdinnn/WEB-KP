import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import { AppContextProvider } from "./context/AppContext.jsx";

// Register PWA Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "✅ PWA: Service Worker registered successfully:",
          registration,
        );

        // Check for updates every hour
        setInterval(
          () => {
            registration.update();
          },
          60 * 60 * 1000,
        );
      })
      .catch((error) => {
        console.error("❌ PWA: Service Worker registration failed:", error);
      });
  });
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </ClerkProvider>,
);

// Log PWA status
console.log("🚀 PWA Status:");
console.log("- Service Worker Support:", "serviceWorker" in navigator);
console.log(
  "- Standalone Mode:",
  window.matchMedia("(display-mode: standalone)").matches,
);
console.log("- iOS Standalone:", window.navigator.standalone === true);
