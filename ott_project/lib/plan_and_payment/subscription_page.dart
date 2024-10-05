import 'dart:convert';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/pages/custom_appbar.dart';
import 'package:ott_project/plan_and_payment/plan_page.dart';
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
  final FlutterSecureStorage secureStorage = FlutterSecureStorage();
  String subscriptionPlan = 'Free';
  String expiry = '';
  bool isSubscribed = false;
  double amount = 0.0;
   bool _isSearching = false;
  List<dynamic> _searchResults = [];
  void initState() {
    super.initState();
    _loadIcon();
    fetchUserProfile(context);
    _loadUserId();
    // _loadSubscriptionStatus();
  }

  Future<void> _loadUserId() async {
    _userId = await Service().getLoggedInUserId();
    setState(() {});
    if (_userId != null) {
      _loadSubscriptionStatus(_userId!);
    }
  }

  Future<void> _loadSubscriptionStatus(int userId) async {
    String url = 
    //'http://localhost:8080/api/v2/paymentHistory/$userId';
    'http://192.168.183.129:8080/api/v2/paymentHistory/$userId';
    try {
      var response = await http.get(Uri.parse(url));

      print('Response code Subs:${response.statusCode}');

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        print('Subscription data:${data}');
        if (data.isNotEmpty) {
          var subscriptionData = data[0];
          setState(() {
            subscriptionPlan = subscriptionData['subscriptionTitle'] ?? 'Free';
            expiry = subscriptionData['expiryDate'] ?? '';
            amount = subscriptionData['amount'] ?? 0.0;
            isSubscribed = subscriptionPlan != 'Free';
          });
        } else {
          setState(() {
            subscriptionPlan = 'Free';
            expiry = '';
            amount = 0.0;
            isSubscribed = false;
          });
        }
      } else {
        print('Failed to load subscription');
      }
    } catch (e) {
      print('Error in loading subscription details:$e');
    }
    // SharedPreferences prefs = await SharedPreferences.getInstance();
    // setState(() {
    //   subscriptionPlan = prefs.getString('subscriptionPlan') ?? 'Free';
    // });
  }

  // Future<void> _updateSubscriptionStatus(String newPlan) async {
  //   SharedPreferences prefs = await SharedPreferences.getInstance();
  //   prefs.setString('subscriptionPlan', newPlan);
  //   setState(() {
  //     subscriptionPlan = newPlan;
  //   });
  // }

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
            'http://192.168.183.129:8080/api/v2/GetUserById/$userId'),
        // 'http://localhost:8080/api/v2/GetUserById/$userId'),
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
  
  void handleSearchState(bool isSearching, List<dynamic> results) {
    setState(() {
      _isSearching = isSearching;
      _searchResults = results;
    });
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
                CustomAppBar(onSearchChanged: handleSearchState),
                // AppBar(
                //   automaticallyImplyLeading: false,
                //   backgroundColor: Colors.transparent,
                //   title: _showSearch
                //       ? TextField(
                //           controller: _searchController,
                //           style: TextStyle(color: Colors.white),
                //           decoration: InputDecoration(
                //             hintText: 'Search Songs...',
                //             hintStyle: TextStyle(color: Colors.white54),
                //             border: InputBorder.none,
                //           ),
                //           onChanged: (value) {},
                //         )
                //       : Row(
                //           //mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                //           children: [
                //             SizedBox(
                //               height: 20,
                //             ),
                //             if (iconData != null)
                //               Image.memory(
                //                 iconData!.imageBytes,
                //                 height: 70,
                //               )
                //             else
                //               Image.asset('assets/images/bgimg2.jpg',
                //                   height: 30),
                //             Spacer(),
                //             IconButton(
                //                 onPressed: () {},
                //                 icon: Icon(
                //                   Icons.cast_connected_rounded,
                //                   color: kWhite,
                //                 )),
                //             SizedBox(
                //               width: 10,
                //             ),
                //             IconButton(
                //                 onPressed: () {},
                //                 icon: Icon(
                //                   Icons.notifications,
                //                   color: kWhite,
                //                 )),
                //           ],
                //         ),
                //   actions: [
                //     IconButton(
                //         onPressed: () {
                //           setState(() {
                //             _showSearch = !_showSearch;
                //             if (!_showSearch) {
                //               _searchController.clear();
                //               //_filterAudioList('');
                //             }
                //           });
                //         },
                //         icon: Icon(
                //           Icons.search_rounded,
                //           color: kWhite,
                //         )),
                //     SizedBox(
                //       width: 10,
                //     ),
                //     IconButton(
                //         onPressed: () {
                //           Navigator.push(
                //               context,
                //               MaterialPageRoute(
                //                   builder: (context) => ProfilePage()));
                //         },
                //         icon: Icon(
                //           Icons.person_outline_rounded,
                //           color: kWhite,
                //         )),
                //     SizedBox(
                //       width: 10,
                //     ),
                //   ],
                // ),
                Divider(
                  color: Colors.white,
                ),
                // SizedBox(
                //   height: 5,
                // ),
                IconButton(
                  icon: Icon(
                    Icons.arrow_back_rounded,
                    color: Colors.white,
                  ),
                  onPressed: () => Navigator.pop(context),
                ),
                SizedBox(
                  height: MediaQuery.of(context).size.height * 0.04,
                ),
                Padding(
                  padding:
                      EdgeInsets.all(MediaQuery.of(context).size.width * 0.04),
                  child: Text(
                    'Welcome ${nameController.text},',
                    style: TextStyle(
                        color: kWhite,
                        fontSize: 16,
                        fontWeight: FontWeight.bold),
                  ),
                ),
                SizedBox(
                  height: MediaQuery.of(context).size.height * 0.07,
                ),
                subscribeInfo('Subscription Plan', '$subscriptionPlan'),
                SizedBox(
                  height: MediaQuery.of(context).size.height * 0.02,
                ),
                // Display Email row
                subscribeInfo('Expiry', '$expiry'),
                SizedBox(
                  height: MediaQuery.of(context).size.height * 0.04,
                ),
                // Row(
                //   children: [
                //     Padding(
                //       padding: const EdgeInsets.all(16.0),
                //       child: Expanded(
                //         // padding: EdgeInsets.all(16.0),
                //         flex: 2,
                //         child: Text(
                //           'Subscription Plan :     $subscriptionPlan',
                //           textAlign: TextAlign.left,
                //           style: TextStyle(
                //               color: kWhite,
                //               fontSize: 16,
                //               fontWeight: FontWeight.bold),
                //         ),
                //       ),
                //     ),
                //     if (subscriptionPlan != 'Free')
                //       Align(
                //         alignment: AlignmentDirectional.centerEnd,
                //         child: Padding(
                //           padding: EdgeInsets.only(right: 16.0, left: 40),
                //           child: Text(
                //             '$amount',
                //             style: TextStyle(
                //                 color: kWhite,
                //                 fontSize: 16,
                //                 fontWeight: FontWeight.bold),
                //           ),
                //         ),
                //       ),
                //   ],
                // ),
                // Padding(
                //   padding: EdgeInsets.all(16.0),
                //   child: Expanded(
                //     flex: 2,
                //     child: Text(
                //       'Expiry : $expiry',
                //       textAlign: TextAlign.center,
                //       style: TextStyle(
                //           color: kWhite,
                //           fontSize: 16,
                //           fontWeight: FontWeight.bold),
                //     ),
                //   ),
                // ),
                //Spacer(),
                SizedBox(
                  height: MediaQuery.of(context).size.height * 0.18,
                ),
                if (!isSubscribed)
                  Align(
                    alignment: Alignment.bottomCenter,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14)),
                        backgroundColor: Colors.red,
                        padding:
                            EdgeInsets.symmetric(vertical: 15, horizontal: 20),
                      ),
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => PlanPage()));
                      },
                      child: Text(
                        'Get Subscription',
                        style: TextStyle(color: kWhite),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget subscribeInfo(String label, String value) {
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
}
