import { Inter } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/config/sockets-config/socket";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PODVIBE",
  description: "Your own Podcast Streaming Application",
};

export default function RootLayout({ children }) {
  return (
    <SocketProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </SocketProvider>
  );
}
