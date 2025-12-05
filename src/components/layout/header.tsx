"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Analyze", href: "/analyze" },
  { name: "Products", href: "/products" },
  { name: "Ingredients", href: "/ingredients" },
  { name: "Routines", href: "/routines" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo + Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tighter text-slate-900 hover:opacity-80 transition-opacity"
            aria-label="Skintelect Home"
          >
            SKIN<span className="text-rose-500">TELECT</span>
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500"
            role="menubar"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition hover:text-slate-900"
                role="menuitem"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-sm font-medium text-slate-900 hover:text-rose-600 transition-colors"
          >
            Sign in
          </button>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800 hover:scale-105 transform duration-200"
          >
            Get Started
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden border-t border-slate-200 bg-white transition-all duration-300 ${
          mobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
        role="menu"
        aria-label="Mobile navigation"
      >
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block py-2 text-slate-600 hover:text-slate-900"
              role="menuitem"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
