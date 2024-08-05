import { SignedIn, UserButton, UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { FilePlus2, MenuIcon } from "lucide-react";
import UpgradeButton from "./UpgradeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/routes";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";

const Header = () => {
  return (
    <header className=" sticky top-0 left-0 z-50 bg-white shadow-sm p-5 border-b ">
      <nav className="flex justify-between max-w-7xl mx-auto">
        <Link href={ROUTES.home.root()} className="text-2xl">
          Chat to <span className="text-indigo-600">PDF</span>
        </Link>

        <SignedIn>
          <div className="flex items-center gap-3">
            <MobileNav />
            <DesktopNav />
            <UserButton />
          </div>
        </SignedIn>
      </nav>
    </header>
  );
};
export default Header;
