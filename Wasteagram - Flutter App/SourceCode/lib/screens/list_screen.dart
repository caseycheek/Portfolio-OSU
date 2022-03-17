import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import '../components/formatted_datetime.dart';
import '../models/post.dart';
import '../screens/detail_screen.dart';
import '../widgets/new_post_fab.dart';
import '../widgets/sentry_demo_drawer.dart';


class ListScreen extends StatefulWidget {
  final String title;
  final String collName;
  final FirebaseAnalytics analytics;
  final FirebaseAnalyticsObserver observer;
  const ListScreen({ 
    Key? key, 
    required this.title, 
    required this.collName, 
    required this.analytics,
    required this.observer, 
  }) : super(key: key);

  @override
  State<ListScreen> createState() => _ListScreenState();
}

class _ListScreenState extends State<ListScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      endDrawer: const SentryDemoDrawer(),
      appBar: AppBar(
        actions: <Widget>[openDrawerBuilder()],
        title: StreamBuilder(
          stream: FirebaseFirestore.instance.collection(widget.collName).snapshots(),
          builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
            return titleStreamBuilder(context, snapshot);
          },
        ),
      ),
      floatingActionButton: NewPostFab(
        title: widget.title, 
        collName: widget.collName, 
        analytics: widget.analytics,
        observer: widget.observer,
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      body: StreamBuilder(
        stream: FirebaseFirestore.instance.collection(widget.collName).snapshots(),
        builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
          return postsStreamBuilder(context, snapshot);
        },
      ),
    );
  }

  Widget openDrawerBuilder() {
    return Builder(
      builder: (BuildContext context) => IconButton(
        onPressed: () => Scaffold.of(context).openEndDrawer(), 
        icon: const Icon(Icons.bug_report),
      )
    );
  } 

  Widget titleStreamBuilder(BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
    if (validStreamDocs(snapshot)) {
      return Text('${widget.title} - ${findTotalItems(snapshot.data!.docs).toString()}');
    } else {return Text(widget.title);}
  }

  bool validStreamDocs(AsyncSnapshot<QuerySnapshot> snapshot) {
    if (snapshot.hasData && 
      snapshot.data?.docs != null && 
      snapshot.data!.docs.isNotEmpty) {
      return true;
    }
    else {return false;}
  }
  
  int findTotalItems(List<QueryDocumentSnapshot> snapshotDocs) {
    num currentCount = 0;
    snapshotDocs.forEach((e) {currentCount+=e['quantity'];});
    return currentCount.toInt();
  }

  Widget postsStreamBuilder(BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
    if (validStreamDocs(snapshot)) {
      return Container(
        color: Theme.of(context).primaryColorLight,
        child: postListView(
          context, 
          sortedPostListFromSnapshotDocs(snapshot.data!.docs)
        )
      );
    } else {return const Center(child: CircularProgressIndicator());}
  }

  List<Post> sortedPostListFromSnapshotDocs(List<QueryDocumentSnapshot> snapshotDocs) {
    List<Post> postList = snapshotDocs.map( 
      (e) => postFromQueryDocumentSnapshot(e)
    ).toList();
    postList.sort((b, a) => a.date.compareTo(b.date)); // newest posts first
    return postList;
  }

  Post postFromQueryDocumentSnapshot(QueryDocumentSnapshot snapshot) {
    return Post(
      date: snapshot['date'], 
      imageUrl: snapshot['imageUrl'], 
      quantity: snapshot['quantity'], 
      latitude: snapshot['latitude'], 
      longitude: snapshot['longitude'],
    );
  }

  Widget postListView(BuildContext context, List<Post> postList) {
    return ListView.builder(
      itemCount: postList.length,
      itemBuilder: (context, index) => postCard(context, postList[index])
    );
  }

  Widget postCard(BuildContext context, Post post) {
    return Card(
      child: Semantics(
        label: 
        'Post created on ${formattedDate(post.dateTime)} has ${post.quantity.toString()} items',
        onTapHint: 'View post details',
        child: ListTile(
          title: Text(formattedDate(post.dateTime)),
          subtitle: Text(formattedTime(post.dateTime)),
          trailing: Text(post.quantity.toString()),
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (context) => 
                DetailScreen(title: widget.title, post: post)
              )
            );
          },
        ),
      ),
    );
  }
}