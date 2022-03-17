import 'package:intl/intl.dart';

String formattedDate(DateTime dateTime) {
  return DateFormat('EEEE, MMM. d, y').format(dateTime);
}

String formattedTime(DateTime dateTime) {
  return DateFormat('jms').format(dateTime);
}