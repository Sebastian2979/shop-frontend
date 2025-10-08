"use client";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/pumo.svg";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import AdminDropDown from "./AdminDropDown";
import { useSelector } from "react-redux";

export const Navbar = () => {
  
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScroll, setIsScroll] = useState(false);

  // Summe aller Mengen im Warenkorb
  const count = useSelector((state) =>
    (state.cart?.items ?? []).reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0
    )
  );

  // "99+" Anzeige ab großer Menge
  const displayCount = count > 99 ? "99+" : count;

  // dezente Bounce-Animation, wenn sich der Count ändert
  const [bump, setBump] = useState(false);
  const prevCountRef = useRef(count);
  useEffect(() => {
    if (count > 0 && count !== prevCountRef.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 300);
      prevCountRef.current = count;
      return () => clearTimeout(t);
    }
    prevCountRef.current = count;
  }, [count]);

  const scrollHandler = () => {
    setIsScroll(window.scrollY > 200);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 text-white ${isScroll ? "bg-black/70 backdrop-blur shadow-md transition-colors duration-300" : ""
        }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto p-4">
        {/* Logo & Links (links) */}
        <div className="flex items-center space-x-4 p-4">
          <Link to="/" aria-label="Startseite">
            <img src={logo} alt="Logo" className="w-8 h-8" />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="font-medium hover:underline">
              Home
            </Link>
            {/* Cart Button (Desktop) */}
            <Link
              to="/cart"
              className={`relative inline-flex items-center p-2 rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition
                hover:bg-white/10 ${bump ? "animate-bounce" : ""}`}
              aria-label={`Warenkorb (${count} Artikel)`}
              title={`Warenkorb (${count} Artikel)`}
            >
              <ShoppingCart className="w-6 h-6" />
              {/* Live-Region für Screenreader */}
              <span className="sr-only" aria-live="polite">
                {count} Artikel im Warenkorb
              </span>

              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid place-items-center h-5 min-w-[1.25rem] px-1 rounded-full text-xs font-semibold bg-teal-500 text-white shadow ring-1 ring-black/10">
                  {displayCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button (rechts) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Navigation umschalten"
            className="p-2 rounded hover:bg-white/10 focus:outline-none focus:ring focus:ring-teal-400"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Auth Buttons (rechts, Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Button
                onClick={logout}
                className="bg-amber-500 text-white hover:bg-amber-600"
              >
                Logout
              </Button>
              <span className="font-medium">Hallo {user.name}</span>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Link
            to="/"
            className="block font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {/* Cart (Mobile) */}
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 px-2 py-2 rounded hover:bg-white/10"
            onClick={() => setMenuOpen(false)}
            aria-label={`Warenkorb (${count} Artikel)`}
            title={`Warenkorb (${count} Artikel)`}
          >
            <ShoppingCart className="w-6 h-6" />
            <span>Warenkorb</span>
            {count > 0 && (
              <span className="ml-auto inline-grid place-items-center h-5 min-w-[1.25rem] px-1 rounded-full text-xs font-semibold bg-teal-500 text-white shadow ring-1 ring-black/10">
                {displayCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              className="block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};