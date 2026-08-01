import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/redux/provider";
import { SocketProvider } from "@/providers/SocketProvider";

export const metadata: Metadata = { title: "Prime Markets", description: "Ecommerce" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ReduxProvider>
          <SocketProvider>
            <Toaster position="top-right" />
            {children}
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}