"use client";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/pumo.svg";
import logoBlack from "../assets/pumo-black.svg";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, LogIn, LogOut } from "lucide-react";
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
    setIsScroll(window.scrollY > 0);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 text-orange-600 ${isScroll ? "bg-black/70 backdrop-blur shadow-md transition-colors duration-300 text-white" : ""
        }`}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto p-4">
        {/* Logo & Links (links) */}
        <div className="flex items-center space-x-4 p-4">
          <Link to="/" aria-label="Startseite">
            {isScroll ? <img src={logo} alt="Logo" className="w-8 h-8" /> : <img src={logoBlack} alt="Logo" className="w-8 h-8 opacity-40" />}
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="font-medium hover:underline ">
              Home
            </Link>
            <Link to="https://app.pumo.digital/@sebastian/mein-mvp-shopsystem" className="font-medium hover:underline" target="blank">
              Blog
            </Link>
          </div>
        </div>

        

        {/* Mobile Menu Button (rechts) */}
        <div className="flex gap-3 md:hidden">
          <Link
            to="/cart"
            className={`relative inline-flex items-center p-2 rounded-lg focus:outline-none focus:ring focus:ring-orange-600 transition
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
              <span className="absolute -top-1.5 -right-1.5 grid place-items-center h-5 min-w-[1.25rem] px-1 rounded-full text-xs font-semibold bg-orange-400 text-white shadow ring-1 ring-black/10">
                {displayCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Navigation umschalten"
            className="p-2 rounded hover:bg-white/10 focus:outline-none focus:ring focus:ring-orange-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Auth Buttons (rechts, Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/cart"
            className={`relative inline-flex items-center p-2 rounded-lg focus:outline-none focus:ring focus:ring-orange-600 transition
                hover:bg-white/10 ${bump ? "animate-bounce" : ""}`}
            aria-label={`Warenkorb (${count} Artikel)`}
            title={`Warenkorb (${count} Artikel)`}
          >
            <ShoppingCart className="w-8 h-8" />
            {/* Live-Region für Screenreader */}
            <span className="sr-only" aria-live="polite">
              {count} Artikel im Warenkorb
            </span>

            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid place-items-center h-5 min-w-[1.25rem] px-1 rounded-full text-xs font-semibold bg-orange-400 text-white shadow ring-1 ring-black/10">
                {displayCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Button
                onClick={logout}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                title='Logout'
              >
                <div>Logout</div><LogOut size={24}/>
              </Button>
              {/* Hier soll ein Userbereich entstehen mit dropdown */}
              <Button size="default" variant="outline" className="cursor-pointer" onClick={() => alert('hier wird ein Userbereich entstehen')}>{user.name}</Button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              title='Login'
            >
              <LogIn size={24}/>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden p-4 space-y-3">
          <Link
            to="/"
            className="block font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="https://app.pumo.digital/@sebastian/mein-mvp-shopsystem"
            className="block font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </Link>

          <div>
            {user ? (
              <>
                <Button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
                >
                  <div>Logout</div><LogOut />
                </Button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex justify-center bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
                onClick={() => setMenuOpen(false)}
              >
                <div>Login</div>&nbsp;<LogIn />
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};