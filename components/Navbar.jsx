'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to close the mobile menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-blue-900" onClick={closeMenu}>
          TechReview<span className="text-blue-600">.io</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/#comparisons" className="hover:text-blue-600 transition-colors">Comparisons</Link>
          <Link href="/#blogs" className="hover:text-blue-600 transition-colors">Blogs</Link>
          <Link href="/#reviews" className="hover:text-blue-600 transition-colors">Reviews</Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            // Close (X) Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Menu Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="flex flex-col px-6 py-4 space-y-4 text-base font-medium text-gray-700">
            <Link href="/" onClick={closeMenu} className="hover:text-blue-600">Home</Link>
            <Link href="/#blogs" onClick={closeMenu} className="hover:text-blue-600">Blogs</Link>
            <Link href="/#comparisons" onClick={closeMenu} className="hover:text-blue-600">Comparisons</Link>
            <Link href="/#reviews" onClick={closeMenu} className="hover:text-blue-600">Reviews</Link>
          </div>
        </div>
      )}
    </nav>
  );
}