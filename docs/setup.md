# Setup

- Clone the repo and change into the new directory.

  ```sh
  git clone https://github.com/falling-fruit/falling-fruit-web
  cd falling-fruit-web
  ```

- Install the [`node`](https://nodejs.org) version specified in the `.nvmrc` file. This is easiest using [`nvm`](https://github.com/nvm-sh/nvm#installing-and-updating).

  ```sh
  # Install node version specified in .nvmrc
  nvm install
  # Use node version specified in .nvmrc
  nvm use
  ```

- [`yarn`](https://classic.yarnpkg.com/en/docs/install) is already provided (see [`.yarn/releases`](.yarn/releases)). Use it to install dependencies.

  ```sh
  yarn
  ```

- Initialize your private `.env` file.

  ```sh
  cp example.env .env
  ```

- Set environment variables in `.env`.

  - `REACT_APP_API_URL`: URL for [falling-fruit-api](https://github.com/falling-fruit/falling-fruit-api). Use https://fallingfruit.org/api/0.3 for the production API if you only want to make frontend changes, or http://localhost:3300/api/0.3 (by default) if you are contributing to both backend and frontend.

  - `REACT_APP_API_KEY`: API key for [falling-fruit-api](https://github.com/falling-fruit/falling-fruit-api). Use `AKDJGHSD` for the production API or any value in column `api_keys.api_key` if running [falling-fruit](https://github.com/falling-fruit/falling-fruit) locally (see [database seeds](https://github.com/falling-fruit/falling-fruit/blob/main/db/seeds.rb)).

  - `REACT_APP_RECAPTCHA_SITE_KEY`: Site key for [reCAPTCHA v3](https://developers.google.com/recaptcha/intro). Use `6Ld99kUdAAAAAAB5nCofKrQB6Vp-e5wR42u5TNZZ` for the production API or the site key matching the secret key if running [falling-fruit-api](https://github.com/falling-fruit/falling-fruit-api) locally. reCAPTCHA is only required for adding and editing content as an anonymous (unauthenticated) user.

  - `REACT_APP_GOOGLE_MAPS_API_KEY`: Your own API key for [Google Maps Platform](https://developers.google.com/maps/documentation/javascript/get-api-key).

  - `REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID`: Tracking ID for Google Analytics. Optional.

# Web app

- Start the application.

To run the app in a browser:

```sh
yarn start
```

Then browse to http://localhost:3000. The app is also available on your local network to test (http-only) on other devices, typically at http://192.168.1.206:3000.

To create a production build (in the `build` directory):

```sh
yarn build
```

If the build fails due to dependency issues, try starting with a clean install:

```sh
rm -rf node_modules
yarn cache clean
yarn
```

# Mobile apps

We use [Capacitor](https://capacitorjs.com) to package the web app as Android and iOS apps. Make sure you can build the web app first with `yarn build` before proceeding. Although most of the mobile app can be tested by opening the web app in a narrow browser window, this is inadequate for testing device-specific functionality like permissions, curved layouts, and onboard functions (camera, compass, and GPS).

## Android

_[`android`](../android) directory · [setup](https://capacitorjs.com/docs/v7/getting-started/environment-setup#android-requirements) · [get started](https://capacitorjs.com/docs/v7/android)_

First install the [requirements](https://capacitorjs.com/docs/v7/getting-started/environment-setup#android-requirements).

- [Android Studio](https://developer.android.com/studio) 2024.2.1+
- SDK Platforms:
  - Android 15 (API Level 35)
- SDK Tools:
  - Android SDK Build-Tools [35.0.0]
  - Android SDK Command-line Tools [latest]
  - Android SDK Platform-Tools [latest]

Sync the app with any changes to [`package.json`](../package.json) and `build` output:

```sh
npx cap sync android
```

Run the app on an emulator or device:

```bash
npx cap run android  # prompts to select device
# npx cap run android --list
# npx cap run android --device
# npx cap run android --emulator
# npx cap run android --target=<device>
```

and debug with Chrome at [chrome://inspect/#devices](chrome://inspect/#devices).

Alternatively, open as a project in Android Studio:

```sh
npx cap open android
```

### Android emulators

Follow [these instructions](https://developer.android.com/studio/run/managing-avds) to create and manage Android Virtual Devices (AVD) in Android Studio, or use `avdmanager` from the command line.

### Android devices

First, enable [USB debugging](https://developer.android.com/studio/debug/dev-options) on your device.
Then plug the device into your computer, start the `adb` (Android Debug Bridge) server, and check that the device is listed:

```sh
sudo adb start-server
npx cap run android --list
```

## iOS

_[`ios`](../ios) directory · [setup](https://capacitorjs.com/docs/v7/getting-started/environment-setup#ios-requirements) · [get started](https://capacitorjs.com/docs/v7/ios)_

First install the [requirements](https://capacitorjs.com/docs/v7/getting-started/environment-setup#ios-requirements).

- [MacOS](https://www.apple.com/os/macos/) 14.5+ ([download](https://support.apple.com/en-us/102662))
- [Xcode](https://developer.apple.com/xcode/) 16.0+ ([download](https://xcodereleases.com))
- [Cocoapods](https://guides.cocoapods.org/using/getting-started.html)

And prepare Xcode for first use:

```sh
# Install Xcode Command Line Tools
xcode-select --install
# Accept Xcode license
sudo xcodebuild -license
# Run Xcode first launch tasks
xcodebuild -runFirstLaunch
```

Sync the app with any changes to [`package.json`](../package.json) and `build` output:

```sh
npx cap sync ios
```

Run the app on an emulator or device:

```sh
npx cap run ios
```

Alternatively, open [`ios/App/App.xcworkspace`](../ios/App/App.xcworkspace) in Xcode:

```sh
npx cap open ios
```
