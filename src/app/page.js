"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "./auth/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // You'll need to implement actual auth logic
  const { isLoggedIn, logout } = useAuthStore();

  useEffect(() => {
    setIsLoaded(true);
    // Check if user is logged in here
    // setIsLoggedIn(true); // Uncomment and implement actual auth check
  }, []);

  const handleLogout = async () => {
    const loggingOut = await logout();
    console.log(loggingOut);
    if (loggingOut.success) {
      toast.success("Logged Out!");
    } else {
      toast.error("Failed to Log Out");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Toaster/>
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

      {/* Navbar */}
      <nav className="relative z-20 flex justify-between items-center p-4 bg-black bg-opacity-50">
        <Link href="/">
          <h1 className="text-2xl font-bold">PodVibe</h1>
        </Link>
        {isLoggedIn ? (
          <div className="text-xl">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar
                  img="/images/people/profile-picture-5.jpg"
                  bordered
                  color="light"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/explore">Explore</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/join-pod">Join Podcast</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div onClick={handleLogout}>Sign Out</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link href="/join-in">
            <button className="bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200 transition-colors">
              Join In
            </button>
          </Link>
        )}
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 md:p-16"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold mb-8 text-center"
        >
          PodVibe
        </motion.h1>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl mb-12 text-center max-w-2xl"
        >
          Discover, Create, and Connect through the Power of Podcasts
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <Link href="/discover">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-gray-200"
            >
              Discover Podcasts
            </motion.button>
          </Link>
          <Link href="/join-pod">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-gray-200"
            >
              Get Starded with PodVibe
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {["Trending", "News", "Comedy", "Education", "Technology"].map(
            (category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-white text-black py-2 px-4 rounded-lg cursor-pointer"
              >
                {category}
              </motion.div>
            )
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
