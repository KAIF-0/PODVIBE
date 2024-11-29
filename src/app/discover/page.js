"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2, Search, Menu } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useAuthStore } from "../auth/store/authStore";
import fetchStreams from "@/app/auth/helper/fetchStreams.js";
import { useStreamStore } from "../auth/store/streamStore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function DiscoverPage() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { logout } = useAuthStore();
  const { ytCredential, refreshYtToken } = useStreamStore();

  useEffect(() => {
    fetchStream();
  }, []);

  const fetchStream = async () => {
    try {
      const { access_token } = ytCredential;

      await fetchStreams().then((e) => {
        // console.log("USER STREAMS: ", e.streams);
        setStreams(e.streams);
      });
    } catch (err) {
      if (err.response) {
        console.error("Error response data:", err.response.data);
      } else {
        console.error("Error message:", err.message);
      }

      setLoading(false);
      setStreams([]);

      if (err.response && err.response.status === 500) {
        //trying refreshing token
        const refreshToken = await refreshYtToken();
        if (refreshToken && refreshToken.message === "userSession expired!") {
          toast.error("Your session has been expired! Please Login again...");
          await logout();
          router.push("/join-in?session=expired");
        }
      }
    }
    setLoading(false);
  };

  const categories = [
    "all",
    "trending",
    "news",
    "comedy",
    "education",
    "technology",
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="text-white">
      <Toaster />
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 relative z-10 text-center">
          Discover Pod Streams
        </h1>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 relative z-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? "bg-white text-gray-900"
                  : "shadow-xl text-gray-300 hover:bg-white hover:text-black"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        )}

        {/* Streams Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
        >
          {streams.map((stream) => (
            <motion.div
              key={stream.id}
              variants={item}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-transparent shadow-2xl p-2 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() =>
                window.open(
                  `https://youtube.com/watch?v=${stream.id}`,
                  "_blank"
                )
              }
            >
              <div className="relative">
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="w-full aspect-video object-cover rounded-lg"
                />
                <div className="absolute bottom-2 right-2 bg-red-600 px-2 py-1 rounded text-sm">
                  {stream.viewerCount.toLocaleString()} Views
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-gray-300">
                  {stream.title}
                </h3>
                <div className="flex flex-row justify-between">
                  <p className="text-gray-400 text-sm">{stream.description}</p>
                  <p className="text-gray-700 text-sm">
                    {new Date(stream.publishedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {!loading && streams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No streams found</p>
          </div>
        )}
      </main>
    </div>
  );
}
