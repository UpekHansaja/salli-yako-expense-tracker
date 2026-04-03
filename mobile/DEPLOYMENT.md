# Deployment & App Store Guide

This guide covers building and publishing your Flutter mobile app to the App Store and Google Play Store.

## Prerequisites

- Completed mobile app development and testing
- iOS: Apple Developer account ($99/year)
- Android: Google Play Developer account ($25 one-time)
- Flutter 3.0+

---

## 🍎 iOS App Store Deployment

### 1. Prepare Your App

#### Create App Icon
1. Design a 1024x1024 PNG icon
2. Use [AppIconTool](https://appicon.co/) to generate all sizes
3. Replace images in `ios/Runner/Assets.xcassets/AppIcon.appiconset/`

#### Update App Name
- Edit `ios/Runner/Info.plist`
- Change `CFBundleDisplayName` to "Salli Yako Expense Tracker"

#### Update Version Number
- Edit `pubspec.yaml`
- Update `version: 1.0.0+1`
- Format: `major.minor.patch+build`

### 2. Create App Store Listing

1. Visit [App Store Connect](https://appstoreconnect.apple.com/)
2. Click "My Apps"
3. Create new app:
   - Platform: iOS
   - App Name: "Salli Yako Expense Tracker"
   - Primary Language: English
   - Bundle ID: `com.salliako.expensetracker` (must match Xcode)
   - SKU: (unique identifier, e.g., `expensetracker001`)

### 3. Configure Signing & Capabilities

Open Xcode:
```bash
open ios/Runner.xcworkspace
```

1. Select "Runner" project
2. Select "Runner" target
3. Go to "Signing & Capabilities"
4. Team: Select your Apple Developer team
5. Bundle ID: `com.salliako.expensetracker`

### 4. Build for iOS

```bash
flutter clean
flutter pub get
flutter build ios --release
```

### 5. Archive & Upload

```bash
# Archive
flutter build ios --release --no-codesign

# Open in Xcode for archiving and upload
open ios/Runner.xcworkspace
```

In Xcode:
1. Product → Archive
2. "Distribute App"
3. Select "App Store Connect"
4. Continue through signing process
5. Upload to App Store

### 6. TestFlight & Release

In App Store Connect:
1. View uploaded build
2. Test on TestFlight (optional)
3. Add app details (description, screenshots, etc)
4. Submit for review
5. Wait for Apple approval (usually 24-48 hours)

---

## 🤖 Android Google Play Store Deployment

### 1. Prepare Your App

#### Create Keystore
```bash
keytool -genkey -v -keystore ~/key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key
```

Save the password somewhere safe!

#### Update Signing Configuration
Edit `android/app/build.gradle`:

```gradle
signingConfigs {
    release {
        storeFile file('/path/to/key.jks')
        storePassword 'your_store_password'
        keyAlias 'key'
        keyPassword 'your_key_password'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

#### Update Version & App Name
- Edit `pubspec.yaml`: `version: 1.0.0+1`
- Edit `android/app/build.gradle`: `versionCode` and `versionName`

### 2. Create Play Console Listing

1. Visit [Google Play Console](https://play.google.com/console)
2. Create new app
3. App name: "Salli Yako Expense Tracker"
4. Category: Finance
5. Content rating: Fill out questionnaire
6. Target audience: All

### 3. Build for Android

```bash
flutter clean
flutter pub get
flutter build apk --release --split-per-abi
```

Or build App Bundle (recommended):
```bash
flutter build appbundle --release
```

Outputs:
- APK: `build/app/outputs/apk/release/`
- Bundle: `build/app/outputs/bundle/release/app-release.aab`

### 4. Upload to Google Play

1. Go to your app in Play Console
2. Left menu → "Release" → "Production"
3. Create new release
4. Upload `app-release.aab`
5. Add release notes
6. Review app details
7. Submit for review

### 5. Google Play Review

- Usually approved within 1-2 hours
- May ask for clarifications
- Once approved, appears in Play Store

---

## 📋 Pre-Release Checklist

### Functionality
- [ ] Back button works correctly
- [ ] Refresh button works
- [ ] Loading spinner appears
- [ ] Error screen displays and retry works
- [ ] All features work as on web
- [ ] Tested on multiple devices
- [ ] Tested on slow network (throttle)
- [ ] Works offline (if applicable)

### Appearance
- [ ] App icon looks good at all sizes
- [ ] App name displays correctly
- [ ] No placeholder text visible
- [ ] Theme matches brand guidelines
- [ ] Status bar color is appropriate

### Content
- [ ] Privacy policy linked
- [ ] Terms of service linked
- [ ] About page has accurate info
- [ ] No debug logs in console
- [ ] No hardcoded credentials

### Performance
- [ ] App starts in < 3 seconds
- [ ] Page loads in < 5 seconds
- [ ] No excessive battery usage
- [ ] Memory usage is reasonable
- [ ] No memory leaks on long use

---

## 🔐 Security Considerations

### Never Commit Sensitive Data

Add to `.gitignore`:
```
key.jks
*.signing
.env.local
```

### Use Environment Variables

For API keys or server URLs:
```dart
// Instead of hardcoding
const String API_URL = 'https://yourdomain.com';

// Use environment variables or config files
String getApiUrl() {
  // Load from environment or config
}
```

### HTTPS Only

Always use HTTPS in production:
```dart
Uri.parse('https://yourdomain.com')  // Not http://
```

### Certificate Pinning (Advanced)

For sensitive apps, implement certificate pinning:
- Verify SSL certificates match expected values
- Prevents session hijacking
- Use `http_certificate_pinning` package

---

## 📊 Post-Launch Monitoring

### Analytics

Add Firebase Analytics:
1. Create Firebase project
2. Add Google Analytics to app
3. Track key events (login, expense creation, etc)

### Crash Reporting

Enable Crashlytics:
1. Add `firebase_crashlytics` to pubspec.yaml
2. Configure in main.dart
3. Monitor crashes in Firebase Console

### User Feedback

Implement in-app feedback:
1. Add feedback button
2. Send to your server or email
3. Monitor user issues

---

## 🔄 Update Process

### Publishing Updates

1. Update version in `pubspec.yaml`
2. Build new release
3. Upload to app stores
4. Users receive update notification

### Version Numbering

Format: `major.minor.patch+build`
- **Major**: Large features or breaking changes
- **Minor**: New features
- **Patch**: Bug fixes
- **Build**: Internal numbering for stores

Example progression:
```
1.0.0+1   → Initial release
1.0.1+2   → Bug fix
1.1.0+3   → New feature
2.0.0+4   → Major update
```

---

## Common Issues

### iOS

| Issue | Solution |
|-------|----------|
| "Bundle contains code not compatible with iPhone" | Update iOS deployment target in Xcode |
| "Certificate signing failed" | Check Team ID and signing certificate |
| "Build failed: Pod install error" | Run `pod install` in ios directory |

### Android

| Issue | Solution |
|-------|----------|
| "Build failed: Gradle error" | Run `flutter clean` and rebuild |
| "Keystore file not found" | Check path to key.jks in build.gradle |
| "APK too large" | Split by ABI or remove unused dependencies |

---

## Firebase Setup (Optional)

For analytics and crash reporting:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Add package
flutter pub add firebase_core firebase_crashlytics firebase_analytics
```

Configure in `lib/main.dart`:
```dart
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const ExpenseTrackerApp());
}
```

---

## Support & Help

- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Flutter Deployment Docs](https://flutter.dev/docs/deployment)
- [Firebase Docs](https://firebase.google.com/docs)

---

## Timeline

- **Initial Setup**: 2-4 hours
- **Building**: 1-2 hours per device
- **App Store Review**: 1-2 days (Apple), 1-2 hours (Google)
- **Seeing in Store**: Immediately after approval

---

## Next Steps

1. Prepare app icon and screenshots
2. Create accounts (App Store Connect, Google Play Console)
3. Test final builds thoroughly
4. Submit to stores
5. Monitor and respond to reviews

Good luck with your launch! 🚀
