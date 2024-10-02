import 'dart:io';
import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/myTextField.dart';

import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/login_page.dart';
import 'package:ott_project/service/service.dart';

class SignUp extends StatefulWidget {
  const SignUp({super.key});

  @override
  State<SignUp> createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  final TextEditingController usernameController = TextEditingController();
  //final TextEditingController lastnameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmpasswordController =
      TextEditingController();
  final TextEditingController mobilenumberController = TextEditingController();
  File? _imageFile;
  final Service service = Service();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  _pickImage() async {
    try {
      final pickedFile =
          await ImagePicker().pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        setState(() {
          _imageFile = File(pickedFile.path);
        });
      }
    } catch (e) {
      // Handle errors here, e.g. show a dialog or snackbar
      print("Image pick error: $e");
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
          body: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  SizedBox(
                    height: size.width * 0.3,
                  ),
                  Stack(
                    children: [
                      Center(
                        child: ClipOval(
                          child: BackdropFilter(
                            filter: ImageFilter.blur(sigmaX: 3, sigmaY: 3),
                            child: CircleAvatar(
                              radius: size.width * 0.14,
                              backgroundColor:
                                  Colors.grey.shade200.withOpacity(0.3),
                              child: _imageFile == null
                                  ? Icon(FontAwesomeIcons.user,
                                      color: kWhite, size: size.width * 0.11)
                                  : CircleAvatar(
                                      radius: size.width * 0.13,
                                      backgroundImage: FileImage(_imageFile!),
                                    ),
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        bottom: size.height * 0.002,
                        left: size.width * 0.53,
                        child: IconButton(
                          onPressed: _pickImage,
                          icon: Icon(
                            Icons.camera_alt,
                            color: kWhite,
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(
                    height: size.width * 0.1,
                  ),
                  Column(
                    children: [
                      MyTextField(
                        controller: usernameController,
                        icon: FontAwesomeIcons.user,
                        hint: 'User Name',
                        inputType: TextInputType.name,
                        inputAction: TextInputAction.next,
                        obscureText: false,
                        validator: (value) {
                          if (value?.isEmpty ?? true) {
                            return '  Please enter your name';
                          }
                          return null;
                        },
                      ),
                      MyTextField(
                        controller: emailController,
                        icon: FontAwesomeIcons.envelope,
                        hint: 'Email',
                        inputType: TextInputType.emailAddress,
                        inputAction: TextInputAction.next,
                        obscureText: false,
                        validator: (value) {
                          if (value!.isEmpty) {
                            return '  Please enter your email';
                          }
                          if (!isValidEmail(value)) {
                            return '  Please enter a valid email';
                          }
                          return null;
                        },
                      ),
                      MyTextField(
                        controller: mobilenumberController,
                        icon: FontAwesomeIcons.phone,
                        hint: 'Mobile Number',
                        inputType: TextInputType.number,
                        inputAction: TextInputAction.next,
                        obscureText: false,
                        validator: (value) {
                          if (value!.isEmpty) {
                            return '  Please enter mobile number';
                          }
                          if (value.length < 10) {
                            return ' Please enter 10 digits';
                          }
                          return null;
                        },
                      ),
                      MyTextField(
                        controller: passwordController,
                        icon: FontAwesomeIcons.lock,
                        hint: 'Password',
                        inputType: TextInputType.visiblePassword,
                        inputAction: TextInputAction.next,
                        obscureText: true,
                        validator: (value) {
                          if (value!.isEmpty) {
                            return '  Please enter password';
                          }
                          return null;
                        },
                      ),
                      MyTextField(
                        controller: confirmpasswordController,
                        icon: FontAwesomeIcons.lock,
                        hint: 'Confirm Password',
                        inputType: TextInputType.visiblePassword,
                        inputAction: TextInputAction.done,
                        obscureText: true,
                        validator: (value) {
                          if (value!.isEmpty) {
                            return '  Please enter confirm password';
                          }
                          return null;
                        },
                        confirmPasswordController: passwordController,
                      ),
                      SizedBox(height: 20),
                      Container(
                        height: size.height * 0.07,
                        width: size.width * 0.8,
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            color: Colors.blueGrey.shade300),
                        child: TextButton(
                            onPressed: () async {
                              if (_formKey.currentState!.validate()) {
                                bool signupSuccess =
                                    await registerUser(context);
                                if (signupSuccess) {
                                  // Sign-up successful, navigate to login or home screen
                                  showValidationDialog(
                                      'User registered Successfully!!!');
                                } //else {
                                //   // Sign-up failed, show an error message
                                //   showValidationDialog(
                                //       'User with the given email already exists.');
                                // }
                              } else {
                                showValidationDialog(
                                    ' Please enter required fields to register.');
                              }
                            },
                            child: Text(
                              'Register',
                              style: kBodyText.copyWith(
                                  fontWeight: FontWeight.bold),
                            )),
                      ),
                      SizedBox(
                        height: 20,
                      ),
                      Row(
                        children: [
                          Expanded(
                            child: Divider(
                              color: Colors.grey[400],
                              thickness: 0.5,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(
                        height: 10,
                      ),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Already Have an account?',
                            style: kBodyText,
                          ),
                          GestureDetector(
                            onTap: () => Navigator.pushNamed(context, '/'),
                            child: Text(
                              'Login Here!',
                              style: kBodyText.copyWith(
                                  color: kBlue, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 15),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Future<void> validateAndRegisterUser(BuildContext context) async {
    // Check if all fields are filled
    if (usernameController.text.isEmpty ||
        emailController.text.isEmpty ||
        mobilenumberController.text.isEmpty ||
        passwordController.text.isEmpty ||
        confirmpasswordController.text.isEmpty) {
      // Show error message for empty fields
      showValidationDialog("All fields are required.");
      return;
    }

    // Validate email format
    if (!isValidEmail(emailController.text)) {
      showValidationDialog("Please enter a valid email.");
      return;
    }

    // Validate password and confirm password match
    if (passwordController.text != confirmpasswordController.text) {
      showValidationDialog("Passwords do not match.");
      return;
    }

    // If validation passes, proceed with registration
    bool isRegistered = await registerUser(context);

    if (isRegistered) {
      // Registration success, navigate to login page
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LoginPage()),
      );
    } else {
      // Handle registration failure
      showValidationDialog("Registration failed. Please try again.");
    }
  }

  Future<bool> registerUser(BuildContext context) async {
    return await service.createUser(
        context,
        usernameController.text,
        emailController.text,
        mobilenumberController.text,
        passwordController.text,
        confirmpasswordController.text
        // _imageFile!,
        );
  }

  bool isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }

  void showValidationDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: kWhite,
          content: Text(
            message,
            style: TextStyle(color: Colors.black, fontSize: 18),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text(
                'OK',
                style: TextStyle(color: Colors.black, fontSize: 18),
              ),
            ),
          ],
        );
      },
    );
  }
}
