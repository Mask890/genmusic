// Native Android tweaks shared by test and release builds:
// system-bar insets, music library scanner plugin, Pebble launcher icons.
import { readFile, writeFile, readdir, cp, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const res = 'android/app/src/main/res';
await cp('resources/android', res, { recursive: true });
await mkdir(join(res, 'values'), { recursive: true });
await writeFile(join(res, 'values/ic_launcher_background.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<resources><color name="ic_launcher_background">#1A1424</color></resources>\n');

const manifestPath = 'android/app/src/main/AndroidManifest.xml';
let manifest = await readFile(manifestPath, 'utf8');
if (!manifest.includes('READ_MEDIA_AUDIO')) {
  manifest = manifest.replace('</manifest>', `    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
</manifest>`);
  await writeFile(manifestPath, manifest);
}

async function findMain(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { const r = await findMain(p); if (r) return r; }
    else if (e.name === 'MainActivity.java') return p;
  }
}
const mainPath = await findMain('android/app/src/main/java');
const pkg = (await readFile(mainPath, 'utf8')).match(/package\s+([\w.]+);/)[1];

await writeFile(mainPath, `package ${pkg};

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(MusicScanPlugin.class);
        super.onCreate(savedInstanceState);
        getWindow().getDecorView().setBackgroundColor(Color.parseColor("#1A1424"));
        View content = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(content, (v, insets) -> {
            Insets b = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            v.setPadding(b.left, b.top, b.right, b.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
    }
}
`);

await writeFile(join(mainPath, '..', 'MusicScanPlugin.java'), `package ${pkg};

import android.Manifest;
import android.database.Cursor;
import android.os.Build;
import android.provider.MediaStore;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(name = "MusicScan", permissions = {
    @Permission(alias = "audio", strings = { Manifest.permission.READ_MEDIA_AUDIO }),
    @Permission(alias = "storage", strings = { Manifest.permission.READ_EXTERNAL_STORAGE })
})
public class MusicScanPlugin extends Plugin {
    private String alias() { return Build.VERSION.SDK_INT >= 33 ? "audio" : "storage"; }

    @PluginMethod
    public void scan(PluginCall call) {
        if (getPermissionState(alias()) != PermissionState.GRANTED) {
            requestPermissionForAlias(alias(), call, "permCallback");
        } else doScan(call);
    }

    @PermissionCallback
    private void permCallback(PluginCall call) {
        if (getPermissionState(alias()) == PermissionState.GRANTED) doScan(call);
        else call.reject("Permission denied");
    }

    private void doScan(PluginCall call) {
        JSArray list = new JSArray();
        String[] cols = { MediaStore.Audio.Media._ID, MediaStore.Audio.Media.TITLE, MediaStore.Audio.Media.ARTIST, MediaStore.Audio.Media.DATA };
        // Only real music: excludes ringtones, alarms, notifications, podcasts and voice notes.
        String sel = MediaStore.Audio.Media.IS_MUSIC + " != 0 AND " + MediaStore.Audio.Media.DURATION + " >= 30000 AND "
            + MediaStore.Audio.Media.DATA + " NOT LIKE '%WhatsApp%' AND " + MediaStore.Audio.Media.DATA + " NOT LIKE '%/Recordings/%'";
        try (Cursor c = getContext().getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, cols, sel, null, MediaStore.Audio.Media.TITLE + " ASC")) {
            while (c != null && c.moveToNext()) {
                JSObject o = new JSObject();
                o.put("id", "ms-" + c.getLong(0));
                o.put("title", c.getString(1));
                String artist = c.getString(2);
                o.put("artist", artist == null || artist.equals("<unknown>") ? "Unknown artist" : artist);
                o.put("path", c.getString(3));
                list.put(o);
            }
        } catch (Exception e) { call.reject(e.getMessage()); return; }
        JSObject ret = new JSObject();
        ret.put("tracks", list);
        call.resolve(ret);
    }
}
`);
