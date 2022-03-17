import 'package:flutter/material.dart';


class SentryDemoDrawer extends StatelessWidget {
  const SentryDemoDrawer({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            alignment: Alignment.center,
            child: const Text('Tap to notify Sentry that the app has thrown an exception')
          ),
          ElevatedButton(
            child: const Text('Throw an Exception'),
            onPressed: () {throw StateError('Example Error!');},
          ),
        ]
      ),
    );
  }
}