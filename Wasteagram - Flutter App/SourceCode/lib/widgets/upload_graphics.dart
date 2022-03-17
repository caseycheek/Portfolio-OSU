import 'package:flutter/material.dart';

class UploadButtonGraphics extends StatelessWidget {
  final bool loading;
  const UploadButtonGraphics({ Key? key, required this.loading }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: CircularProgressIndicator(color: Colors.white,),
      );
    } else {
      return const Icon(Icons.cloud_upload, size: 50,);
    }    
  }
}