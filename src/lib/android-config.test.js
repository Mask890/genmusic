import { describe, expect, test } from 'bun:test';
import { androidConfig } from '../../capacitor.config';

describe('Android test separation', () => {
  test('test APK has its own identity and offline renderer', () => {
    expect(androidConfig(true)).toEqual({ appId: 'app.pebble.player.test', appName: 'Pebble Test', webDir: 'dist-native' });
  });
  test('production APK keeps its stable identity and offline renderer', () => {
    expect(androidConfig(false)).toEqual({ appId: 'app.pebble.player', appName: 'Pebble', webDir: 'dist-native' });
  });
});