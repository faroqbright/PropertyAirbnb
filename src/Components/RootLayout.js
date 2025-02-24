"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "@/app/globals.css";
import Navbar from "@/Components/LandingPage/Common/Navbar";
import Footer from "@/Components/LandingPage/Common/Footer";
import { persistor, store } from "@/store/store";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/Auth")) {
      window.scrollTo({
        top: 520, 
        behavior: "smooth",
      });
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body className="bg-white font-plus-jakarta text-black">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
            />
            <Navbar />
            {children}
            <Footer />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
