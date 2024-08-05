import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ROUTES } from "@/routes";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";

const Header = () => {
  return (
    <header className="content-center sticky top-0 left-0 z-50 bg-white shadow-sm p-5 border-b h-[81px]">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
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
