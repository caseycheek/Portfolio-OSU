import 'package:flutter/material.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import '../components/formatted_datetime.dart';
import '../screens/new_post_screen.dart';

class NewPostFab extends StatelessWidget {
  final String title;
  final String collName;
  final FirebaseAnalytics analytics;
  final FirebaseAnalyticsObserver observer;
  const NewPostFab({ 
    Key? key, 
    required this.title, 
    required this.collName, 
    required this.analytics, 
    required this.observer,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      enabled: true,
      onTapHint: 'Create a new post',
      child: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          _sendAnalyticsEvent();
          Navigator.of(context).push(
            MaterialPageRoute(builder: (context) => 
            NewPostScreen(title: title, collName: collName,)
            )
          );
        },
      ),
    );
  }

  Future<void> _sendAnalyticsEvent() async {
    await analytics.logEvent(
      name: 'tapped_new_post_fab',
      parameters: <String, dynamic>{
        'time': formattedTime(DateTime.now()),
      }
    );
  }
}