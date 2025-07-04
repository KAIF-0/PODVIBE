"use client";
import { useAuthStore } from "@/app/auth/store/authStore";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "flowbite-react";
import Link from "next/link";
import axios from "axios";
import env from "@/env";
import toast, { Toaster } from "react-hot-toast";
import profile from "@/assets/profile.jpg";
import { Loader2, Search, Menu } from "lucide-react";
import { useStreamStore } from "@/app/auth/store/streamStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSocket } from "@/config/sockets-config/socket";

export default function Navbar({stopRecording}) {
  const { isLoggedIn, logout, userId } = useAuthStore();
  const router = useRouter();
  const {
    storeYtToken,
    refreshYtToken,
    ytCredential,
    startStream: setStreamStarted,
    isStreaming,
    endStream,
  } = useStreamStore();
  const [showEndStream, setShowEndStream] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ytAuthCookie = Cookies.get("isYtAuthenticated");
  const isYtAuthenticated = ytAuthCookie ? JSON.parse(ytAuthCookie) : false;
  const socket = useSocket();

  const handleLogout = async () => {
    const loggingOut = await logout();
    console.log(loggingOut);
    if (loggingOut.success) {
      toast.success("Logged Out!");
      router.push("/");
    } else {
      toast.error("Failed to Log Out");
    }
  };

  const handleEndStream = async () => {
    setIsLoading(true);
    try {
      console.log("Stream has ended!");
      const { access_token, broadcastId } = ytCredential;
      console.log(access_token, broadcastId);
      await socket.emit("endStream", { userId: userId }); //killling FFmpeg Process
      await axios
        .post("/api/end-stream", {
          access_token,
          broadcastId,
        })
        .then(async (e) => {
          console.log("Stream Ended!");
          toast.success("Stream Ended!");
          await endStream(access_token);
          setIsLoading(false);
          setShowEndStream(false);
        });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Oops! Something went wrong");
    }
  };

  return (
    <div className="bg-gray-900 border-b-2 rounded-b-xl">
      {/* Navbar */}
      <Toaster />
      <nav className="relative z-20 flex justify-between items-center p-3 bg-black shadow-2xl bg-opacity-50 md:px-28">
        <Link href="/">
          <h1 className="text-4xl text-white font-bold">PodVibe</h1>
        </Link>
        <div className="flex items-center space-x-4">
          {isStreaming && (
            <>
              {!showEndStream ? (
                <button
                  className="animate-pulse bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-800 font-bold shadow-lg"
                  onClick={() => setShowEndStream(true)}
                >
                  Live
                </button>
              ) : (
                <button
                  className="bg-red-600 text-white py-2 px-4 rounded-full font-bold shadow-lg hover:bg-red-800 transition-colors"
                  onClick={handleEndStream}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-8 h-7 animate-spin" />
                  ) : (
                    "End Stream "
                  )}
                </button>
              )}
            </>
          )}
          {isLoggedIn ? (
            <div className="text-xl">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar
                    img="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
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
                  <DropdownMenuItem className="flex items-center">
                    <Link href="/api/oauth" className="flex items-center">
                      Join Youtube
                      {isYtAuthenticated && (
                        <span className="ml-2 text-green-500">&#10003;</span> // Green check mark
                      )}
                    </Link>
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
        </div>
      </nav>
    </div>
  );
}
