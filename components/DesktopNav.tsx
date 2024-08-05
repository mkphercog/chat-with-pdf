import Link from "next/link";
import { Button } from "./ui/button";
import { ROUTES } from "@/routes";
import { FilePlus2 } from "lucide-react";
import UpgradeButton from "./UpgradeButton";

const DesktopNav = () => {
  return (
    <div className="hidden md:flex items-center space-x-2 ">
      <Button asChild variant="outline">
        <Link href={ROUTES.dashboard.root()}>My documents</Link>
      </Button>

      <Button asChild variant="outline" className="border-indigo-600">
        <Link href={ROUTES.dashboard.uploadFile()}>
          <FilePlus2 className="text-indigo-600" />
        </Link>
      </Button>

      <UpgradeButton />
    </div>
  );
};
export default DesktopNav;
