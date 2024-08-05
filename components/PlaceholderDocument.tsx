"use client";

import { FrownIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { ROUTES } from "@/routes";

const PlaceholderDocument = () => {
  const { isOverFileLimit } = useSubscription();
  const router = useRouter();

  const handleClick = () => {
    if (isOverFileLimit) {
      router.push(ROUTES.dashboard.pricing());
    } else {
      router.push(ROUTES.dashboard.uploadFile());
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400"
    >
      {isOverFileLimit ? (
        <FrownIcon className="h-16 w-16" />
      ) : (
        <PlusCircleIcon className="h-16 w-16" />
      )}

      <p className="font-semibold">
        {isOverFileLimit ? "Upgrade to add more documents" : "Add a document"}
      </p>
    </Button>
  );
};
export default PlaceholderDocument;
