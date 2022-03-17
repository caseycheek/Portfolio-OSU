class Post {
  final int date;
  final String imageUrl;
  final int quantity;
  final double latitude;
  final double longitude;

  Post({
    required this.date,
    required this.imageUrl,
    required this.quantity,
    required this.latitude,
    required this.longitude,
  });

  DateTime get dateTime => DateTime.fromMillisecondsSinceEpoch(date);
  Map<String, dynamic> get toMap => {
    'imageUrl': imageUrl,
    'quantity': quantity,
    'latitude': latitude,
    'longitude': longitude,
    'date': date,
  };

  Post.fromMap(Map<String, dynamic> map) :
    date = map['date'],
    imageUrl = map['imageUrl'],
    quantity = map['quantity'],
    latitude = map['latitude'],
    longitude = map['longitude'];
}