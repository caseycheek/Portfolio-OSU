import 'package:location/location.dart';

class GetLocation {
Location location = Location();
PermissionStatus? _permissionGranted;

  Future<LocationData?> retrieveLocation() async {
    // enable service
    bool _serviceEnabled = await location.serviceEnabled();
    if (!_serviceEnabled) {
      _serviceEnabled = await location.requestService();
      if (!_serviceEnabled) {
        print('Failed to enable service. Returning.');
        return null;
      }
    }
    // ask permission
    _permissionGranted = await location.hasPermission();
    if (_permissionGranted == PermissionStatus.denied) {
      _permissionGranted = await location.requestPermission();
      if (_permissionGranted != PermissionStatus.granted) {
        print('Location service permission not granted. Returning.');
        return null;
      }
    }
    // return location data
    return await location.getLocation();  
  }
}