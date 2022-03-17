import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:image_picker/image_picker.dart';
import 'package:location/location.dart';
import '../components/get_location.dart';
import '../models/post.dart';
import '../widgets/upload_graphics.dart';


class NewPostScreen extends StatefulWidget {
  final String title;
  final String collName;
  const NewPostScreen({ Key? key, required this.title, required this.collName }) : super(key: key);

  @override
  State<NewPostScreen> createState() => _NewPostScreenState();
}

class _NewPostScreenState extends State<NewPostScreen> {
  File? image;
  final picker = ImagePicker();
  final _formKey = GlobalKey<FormState>();
  int? quantity;
  Widget uploadButtonIcon = const UploadButtonGraphics(loading: false);
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('New Post')),
      body: Center(child: (newPost(context))),
    );
  }

  Widget newPost(BuildContext context) {
    if( image == null) {return selectImageButton();} 
    else {return makePostWithImage(context);}
  }

  Widget selectImageButton() {
    return Semantics(
      button: true,
      label: 'Select a photo from the gallery',
      child: ElevatedButton(
        child: const Text('Select Photo'),
        onPressed: () {
          // pick photo from gallery and set as image
          getImage();
        }
      ),
    );
  }

  void getImage() async {
    try {
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);
      image = File(pickedFile!.path);
      setState(() {}); // marks as dirty and triggers rebuild
    } catch (e) {
      errorAlert('Oops, we failed to retrieve an image for this post.');
    }
  }

  Widget makePostWithImage(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        // show image
        Padding(
          padding: const EdgeInsets.all(12),
          child: Image.file(image!),
        ),
        // number of items field
        Padding(
          padding: const EdgeInsets.all(12),
          child: quantityField(context),
        ),
        const Spacer(),
        Row(children: [Expanded(child: uploadButton())]),
      ],
    );
  }

  Widget quantityField(BuildContext context) {
    return Semantics(
      textField: true,
      label: 'Enter the number of wasted items',
      child: Form(
        key: _formKey,
        child: TextFormField(
          validator: (value) {
            if (value == null || int.tryParse(value) == null) {
              return 'Please enter the number of items as an integer.';
            } else {
              quantity = int.parse(value);
              return null;
            }
          },
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.headline6,
          decoration: const InputDecoration(labelText: 'Number of wasted items'),
        ),
      ),
    );
  }

  Widget uploadButton() {
    return Semantics(
      button: true,
      label: 'Upload this post',
      onTapHint: 'Tap to upload this post',
      child: ElevatedButton(
        child: SizedBox(height: 60, width: 60, child: uploadButtonIcon),
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            changeUploadButtonIcon(true);
            uploadData();            
          }
        }, 
      ),
    );
  }

  void changeUploadButtonIcon(bool loading) {
    uploadButtonIcon = UploadButtonGraphics(loading: loading);
    setState(() {});
  }

  void errorAlert(String message) {
    changeUploadButtonIcon(false);
    showDialog(
      context: context, 
      builder: (BuildContext context) => 
       AlertDialog(
        title: const Text('Something went wrong!'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context), 
            child: const Text('Try Again')
          )
        ],
      )
    );
  }

  void uploadData() async {
    // First, check for valid location data
    LocationData? loc = await GetLocation().retrieveLocation();
    if (loc == null) {
      errorAlert('We\'re having some trouble finding your location.');
      return;
    }
    // Second, try to upload the image to Firebase storage and get the url string
    String? imageUrl = await uploadImageAndGetUrl();
    if (imageUrl == null) {
      errorAlert('We\re having some trouble uploading your image.');
    }
    // Third, send the data to firestore
    else {
      final Post post = Post(
        date: DateTime.now().millisecondsSinceEpoch,
        imageUrl: imageUrl, 
        quantity: quantity!, 
        latitude: loc.latitude!, 
        longitude: loc.longitude!,
      );
      FirebaseFirestore.instance.collection(widget.collName).add(post.toMap);
      // Lastly, navigate back to the list screen
      Navigator.of(context).pop();
    }
  }

  Future<String?> uploadImageAndGetUrl() async {
    String fileName = DateTime.now().toString() + '.jpg';
    Reference storageRef = FirebaseStorage.instance.ref().child(fileName);
    UploadTask uploadTask = storageRef.putFile(image!);
    await uploadTask;
    return await storageRef.getDownloadURL();
  }
}