import 'package:flutter/material.dart';
import 'screens/webview_screen.dart';

void main() {
  runApp(const ExpenseTrackerApp());
}

class ExpenseTrackerApp extends StatelessWidget {
  const ExpenseTrackerApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Salli Yako Expense Tracker',
      theme: ThemeData(
        primaryColor: const Color(0xFF8b5cf6),
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF8b5cf6),
          brightness: Brightness.light,
        ),
      ),
      darkTheme: ThemeData(
        primaryColor: const Color(0xFF8b5cf6),
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF8b5cf6),
          brightness: Brightness.dark,
        ),
      ),
      home: const WebViewScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
