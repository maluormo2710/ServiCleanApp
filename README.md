<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6f829646-fd3c-495d-9ce3-2b3e254099dd?fullscreenApplet=true
View your app in AI Studio: https://ai.studio/apps/6f829646-fd3c-495d-9ce3-2b3e254099dd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
`npm install`

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key (optional)

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
`npm run dev`

---

# Guide: Building an Android APK from a Vite + React Project

This guide outlines the process of transforming a web project (Vite, React, TypeScript) into a native Android application using Capacitor. It also includes troubleshooting steps for common Gradle version mismatches.

## 1. Prerequisites
* Node.js installed on your system.
* Android Studio installed and updated.
* Your React project must be using Vite as the build tool.

## 2. Project Preparation
Before adding mobile capabilities, generate the production build of your web application.

npm install
npm run build

*Note: This creates the 'dist' folder.*

## 3. Integrating Capacitor
Capacitor is the bridge that allows your web code to run as a native app.

### Step 3.1: Install Dependencies
npm install @capacitor/core
npm install -D @capacitor/cli

### Step 3.2: Initialize Capacitor
npx cap init

* App name: Your app's display name.
* App ID: A unique identifier (e.g., com.yourname.appname).
* Web asset directory: Set this to 'dist'.

### Step 3.3: Configure capacitor.config.ts
Ensure your configuration file points to the correct build folder:

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.appname',
  appName: 'YourApp',
  webDir: 'dist', // Must match your build folder
  server: {
    androidScheme: 'https'
  }
};

export default config;

## 4. Adding Android Platform
1. Install the Android package:
   npm install @capacitor/android
2. Add the Android platform folder:
   npx cap add android

## 5. Synchronization Workflow
Every time you make changes to your React code, you must run:

npm run build
npx cap sync android

## 6. Troubleshooting: Android Gradle Plugin (AGP) Incompatibility
If Android Studio displays an error regarding an incompatible AGP version (e.g., Project is using AGP 8.13.0, but latest supported is 8.12.2), follow these steps:

1. Open Android Studio.
2. In the project explorer (left pane), expand Gradle Scripts.
3. Locate build.gradle (Project: android) or variables.gradle.
4. Find the version number for the Android Gradle Plugin:
   classpath 'com.android.tools.build:gradle:8.13.0'
5. Change the version to match your IDE's supported version (e.g., change 8.13.0 to 8.12.2).
6. Click "Sync Now" in the yellow banner at the top.

## 7. Generating the APK
Once the project is synced in Android Studio:
1. Go to the top menu: Build > Build Bundle(s) / APK(s) > Build APK(s).
2. Wait for the build process to finish.
3. Click the "locate" link in the pop-up notification to find your app-debug.apk file.

---
Generated for: Mario Luis Orozco Morales
