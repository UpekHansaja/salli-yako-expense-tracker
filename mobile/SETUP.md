# Getting Started with Flutter Setup

This file helps you set up Flutter if you don't have it installed yet.

## 1. Install Flutter SDK

### macOS (Recommended for your machine)

**Option A: Using Homebrew (Easiest)**
```bash
brew install flutter
```

**Option B: Manual Download**
1. Download from [flutter.dev](https://flutter.dev/docs/get-started/install/macos)
2. Extract to a location (e.g., `~/Development/flutter`)
3. Add to PATH:
   ```bash
   export PATH="$PATH:$HOME/Development/flutter/bin"
   ```
   Add this to your `~/.zshrc` or `~/.bash_profile`

### Verify Installation
```bash
flutter --version
dart --version
```

## 2. Install Dependencies

### Xcode (for iOS development)
```bash
# Install Xcode from App Store or
xcode-select --install

# Accept license
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcode-select --reset
```

### Android Studio (for Android development)

1. Download from [Android Studio](https://developer.android.com/studio)
2. Install Android SDK:
   ```bash
   flutter config --android-sdk=/Users/your-username/Library/Android/sdk
   ```
3. Accept licenses:
   ```bash
   flutter doctor --android-licenses
   ```

### CocoaPods (for iOS dependencies)
```bash
sudo gem install cocoapods
```

## 3. Verify Setup

```bash
flutter doctor
```

Expected output (✓ = good, ✗ = needs fixing):
```
[✓] Flutter (Channel stable, 3.x.x releases)
[✓] Android toolchain - develop for Android devices
[✓] Xcode - develop for iOS and macOS
[✓] CocoaPods version 1.x.x
[✓] VS Code
```

**Fix any ✗ with**: `flutter doctor --verbose`

## 4. Configure IDE (Optional)

### VS Code
1. Install "Flutter" extension by Dart Code
2. Install "Dart" extension
3. Restart VS Code

### Android Studio
1. Preferences → Plugins
2. Search "Flutter" and install
3. Restart Android Studio

## 5. Create Your First Flutter App (Test)

```bash
flutter create test_app
cd test_app
flutter run
```

If this works, you're all set! ✅

## 6. Ready for Expense Tracker Mobile App

```bash
cd /Users/upekhansaja/Documents/Projects/Web/salli-yako-expense-tracker/mobile
flutter pub get
cd ios && pod install && cd ..
flutter run
```

## Troubleshooting

### "flutter command not found"
- Flutter isn't in your PATH
- Add this to `~/.zshrc`:
  ```bash
  export PATH="$PATH:~/Development/flutter/bin"
  ```
- Restart terminal or run: `source ~/.zshrc`

### "Xcode build failed for iOS"
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

### "Android setup incomplete"
```bash
flutter doctor --android-licenses
# Accept all licenses when prompted
```

### "CocoaPods error"
```bash
sudo gem install cocoapods
cd ios
pod repo update
pod install
cd ..
```

## Quick Setup Complete Checklist

- [ ] Flutter installed: `flutter --version`
- [ ] Dart installed: `dart --version`
- [ ] Xcode configured: `flutter doctor` shows ✓
- [ ] Android SDK configured: `flutter doctor` shows ✓
- [ ] CocoaPods installed: `pod --version`
- [ ] Created test app: `flutter create test_app && cd test_app && flutter run`
- [ ] Test app runs on simulator/emulator

Once all checkmarks are done, you're ready!

## Next Steps

```bash
# Navigate to mobile project
cd salli-yako-expense-tracker/mobile

# Install dependencies
flutter pub get

# Setup iOS
cd ios && pod install && cd ..

# Run the app
flutter run
```

## Environment Information
- **OS**: macOS
- **Recommended IDE**: VS Code or Android Studio
- **Flutter Channel**: stable (recommended)
- **Minimum SDK**:
  - iOS: 11.0
  - Android: API 21 (5.0)

## Useful Links

- [Flutter Installation Guide](https://flutter.dev/docs/get-started/install)
- [Flutter for macOS](https://flutter.dev/docs/get-started/install/macos)
- [Android Studio Setup](https://developer.android.com/studio)
- [Xcode Setup](https://developer.apple.com/xcode/)

---

**Once setup is complete, start with [QUICK_START.md](./QUICK_START.md)**
