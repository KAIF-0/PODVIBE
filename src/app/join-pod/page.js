"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function PodvibeJoin() {
  const [roomLink, setroomLink] = useState("");
  const router = useRouter();

  const handleJoin = (e) => {
    e.preventDefault();
    router.push(`${roomLink}`);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-32  text-white p-4">
        <motion.div
          className="absolute inset-0 z-0 h-full"
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
                className="text-center hover:underline text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Link href={`/join-pod/pod-room/${uuidv4()}`}>
                  Or Create a Podcast
                </Link>
              </motion.p>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
