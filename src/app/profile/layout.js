import Navbar from "@/components/navbar";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PODVIBE",
  description: "Your own Podcast Streaming Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
      {children}</body>
    </html>
  );
}
