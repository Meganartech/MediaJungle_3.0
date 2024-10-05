import 'package:flutter/material.dart';

import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/myTextField.dart';

import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/main_tab.dart';

import 'package:shared_preferences/shared_preferences.dart';

import 'package:ott_project/service/service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _isChecked = false;
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  final Service service = Service();
  @override
  void initState() {
    loadUserEmailPassword();
    super.initState();
  }

  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Stack(
      children: [
        BackgroundImage(),
        Scaffold(
          backgroundColor: Colors.transparent,
          body: SafeArea(
            child: Center(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    SizedBox(
                      height: 10,
                    ),
                    Center(
                      child: ClipRRect(
                          borderRadius: BorderRadius.circular(20),
                          child: Image.asset(
                            'assets/icon/media_jungle.png',
                            fit: BoxFit.cover,
                            height: MediaQuery.sizeOf(context).height * 0.20,
                            width: MediaQuery.sizeOf(context).width * 0.50,
                          )),
                      // child: Text(
                      //   'Media Jungle',
                      //   style: TextStyle(
                      //       color: kWhite,
                      //       fontSize: 42,
                      //       fontWeight: FontWeight.bold),
                      // ),
                    ),
                    Center(
                      child: Text(
                        'With our app, youll have access to a vast library of movies, TV shows, documentaries and more, all at your fingertips',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            color: kWhite,
                            fontSize: 16,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                    SizedBox(height: 10),
                    Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          MyTextField(
                            controller: emailController,
                            hint: 'Enter Email',
                            obscureText: false,
                            icon: FontAwesomeIcons.envelope,
                            inputType: TextInputType.emailAddress,
                            inputAction: TextInputAction.next,
                          ),
                          MyTextField(
                            controller: passwordController,
                            hint: 'Enter Password',
                            obscureText: true,
                            icon: FontAwesomeIcons.lock,
                            inputType: TextInputType.visiblePassword,
                            inputAction: TextInputAction.done,
                          ),
                        ]),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        // SizedBox(
                        //   width: 5,
                        // ),
                        Theme(
                          data: ThemeData(
                              unselectedWidgetColor:
                                  Color(0xff00C8E8) // Your color
                              ),
                          child: Checkbox(
                            activeColor: Color.fromARGB(255, 109, 110, 110),
                            value: _isChecked,
                            onChanged: (value) {
                              setState(() {
                                _isChecked = value ?? false;
                              });
                            },
                          ),
                        ),
                        SizedBox(
                          width: 0,
                        ),
                        Text(
                          'Remember me',
                          style: TextStyle(fontSize: 16, color: Colors.white),
                        ),

                        SizedBox(
                          width: 40,
                        ),
                        Container(
                          alignment: Alignment(1.0, 0.0),
                          child: GestureDetector(
                            onTap: () =>
                                Navigator.pushNamed(context, 'ForgetPassword'),
                            child: Text(
                              'Forget Password?',
                              style:
                                  TextStyle(fontSize: 16, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(
                      height: 15,
                    ),
                    Container(
                      height: size.height * 0.07,
                      width: size.width * 0.8,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          color: Colors.blueGrey.shade300),
                      child: TextButton(
                          onPressed: () {
                            handleLogin(context);
                            // Navigator.push(
                            //   context,
                            //   MaterialPageRoute(
                            //     builder: (context) =>
                            //         MainTab(), // Pass liked songs
                            //   ),
                            // );

                            // Navigator.pushReplacement(
                            //     context,
                            //     MaterialPageRoute(
                            //         builder: (context) => MainTab()));
                          },
                          child: Text(
                            'Login',
                            style:
                                kBodyText.copyWith(fontWeight: FontWeight.bold),
                          )),
                    ),
                    /*MyButton(
                      //buttonName: 'Login',
                      onPressed: handleLogin,
                    ),*/
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
                    //     Padding(
                    //       padding: const EdgeInsets.symmetric(horizontal: 10),
                    //       child: Text(
                    //         'Or Continue with',
                    //         style: TextStyle(color: Colors.grey[500]),
                    //       ),
                    //     ),
                    // Expanded(
                    //   child: Divider(
                    //     color: Colors.grey[400],
                    //     thickness: 0.5,
                    //   ),
                    // ),
                    //   ],
                    // ),
                    // const SizedBox(
                    //   height: 20,
                    // ),
                    // Square(
                    //     onTap: googleLogin,
                    //     imagePath: 'assets/images/google.jpg'),
                    const SizedBox(
                      height: 20,
                    ),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Not a Member?',
                          style: TextStyle(
                            color: const Color.fromARGB(255, 248, 243, 243),
                          ),
                        ),
                        const SizedBox(
                          width: 4,
                        ),
                      ],
                    ),
                    GestureDetector(
                      onTap: () =>
                          Navigator.pushNamed(context, 'CreateNewAccount'),
                      child: Container(
                        child: Text(
                          'Create New Account',
                          style: kBodyText,
                        ),
                        decoration: BoxDecoration(
                            border: Border(
                                bottom: BorderSide(width: 1, color: kWhite))),
                      ),
                    ),
                    SizedBox(
                      height: 3,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  void handleLogin(BuildContext context) async {
    String email = emailController.text;
    String password = passwordController.text;
    if (email.isNotEmpty && password.isNotEmpty) {
      var success = await service.loginUser(context, email, password);
      if (success) {
        if (_isChecked) {
          saveUserCredentials(email, password);
        }
        Navigator.pushReplacement(
            context, MaterialPageRoute(builder: ((context) => MainTab())));
      }
    } else {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            backgroundColor: kWhite,
            title: Text(
              "Login Failed",
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black),
            ),
            content: Text(
              "Email and password are required.",
              style: TextStyle(color: Colors.black, fontSize: 18),
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: Text(
                  "OK",
                  style: TextStyle(color: Colors.black, fontSize: 18),
                ),
              ),
            ],
          );
        },
      );
    }
  }

  void saveUserCredentials(String email, String password) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setBool('rememberMe', true);
    prefs.setString('email', email);
    prefs.setString('password', password);
  }

  void loadUserEmailPassword() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool rememberMe = prefs.getBool("rememberMe") ?? false;
    String email = prefs.getString('email') ?? '';
    String password = prefs.getString('password') ?? '';

    setState(() {
      _isChecked = rememberMe;
      emailController.text = email;
      passwordController.text = password;
    });
  }
}
