import type { LandingPageFeature } from "@/types";
import { FC } from "react";

const LandingPageFeature: FC<LandingPageFeature> = (feature) => {
  const { name, description } = feature;

  return (
    <div className="relative pl-9">
      <dt className="inline font-semibold text-gray-900">
        <feature.icon
          aria-hidden="true"
          className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
        />
      </dt>
      <dd className="font-bold">{name}</dd>
      <dd>{description}</dd>
    </div>
  );
};
export default LandingPageFeature;
