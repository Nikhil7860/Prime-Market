import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/redux/provider";

export const metadata: Metadata = { title: "Prime Markets", description: "Ecommerce" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning><ReduxProvider>{children}<Toaster position="top-right" /></ReduxProvider></body>
    </html>
  );
}