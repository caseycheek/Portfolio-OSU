import 'package:flutter/material.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'screens/list_screen.dart';


class App extends StatelessWidget {
  final String title;
  final String collName;
  const App({ Key? key, required this.title, required this.collName }) : super(key: key);
  static FirebaseAnalytics analytics = FirebaseAnalytics.instance;
  static FirebaseAnalyticsObserver observer = 
    FirebaseAnalyticsObserver(analytics: analytics);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: title,
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
      ),
      home: ListScreen(
        title: title, 
        collName: collName, 
        analytics: analytics,
        observer: observer,
      ),
      navigatorObservers: [observer],
    );
  }
}