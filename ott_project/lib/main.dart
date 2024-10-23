import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:ott_project/components/music_folder/audio_provider.dart';
//import 'package:ott_project/components/music_folder/recently_played_manager.dart';

import 'package:ott_project/pages/Sign_up.dart';
import 'package:ott_project/pages/forget_password.dart';
import 'package:ott_project/pages/home_page.dart';
import 'package:ott_project/pages/login_page.dart';
import 'package:provider/provider.dart';

import 'components/music_folder/recently_played.dart';
import 'pages/movie_page.dart';

//import 'package:flutter_cas'

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => AudioProvider()),
        ChangeNotifierProvider(create: (context) => RecentlyPlayed()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OTT Play',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        textTheme:
            GoogleFonts.sourceSans3TextTheme(Theme.of(context).textTheme),
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => LoginPage(),
        'ForgetPassword': (context) => ForgetPassword(),
        'CreateNewAccount': (context) => SignUp(),
        'Login': (context) => MoviePage(),
        //'Home': (context) => MainTab(),
      },
    );
  }
}
