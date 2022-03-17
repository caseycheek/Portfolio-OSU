import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' as Foundation;
import 'package:firebase_core/firebase_core.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'app.dart';

const DSN_URL = 'https://588f39005b2c4060b79b8b33f7f95a16@o1164218.ingest.sentry.io/6253161';

Future<void> main() async {
  const String title = 'Wasteagram';
  const String collectionName = 'posts';

  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  if (Foundation.kDebugMode) {
    runApp(const App(title: title, collName: collectionName));
  } else {
    // Flutter runs apps in debug mode by default and only supports release mode
    // for certain target architechtures. It does not support x86 Android ABI.
    // https://docs.flutter.dev/deployment/android#what-are-the-supported-target-architectures
    await SentryFlutter.init(
      (options) => options.dsn = DSN_URL, 
      appRunner: () => runApp(const App(title: title, collName: collectionName,))
    ); 
  }
}
