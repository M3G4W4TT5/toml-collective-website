import assert from 'node:assert/strict';
import test from 'node:test';
import { readRouteRecords } from '../src/lib/route-records.ts';

const entry = { _id: 'fixture', title: 'Fixture', slug: 'valid-case' };

test('empty collections and entries without optional copy are supported', () => {
  assert.deepEqual(readRouteRecords([], 'case'), []);
  assert.equal(readRouteRecords([entry], 'case')[0].description, '');
});

test('CMS path traversal, invalid titles and non-text copy cannot enter generated pages', () => {
  for (const slug of ['../about', 'nested/page', 'UPPER', '-leading', 'trailing-', 'double--hyphen', 'x'.repeat(97)]) {
    assert.throws(() => readRouteRecords([{ ...entry, slug }], 'case'), /Invalid published/);
  }
  assert.throws(() => readRouteRecords([{ ...entry, title: ' ' }], 'case'), /Invalid published/);
  assert.throws(() => readRouteRecords([{ ...entry, description: [] }], 'case'), /Invalid case text/);
});

test('duplicate CMS slugs fail instead of silently overwriting a generated page', () => {
  assert.throws(() => readRouteRecords([entry, { ...entry, _id: 'another' }], 'case'), /Duplicate case slug/);
});
