import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';
import 'package:ott_project/components/pallete.dart';

class Service {
  final FlutterSecureStorage secureStorage = FlutterSecureStorage();

  Future<bool> createUser(
    BuildContext context,
    String username,
    String email,
    String mobnum,
    String password,
    String confirmpassword,
    // File profilePicture,
  ) async {
    var uri = Uri.parse(
       //"https://testtomcat.vsmartengine.com/media/api/v2/userregister");
         'http://192.168.156.243:8080/api/v2/userregister');
       //  'http://localhost:8080/api/v2/userregister');
    //Map<String, String> headers = {"Content-Type": "multipart/form-data"};
    var request = http.MultipartRequest('POST', uri);
    request.fields['username'] = username;
    request.fields['email'] = email;
    request.fields['mobnum'] = mobnum;
    request.fields['password'] = password;
    request.fields['confirmPassword'] = confirmpassword;
    // print(username + email + mobnum + password + confirmpassword);
    // request.files.add(await http.MultipartFile.fromPath(
    //   'profile',
    //   profilePicture.path,
    // )
    //);

    try {
      var response = await request.send();
      print(response.statusCode);
      if (response.statusCode == 200) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      _showAlertDialog(context, 'Error', 'An error occurred: $e');
      return false;
    }
  }

  // Utility method to show an alert dialog
  void _showAlertDialog(BuildContext context, String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.grey.shade300,
        title: Text(
          title,
          style: TextStyle(color: kWhite),
        ),
        content: Text(
          message,
          style: TextStyle(color: kWhite),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  Future<bool> loginUser(
    BuildContext context,
    String email,
    String password,
    TextEditingController emailController,
    TextEditingController passwordController,
  ) async {
    var uri = Uri.parse(
     // "https://testtomcat.vsmartengine.com/media/api/v2/login");
       'http://192.168.156.243:8080/api/v2/login');
     //   'http://localhost:8080/api/v2/login');
    Map<String, String> headers = {"Content-Type": "application/json"};
    Map data = {
      'email': email,
      'password': password,
    };
    var body = jsonEncode(data);
    var response = await http.post(uri, headers: headers, body: body);
    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');
    if (response.statusCode == 200) {

      var responseData = jsonDecode(response.body);
      String token = responseData['token'];
      print('User token:$token');
      String userId = responseData['userId'].toString();
      await secureStorage.write(key: 'token', value: token);
      await secureStorage.write(key: 'userId', value: userId);
      return true;
    } else if (response.statusCode == 401) {
      String errorMessage = 'An unknown error occurred';
      errorMessage = 'Incorrect password';
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          backgroundColor: Colors.grey.shade300,
          content: Text(
            errorMessage,
            style: TextStyle(color: kWhite, fontSize: 20),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text('OK'),
            ),
          ],
        ),
      );
    } else if (response.statusCode == 404) {
      
      String errorMessage = 'User not found ';
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          backgroundColor: Colors.grey.shade300,
          content: Text(
            errorMessage,
            style: TextStyle(color: kWhite),
          ),
          actions: [
            TextButton(
              onPressed: () {
                emailController.clear();
                passwordController.clear();
                Navigator.pop(context);
              },
              child: Text('OK'),
            ),
          ],
        ),
      );
    }

    return false;
  }

  Future<int?> getLoggedInUserId() async {
    String? userId = await secureStorage.read(key: 'userId');
    return userId != null ? int.tryParse(userId) : null;
  }

  Future<bool> logoutUser(BuildContext context) async {
    String? token = await secureStorage.read(key: 'token');
    var uri = Uri.parse(
      'http://192.168.156.243:8080/api/v2/logout');
      //"https://testtomcat.vsmartengine.com/media/api/v2/logout");
    if(token == null) return false;
    Map<String, String> headers = {
      "Content-Type": "application/json",
      "Authorization": token,
    };

    try {
      var response = await http.post(uri, headers: headers);
      if (response.statusCode == 200) {
        await secureStorage.delete(key: 'token');
        return true;
      } else {
        _showAlertDialog(context, 'Error', 'Failed to Logout');
        return false;
      }
    } catch (e) {
      _showAlertDialog(context, 'Error', 'An error occured"$e');
      return false;
    }
  }
}
