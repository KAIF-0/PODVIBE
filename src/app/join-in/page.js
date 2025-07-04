"use client";
import React, { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { loginWithOAuth } from "@/app/auth/helper/helper";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

const JoinPage = () => {
  const handleGoogleLogin = async () => {
    await loginWithOAuth("google"); // Call the login function for Google
  };

  const handleGithubLogin = async () => {
    await loginWithOAuth("github"); // Call the login function for GitHub
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-900 text-white">
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
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 md:p-16"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center"
        >
          Join PodVibe
        </motion.h1>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl mb-12 text-center max-w-2xl"
        >
          Connect with your favorite platform to get started
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className="flex flex-col gap-6 w-full max-w-md"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-gray-200 flex items-center justify-center"
            onClick={handleGoogleLogin} // Call the Google login function
          >
            <FaGoogle className="mr-2" /> Continue with Google
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-gray-200 flex items-center justify-center"
            onClick={handleGithubLogin} // Call the GitHub login function
          >
            <FaGithub className="mr-2" /> Continue with GitHub
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 text-sm text-gray-400"
        >
          By continuing, you agree to PodVibe&apos;s Terms of Service and
          Privacy Policy.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default JoinPage;
