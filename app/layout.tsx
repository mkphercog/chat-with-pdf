import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { ROUTES } from "@/routes";
import { FC, PropsWithChildren } from "react";
import Cookies from "@/components/Cookies";

export const metadata: Metadata = {
  title: "Chat with PDF",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ClerkProvider afterSignOutUrl={ROUTES.home.root()}>
      <html lang="en">
        <body className="min-h-screen overflow-auto flex flex-col">
          <Toaster />
          <Cookies />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
};
export default RootLayout;
