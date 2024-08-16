"use client";

import useSubscription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import Link from "next/link";
import { Loader2Icon, StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes";

const UpgradeButton = () => {
  const { hasActiveMembership, loading } = useSubscription();
  const router = useRouter();

  const goToPricingPage = () => {
    router.push(ROUTES.dashboard.pricing());
  };

  if (!hasActiveMembership && !loading)
    return (
      <Button
        asChild
        variant="default"
        className="border-indigo-600 md:inline-flex"
      >
        <Link href={ROUTES.dashboard.pricing()}>
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
        <span className="font-extrabold">PRO </span> account
      </p>
    </Button>
  );
};
export default UpgradeButton;
