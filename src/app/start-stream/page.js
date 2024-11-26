"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Youtube } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "../auth/store/authStore";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { io } from "socket.io-client";
import env from "@/env";

export default function Component() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [socket, setSocket] = useState(null);
  const {
    isLoggedIn,
    logout,
    storeYtToken,
    refreshYtToken,
    ytCredential,
    isYtJoined,
    startStream: setStreamStarted,
    isStreaming,
    userId,
  } = useAuthStore();

  useEffect(() => {
    const socket = io(env.STREAM_SERVER_URL);
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("You must be logged in to stream your Podcast!");
      return;
    }
    setIsLoading(true);
    console.log(title, description);

    try {
      if (!isYtJoined) {
        await storeYtToken();
      }

      await refreshYtToken();

      const { access_token } = ytCredential;
      await axios
        .post("/api/create-broadcast", {
          access_token: access_token,
          title: title,
          description: description,
        })
        .then(async (e) => {
          const { broadcastId } = e.data;
          console.log(broadcastId);

          await axios
            .post("/api/create-stream", {
              access_token: access_token,
              title: title,
            })
            .then(async (e) => {
              const { streamId } = e.data;
              console.log(streamId);

              await axios
                .post("/api/bind-stream", {
                  access_token: access_token,
                  broadcastId: broadcastId,
                  streamId: streamId,
                })
                .then(async (e) => {
                  const { boundStreamId } = e.data;
                  console.log(boundStreamId);

                  await axios
                    .post("/api/stream-key", {
                      access_token: access_token,
                      boundStreamId: boundStreamId,
                    })
                    .then(async (e) => {
                      console.log("STREAM DETAILS:", e.data);
                      socket.emit("streamKey", {
                        streamKey: e.data.streamKey,
                        userId: userId,
                      });
                      await new Promise((resolve) => setTimeout(resolve, 2000));
                      await startStream();
                      toast.loading(
                        "Broadcast started! Please wait to go live.",
                        {
                          duration: 3000,
                        }
                      );
                      await new Promise((resolve) =>
                        setTimeout(resolve, 60000)
                      );
                      await axios
                        .post("/api/start-stream", {
                          access_token: access_token,
                          broadcastId: broadcastId,
                        })
                        .then(async (e) => {
                          console.log("STREAM STARTED");
                          setStreamStarted(access_token, broadcastId); //isStreaming = true set kardega;
                          toast.success("You are Live Now!");
                        })
                        .catch((er) => {
                          console.log("ERROR", er);
                        });
                    });
                });
            });
        });
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "You are not enabled for live streaming"
      ) {
        toast.error("Please enable live streaming on Youtube!");
      }
      console.log(error.response);
      toast.error("Stream Failed! Try again later...");
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const startStream = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      //if user audio stream not started
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const combinedStream = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      console.log("Combined Stream:", combinedStream);

      const mediaRecorder = new MediaRecorder(combinedStream, {
        audioBitsPerSecond: 125000,
        videoBitsPerSecond: 2500000,
        framerate: 25,
      });

      if (!mediaRecorder) {
        alert("Media Recorder is not supported in this browser!");
      }

      // 20ms pe frames jaenge
      mediaRecorder.start(20);

      mediaRecorder.ondataavailable = (e) => {
        // console.log("Binary data: ", e.data);
        socket.emit("streamData", { userId: userId, streamData: e.data });
      };
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  // const setStreamKey = async (key) => {
  //   // socket.emit("streamKey", key);
  //   await axios.post(`${env.STREAM_SERVER_URL}/set-streamKey`,{
  //     streamKey: key
  //   }).then((e)=>{
  //     console.log("Stream Key Set");
  //   }).catch((err) => {
  //     if (err.response) {
  //       console.error("Error response data:", err.response.data);
  //     } else {
  //       console.error("Error message:", err.message);
  //     }
  //   });
  // };

  return (
    <div className="flex flex-col items-center md:mt-16 justify-center p-4">
      <Toaster />
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Start Streaming
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300"
          >
            Set up your YouTube live stream
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Stream Title
            </label>
            <Input
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your stream title"
              className="bg-white/20 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Stream Description
            </label>
            <Textarea
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your stream description"
              className="bg-white/20 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 transform hover:scale-[1.02]"
            disabled={isLoading && isStreaming}
          >
            <Youtube className="w-5 h-5 mr-2" />
            {isLoading ? "Starting Stream..." : "Start YouTube Stream"}
          </Button>
        </motion.form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-wrap justify-center gap-2"
      >
        {["Gaming", "IRL", "Music", "Education", "Technology"].map(
          (tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200 hover:bg-white/20 transition-colors cursor-pointer"
            >
              {tag}
            </motion.span>
          )
        )}
      </motion.div>
    </div>
  );
}
