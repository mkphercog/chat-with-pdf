import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { ROUTES } from "@/routes";
import { FC, PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Chat with PDF",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ClerkProvider
      afterSignOutUrl={ROUTES.home.root()}
      signInFallbackRedirectUrl={ROUTES.dashboard.root()}
    >
      <html lang="en">
        <body className="min-h-max h-max overflow-auto flex flex-col">
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
};
export default RootLayout;
