import 'package:flutter/material.dart';
import 'package:ott_project/components/library/library_page.dart';
import 'package:ott_project/pages/movie_page.dart';

// import 'package:ott_project/pages/audio_page.dart';
// import 'package:ott_project/pages/home_page.dart';
import 'package:ott_project/pages/music_page.dart';
import 'package:ott_project/pages/sample_home_page.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/service/service.dart';


class MainTab extends StatefulWidget {
  const MainTab({super.key});

  @override
  State<MainTab> createState() => _MainTabState();
}

class _MainTabState extends State<MainTab> with TickerProviderStateMixin {
  int selectTab = 0;
  TabController? controller;
  late Future<int?> userId;

  @override
  void initState() {
    super.initState();
    userId = Service().getLoggedInUserId();
    controller = TabController(length: 4, vsync: this);
    controller?.addListener(() {
      setState(() {
        selectTab = controller?.index ?? 0;
      });
    });
  }

  // void _navigateToTab(int index) {
  //   setState(() {
  //     selectTab = index;
  //     controller?.animateTo(index);
  //   });
  // }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<int?>(
      future: userId,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        } else if (snapshot.hasError || snapshot.data == null) {
          return Scaffold(
            body: Center(
                child: Text('Failed to load user ID or user not logged in')),
          );
        } else {
          int userId = snapshot.data!;
          return Scaffold(
            backgroundColor: Colors.transparent,
            body: Expanded(
              child: TabBarView(controller: controller, children: [
               // SampleHomePage(),
                MoviePage(),
                MusicPage(userId: userId),
                LibraryPage(
                  userId: userId,
                ),
              ProfilePage(),
              ]),
            ),
            bottomNavigationBar: Container(
              decoration: BoxDecoration(
                color: Colors.transparent,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(25),
                  bottom: Radius.circular(25),
                ),
                boxShadow: [
                  BoxShadow(
                    offset: Offset(0, -3),
                    blurRadius: 10,
                    color: Colors.black.withOpacity(0.1),
                  ),
                ],
              ),

              child: BottomAppBar(
                color: Colors.transparent,
                elevation: 2,
                child: TabBar(
                  controller: controller,
                  indicatorWeight: 0.01,
                  indicatorColor: Colors.transparent,
                  dividerColor: Colors.transparent,
                  overlayColor: const WidgetStatePropertyAll(
                      Color.fromARGB(0, 14, 13, 13)),
                  unselectedLabelStyle: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w700),
                  labelColor: Colors.green,
                  unselectedLabelColor: Colors.white,
                  labelStyle: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w400),
                  tabs: [
                   
                    Tab(
                      text: "MOVIE",
                      icon: Icon(
                        Icons.movie_rounded,
                        size: 27,
                        color: selectTab == 0 ? Colors.green : Colors.white,
                      ),
                      // icon: Image.asset(
                      //   "assets/images/movie.png",
                      //   width: 20,
                      //   height: 20,
                      //   color: selectTab == 1 ? Colors.green : Colors.white,
                      // ),
                    ),
                    Tab(
                      text: "MUSIC",
                      icon: Icon(
                        Icons.music_note_sharp,
                        size: 27,
                        color: selectTab == 1 ? Colors.green : Colors.white,
                      ),
                      // icon: Image.asset(
                      //   "assets/images/music.png",
                      //   width: 20,
                      //   height: 20,
                      //   color: selectTab == 2 ? Colors.green : Colors.white,
                      // ),
                    ),
                    Tab(
                      text: "LIBRARY",
                      icon: Icon(
                        Icons.library_music_rounded,
                        size: 27,
                        color: selectTab == 2 ? Colors.green : Colors.white,
                      ),
                      // icon: Image.asset(
                      //   "assets/images/library.png",
                      //   width: 20,
                      //   height: 20,
                      //   color: selectTab == 3 ? Colors.green : Colors.white,
                      // ),
                    ),
                     Tab(
                      text: "Profile",
                      icon: Icon(
                        Icons.person_outline_rounded,
                        size: 27,
                        color: selectTab == 3 ? Colors.green : Colors.white,
                      ),

                    ),
                  ],
                ),
              ),
              // ),
            ),
          );
        }
      },
    );
  }
}
