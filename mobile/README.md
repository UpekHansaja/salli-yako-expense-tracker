# Expense Tracker Mobile App

A Flutter-based mobile wrapper for the Salli Yako Expense Tracker web application. This app uses WebView to render your Next.js web app on iOS and Android devices.

## Features

- 🌐 **WebView Integration**: Runs your existing Next.js web app natively on mobile
- 🔄 **Cross-Platform**: Works on both iOS and Android
- 📱 **Native Feel**: Includes back button support, pull-to-refresh, and loading indicators
- 🎨 **Material Design**: Beautiful Material 3 design following Apple guidelines
- 🔒 **Secure**: Handles permissions properly on both platforms
- ⚡ **Fast**: Direct rendering without additional overhead

## Prerequisites

- Flutter SDK 3.0+ ([Install Flutter](https://flutter.dev/docs/get-started/install))
- Dart SDK (comes with Flutter)
- Xcode 12+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS dependencies)

## Setup Instructions

### 1. Install Flutter Dependencies

```bash
cd mobile
flutter pub get
```

### 2. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

Make sure you have Android SDK tools installed. Update the `android/local.properties` file with your SDK path:

```
sdk.dir=/Users/your-username/Library/Android/sdk
flutter.sdk=/Users/your-username/fvm/versions/3.x.x
```

### 4. Configure the Web App URL

Edit `lib/screens/webview_screen.dart` and update the URL:

**For Local Development:**
```dart
// Use this if running on iOS simulator or local Android emulator
Uri.parse('http://localhost:3000'),
```

**For Physical Devices or Production:**
```dart
// Use your actual server URL
Uri.parse('https://your-domain.com'),
```

## Running the App

### iOS Simulator
```bash
flutter run -d "iPhone 15"
```

### iOS Device
```bash
flutter run -d <your-device-id>
```

### Android Emulator
```bash
flutter run -d emulator-5554
```

### Android Device
```bash
flutter run -d <your-device-id>
```

## Building for Release

### iOS Production Build
```bash
flutter build ios --release
```

### Android Production Build
```bash
flutter build apk --release
```

## Project Structure

```
mobile/
├── lib/
│   ├── main.dart              # App entry point
│   └── screens/
│       └── webview_screen.dart # WebView implementation
├── ios/                        # iOS-specific code
├── android/                    # Android-specific code
├── pubspec.yaml               # Flutter dependencies
└── README.md                  # This file
```

## Development Setup

### 1. Start Your Web App Locally

In the parent directory (salli-yako-expense-tracker):

```bash
npm install  # or pnpm install
npm run dev  # or pnpm dev
```

The app will run at `http://localhost:3000`

### 2. Configure Mobile App for Local Development

For iOS Simulator:
```
Update webview_screen.dart to use: http://localhost:3000
```

For Physical Device:
```
Use your machine's IP address: http://192.168.x.x:3000
```

### 3. Run the Flutter App

```bash
flutter run
```

## Troubleshooting

### WebView Not Loading

1. **Check Network**: Ensure your web server is running and accessible
2. **Check URL**: Verify the URL in `webview_screen.dart` is correct
3. **iOS Simulator**: Use `http://localhost:3000` for local development
4. **Physical Device**: Use your machine's IP address instead of localhost
5. **Android Emulator**: Use `10.0.2.2:3000` instead of localhost

### Build Issues

#### iOS:
```bash
# Clean build
flutter clean
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
flutter pub get
```

#### Android:
```bash
# Clean build
flutter clean
./android/gradlew clean -p android
flutter pub get
```

### Permission Denied

The app requests permissions automatically. If you're getting permission errors:

1. Go to app settings on your device
2. Grant required permissions (Camera, Microphone, Storage)
3. Restart the app

## Configuration

### Changing App Name

**iOS**:
1. Open `ios/Runner.xcworkspace` in Xcode
2. Change "Salli Yako Expense Tracker" in Info.plist

**Android**:
1. Edit `android/app/src/main/AndroidManifest.xml`
2. Change `android:label`

### Changing App Icon

**iOS**:
1. Open `ios/Runner.xcworkspace` in Xcode
2. Replace assets in Assets.xcassets

**Android**:
1. Replace images in `android/app/src/main/res/mipmap-*`

## Performance Optimization

1. **Minify web assets**: Ensure your Next.js app is built for production
2. **Compress resources**: Use image optimization in your web app
3. **Cache static assets**: Configure proper caching headers in your server

## Security Considerations

1. **HTTPS Only (Production)**: Always use HTTPS for production URLs
2. **Certificate Pinning**: Consider implementing certificate pinning for sensitive apps
3. **API Keys**: Never hardcode API keys in the app
4. **Content Security Policy**: Configure CSP headers in your web app

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| WebView shows blank screen | Check if your web server is running. Update the URL in webview_screen.dart |
| Connection timeout | Use your machine's IP address for physical devices instead of localhost |
| Back button not working | Ensure `WillPopScope` is properly implemented in webview_screen.dart |
| Permissions not granted | Go to app settings and manually grant permissions |
| iOS build fails | Run `pod install` in the ios directory |
| Android build fails | Update Android SDK tools and check gradle configuration |

## Support

For issues with Flutter, visit [Flutter Documentation](https://flutter.dev/docs)

For issues with your web app, check the main project README.

## License

Same as the parent Salli Yako Expense Tracker project.

## Next Steps

1. ✅ Create Flutter project structure
2. ✅ Configure iOS and Android
3. ✅ Set up WebView
4. ⏭️ Build and test on devices
5. ⏭️ Deploy to App Store and Google Play
