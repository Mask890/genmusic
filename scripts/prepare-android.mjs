import { readFile, writeFile } from 'node:fs/promises';
const path = 'android/app/build.gradle';
const version = process.env.APP_VERSION || '0.1.0';
const code = Number(process.env.BUILD_NUMBER || 1);
if (!/^\d+\.\d+\.\d+$/.test(version) || !Number.isSafeInteger(code) || code < 1) throw new Error('Invalid version');
let gradle = await readFile(path, 'utf8');
gradle = gradle.replace('versionCode 1', `versionCode ${code}`).replace('versionName "1.0"', `versionName "${version}"`);
gradle = gradle.replace('    buildTypes {', `    signingConfigs {
        release {
            storeFile file(System.getenv("ANDROID_KEYSTORE_PATH"))
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }
    }
    buildTypes {`).replace('        release {\n            minifyEnabled', '        release {\n            signingConfig signingConfigs.release\n            minifyEnabled');
await writeFile(path, gradle);
