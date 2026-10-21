import { createClient } from "@sanity/client";
import { site } from "./site";

/** Build-time published reads only. CMS publishing and fallback rules are unchanged. */
export const sanityClient = site.projectId
  ? createClient({
      projectId: site.projectId,
      dataset: site.dataset,
      apiVersion: "2025-05-01",
      perspective: "published",
      useCdn: false,
    })
  : null;
