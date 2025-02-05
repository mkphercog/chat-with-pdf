import type { FC, PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/routes";
import { LucideArrowLeft } from "lucide-react";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const { userId } = auth();

  if (userId != null) redirect(ROUTES.dashboard.root());

  return (
    <div className="min-h-screen flex flex-col justify-between items-center gap-10 p-5 md:p-20">
      <div className="flex flex-col gap-4 my-5 items-center">
        <p className="mt-2 text-3xl font-bold tracking-tight  sm:text-4xl">
          Chat with <span className="text-indigo-600">PDF</span>
        </p>
      </div>
      <div className="flex flex-col justify-center items-center">
        {children}
      </div>
      <Button asChild variant="link" className="text-indigo-600">
        <Link href={ROUTES.home.root()}>
          <LucideArrowLeft /> Home page
        </Link>
      </Button>
    </div>
  );
};

export default AuthLayout;
