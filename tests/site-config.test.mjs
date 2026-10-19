import assert from 'node:assert/strict';
import test from 'node:test';
import { readSiteConfig } from '../config/site.mjs';

const configured = { PUBLIC_SANITY_PROJECT_ID: 'testonly', SITE_URL: 'https://client.test' };

test('account-free demo stays unindexed and cannot send mail from the UI', () => {
  const site = readSiteConfig({});
  assert.equal(site.mode, 'demo');
  assert.equal(site.indexable, false);
  assert.equal(site.formReady, false);
});

test('review and live builds reject missing CMS and placeholder origins', () => {
  for (const mode of ['review', 'live']) {
    assert.throws(() => readSiteConfig({ PUBLIC_SITE_MODE: mode }), /PUBLIC_SANITY_PROJECT_ID/);
    assert.throws(() => readSiteConfig({ PUBLIC_SITE_MODE: mode, PUBLIC_SANITY_PROJECT_ID: 'testonly' }), /SITE_URL/);
    for (const url of ['https://example.invalid', 'http://client.test', 'https://example.com', 'https://client.test/path', 'https://user:pass@client.test']) {
      assert.throws(() => readSiteConfig({ ...configured, PUBLIC_SITE_MODE: mode, SITE_URL: url }), /SITE_URL/);
    }
  }
});

test('only the configured production branch can build indexable live pages', () => {
  const live = { ...configured, PUBLIC_SITE_MODE: 'live', SITE_PRODUCTION_BRANCH: 'production' };
  assert.equal(readSiteConfig({ ...live, WORKERS_CI_BRANCH: 'production' }).indexable, true);
  const preview = readSiteConfig({ ...live, WORKERS_CI_BRANCH: 'new-design' });
  assert.equal(preview.mode, 'review');
  assert.equal(preview.indexable, false);
  assert.equal(readSiteConfig({ ...configured, PUBLIC_SITE_MODE: 'review' }).indexable, false);
});

test('invalid switches and an enabled form without Turnstile fail configuration', () => {
  assert.throws(() => readSiteConfig({ PUBLIC_SITE_MODE: 'production' }), /PUBLIC_SITE_MODE/);
  assert.throws(() => readSiteConfig({ PUBLIC_CONTACT_FORM_READY: 'true' }), /PUBLIC_CONTACT_FORM_READY/);
  assert.throws(() => readSiteConfig({ PUBLIC_CONTACT_FORM_READY: '1' }), /PUBLIC_TURNSTILE_SITE_KEY/);
});
