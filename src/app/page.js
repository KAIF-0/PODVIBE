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
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/navbar";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const ytAuthCookie = Cookies.get("isYtAuthenticated");
  const isYtAuthenticated = ytAuthCookie ? JSON.parse(ytAuthCookie) : false;  
  const router = useRouter();

//custome routing to check auth first

  const redirect = (path)=>{
    if (!isYtAuthenticated) {
          toast.custom(
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between bg-white text-black p-4 rounded-xl shadow-lg border"
              style={{ minWidth: "320px" }}
            >
              <div>
                <h4 className="text-md font-bold text-black">
                  You are not authenticated with YouTube!
                </h4>
              </div>
              <button
                onClick={() => router.push("/api/oauth")}
                className="ml-4 bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-white hover:text-red-600 border hover:border-red-600"
              >
                Authenticate
              </button>
            </motion.div>,
            {
              duration: 2000,
            }
          );
          return;
        }
    router.push(path);

  }

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />
      <Toaster />
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.3}
        duration={5}
        repeatDelay={0.5}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />

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
          className="flex flex-col md:flex-row gap-5"
        >
          <div onClick={() => redirect("/discover")}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-gray-200"
            >
              Discover Podcasts
            </motion.button>
          </div>
          <Link href="/join-pod">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-gray-200"
            >
              Get Starded with Podcast
            </motion.button>
          </Link>
          <Link href="/start-stream">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-gray-200"
            >
              Start Stream
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
