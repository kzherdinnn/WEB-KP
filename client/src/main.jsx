import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import { AppContextProvider } from "./context/AppContext.jsx";

// PWA Service Worker will be auto-registered by vite-plugin-pwa
// No need for manual registration

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
  </ClerkProvider>
);

// Log PWA status
console.log("🚀 PWA Status:");
console.log("- Service Worker Support:", "serviceWorker" in navigator);
console.log(
  "- Standalone Mode:",
  window.matchMedia("(display-mode: standalone)").matches
);
console.log("- iOS Standalone:", window.navigator.standalone === true);
