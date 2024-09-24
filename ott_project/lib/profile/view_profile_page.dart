import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:ott_project/profile/update_profile.dart';
import '../components/background_image.dart';
import '../components/myTextField.dart';
import '../components/pallete.dart';
import 'package:http/http.dart' as http;

class ViewProfilePage extends StatefulWidget {
  final VoidCallback onProfileUpdated;
  const ViewProfilePage({super.key, required this.onProfileUpdated});

  @override
  State<ViewProfilePage> createState() => _ViewProfilePageState();
}

class _ViewProfilePageState extends State<ViewProfilePage> {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController mobilenumberController = TextEditingController();
  final FlutterSecureStorage secureStorage = FlutterSecureStorage();
  String base64Image = '';
  File? _profilePicture;

  @override
  void initState() {
    super.initState();
    fetchUserProfile(context);
  }

  @override
  void dispose() {
    usernameController.dispose();
    emailController.dispose();
    mobilenumberController.dispose();
    super.dispose();
  }

  Future<void> fetchUserProfile(BuildContext context) async {
    String? token = await secureStorage.read(key: 'token');
    String? userId = await secureStorage.read(key: 'userId');
    if (token == null || userId == null) {
      showDialog(
          context: context,
          builder: (context) => AlertDialog(
                backgroundColor: Colors.transparent,
                content: Text(
                  'Token or User Id not found',
                  style: TextStyle(color: Colors.white),
                ),
                actions: [
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: Text('OK'),
                  ),
                ],
              ));
      return;
    }

    try {
      var response = await http.get(
        Uri.parse(
            //  'https://testtomcat.vsmartengine.com/media/api/v2/GetUserById/$userId'),
            // 'http://192.168.40.165:8080/api/v2/GetUserById/$userId'),
            'http://localhost:8080/api/v2/GetUserById/$userId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      // print(response.statusCode);

      if (response.statusCode == 200) {
        var userData = jsonDecode(response.body);
        //print(userData);
        //_image = userData['profile'];
        setState(() {
          usernameController.text = userData['username'] ?? '';
          emailController.text = userData['email'] ?? '';
          mobilenumberController.text = userData['mobnum'] ?? '';
          base64Image = userData['profile'];
        });
        setState(() {});
        //  await fetchProfileImage(userId);
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
    return Stack(
      children: [
        BackgroundImage(),
        Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            leading: IconButton(
              icon: Icon(
                Icons.arrow_back_rounded,
                color: Colors.white,
              ),
              onPressed: () {
                widget.onProfileUpdated();
                // Navigate to the profile page
                Navigator.pop(context);
              },
            ),
          ),
          body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  //  GestureDetector(
                  // onTap: _pickProfilePicture,
                  //child:
                  CircleAvatar(
                    radius: 50,
                    backgroundImage: _profilePicture != null
                        ? FileImage(_profilePicture!)
                        : base64Image.isNotEmpty
                            ? Image.memory(base64Decode(base64Image)).image
                            : const AssetImage('assets/images/bg2.jpg'),
                  ),
                  //),
                  const SizedBox(height: 10),
                  Text(
                    usernameController.text,
                    style: TextStyle(color: kWhite),
                  ),
                  const SizedBox(height: 20),
                  profileInfo('Name', usernameController.text),
                  const SizedBox(height: 15),
                  // Display Email row
                  profileInfo('Email', emailController.text),
                  const SizedBox(height: 15),
                  // Display Phone Number row
                  profileInfo('Phone Number', mobilenumberController.text),
                  //const SizedBox(height: 30),

                  const SizedBox(height: 50.0),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    UpdateProfilePage(onProfileUpdated: () {
                                      fetchUserProfile(context);
                                    })));
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 15),
                        backgroundColor: Color.fromARGB(174, 93, 104, 195),
                        foregroundColor: kWhite,
                      ),
                      child: const Text('Edit Profile'),
                    ),
                  ),
                  const SizedBox(height: 16.0),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget profileInfo(String label, String value) {
    return Center(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
              flex: 2,
              child: Text('$label',
                  style: TextStyle(
                      color: kWhite,
                      fontWeight: FontWeight.normal,
                      fontSize: 16))),
          const SizedBox(width: 10),
          Text(':',
              style: TextStyle(
                  color: kWhite, fontWeight: FontWeight.normal, fontSize: 16)),
          const SizedBox(width: 10),
          Expanded(
            flex: 3,
            child: Text(value,
                style: TextStyle(
                    color: kWhite,
                    fontWeight: FontWeight.normal,
                    fontSize: 16)),
          ),
        ],
      ),
    );
  }

  void showProfileUpdatedDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            'Profile Updated',
            style: TextStyle(color: Colors.black),
          ),
          content: Text(
            'Your profile has been updated successfully.',
            style: TextStyle(color: Colors.black),
          ),
          backgroundColor: kWhite,
          actions: [
            TextButton(
              onPressed: () async {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text(
                'OK',
                style: TextStyle(color: Colors.black),
              ),
            ),
          ],
        );
      },
    );
  }

  void showErrorProfileUpdateDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          content: Text(
            'Failed to update profile',
            style: TextStyle(color: Colors.black),
          ),
          backgroundColor: kWhite,
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text(
                'OK',
                style: TextStyle(color: Colors.black),
              ),
            ),
          ],
        );
      },
    );
  }
}
