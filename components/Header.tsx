import { SignedIn, UserButton } from "@clerk/nextjs";
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

const Header = () => {
  return (
    <div className="flex justify-between sticky top-0 left-0 z-50 bg-white shadow-sm p-5 border-b">
      <Link href={ROUTES.home.root()} className="text-2xl">
        Chat to <span className="text-indigo-600">PDF</span>
      </Link>

      <SignedIn>
        <div className="flex justify-center items-center gap-3 md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MenuIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Button asChild variant="ghost">
                  <Link href={ROUTES.dashboard.root()}>My documents</Link>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  asChild
                  variant="ghost"
                  className="border-indigo-600 w-full flex gap-2"
                >
                  <Link href={ROUTES.dashboard.uploadFile()}>Add document</Link>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UpgradeButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserButton />
        </div>

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
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
};
export default Header;
