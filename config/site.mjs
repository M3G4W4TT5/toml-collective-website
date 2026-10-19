/**
 * Shared by Astro configuration, pages, and configuration tests.
 * @param {Record<string, string | boolean | undefined>} env
 */
export function readSiteConfig(env) {
  const value = (key) => typeof env[key] === 'string' ? env[key].trim() : '';
  const requestedMode = value('PUBLIC_SITE_MODE') || 'demo';
  if (!['demo', 'review', 'live'].includes(requestedMode)) {
    throw new Error('PUBLIC_SITE_MODE must be demo, review, or live.');
  }
  // Branch previews stay unindexed even when they inherit live settings.
  const branch = value('WORKERS_CI_BRANCH');
  const productionBranch = value('SITE_PRODUCTION_BRANCH') || 'main';
  const mode = requestedMode === 'live' && branch && branch !== productionBranch
    ? 'review' : requestedMode;
  const projectId = value('PUBLIC_SANITY_PROJECT_ID');
  const dataset = value('PUBLIC_SANITY_DATASET') || 'production';
  if (mode !== 'demo' && !projectId) {
    throw new Error('Review and live builds require PUBLIC_SANITY_PROJECT_ID. Use demo while CMS setup is pending.');
  }
  const configuredUrl = value('SITE_URL');
  if (mode !== 'demo' && !configuredUrl) throw new Error('Review and live builds require SITE_URL.');
  let url;
  try { url = new URL(configuredUrl || 'https://example.invalid'); }
  catch { throw new Error('SITE_URL must be an absolute HTTP(S) origin.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password
    || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTP(S) origin without a path, credentials, query, or fragment.');
  }
  if (mode !== 'demo' && (url.protocol !== 'https:' || url.hostname === 'localhost'
    || url.hostname === '127.0.0.1' || url.hostname.endsWith('.invalid')
    || ['example.com', 'example.org', 'example.net'].includes(url.hostname))) {
    throw new Error('Review and live builds require a real HTTPS SITE_URL.');
  }
  const formFlag = value('PUBLIC_CONTACT_FORM_READY') || '0';
  if (!['0', '1'].includes(formFlag)) throw new Error('PUBLIC_CONTACT_FORM_READY must be 0 or 1.');
  const turnstileSiteKey = value('PUBLIC_TURNSTILE_SITE_KEY');
  if (formFlag === '1' && !turnstileSiteKey) {
    throw new Error('An enabled contact form requires PUBLIC_TURNSTILE_SITE_KEY.');
  }
  return {
    mode, url: url.origin, projectId, dataset,
    indexable: mode === 'live',
    language: value('PUBLIC_SITE_LANGUAGE') || 'en',
    formReady: formFlag === '1', turnstileSiteKey,
    contactEmail: value('PUBLIC_CONTACT_EMAIL'),
  };
}
