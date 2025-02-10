import 'dart:convert';
import 'dart:io';
import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/myTextField.dart';
import 'package:http/http.dart' as http;
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/login_page.dart';
import 'package:ott_project/service/service.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
   final TextEditingController codeController = TextEditingController();
  bool isLoading = false;
  bool visibleOTP = false;
   bool visiblePassword = false;
   bool confirmVisiblePassword = false;
  File? _imageFile;
  final Service service = Service();
  String verifyButtonText = 'Verify'; 
  bool isVerifying = false;
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
  void initState() {
    visiblePassword = false;
    confirmVisiblePassword = false;
    super.initState();
  }


//  Future<void> sendVerificationcode(String email) async{
//     const String baseUrl = 
//     //'http://localhost:8080/api/v2/send-code';
//     'https://testtomcat.vsmartengine.com/media/api/v2/send-code';
//     //'http://192.168.156.243:8080/api/v2/send-code';
//     setState(() {
//       isLoading = true;
//     });
//     try{
//       final response = await http.post(
//         Uri.parse(baseUrl),
//         body: {'email' : email}
//       );
//       if(response.statusCode == 200){
//         final data = jsonDecode(response.body);
//         final receivedOTP = data['code'];
//         SharedPreferences prefs = await SharedPreferences.getInstance();
//         await prefs.setString('savedEmail', email);
//         await prefs.setString('storedOTP', receivedOTP);
//         ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Verification code sent successfully')));

//       }else if (response.statusCode == 400 && response.body.contains('Invalid email')) {
//       // Email not found in the backend
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text('Email not found. Please try again.')),
//       );
//     }else{
//         ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('An error occurred while processing your request. Please try again later.')));
//       }
//     }catch(e){
//       ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('An error occurred while processing your request. Please try again later.')));
//     }finally{
//       setState(() {
//         isLoading = false;
//       });
//     }
//   }

// Future<void> verifyCode(String email,String code) async{
//    setState(() {
//       isVerifying = true; // Start verifying
//     });

