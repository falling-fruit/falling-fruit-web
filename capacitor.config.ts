import type { CapacitorConfig } from '@capacitor/cli'
import * as dotenv from 'dotenv'

// Load build options from .env file
dotenv.config({ quiet: true })

const config: CapacitorConfig = {
  // android: uh.fallingfruit.app
  // ios: com.fiddlemeragged.fallingfruit
  appId: 'org.fallingfruit.app',
  appName: 'Falling Fruit',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    // Android 15+ (targetSdk 35+) forces edge-to-edge, so the WebView draws
    // behind the system bars and window.innerHeight includes the bottom
    // navigation bar. The bundled SystemBars plugin injects the real
    // --safe-area-inset-* CSS variables as inline styles on the document root
    // (working around a Chromium bug where env(safe-area-inset-*) is 0 on
    // Android WebView < 140), which the layout already consumes to reserve
    // space for the bottom system bar. It also zeroes the bottom inset while
    // the keyboard is visible.
    SystemBars: {
      insetsHandling: 'css',
    },
  },
  android: {
    buildOptions: {
      keystorePath: process.env.ANDROID_KEYSTORE_PATH,
      keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
      keystoreAlias: process.env.ANDROID_KEYSTORE_ALIAS,
      keystoreAliasPassword: process.env.ANDROID_KEYSTORE_ALIAS_PASSWORD,
      releaseType: 'APK',
      signingType: 'apksigner',
    },
  },
}

export default config
