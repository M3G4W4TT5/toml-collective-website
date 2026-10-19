import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { homePage } from './schemas/homePage';

export default defineConfig({
  name: 'website-starter',
  title: 'Website content',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'missing',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool()],
  document: {
    singletons: [{ documentId: 'home', schemaType: 'homePage', title: 'Home page' }],
    // Home is required by the build. This is an editor guard, not API authorization.
    actions: (actions, context) => context.documentId === 'home'
      ? actions.filter(({ action }) => action !== 'delete' && action !== 'unpublish')
      : actions,
  },
  schema: { types: [homePage] },
});