//     const String baseUrl =
//     // 'http://localhost:8080/api/v2/verify-code';
//      //'http://192.168.156.243:8080/api/v2/verify-code';
//     'https://testtomcat.vsmartengine.com/media/api/v2/verify-code';
//      setState(() {
//       isLoading = true;
//     });
//     try{
//       final response = await http.post(Uri.parse(baseUrl),
//       body: {'email':email, 'code': code},
//       );
//       if(response.statusCode == 200){
//          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Code verified')));
//           setState(() {
//             verifyButtonText = 'Verified';
//           });
//       } else if (response.statusCode == 400 && response.body.contains('Invalid verification code')) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text('Invalid verification code. Please try again.')),
//         );
//       } else if (response.statusCode == 400 && response.body.contains('Verification code expired')) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text('Verification code expired. Please resend code.')),
//         );
//       }else{
//           ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('An error occurred while processing your request. Please try again later.')));
//       }
//     }catch(e){
//         ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('An error occurred while processing your request. Please try again later.')));
//     }
//   }


  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return WillPopScope(
      onWillPop: () async{
        return false;
      },
      child: Stack(
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
                      height: MediaQuery.sizeOf(context).height * 0.10,
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
                          bottom: MediaQuery.sizeOf(context).height * 0.002,
                          left: MediaQuery.sizeOf(context).width * 0.52,
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
                      height:  MediaQuery.sizeOf(context).height * 0.03,
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
                      //    SizedBox(
                      //   height: MediaQuery.sizeOf(context).height * 0.01,
                      // ),
                       Padding(
                         padding: const EdgeInsets.only(left: 20,top: 8,bottom: 8,right: 20),
                         child: TextField(
                           controller: emailController,
                           
                           decoration: InputDecoration(
                             hintText: 'Email',
                              hintStyle: Theme.of(context)
                          .textTheme
                          .bodyLarge!
                          .copyWith(color: Colors.white54),
                             prefixIcon: Icon(
                               FontAwesomeIcons.envelope,
                               color: Colors.white,
                             ),
                             suffixIcon: Padding(
                               padding: EdgeInsets.only(top: 8,bottom: 8,left: 20,right: MediaQuery.sizeOf(context).width * 0.04), // Adjust padding as needed
                               child: TextButton(
                                 onPressed: () {
                                   final email = emailController.text.trim();
                                   if (email.isEmpty) {
                                     ScaffoldMessenger.of(context).showSnackBar(
                                       const SnackBar(content: Text('Please enter an email.')),
                                     );
                                   } else if (!RegExp(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
                                       .hasMatch(email)) {
                                     ScaffoldMessenger.of(context).showSnackBar(
                                       const SnackBar(content: Text('Please enter a valid email address.')),
                                     );
                                   } else {
                                     //sendVerificationcode(email);
                                   }
                                 },
                                 child: Text(
                                   'Get OTP',
                                   style: TextStyle(color: Colors.white),
                                 ),
                                 style: TextButton.styleFrom(
                                   backgroundColor: Color(0xFF3FD2FB),
                                   shape: RoundedRectangleBorder(
                                     borderRadius: BorderRadius.circular(8),
                                   ),
                                 ),
                               ),
                             ),
                             enabledBorder: OutlineInputBorder(
                               borderSide: BorderSide(color: Colors.white),
                               borderRadius: BorderRadius.circular(10),
                             ),
                             focusedBorder: OutlineInputBorder(
                               borderSide: BorderSide(color: Colors.white),
                               borderRadius: BorderRadius.circular(10),
                             ),
                           ),
                           style: TextStyle(color: Colors.white),
                           
                           keyboardType: TextInputType.emailAddress,
                           textInputAction: TextInputAction.next,
                         ),
                       ),
 
                         Padding(
                           padding: EdgeInsets.only(top: 8,bottom: 8,left: 20,right: MediaQuery.sizeOf(context).width * 0.09),
                           child: Row(
                             children: [
                               Expanded(
                                flex: 3,
                                 child: TextField( 
                                  controller: codeController,
                                  decoration: InputDecoration(
                                   hintText: 'Enter OTP',
                                    hintStyle: Theme.of(context)
                                        .textTheme
                                        .bodyLarge!
                                        .copyWith(color: Colors.white54),
                                   prefixIcon: Icon(FontAwesomeIcons.lock,color: Colors.white.withOpacity(0.9),size: 20,),
                                   suffixIcon: IconButton(onPressed: (){

                                    setState(() {
                                      visibleOTP = !visibleOTP;
                                    });
                                   }, icon: Icon(visibleOTP ? Icons.visibility :Icons.visibility_off,color: Colors.white,size: 20,),),
                                   enabledBorder: OutlineInputBorder(
                                    borderSide: BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(10),
                                   ),
                                   focusedBorder: OutlineInputBorder(
                                      borderSide: BorderSide(color: Colors.white),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                   
                                  ),
                                  style: TextStyle(color: Colors.white),
                                  keyboardType: TextInputType.visiblePassword,
                                  textInputAction: TextInputAction.next,
                                  obscureText: !visibleOTP,
                                 ),
                               ),
                               SizedBox(width: MediaQuery.sizeOf(context).width * 0.06,),
                               Padding(
                                 padding: const EdgeInsets.only(top: 0),
                                 child: TextButton(
                                       onPressed: (){
                                         final code = codeController.text.trim();
                                         final email = emailController.text.trim();
                               if (code.isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Please enter code.')),
                                  );
                                }else{
                                 // verifyCode(email, code);
                                }
                                        }, 
                                       child: Text(verifyButtonText,style: TextStyle(color: Colors.white),),
                                       style: TextButton.styleFrom(
                                  backgroundColor: const Color.fromARGB(255, 48, 138, 51),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  )
                                                               ),),
                               ),
                             ],
                           ),
                         ),
                      // SizedBox(
                      //   height: MediaQuery.sizeOf(context).height * 0.01,
                      // ),
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
                         suffixIcon: IconButton(onPressed: (){
                                setState(() {
                                  visiblePassword = !visiblePassword;
                                });
                              },
                               icon: Icon(visiblePassword ? Icons.visibility :Icons.visibility_off,color: Colors.white,size: 20,)),
                          inputAction: TextInputAction.next,
                          obscureText: !visiblePassword,
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
                          suffixIcon: IconButton(onPressed: (){
                                setState(() {
                                  confirmVisiblePassword = !confirmVisiblePassword;
                                });
                              },
                               icon: Icon(confirmVisiblePassword ? Icons.visibility :Icons.visibility_off,color: Colors.white,size: 20,)),
                          inputAction: TextInputAction.done,
                          obscureText: !confirmVisiblePassword,
                          validator: (value) {
                            if (value!.isEmpty) {
                              return '  Please enter confirm password';
                            }
                            return null;
                          },
                          confirmPasswordController: passwordController,
                        ),
                        SizedBox(height:  MediaQuery.sizeOf(context).height * 0.03),
                        Container(
                          height: MediaQuery.sizeOf(context).height * 0.07,
                          width: MediaQuery.sizeOf(context).width * 0.6,
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
                                    usernameController.clear();
                                    emailController.clear();
                                    mobilenumberController.clear();
                                    passwordController.clear();
                                    confirmpasswordController.clear();
                                    setState(() {
                                      _imageFile = null;
                                    });
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
                          height:  MediaQuery.sizeOf(context).height * 0.02,
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
                         SizedBox(
                          height: MediaQuery.sizeOf(context).height * 0.01,
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
                        SizedBox(height:  MediaQuery.sizeOf(context).height * 0.01),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
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
      clearInputFields();
      // Registration success, navigate to login page
      Navigator.pushAndRemoveUntil(
              context, MaterialPageRoute(builder: (context) => const LoginPage()),(route)=> false);
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
  void clearInputFields(){
    usernameController.clear();
     emailController.clear();
        mobilenumberController.clear();
        passwordController.clear();
        confirmpasswordController.clear();
  }
}