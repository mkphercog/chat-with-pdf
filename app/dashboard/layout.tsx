import Header from "@/components/Header";
import { ClerkLoaded } from "@clerk/nextjs";
import { FC, PropsWithChildren } from "react";

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ClerkLoaded>
      <div className="flex flex-1 flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </ClerkLoaded>
  );
};
export default DashboardLayout;
