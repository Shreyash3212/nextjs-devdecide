"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // 1. Import the Next.js Image component
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const menuVariants = {
    closed: { x: "100%", transition: { type: "tween", duration: 0.3 } },
    open: { x: 0, transition: { type: "tween", duration: 0.3 } },
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span>
                <Image
                  src="/icon.png"
                  alt="DevDecide Logo"
                  width={150} // Adjust this width based on your logo's dimensions
                  height={40} // Adjust this height to maintain aspect ratio
                  className="object-contain h-8 w-auto rounded-md" // Forces it to fit nicely in the navbar
                  priority // Tells Next.js to load this image immediately
                />
              </span>
              <span>
                <strong>Dev</strong>Decide
              </span>
            </div>
          </Link>

          {/* Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/comparisons"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Comparisons
            </Link>
            <Link
              href="/blogs"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Blogs
            </Link>
            <Link
              href="/reviews"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Reviews
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 z-50 relative"
            aria-label="Toggle Menu"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-gray-900 block transition-colors"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-gray-900 block my-1.5"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-gray-900 block"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />

            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 flex flex-col pt-20 px-6 md:hidden"
            >
              <div className="flex flex-col space-y-6">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                >
                  Home
                </Link>
                <Link
                  href="/comparisons"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                >
                  Comparisons
                </Link>
                <Link
                  href="/blogs"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                >
                  Blogs
                </Link>
                <Link
                  href="/reviews"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                >
                  Reviews
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
