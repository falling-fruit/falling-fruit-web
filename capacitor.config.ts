import type { CapacitorConfig } from '@capacitor/cli'
import * as dotenv from 'dotenv'

// Load build options from .env file
dotenv.config()

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
