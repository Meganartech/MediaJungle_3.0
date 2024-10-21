import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:ott_project/components/pallete.dart';

import '../components/background_image.dart';
import '../components/myTextField.dart';

class ChangePasswordPage extends StatefulWidget {
  ChangePasswordPage({super.key});

  @override
  State<ChangePasswordPage> createState() => _ChangePasswordPageState();
}

class _ChangePasswordPageState extends State<ChangePasswordPage> {
  final TextEditingController currentPasswordController =
      TextEditingController();
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController newPasswordController = TextEditingController();

  final TextEditingController confirmPasswordController =
      TextEditingController();

  final FlutterSecureStorage secureStorage = FlutterSecureStorage();
  String base64Image = '';

  @override
  void initState() {
    super.initState();
    fetchUserProfile(context);
    // fetchProfileImage(context as String);
  }

  Future<void> changePassword(BuildContext context) async {
    final String curpassword = currentPasswordController.text;
    final String newpassword = newPasswordController.text;
    final String confirmpassword = confirmPasswordController.text;
    if (curpassword.isEmpty || newpassword.isEmpty || confirmpassword.isEmpty) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          content: Text('All fields are required. Please fill in all fields.'),
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
      return;
    }

    if (newpassword != confirmpassword) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          content:
              Text('Passwords do not match. Please enter the same password.'),
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
      return;
    }
    String? userId = await secureStorage.read(key: 'userId');
    try {
      var url = Uri.parse(
          //'https://testtomcat.vsmartengine.com/media/api/v2/UpdateUser/mobile/$userId'
          'http://192.168.183.42:8080/api/v2/GetUserById/$userId'
          );
      var request = http.MultipartRequest('PATCH', url);

      request.fields['password'] = curpassword;
      request.fields['newpassword'] = newpassword;

      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        _showSuccessDialog(context, 'Password changed Successfully');
        _clearPasswordFields();
      } else {
        _showErrorDialog(context, 'An error occurred');
      }
    } catch (e) {
      _showErrorDialog(context, 'An error occurred while changing password');
    }
  }

  void _showErrorDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          content: Text(message, style: TextStyle(color: Colors.black)),
          backgroundColor: Colors.white,
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('OK', style: TextStyle(color: Colors.black)),
            ),
          ],
        );
      },
    );
  }

  void _showSuccessDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Success', style: TextStyle(color: Colors.black)),
          content: Text(message, style: TextStyle(color: Colors.black)),
          backgroundColor: Colors.white,
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('OK', style: TextStyle(color: Colors.black)),
            ),
          ],
        );
      },
    );
  }

  void _clearPasswordFields() {
    currentPasswordController.clear();
    newPasswordController.clear();
    confirmPasswordController.clear();
  }

  Future<void> fetchUserProfile(BuildContext context) async {
    String? token = await secureStorage.read(key: 'token');
    String? userId = await secureStorage.read(key: 'userId');

    try {
      var response = await http.get(
        Uri.parse(
            //'https://testtomcat.vsmartengine.com/media/api/v2/GetUserById/$userId'),
            'http://192.168.183.42:8080/api/v2/GetUserById/$userId'
            //'http://localhost:8080/api/v2/GetUserById/$userId'
            ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      // print(response.statusCode);

      if (response.statusCode == 200) {
        var userData = jsonDecode(response.body);
        //final List<dynamic> responseBody = jsonDecode(response.body);

        //final String base64Thumbnail = userData[0];
        //_image = userData['profile'];

        setState(() {
          base64Image = userData['profile'];
          usernameController.text = userData['username'] ?? '';
          // emailController.text = userData['email'] ?? '';
          // mobilenumberController.text = userData['mobnum'] ?? '';
        });

        //await fetchProfileImage(userId);
      } else {
        // Handle error
        print('Failed to fetch user profile');
      }
    } catch (e) {
      // Handle error
      print('Error fetching user profile: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Stack(
      children: [
        BackgroundImage(),
        Scaffold(
          backgroundColor: Colors.transparent, 
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            leading: IconButton(
              onPressed: () {
                Navigator.pop(context);
              },
              icon: Icon(
                Icons.arrow_back_rounded,
                color: kWhite,
              ),
            ),
          ),
          body: SingleChildScrollView(
            child: Column(
              children: [
                Center(
                  child: Column(
                    children: [
                      SizedBox(
                        height: size.height * 0.01,
                      ),
                      CircleAvatar(
                        radius: 50,
                        backgroundImage: base64Image.isNotEmpty
                            ? Image.memory(base64Decode(base64Image)).image
                            : const AssetImage('assets/images/bg1.jpg'),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        usernameController.text,
                        style: TextStyle(color: kWhite),
                      ),
                      SizedBox(
                        height: size.height * 0.09,
                      ),

                      //SizedBox(height: 15),
                      MyTextField(
                          controller: currentPasswordController,
                          icon: FontAwesomeIcons.lock,
                          hint: 'Current Password',
                          inputType: TextInputType.visiblePassword,
                          inputAction: TextInputAction.next,
                          obscureText: false),
                      SizedBox(
                        height: 10,
                      ),
                      MyTextField(
                          controller: newPasswordController,
                          icon: FontAwesomeIcons.lock,
                          hint: 'New Password',
                          inputType: TextInputType.visiblePassword,
                          inputAction: TextInputAction.next,
                          obscureText: true),
                      SizedBox(
                        height: 10,
                      ),
                      MyTextField(
                          controller: confirmPasswordController,
                          icon: FontAwesomeIcons.lock,
                          hint: 'Confirm Password',
                          inputType: TextInputType.visiblePassword,
                          inputAction: TextInputAction.next,
                          obscureText: true),
                      SizedBox(height: 30),
                      Container(
                        height: size.height * 0.08,
                        width: size.width * 0.8,
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            color: Colors.blueGrey.shade300),
                        child: TextButton(
                            onPressed: () {
                              changePassword(context);
                            },
                            child: Text(
                              'Submit',
                              style: kBodyText.copyWith(
                                  fontWeight: FontWeight.bold),
                            )),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        )
      ],
    );
  }
}
