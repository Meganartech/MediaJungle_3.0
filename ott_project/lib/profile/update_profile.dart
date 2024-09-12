import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../components/background_image.dart';
import '../components/myTextField.dart';
import '../components/pallete.dart';
import 'package:http/http.dart' as http;

class UpdateProfilePage extends StatefulWidget {
  final VoidCallback onProfileUpdated;
  const UpdateProfilePage({super.key, required this.onProfileUpdated});

  @override
  State<UpdateProfilePage> createState() => _UpdateProfilePageState();
}

class _UpdateProfilePageState extends State<UpdateProfilePage> {
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
            'http://192.168.40.165:8080/api/v2/GetUserById/$userId'),
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

  // Future<void> fetchProfileImage(String userId) async {
  //   try {
  //     final response = await http.get(
  //       Uri.parse(
  //           //'https://testtomcat.vsmartengine.com/media/api/v2/mobile/GetThumbnailsById/$userId'
  //           'http://192.168.40.165:8080/api/v2/mobile/GetThumbnailsById/$userId'),
  //     );

  //     if (response.statusCode == 200) {
  //       final List<dynamic> responseBody = jsonDecode(response.body);
  //       if (responseBody.isNotEmpty) {
  //         final String base64Thumbnail = responseBody[0];
  //         //print('Base64 Thumbnail: $base64Thumbnail'); // Debugging print

  //         // Decode the Base64 string

  //         setState(() {
  //           base64Image = base64Thumbnail;
  //           print('Image bytes set'); // Debugging print
  //         });
  //       }
  //     } else {
  //       print('Failed to load profile image: ${response.statusCode}');
  //     }
  //   } catch (e) {
  //     print('Error fetching profile image: $e');
  //   }
  // }

  Future<void> _updateUserProfile() async {
    //String? token = await secureStorage.read(key: 'token');
    String? userId = await secureStorage.read(key: 'userId');
    try {
      var url = Uri.parse(
          // 'https://testtomcat.vsmartengine.com/media/api/v2/UpdateUser/mobile/$userId');
          'http://192.168.40.165:8080/api/v2/UpdateUser/mobile/$userId');
      var request = http.MultipartRequest('PATCH', url);
      //..headers.addAll({'Content-Type': 'application/json'});
      request.fields['username'] = usernameController.text;
      request.fields['email'] = emailController.text;
      request.fields['mobnum'] = mobilenumberController.text;
      if (_profilePicture != null) {
        request.files.add(await http.MultipartFile.fromPath(
          'profile',
          _profilePicture!.path,
        ));
      }
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);
      //print(response.statusCode);
      // Handle the response
      //await fetchProfileImage(userId!);

      if (response.statusCode == 200) {
        showProfileUpdatedDialog();
        fetchUserProfile(context);
      } else {
        showErrorProfileUpdateDialog();
      }
    } catch (e) {
      // Handle error
      print('Error updating user profile: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error updating profile'),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  Future<void> _pickProfilePicture() async {
    var pickedImage =
        await ImagePicker().pickImage(source: ImageSource.gallery);
    if (pickedImage != null) {
      setState(() {
        _profilePicture = File(pickedImage.path);
        base64Image = '';
      });
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
                children: [
                  GestureDetector(
                    onTap: _pickProfilePicture,
                    child: CircleAvatar(
                      radius: 50,
                      backgroundImage: _profilePicture != null
                          ? FileImage(_profilePicture!)
                          : base64Image.isNotEmpty
                              ? Image.memory(base64Decode(base64Image)).image
                              : const AssetImage('assets/images/bg2.jpg'),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    usernameController.text,
                    style: TextStyle(color: kWhite),
                  ),
                  const SizedBox(height: 20),
                  MyTextField(
                    controller: usernameController,
                    icon: Icons.person,
                    hint: 'User Name',
                    inputType: TextInputType.name,
                    inputAction: TextInputAction.next,
                    obscureText: false,
                  ),
                  const SizedBox(height: 5),
                  MyTextField(
                    controller: emailController,
                    icon: Icons.email,
                    hint: 'Email',
                    inputType: TextInputType.name,
                    inputAction: TextInputAction.next,
                    obscureText: false,
                  ),
                  const SizedBox(height: 5),
                  MyTextField(
                    controller: mobilenumberController,
                    icon: Icons.phone,
                    hint: 'Mobile Number',
                    inputType: TextInputType.emailAddress,
                    inputAction: TextInputAction.next,
                    obscureText: false,
                  ),
                  const SizedBox(height: 24.0),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _updateUserProfile,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 15),
                        backgroundColor: Color.fromARGB(174, 93, 104, 195),
                        foregroundColor: kWhite,
                      ),
                      child: const Text('Save'),
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