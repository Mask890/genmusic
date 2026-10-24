import { describe, expect, test } from 'bun:test';
import { assetFor, stableReleases, type Release } from './releases';
const make = (tag: string, published: string): Release => ({ tag_name: tag, name: tag, published_at: published, body: '', html_url: 'https://github.com/example/pebble/releases', assets: ['Windows.exe', 'Mac.dmg', 'Android.apk'].map((suffix) => ({ name: `Pebble-${suffix}`, browser_download_url: `https://github.com/example/pebble/releases/download/v1/Pebble-${suffix}`, size: 100 })) });
describe('Download rules', () => {
  test('Windows uses EXE', () => expect(assetFor(make('v1', '2026-10-24'), 'windows')?.name).toBe('Pebble-Windows.exe'));
  test('Mac uses DMG', () => expect(assetFor(make('v1', '2026-10-24'), 'mac')?.name).toBe('Pebble-Mac.dmg'));
  test('Android uses APK', () => expect(assetFor(make('v1', '2026-10-24'), 'android')?.name).toBe('Pebble-Android.apk'));
  test('newest stable release is first', () => expect(stableReleases([make('v1', '2026-10-23'), { ...make('v3', '2026-10-26'), draft: true }, make('v2', '2026-10-24'), { ...make('v4', '2026-10-27'), prerelease: true }]).map((r) => r.tag_name)).toEqual(['v2', 'v1']));
  test('no invented download links', () => expect(assetFor(undefined, 'windows')).toBeUndefined());
});
