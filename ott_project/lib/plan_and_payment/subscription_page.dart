import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/service/icon_service.dart';
import 'package:ott_project/service/service.dart';

class SubscriptionPage extends StatefulWidget {
  const SubscriptionPage({super.key});

  @override
  State<SubscriptionPage> createState() => _SubscriptionPageState();
}

class _SubscriptionPageState extends State<SubscriptionPage> {
  int? _userId;
  AppIcon? iconData;
  bool _showSearch = false;
  final TextEditingController nameController = TextEditingController();
  final TextEditingController _searchController = TextEditingController();
  final FlutterSecureStorage secureStorage = FlutterSecureStorage();

  void initState() {
    super.initState();
    _loadIcon();
    fetchUserProfile(context);
  }

  Future<void> _loadUserId() async {
    _userId = await Service().getLoggedInUserId();
    setState(() {});
  }

  Future<void> _loadIcon() async {
    try {
      final icon = await IconService.fetchIcon();

      setState(() {
        iconData = icon;
      });
    } catch (e) {
      print('Error loading icon: $e');
    }
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
            //    'https://testtomcat.vsmartengine.com/media/api/v2/GetUserById/$userId'),
            //'http://192.168.40.165:8080/api/v2/GetUserById/$userId'
            'http://localhost:8080/api/v2/GetUserById/$userId'),
        //),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      // print(response.statusCode);

      if (response.statusCode == 200) {
        var userData = jsonDecode(response.body);
        //final List<dynamic> responseBody = jsonDecode(response.body);

        //final String base64Thumbnail = userData[0];
        //_image = userData['profile'];

        setState(() {
          // base64Image = userData['profile'];
          nameController.text = userData['username'] ?? '';
        });

        //await fetchProfileImage(userId);
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
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          BackgroundImage(),
          SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppBar(
                  automaticallyImplyLeading: false,
                  backgroundColor: Colors.transparent,
                  title: _showSearch
                      ? TextField(
                          controller: _searchController,
                          style: TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: 'Search Songs...',
                            hintStyle: TextStyle(color: Colors.white54),
                            border: InputBorder.none,
                          ),
                          onChanged: (value) {},
                        )
                      : Row(
                          //mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            SizedBox(
                              height: 20,
                            ),
                            if (iconData != null)
                              Image.memory(
                                iconData!.imageBytes,
                                height: 60,
                              )
                            else
                              Image.asset('assets/images/bgimg2.jpg',
                                  height: 30),
                            Spacer(),
                            IconButton(
                                onPressed: () {},
                                icon: Icon(
                                  Icons.cast_connected_rounded,
                                  color: kWhite,
                                )),
                            SizedBox(
                              width: 10,
                            ),
                            IconButton(
                                onPressed: () {},
                                icon: Icon(
                                  Icons.notifications,
                                  color: kWhite,
                                )),
                          ],
                        ),
                  actions: [
                    IconButton(
                        onPressed: () {
                          setState(() {
                            _showSearch = !_showSearch;
                            if (!_showSearch) {
                              _searchController.clear();
                              //_filterAudioList('');
                            }
                          });
                        },
                        icon: Icon(
                          Icons.search_rounded,
                          color: kWhite,
                        )),
                    SizedBox(
                      width: 10,
                    ),
                    IconButton(
                        onPressed: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => ProfilePage()));
                        },
                        icon: Icon(
                          Icons.person_outline_rounded,
                          color: kWhite,
                        )),
                    SizedBox(
                      width: 10,
                    ),
                  ],
                ),
                Divider(
                  color: Colors.white,
                ),
                SizedBox(
                  height: 10,
                ),
                IconButton(
                  icon: Icon(
                    Icons.arrow_back_rounded,
                    color: Colors.white,
                  ),
                  onPressed: () => Navigator.pop(context),
                ),
                SizedBox(
                  height: 20,
                ),
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'Welcome ${nameController.text},',
                    style: TextStyle(
                        color: kWhite,
                        fontSize: 16,
                        fontWeight: FontWeight.bold),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'Subscription Plan : Free',
                    style: TextStyle(
                        color: kWhite,
                        fontSize: 16,
                        fontWeight: FontWeight.bold),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'Expiry : ',
                    style: TextStyle(
                        color: kWhite,
                        fontSize: 16,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
