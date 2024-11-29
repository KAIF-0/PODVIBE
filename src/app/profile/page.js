"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Loader2,
  Search,
  Menu,
  User,
  Settings,
  Video,
  Users,
} from "lucide-react";
import Link from "next/link";
import fetchStreams from "../auth/helper/fetchStreams";
import { useAuthStore } from "../auth/store/authStore";
import Image from "next/image";
import profile from "@/assets/profile.jpg";
import { useStreamStore } from "../auth/store/streamStore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [userStreams, setUserStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, username, logout } = useAuthStore();
  const { refreshYtToken } = useStreamStore();

  useEffect(() => {
    try {
      fetchUserData();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUserInfo = {
      username: "JohnDoe",
      avatar: "/placeholder.svg?height=200&width=200",
      followers: 1500,
      following: 250,
      totalViews: 50000,
    };

    await fetchStreams()
      .then((e) => {
        // console.log("USER STREAMS: ", e.streams);
        setUserStreams(e.streams);
      })
      .catch(async (err) => {
        console.error("Error fetching streams: ", err);
        setLoading(false);
        if (err.response && err.response.status === 500) {
          //trying refreshing token
          const refreshToken = await refreshYtToken();
          if (refreshToken && refreshToken.message === "userSession expired!") {
            toast.error("Your session has been expired! Please Login again...");
            await logout();
            router.push("/join-in?session=expired");
          }
        }
      });

    setUserInfo(mockUserInfo);
    setLoading(false);
  };

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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show">
            {/* User Info */}
            <motion.div
              variants={item}
              className="bg-transparent shadow-2xl rounded-lg p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Image
                  height={200}
                  width={200}
                  src={profile}
                  alt={username}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{username}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-300">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      <span>{userInfo.followers} followers</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      <span>{userInfo.following} following</span>
                    </div>
                    <div className="flex items-center">
                      <Video className="w-5 h-5 mr-2" />
                      <span>
                        {userInfo.totalViews.toLocaleString()} total views
                      </span>
                    </div>
                  </div>
                </div>
                <button className="ml-auto px-4 py-2 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                  <Settings className="w-5 h-5 inline-block mr-2" />
                  Edit Profile
                </button>
              </div>
            </motion.div>

            {/* User Streams */}
            <motion.div variants={item}>
              <h2 className="text-2xl font-bold mb-4">Recent Streams</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userStreams.map((stream) => (
                  <motion.div
                    key={stream.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-transparent shadow-2xl rounded-lg overflow-hidden cursor-pointer group"
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
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-red-600 px-2 py-1 rounded text-sm">
                        {stream.viewerCount.toLocaleString()} views
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-gray-300">
                        {stream.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Streamed on{" "}
                        {new Date(stream.publishedAt).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
