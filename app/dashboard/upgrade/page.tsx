"use client";

import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import { CheckIcon } from "lucide-react";
import { PRICING_FREE_FEATURES, PRICING_PRO_FEATURES } from "@/constants";

import "./page.css";

const PricingPage = () => {
  const { hasActiveMembership, loading } = useSubscription();

  const proPlanButtonText = loading
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
            Supercharge your document companion
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan thats packed with the best features for
          interacting with your PDFs, enhancing productivity, and streamlining
          your workflow.
        </p>
        <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 font-semibold text-indigo-600">
          For both plans, after deleting your account, we will also delete all
          your uploaded files.
        </p>
        <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8 lg:max-w-4xl px-4 md:px-0">
          <div className="ring-1 ring-gray-200 p-8 h-fit pb-12 rounded-3xl">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">
              Starter plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Explore core features at
              <span className="font-bold  text-indigo-600"> NO COST</span>
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
              {PRICING_FREE_FEATURES.map((feature) => (
                <li className="flex gap-x-3" key={feature}>
                  <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative ring-2 ring-indigo-600 p-8 h-fit pb-12 rounded-3xl">
            <div className="ribbon font-semibold text-white bg-indigo-700 text-xl md:text-2xl lg:text-3xl">
              Coming soon!
            </div>

            <h3 className="text-lg font-semibold leading-8 text-indigo-600">
              Pro plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Maximize productivity with PRO features
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
              disabled
            >
              {proPlanButtonText}
            </Button>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              {PRICING_PRO_FEATURES.map((feature) => (
                <li className="flex gap-x-3" key={feature}>
                  <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PricingPage;
