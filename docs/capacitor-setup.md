# Capacitor Setup

I installed Capacitor on a Macbook and successfully built and ran the Android and iOS falling-fruit clients using the following instructions.

## Install Capacitor

I installed Capacitor 7 using the VSCode Extension an option described here:
https://capacitorjs.com/docs/getting-started

## Environment setup

Capacitor needs NodeJS 20 or higher installed. I installed 22.16.0.\
I installed the latest versions of Android Studio 2025.1.2, xCode 16.4 and cocoapods 1.16.2 (used to download iOS packages).\
This document describes what is required for building iOS and Android apps https://capacitorjs.com/docs/getting-started/environment-setup

To support the higher versions, in the web project .nvmrc file change:

```
FROM:
    16.20.2
TO:
    22.16.0
```

In the web project package.json file change:

```
FROM:
  "engines": {
    "node": "^16.20"
  }
TO:
  "engines": {
    "node": "^22.16.0"
  }
```

In the web project package.json file I also had to bump up the React version to resolve build errors.

```
FROM:
    "react-scripts": "^4.0.3",
TO:
    "react-scripts": "^5.0.1",
```

## Install newer NodeJS

Next update the node.js version
First delete the `node_modules` folder and `package lock files`
Then installed in Terminal using:

```
$ nvm use 22.16.0
$ npm install --force
```

`--force` is necessary due to older package incompatibilities.\
There will be lost of warning and at the end: 139 vulnerabilities (100 moderate, 32 high, 7 critical)

## Run Capacitor

First make sure you are using the correct version of Node.\
The in terminal run:

```
falling-fruit-web % nvm use 22.16.0
falling-fruit-web % npx cap init
```

You will be prompted with questions. This is how I answered.

```
falling-fruit-web % npx cap init
[?] What is the name of your app?
    This should be a human-friendly app name, like what you'd see in the App Store.
✔ Name … FallingFruit
[?] What should be the Package ID for your app?
    Package IDs (aka Bundle ID in iOS and Application ID in Android) are unique identifiers for apps. They must be in
    reverse domain name notation, generally representing a domain name that you or your company owns.
✔ Package ID … org.fallingfruit.FallingFruit
✔ Creating capacitor.config.ts in /Users/claires/Dev/falling-fruit-web in 2.20ms
[success] capacitor.config.ts created!
```

The capacitor.config.ts just built points to the folder of the built web app.

```
webDir: 'build'
```

## Build the Web App

Because of old library incompatibilities, I need to run the command `export NODE_OPTIONS=--openssl-legacy-provider` first.\
I found this article helpful in resolving the errors I first encountered. https://www.freecodecamp.org/news/error-error-0308010c-digital-envelope-routines-unsupported-node-error-solved/

To build the app in terminal run:

```
falling-fruit-web % export NODE_OPTIONS=--openssl-legacy-provider
falling-fruit-web % npm run build
```

## Build the Mobile Apps and launch Mobile app IDE.

### Android

To build the Android app and launch Android Studio, run the following commands in terminal.

```
falling-fruit-web % npm install @capacitor/android --force
falling-fruit-web % npx cap add android
falling-fruit-web % npx cap open android
```

In Android Studio, the Android mobile client builds and runs in a simulator (I didn't have a device to try)

### iOS

iOS has an extra step of installing pod files which needs to be done in the iOS project folder. xCode can then be opened using the xcworkspace file in the App folder.

```
falling-fruit-web % npm install @capacitor/ios --force
falling-fruit-web % npx cap add ios
falling-fruit-web % cd ios/App
App % pod install
App % open App.xcworkspace
```

In xCode, the iOS app mobile client builds and runs in a simulator and on the phone.

### Problems

- The iOS client has a layout bug where the UI goes under the "notch". In the map view the search bar is under the notch and not accessible.

- Both client show an error when first navigating to the map "This page can't load Google Maps correctly. Do you own the website?" Tapping the "OK" button the map appears to work fine.
