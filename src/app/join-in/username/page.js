"use client";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { account, databases } from "@/config/appwrite-config/appwrite";
import { useAuthStore } from "@/app/auth/store/authStore";
import { Query } from "appwrite";
import env from "@/env";
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "flowbite-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import google from "@/assets/google.png";
import github from "@/assets/github.png";
import Image from "next/image";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function UsernameForm() {
  const [provider, setProvider] = useState(""); // either "github" or "google"
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLaoding, setisLoading] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login } = useAuthStore();

  useEffect(() => {
    // Simulate OAuth login success
    // This would be handled by your OAuth logic, determining which provider logged in
    const queryProvider = searchParams.get("provider");
    if (queryProvider === "google" || queryProvider === "github") {
      setProvider(queryProvider);
      setIsLoggedIn(true);
    }
    console.log(user);
    account
      .get("current")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    console.log("Username submitted:", username);
    if (username.trim().length === 0) {
      toast.error("Please enter a valid username!");
      setisLoading(false);
      return;
    }
    try {
      const checkUsername = await databases.listDocuments(
        env.APPWRITE_DATABASE_ID,
        env.APPWRITE_USER_COLLECTION_ID,
        [Query.equal("username", username.trim())]
      );
      if (checkUsername.documents.length > 0) {
        toast.error("Username already exists!");
        setisLoading(false);
      } else {
        console.log("USER NAME SAVED");

        const loginSuccess = await login(username.trim());

        if (loginSuccess.success) {
          setisLoading(false);
          router.push("/");
        } else {
          setisLoading(false);
          toast.error("Failed to login");
        }
      }
    } catch (error) {
      console.log("Error: ", error);
      setisLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-900 text-white">
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

      {isLoggedIn ? (
        <div className="w-full max-w-lg border-white border-2 rounded-3xl">
          {/* Card container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-xl shadow-2xl text-center"
          >
            {/* Success animation for provider logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                className="w-48 h-48 mx-auto"
              >
                <Image
                  width={40}
                  height={40}
                  quality={100}
                  layout="fixed"
                  src={provider == "google" ? google : github}
                  alt="Rotating"
                  className="w-full h-full object-cover rounded-full"
                />
              </motion.div>
              <p className="text-xl mt-4 font-semibold">
                Logged in with {provider}!
              </p>
            </motion.div>

            {/* Username form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center space-y-4"
            >
              <motion.input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                className="w-full px-4 py-3 text-lg rounded-lg bg-gray-800 text-white border-2 border-gray-600 focus:ring-2 focus:ring-gray-500"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                required
              />
              <motion.button
                disabled={isLaoding}
                type="submit"
                className="w-full px-6 py-3 text-lg rounded-lg bg-white text-black hover:bg-gray-300 focus:outline-none font-bold"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {isLaoding ? (
                  <div className="space-x-2">
                    <Spinner aria-label="Default status example" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )}
    </div>
  );
}

// Wrapping the component with Suspense
const WrappedUsernameForm = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      }
    >
      <UsernameForm />
    </Suspense>
  );
};

export default WrappedUsernameForm;
