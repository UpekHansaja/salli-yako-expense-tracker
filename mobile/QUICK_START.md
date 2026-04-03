# Flutter Mobile App - Quick Setup Guide

## 📱 What This Is

This is a Flutter-based mobile wrapper for your Salli Yako Expense Tracker web application. It uses WebView to display your Next.js web app inside a native mobile shell, giving you iOS and Android apps without rebuilding your entire application.

## 🚀 Quick Start

### 1. Prerequisites Check
Make sure you have:
- ✅ Flutter 3.0+ installed (`flutter --version`)
- ✅ Dart SDK (comes with Flutter)
- ✅ Xcode 12+ (for iOS development)
- ✅ Android Studio (for Android development)
- ✅ CocoaPods (`pod --version`)

### 2. Setup the Mobile Project

```bash
# Navigate to the mobile directory
cd mobile

# Get Flutter dependencies
flutter pub get

# Setup iOS dependencies
cd ios
pod install
cd ..
```

### 3. Start Your Web App

In the parent directory (salli-yako-expense-tracker):

```bash
# Install dependencies (if not already done)
npm install # or pnpm install

# Start development server
npm run dev # or pnpm dev
```

Your app will run at `http://localhost:3000`

### 4. Configure the Mobile App URL

**For iOS Simulator (uses localhost):**
The app is already configured to use `http://localhost:3000`

**For Android Emulator:**
The app uses `http://localhost:3000` (genymotion) or update it to `http://10.0.2.2:3000` if using Android AVD

**For Physical Device:**
Edit `lib/screens/webview_screen.dart` and replace `http://localhost:3000` with your machine's IP:
```bash
# Get your machine's IP address
ifconfig  # On macOS/Linux

# Then update webview_screen.dart to:
Uri.parse('http://192.168.x.x:3000')  # Replace with your actual IP
```

### 5. Run on Device/Simulator

**iOS Simulator:**
```bash
flutter run
# Or specify device
flutter run -d "iPhone 15"
```

**iOS Physical Device:**
```bash
flutter run
# Select your device when prompted
```

**Android Emulator:**
```bash
# First, start emulator from Android Studio
flutter run
# Or specify device
flutter run -d emulator-5554
```

**Android Physical Device:**
```bash
flutter run
# Your device must be connected and USB debugging enabled
```

## 📁 Project Structure

```
mobile/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── screens/
│   │   └── webview_screen.dart      # Main WebView screen
│   └── ...
├── android/                         # Android configuration
├── ios/                            # iOS configuration
├── pubspec.yaml                    # Dependencies
└── README.md                       # Full documentation
```

## 🔧 Configuration

### Change the Web App URL

Edit `lib/screens/webview_screen.dart`:

```dart
_webViewController = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      // ... other config ...
      ..loadRequest(
        // Change this URL:
        Uri.parse('http://localhost:3000'),  // ← Update here
      );
```

### Change App Name

**iOS:**
1. Open `ios/Runner.xcworkspace` in Xcode
2. Edit Runner → General → Display Name

**Android:**
1. Edit `android/app/src/main/AndroidManifest.xml`
2. Change the `android:label` value

## 🐛 Troubleshooting

### "WebView shows blank page"
- Check if your Next.js dev server is running: `npm run dev`
- Verify the URL in webview_screen.dart is correct
- Check network connection between device and server

### "Connection refused" (Physical Device)
- Use your machine's IP instead of localhost: `http://192.168.x.x:3000`
- Find IP with: `ifconfig | grep inet`
- Make sure both devices are on same network

### "Permission denied"
- Go to app settings → Permissions
- Grant Camera, Microphone, Storage permissions
- Restart the app

### iOS Build Fails
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
flutter pub get
```

### Android Build Fails
```bash
flutter clean
./android/gradlew clean -p android
flutter pub get
```

## 📦 Building for Release

### iOS (requires Apple Developer Account)
```bash
flutter build ios --release
# Follow prompts to upload to App Store
```

### Android (produces APK)
```bash
flutter build apk --release
# APK will be at: build/app/outputs/apk/release/app-release.apk
```

## 🎯 Development Workflow

1. **Make changes to your web app** (`../`)
2. **Save in your text editor** - Changes auto-reload in browser
3. **Refresh in mobile app** using the refresh button (⟳) in the top bar

No need to rebuild the Flutter app for web app changes!

## ✨ Features Included

- ✅ WebView rendering of your Next.js app
- ✅ Back button support (handles backstack properly)
- ✅ Refresh/reload button
- ✅ Loading spinner while pages load
- ✅ Error screen with retry button
- ✅ Permission handling for iOS and Android
- ✅ Dark mode support
- ✅ Material 3 design
- ✅ Responsive layout

## 📚 Next Steps

1. ✅ Install Flutter and dependencies
2. ✅ Set up iOS and Android
3. ✅ Run on simulator/emulator
4. ⏭️ Test on physical device
5. ⏭️ Configure signing (for App Store/Play Store)
6. ⏭️ Build and distribute

## 🔗 Useful Resources

- [Flutter Docs](https://flutter.dev/docs)
- [WebView Plugin Docs](https://pub.dev/packages/webview_flutter)
- [iOS App Distribution](https://flutter.dev/docs/deployment/ios)
- [Android App Distribution](https://flutter.dev/docs/deployment/android)

## ❓ Need Help?

1. Check the main [README.md](./README.md) for detailed documentation
2. Run `flutter doctor` to check your setup
3. Check Flutter logs: `flutter logs`
4. Visit [Flutter issues](https://github.com/flutter/flutter/issues)

---

**Happy mobile development! 🚀**
