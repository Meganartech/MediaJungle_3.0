import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/myTextField.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:http/http.dart' as http;

class ForgetPassword extends StatelessWidget {
  ForgetPassword({super.key});

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

  Future<void> resetPassword(BuildContext context) async {
    final String email = emailController.text;
    final String password = passwordController.text;
    final String confirmpassword = confirmPasswordController.text;

    if (password != confirmpassword) {
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
    final response = await http.post(
      Uri.parse("http://192.168.40.165:8080/api/v2/forgetPassword"),
      headers: <String, String>{'Content-Type': 'application/json'},
      body: jsonEncode(<String, String>{
        'email': email,
        'password': password,
        'confirmPassword': confirmpassword,
      }),
    );
    print('Response code: ${response.statusCode}');
    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Password reset successfully')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to reset password: ${response.body}')),
      );
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
                      Text('Forget Password', style: kBodyText),
                      SizedBox(
                        height: size.height * 0.09,
                      ),
                      Container(
                        width: size.width * 0.9,
                        height: size.height * 0.09,
                        child: Text(
                            'Enter your email and new password to reset your password',
                            style: kBodyText),
                      ),
                      //SizedBox(height: 15),
                      MyTextField(
                          controller: emailController,
                          icon: FontAwesomeIcons.envelope,
                          hint: 'Email',
                          inputType: TextInputType.emailAddress,
                          inputAction: TextInputAction.next,
                          obscureText: false),
                      SizedBox(
                        height: 10,
                      ),
                      MyTextField(
                          controller: passwordController,
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
                              resetPassword(context);
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
