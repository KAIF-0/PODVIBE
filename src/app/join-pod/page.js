"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../auth/store/authStore";
import toast, { Toaster } from "react-hot-toast";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function PodvibeJoin() {
  const [roomLink, setroomLink] = useState("");
  const [uuid, setUuid] = useState("");
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    setUuid(uuidv4());
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("You must be logged in to join a Podcast!");
      return;
    }
    router.push(`${roomLink}`);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black text-white">
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
      <div className="flex flex-col items-center justify-center border-2 rounded-3xl text-white p-4">
      

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-transparent rounded-2xl shadow-2xl p-8 space-y-7"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.h1
              className="text-4xl font-bold text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              PODVIBE
            </motion.h1>

            <motion.h2
              className="text-2xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Have a smooth One-on-One podcast
            </motion.h2>

            <motion.p
              className="text-center text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              PODVIBE is a best service to stream podcast on youtube
            </motion.p>

            <motion.form
              onSubmit={handleJoin}
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter room link to join a podcast"
                    value={roomLink}
                    onChange={(e) => setroomLink(e.target.value)}
                    className="flex-grow bg-gray-800 text-white border-gray-700"
                  />
                  <Button
                    type="submit"
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Join
                  </Button>
                </div>
              </motion.div>
              <motion.p
                className="text-center text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {isLoggedIn ? (
                  <Link
                    className="hover:underline"
                    href={`/join-pod/pod-room/${uuid}`}
                  >
                    Or Create a Podcast
                  </Link>
                ) : (
                  <span className="animate-pulse text-red-500">
                    You must be logged in to create a podcast!
                  </span>
                )}
              </motion.p>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
