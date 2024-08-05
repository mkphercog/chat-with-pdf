import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { ROUTES } from "@/routes";
import Link from "next/link";
import { Button } from "./ui/button";
import UpgradeButton from "./UpgradeButton";

const MobileNav = () => {
  return (
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
    </div>
  );
};

export default MobileNav;
