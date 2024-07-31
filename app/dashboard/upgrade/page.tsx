"use client";

import createCheckoutSession from "@/actions/createCheckoutSession";
import createStripePortal from "@/actions/createStripePortal";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import getStripe from "@/lib/stripe-js";
import { useUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import "./page.css";
import {
  FREE_DOC_LIMIT,
  FREE_MESSAGES_LIMIT,
  PRO_DOC_LIMIT,
  PRO_MESSAGES_LIMIT,
} from "@/constants/plans";

export type UserDetails = {
  email: string;
  name: string;
};

const FREE_FEATURES = [
  `${FREE_DOC_LIMIT} Documents`,
  `Up to ${FREE_MESSAGES_LIMIT} messages per document`,
  "Try out the AI Chat Functionality",
];
const PRO_FEATURES = [
  `Store up to ${PRO_DOC_LIMIT} Documents`,
  "Ability to Delete Documents",
  `Up to ${PRO_MESSAGES_LIMIT} messages per document`,
  "Full Power AI Chat Functionality with Memory Recall",
  "Advanced analitics",
];

function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
        const stripePortalUrl = await createStripePortal();
        return router.push(stripePortalUrl);
      }

      const sessionId = await createCheckoutSession(userDetails);

      await stripe?.redirectToCheckout({
        sessionId,
      });
    });
  };

  const proPlanButtonText =
    isPending || loading
      ? "Loading..."
      : hasActiveMembership
      ? "Manage plan"
      : "Upgrade to pro";

  return (
    <div>
      <div className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Supercharge your Document Companion
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan thats packed with the best features for
          interacting with your PDFs, enhancing productivity, and streamlining
          your workflow.
        </p>

        <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8 lg:max-w-4xl">
          <div className="ring-1 ring-gray-200 p-8 h-fit pb-12 rounded-3xl">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">
              Starter Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Explore Core Features at No Cost
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                FREE
              </span>
            </p>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              {FREE_FEATURES.map((feat) => (
                <li className="flex gap-x-3" key={feat}>
                  <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative ring-2 ring-indigo-600 p-8 h-fit pb-12 rounded-3xl">
            <div className="ribbon font-semibold text-white bg-indigo-700 text-xl md:text-2xl lg:text-3xl">
              Coming soon!
            </div>

            <h3 className="text-lg font-semibold leading-8 text-indigo-600">
              Pro Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Maximize Productivity with PRO Features
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                -.--
              </span>
              <span className="text-sm font-semibold leading-6 text-gray-600">
                / month
              </span>
            </p>

            <Button
              className="mt-6 w-full block bg-indigo-600 hover:bg-indigo-500"
              disabled={true}
              //maybe in the future for now I don't have Stripe account
              // disabled={loading || isPending}
              // onClick={handleUpgrade}
            >
              {proPlanButtonText}
            </Button>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              {PRO_FEATURES.map((feat) => (
                <li className="flex gap-x-3" key={feat}>
                  <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PricingPage;
