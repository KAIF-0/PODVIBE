"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black z-0" />
      <motion.div
        className="absolute inset-0 z-0"
        initial={{
          background:
            "radial-gradient(circle at 50% 50%, #ffffff 0%, #000000 100%)",
        }}
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, #ffffff 0%, #000000 100%)",
            "radial-gradient(circle at 100% 0%, #ffffff 0%, #000000 100%)",
            "radial-gradient(circle at 100% 100%, #ffffff 0%, #000000 100%)",
            "radial-gradient(circle at 0% 100%, #ffffff 0%, #000000 100%)",
            "radial-gradient(circle at 50% 50%, #ffffff 0%, #000000 100%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-6xl md:text-8xl font-bold mb-4 text-center relative z-20"
      >
        404
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-8 relative z-20"
      >
        <h2 className="text-2xl md:text-4xl font-semibold mb-2">
          Oops! Page Not Found
        </h2>
        <p className="text-lg md:text-xl text-gray-300">
          The page you&apos;re looking for seems to be off the air.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative z-20"
      >
        <Link
          href="/"
          className="bg-white text-black px-6 py-3 rounded-full font-semibold text-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          Back to Home
        </Link>
      </motion.div>
      <motion.div
        className="mt-12 flex flex-wrap justify-center gap-4 relative z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {["Trending", "News", "Comedy", "Education", "Technology"].map(
          (category, index) => (
            <motion.span
              key={category}
              className="bg-gray-700 text-white px-4 py-2 rounded-full text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
            >
              {category}
            </motion.span>
          )
        )}
      </motion.div>
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientAnimation 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
