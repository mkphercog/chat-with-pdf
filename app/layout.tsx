import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { ROUTES } from "@/routes";

export const metadata: Metadata = {
  title: "Chat with PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={ROUTES.home.root()}
      signInFallbackRedirectUrl={ROUTES.dashboard.root()}
    >
      <html lang="en">
        <body className="min-h-svh h-svh overflow-auto flex flex-col">
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
