import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/forget_password/verification_code_page.dart';
import 'package:ott_project/components/myTextField.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ForgetPasswordEmail extends StatefulWidget {
  const ForgetPasswordEmail({super.key});

  @override
  State<ForgetPasswordEmail> createState() => _ForgetPasswordEmailState();
}

class _ForgetPasswordEmailState extends State<ForgetPasswordEmail> {

  final TextEditingController emailController = TextEditingController();
  bool isLoading = false;

  Future<void> sendVerificationcode(String email) async{
    const String baseUrl = 
    //'http://localhost:8080/api/v2/send-code';
    'https://testtomcat.vsmartengine.com/media/api/v2/send-code';
   // 'http://192.168.156.243:8080/api/v2/send-code';
    setState(() {
      isLoading = true;
    });
    try{
      final response = await http.post(
        Uri.parse(baseUrl),
        body: {'email' : email}
      );
      if(response.statusCode == 200){
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('savedEmail', email);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Verification code sent successfully')));

        Navigator.push(context, MaterialPageRoute(builder: (context)=> VerificationCodePage(email:email)));
      
      }else if (response.statusCode == 400 && response.body.contains('Invalid email')) {
      // Email not found in the backend
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Email not found. Please try again.')),
      );
    }else{
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('An error occurred while processing your request. Please try again later.')));
      }
    }catch(e){
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('An error occurred while processing your request. Please try again later.')));
    }finally{
      setState(() {
        isLoading = false;
      });
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
                        height: size.height * 0.20,
                      ),
                      Container(
                        width: size.width * 0.9,
                        height: size.height * 0.09,
                        child: Text(
                            'Enter your email to get Verification code',textAlign: TextAlign.center,
                            style: kBodyText),
                      ),
                      //SizedBox(height: 15),
                      MyTextField(
                          controller: emailController,
                          icon: FontAwesomeIcons.envelope,
                          hint: 'Email',
                          inputType: TextInputType.emailAddress,
                          inputAction: TextInputAction.done,
                          obscureText: false),
                      SizedBox(
                        height: MediaQuery.sizeOf(context).height * 0.01,
                      ),
                     
                      SizedBox(height: MediaQuery.sizeOf(context).height * 0.04),
                      Container(
                        height: size.height * 0.08,
                        width: size.width * 0.6,
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            color: Colors.blueGrey.shade300),
                        child: TextButton(
                            onPressed: 
                            isLoading ? null :
                            () {  
                             final email = emailController.text.trim();
                             if (email.isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Please enter an email.')),
                                  );
                                } else if (!RegExp(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").hasMatch(email)) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Please enter a valid email address.')),
                                  );
                                } else {
                                  sendVerificationcode(email).then((_){
                                    Future.delayed(Duration(seconds: 3),(){
                                      emailController.clear();
                                    });
                                  });
                                }
                                
                            },
                            child: isLoading ? CircularProgressIndicator(color: Colors.white,)
                            :
                            Text(
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
