import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import LocationProvider from "@/app/providers/LocationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COMMANDR - Disaster Management Platform",
  description:
    "Empowering communities with real-time alerts, resources, and emergency response coordination.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 🔐 Auth first */}
        <AuthProvider>
          {/* 🔌 Socket depends on auth */}
          <SocketProvider>
            {/* 📍 Location depends on auth */}
            <LocationProvider>
              <div className="flex flex-col min-h-screen w-full overflow-x-hidden scroll-smooth bg-gradient-to-tr from-green-50 via-white to-lime-50">
                <Navbar />

                <main className="flex-1 mt-24">
                  {children}
                </main>

                <Footer />
              </div>
            </LocationProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
