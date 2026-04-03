import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:permission_handler/permission_handler.dart';
import 'dart:io';

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({Key? key}) : super(key: key);

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late WebViewController _webViewController;
  bool _isLoading = true;
  bool _canGoBack = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _requestPermissions();
    _initializeWebView();
  }

  Future<void> _requestPermissions() async {
    if (Platform.isAndroid) {
      await Permission.internet.request();
      await Permission.camera.request();
      await Permission.microphone.request();
    } else if (Platform.isIOS) {
      await Permission.camera.request();
      await Permission.microphone.request();
    }
  }

  void _initializeWebView() {
    _webViewController = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
              _errorMessage = null;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
            _updateBackButtonState();
          },
          onWebResourceError: (WebResourceError error) {
            setState(() {
              _isLoading = false;
              _errorMessage = error.description;
            });
          },
          onNavigationRequest: (NavigationRequest request) {
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(
        // Use localhost:3000 for development, or your deployed URL for production
        Uri.parse('http://localhost:3000'),
      );
  }

  Future<void> _updateBackButtonState() async {
    final canGoBack = await _webViewController.canGoBack();
    setState(() {
      _canGoBack = canGoBack;
    });
  }

  Future<void> _goBack() async {
    if (await _webViewController.canGoBack()) {
      _webViewController.goBack();
      _updateBackButtonState();
    }
  }

  Future<void> _reload() async {
    _webViewController.reload();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        if (_canGoBack) {
          _goBack();
          return false;
        }
        return true;
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            'Salli Yako Expense Tracker',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 18,
            ),
          ),
          backgroundColor: const Color(0xFF8b5cf6),
          foregroundColor: Colors.white,
          elevation: 0,
          actions: [
            if (_canGoBack)
              IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: _goBack,
                tooltip: 'Go back',
              ),
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _reload,
              tooltip: 'Reload',
            ),
          ],
        ),
        body: _errorMessage != null
            ? _buildErrorWidget()
            : Stack(
                children: [
                  WebViewWidget(controller: _webViewController),
                  if (_isLoading)
                    Container(
                      color: Colors.white.withOpacity(0.7),
                      child: const Center(
                        child: CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Color(0xFF8b5cf6),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Container(
      color: Colors.white,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Color(0xFFef4444),
            ),
            const SizedBox(height: 24),
            const Text(
              'Connection Error',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(
                _errorMessage ?? 'Failed to load the application',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  color: Color(0xFF6b7280),
                  height: 1.5,
                ),
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: _reload,
              icon: const Icon(Icons.refresh),
              label: const Text('Try Again'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF8b5cf6),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
