// main.jsx — wrap entire app in ClerkProvider
// Make sure VITE_CLERK_PUBLISHABLE_KEY is set in frontend/.env

import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY\n" +
    "1. Go to https://dashboard.clerk.com\n" +
    "2. Create an app → copy Publishable Key\n" +
    "3. Add it to frontend/.env as VITE_CLERK_PUBLISHABLE_KEY=pk_test_..."
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);