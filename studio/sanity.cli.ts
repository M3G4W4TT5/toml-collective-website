import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'tt800xj0',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  studioHost: 'toml-collective',
});
