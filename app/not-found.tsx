import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import { BanIcon } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="h-screen w-full  flex flex-col justify-center items-center gap-4">
      <BanIcon className="w-24 h-24 text-indigo-600" />
      <h2 className="font-bold text-2xl">Page not found</h2>
      <Button asChild>
        <Link href={ROUTES.home.root()}>HOME PAGE</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
