import type { CapacitorConfig } from '@capacitor/cli';
export function androidConfig(testBuild = false): CapacitorConfig {
  return {
    appId: testBuild ? 'app.pebble.player.test' : 'app.pebble.player',
    appName: testBuild ? 'Pebble Test' : 'Pebble',
    webDir: 'dist-native',
  };
}
export default androidConfig(process.env.PEBBLE_ANDROID_TEST === '1');
