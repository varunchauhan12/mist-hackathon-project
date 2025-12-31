import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import ChatBot from "@/components/chatBot";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parali Platform",
  description: "Smart Parali Management System",
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
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden scroll-smooth bg-gradient-to-tr from-green-50 via-white to-lime-50">
          
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 mt-24">
            {children}
          </main>

          {/* Chatbot */}
          {/* <ChatBot className="fixed bottom-6 right-6 z-50" /> */}

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}

