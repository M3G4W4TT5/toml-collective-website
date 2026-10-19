import { readSiteConfig } from '../../config/site.mjs';

// Imported only by build-time/server code.
export const site = readSiteConfig({
  PUBLIC_SITE_MODE: import.meta.env.PUBLIC_SITE_MODE,
  PUBLIC_SITE_LANGUAGE: import.meta.env.PUBLIC_SITE_LANGUAGE,
  SITE_URL: import.meta.env.SITE_URL,
  PUBLIC_SANITY_PROJECT_ID: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET: import.meta.env.PUBLIC_SANITY_DATASET,
  PUBLIC_CONTACT_FORM_READY: import.meta.env.PUBLIC_CONTACT_FORM_READY,
  PUBLIC_TURNSTILE_SITE_KEY: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
  PUBLIC_CONTACT_EMAIL: import.meta.env.PUBLIC_CONTACT_EMAIL,
  WORKERS_CI_BRANCH: process.env.WORKERS_CI_BRANCH,
  SITE_PRODUCTION_BRANCH: process.env.SITE_PRODUCTION_BRANCH || import.meta.env.SITE_PRODUCTION_BRANCH,
});
