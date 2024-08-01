"use client";

import useSubscription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import Link from "next/link";
import { Loader2Icon, StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function UpgradeButton() {
  const { hasActiveMembership, loading } = useSubscription();
  const router = useRouter();

  const goToPricingPage = () => {
    router.push("/dashboard/upgrade");
  };

  if (!hasActiveMembership && !loading)
    return (
      <Button
        asChild
        variant="default"
        className="border-indigo-600 hidden md:inline-flex"
      >
        <Link href={"/dashboard/upgrade"}>
          Upgrade <StarIcon className="ml-3 fill-indigo-600 text-white" />
        </Link>
      </Button>
    );

  if (loading)
    return (
      <Button variant="default" className="border-indigo-600">
        <Loader2Icon className="animate-spin" />
      </Button>
    );

  return (
    <Button
      onClick={goToPricingPage}
      variant="default"
      className="border-indigo-600 bg-indigo-600"
    >
      <p>
        <span className="font-extrabold">PRO </span> Account
      </p>
    </Button>
  );
}
export default UpgradeButton;
