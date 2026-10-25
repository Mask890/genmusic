import { cp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { packager } from '@electron/packager';
const require = createRequire(import.meta.url);
const version = process.env.APP_VERSION || '0.1.0';
const stage = 'native-stage';
await rm(stage, { recursive: true, force: true });
await mkdir(`${stage}/electron`, { recursive: true });
await cp('electron/main.cjs', `${stage}/electron/main.cjs`);
await cp('dist-native', `${stage}/dist-native`, { recursive: true });
await writeFile(`${stage}/package.json`, JSON.stringify({ name: 'pebble', productName: 'Pebble', version, description: 'Pebble local music player', author: 'Pebble', main: 'electron/main.cjs' }));
const electronVersion = JSON.parse(await readFile('node_modules/electron/package.json', 'utf8')).version;
const paths = await packager({ dir: stage, name: 'Pebble', out: 'native-artifacts', overwrite: true, platform: process.platform, arch: process.platform === 'darwin' ? 'universal' : 'x64', electronVersion, appVersion: version, asar: true });
if (process.platform === 'win32') {
  const { createWindowsInstaller } = require('electron-winstaller');
  await createWindowsInstaller({ appDirectory: paths[0], outputDirectory: 'native-artifacts/installer', authors: 'Pebble', exe: 'Pebble.exe', setupExe: `Pebble-${version}-Windows.exe`, noMsi: true });
}
