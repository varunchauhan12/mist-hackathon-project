"use client";

import { useState, useEffect } from "react";
import { Menu, X, AlertTriangle } from "lucide-react";
import Image from "next/image";

export default function DisasterNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Dashboard", path: "/victim/dashboard", critical: true },
    { name: "User Login", path: "/auth/login" },
  ];

  const moreLinks = [
    { name: "Emergency Contacts", path: "/emergency", critical: true },
    { name: "Contact Us", path: "/contact" },
    { name: "logistics", path: "/logistics/dashboard" },
    { name: "Rescue", path: "/rescue/dashboard" },
  ];

  // -------- Scroll Glassmorphism --------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseLink =
    "relative px-4 py-2 text-[#e5e7eb] hover:text-white after:block after:scale-x-0 after:bg-[#38bdf8] after:h-[2px] after:rounded-full after:transition-transform hover:after:scale-x-100 transition-all duration-200 text-lg lg:text-xl tracking-wide";

  const criticalLink =
    "relative px-4 py-2 text-[#ef4444] hover:text-white after:block after:scale-x-0 after:bg-[#ef4444] after:h-[2px] after:rounded-full after:transition-transform hover:after:scale-x-100 transition-all duration-200 text-lg lg:text-xl tracking-wide font-semibold";

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-[#0b0f14]/70 backdrop-blur-2xl shadow-2xl border-b border-white/10"
          : "bg-[#0b0f14]/95 backdrop-blur-xl border-b border-white/12"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
        {/* LOGO */}
        <a href="/" className="flex items-center gap-4">
          <div className="h-20 w-20 border-4 border-[#38bdf8] rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="COMMANDR Logo"
              width={80}
              height={80}
              priority
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 rounded-full"
            />
          </div>

          <span className="text-2xl lg:text-4xl font-extrabold text-[#e5e7eb] tracking-wide drop-shadow-xl hidden sm:block">
            COMMANDR
          </span>
        </a>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ name, path, critical }) => (
            <a
              key={name}
              href={path}
              className={critical ? criticalLink : baseLink}
            >
              {name}
            </a>
          ))}

          {/* DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="px-5 py-2 bg-white/6 hover:bg-white/12 text-[#e5e7eb] rounded-xl shadow-lg transition-all text-lg lg:text-xl font-medium border border-white/12"
            >
              More
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-[#0b0f14]/95 backdrop-blur-xl text-[#e5e7eb] rounded-xl shadow-xl overflow-hidden border border-white/12">
                {moreLinks.map(({ name, path, critical }) => (
                  <a
                    key={name}
                    href={path}
                    onClick={() => setDropdownOpen(false)}
                    className={`block px-6 py-3 text-lg transition-colors ${
                      critical
                        ? "text-[#ef4444] hover:bg-[#ef4444]/10 font-semibold"
                        : "hover:bg-white/6"
                    }`}
                  >
                    {name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="md:hidden text-[#e5e7eb] hover:scale-110 transition-transform"
        >
          {mobileOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0b0f14]/90 backdrop-blur-2xl text-white px-6 pb-6 space-y-4 border-t border-white/12">
          {navLinks.map(({ name, path, critical }) => (
            <a
              key={name}
              href={path}
              onClick={() => setMobileOpen(false)}
              className={`block text-xl transition-all duration-200 ${
                critical
                  ? "scale-110 font-bold text-[#ef4444]"
                  : "hover:text-[#38bdf8]"
              }`}
            >
              {name}
            </a>
          ))}

          <div className="border-t border-white/12 pt-4 space-y-3">
            {moreLinks.map(({ name, path, critical }) => (
              <a
                key={name}
                href={path}
                onClick={() => setMobileOpen(false)}
                className={`block text-xl transition-colors ${
                  critical
                    ? "text-[#ef4444] font-semibold"
                    : "hover:text-[#38bdf8]"
                }`}
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
