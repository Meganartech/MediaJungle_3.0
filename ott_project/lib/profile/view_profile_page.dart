import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:ott_project/profile/update_profile.dart';
import '../components/background_image.dart';
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

    try {
      var response = await http.get(
        Uri.parse(
            //  'https://testtomcat.vsmartengine.com/media/api/v2/GetUserById/$userId'),
            'http://192.168.183.129:8080/api/v2/GetUserById/$userId'),
        // 'http://localhost:8080/api/v2/GetUserById/$userId'),
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
          if (userData['profile'] != null) {
            base64Image = userData['profile'];
          }
        });
        setState(() {});
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
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  //  GestureDetector(
                  // onTap: _pickProfilePicture,
                  //child:
                  CircleAvatar(
                    radius: 50,
                    backgroundColor: const Color.fromARGB(255, 51, 49, 49),
                    backgroundImage: _profilePicture != null
                        ? FileImage(_profilePicture!)
                        : base64Image.isNotEmpty
                            ? Image.memory(base64Decode(base64Image)).image
                            : null,
                  ),
                  //),
                  const SizedBox(height: 10),
                  Text(
                    usernameController.text,
                    style: TextStyle(color: kWhite),
                  ),
                  const SizedBox(height: 40),
                  profileInfo('Name', usernameController.text),
                  const SizedBox(height: 15),
                  // Display Email row
                  profileInfo('Email', emailController.text),
                  const SizedBox(height: 15),
                  // Display Phone Number row
                  profileInfo('Phone Number', mobilenumberController.text),
                  //const SizedBox(height: 30),

                  SizedBox(
                    height: MediaQuery.of(context).size.height * 0.18,
                  ),
                  SizedBox(
                    //width: double.infinity,
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
                        // minimumSize: Size(double.infinity, 40),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14)),
                        padding: EdgeInsets.symmetric(
                            horizontal:
                                MediaQuery.sizeOf(context).height * 0.04,
                            vertical: 15),
                        backgroundColor: Color.fromARGB(174, 93, 104, 195),
                        foregroundColor: kWhite,
                      ),
                      child: const Text(
                        'Edit Profile',
                        style: TextStyle(fontSize: 14),
                      ),
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
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
              flex: 2,
              child: Text('$label',
                  textAlign: TextAlign.left,
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
            flex: 2,
            child: Text(value,
                textAlign: TextAlign.start,
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
