import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import LandingPageFeature from "@/components/LandingPageFeature";
import { Button } from "@/components/ui/button";
import { LANDING_PAGE_FEATURES, LANDING_PAGE_IMAGE } from "@/constants";
import { ROUTES } from "@/routes";

const Home = async () => {
  const user = await currentUser();

  return (
    <main className="flex-1 overflow-auto p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-lg">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Your Interactive Document Companion
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your PDFs into Interactive Conversations
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Introdusing
              <span className="font-bold text-indigo-600"> Chat with PDF</span>
              <br />
              <br />
              Upload your document, and our chatbot will answer questions,
              summarize content and answer all your questions. Ideal for
              everyone.
              <span className="font-bold text-indigo-600"> Chat with PDF </span>
              turns static documents into
              <span className="font-bold"> dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>

          {user?.id && (
            <p className="text-3xl font-bold mt-10 text-indigo-600">{`Welcome, ${user?.firstName}!`}</p>
          )}
          <Button asChild className="mt-8">
            <Link prefetch={false} href={ROUTES.dashboard.root()}>
              {user?.id ? "Go to dashboard" : "Get started"}
            </Link>
          </Button>
        </div>

        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              alt="App screenshot"
              src={LANDING_PAGE_IMAGE}
              width={2432}
              height={1442}
              priority
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
            <div aria-hidden="true" className="relative">
              <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {LANDING_PAGE_FEATURES.map((feature) => (
              <LandingPageFeature key={feature.name} {...feature} />
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
};
export default Home;
