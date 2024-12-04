import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ott_project/components/notification/notification.dart';

class NotificationApiService {
  static const String baseUrl = 
  // 'https://testtomcat.vsmartengine.com/media/api/v2';
   'http://localhost:8080/api/v2';
  //   'http://192.168.156.243:8080/api/v2';

  Future<List<Notifications>> fetchNotification(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/usernotifications'),
      headers: {'Authorization': 'Bearer $token'},
    );
    print('Notification Request Token: Bearer $token');
  print('Notification status:${response.statusCode}');
  print('Notification:${response.body}');
    if (response.statusCode == 200) {
      print('Notification:${response.body}');
      List<dynamic> notificationJson = jsonDecode(response.body);
      return notificationJson
          .map((json) => Notifications.fromJson(json))
          .toList();
    } else if (response.statusCode == 401) {
      print('Not authorized');
    } else {
      print('Failed to load notifications');
    }
    return [];
  }

  Future<void> markAllasRead(String token) async {
    final response = await http.post(
      Uri.parse('$baseUrl/markAllAsReaduser'),
      headers: {'Authorization': 'Bearer $token'},
    );
    print('Notification status:${response.statusCode}');
  print('Notification:${response.body}');

    if (response.statusCode == 200) {
      print('All notifications are read');
    } else {
      print('Error in marking all as read');
    }
  }

  Future<int> fetchUnreadCount(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/unreadCountuser'),
      headers: {'Authorization': 'Bearer $token'},
    );
    print('Notification status:${response.statusCode}');
  print('Notification:${response.body}');
    if (response.statusCode == 200) {
      return int.parse(response.body);
    } else {
      print('Error in count');
    }
    return 0;
  }

  Future<void> clearAllNotifications(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/clearAlluser'),
      headers: {'Authorization': 'Bearer $token'},
    );
print('Notification status:${response.statusCode}');
  print('Notification:${response.body}');
    if (response.statusCode == 200) {
      print('All notifications are cleared');
    } else {
      print('Error in clearing');
    }
  }
}
