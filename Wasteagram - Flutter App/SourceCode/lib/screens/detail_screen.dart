import 'package:flutter/material.dart';
import '../components/formatted_datetime.dart';
import '../models/post.dart';


class DetailScreen extends StatelessWidget {
  final String title;
  final Post post;
  const DetailScreen({ 
    Key? key, 
    required this.title, 
    required this.post 
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Text(formattedDate(post.dateTime), 
              style: Theme.of(context).textTheme.headline5),
            photoBox(context, post.imageUrl),
            Text('Items: ${post.quantity.toString()}',
              style: Theme.of(context).textTheme.headline5),
            Text('(${post.latitude}, ${post.longitude})',
              style: Theme.of(context).textTheme.headline6),
          ],
        ),
      ),
    );
  }

  Widget photoBox(BuildContext context, String imageUrl) {
    return SizedBox(
      width: MediaQuery.of(context).size.width * 0.8,
      child: Stack(
        children: [
          Container(
            padding: const EdgeInsets.all(25),
            alignment: Alignment.center,
            child: const CircularProgressIndicator()
          ),
          Image.network(imageUrl),
        ]
      ), 
    );
  }
}