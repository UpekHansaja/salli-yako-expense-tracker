# Mobile App Configuration Guide

## Environment URLs

This guide helps you configure the correct URL for different development scenarios.

### 1. Local Development with Simulator/Emulator

#### iOS Simulator
```dart
// lib/screens/webview_screen.dart
Uri.parse('http://localhost:3000')
```

**Why?** iOS Simulator can access your Mac's localhost directly.

**Setup:**
```bash
# Terminal 1: Start your web app
cd ..
npm run dev

# Terminal 2: Run Flutter app
cd mobile
flutter run -d "iPhone 15"
```

#### Android Emulator (genymotion)
```dart
Uri.parse('http://localhost:3000')
```

#### Android Emulator (Android SDK)
```dart
Uri.parse('http://10.0.2.2:3000')
```

**Why?** Android SDK emulator maps `10.0.2.2` to host machine's localhost.

**Setup:**
```bash
# Terminal 1: Start your web app
cd ..
npm run dev

# Terminal 2: Start Android emulator (from Android Studio)

# Terminal 3: Run Flutter app
cd mobile
flutter run
```

---

### 2. Physical Device (Local Network)

#### Find Your Machine's IP Address

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Look for 192.168.x.x or 10.x.x.x
```

**Example Output:**
```
inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

#### Configure Flutter App

Edit `lib/screens/webview_screen.dart`:
```dart
Uri.parse('http://192.168.1.100:3000')  // Replace with your IP
```

#### Network Setup

1. **Ensure device is on same WiFi network** as your development machine
2. **Disable firewalls** temporarily (or allow port 3000):
   ```bash
   # macOS - Check if port is accessible
   nc -zv 192.168.1.100 3000
   ```
3. **Start your web server:**
   ```bash
   npm run dev
   ```
4. **Run Flutter on device:**
   ```bash
   flutter run
   ```

---

### 3. Production Deployment

#### Using Your Domain

```dart
Uri.parse('https://yourdomain.com')
```

#### Configuration Steps

1. **Build your Next.js app for production:**
   ```bash
   npm run build
   npm start  # or deploy to your server
   ```

2. **Update Flutter app:**
   Edit `lib/screens/webview_screen.dart`:
   ```dart
   Uri.parse('https://yourdomain.com')
   ```

3. **Clear any development URLs from app:**
   Remove any `localhost` or local IP references

4. **Rebuild the mobile app:**
   ```bash
   flutter clean
   flutter pub get
   flutter build apk --release
   flutter build ios --release
   ```

---

## Network Troubleshooting

### "Connection Refused"
```
Check checklist:
☐ Web server is running (npm run dev)
☐ Using correct IP address
☐ Device is on same network
☐ Firewall allows port 3000
☐ Using http:// not https:// for local dev
```

#### Fix:
```bash
# Get your IP again
ifconfig | grep "inet "

# Verify server is running on port 3000
lsof -i :3000

# Test connection from device
# On device browser, navigate to http://YOUR_IP:3000
```

### "Timeout (Device on 4G/LTE)"
- Your server is only accessible on WiFi
- Only works with devices on same network
- For mobile 4G: Must deploy to internet-accessible server

### "HTTPS Certificate Error"
For production (https:// URLs):
1. Ensure certificate is valid
2. Try with http:// first (if possible)
3. Update certificate if expired

---

## Quick Reference

| Scenario | URL | Command |
|----------|-----|---------|
| iOS Simulator → Local Dev | `http://localhost:3000` | `flutter run -d "iPhone 15"` |
| Android SDK Emulator → Local Dev | `http://10.0.2.2:3000` | `flutter run` |
| Android Genymotion → Local Dev | `http://localhost:3000` | `flutter run` |
| iPhone (WiFi) → Mac Local Dev | `http://192.168.x.x:3000` | `flutter run` |
| Android (WiFi) → Mac Local Dev | `http://192.168.x.x:3000` | `flutter run` |
| Production | `https://yourdomain.com` | `flutter build apk --release` |

---

## Environment-Specific Setup Script

### Create `.env.local` for easy switching

```bash
# .env.local (add to .gitignore!)
DEVELOPMENT_URL=http://192.168.1.100:3000
STAGING_URL=https://staging.yourdomain.com
PRODUCTION_URL=https://yourdomain.com
```

Then update webview_screen.dart to read from config.

---

## Advanced: Multiple Flavors

For complex projects, use Flutter flavors:

```bash
# Debug (localhost)
flutter run --flavor development

# Staging
flutter run --flavor staging

# Production
flutter run --flavor production
```

Configure in `pubspec.yaml` and platform-specific files.

---

## Testing Checklist

- [ ] Test on iOS Simulator
- [ ] Test on Android Emulator
- [ ] Test on physical iPhone
- [ ] Test on physical Android
- [ ] Test on WiFi with local IP
- [ ] Test with slow network (throttle in DevTools)
- [ ] Test offline mode
- [ ] Test app refresh
- [ ] Test back button navigation
- [ ] Test long page loads (ensure spinner shows)

---

## Performance Tips

1. **Use localhost/local IP for development** - much faster than production
2. **Profile with DevTools** - check network and rendering performance
3. **Enable browser DevTools in web app** - debug while in WebView
4. **Cache assets** - configure proper caching headers
5. **Minimize bundle size** - build Next.js for production

---

## Next Steps

1. Choose your configuration from above
2. Update `lib/screens/webview_screen.dart`
3. Run `flutter run`
4. Test thoroughly
5. Build for release

Need help? See main [README.md](./README.md)
