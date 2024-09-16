import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import 'package:http/http.dart' as http;
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/plan_and_payment/payment_settings.dart';
import 'package:ott_project/plan_and_payment/plan_details.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/service/icon_service.dart';
import 'package:ott_project/service/plan_api_service.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:ott_project/service/service.dart';

// class PlanPage extends StatefulWidget {
//   const PlanPage({super.key});

//   @override
//   State<PlanPage> createState() => _PlanPageState();
// }

// class _PlanPageState extends State<PlanPage> {
//   String selectedPlan = '';
//   String selectedDuration = '';
//   bool _showSearch = false;
//   final TextEditingController _searchController = TextEditingController();
//   AppIcon? iconData;
//   List<PlanDetails> plan = [];
//   late Razorpay _razorpay;
//   String? razorpayKey;
//   Map<String, bool> expandedState = {};
//   int? _userId;
//   String baseUrl = 'http://192.168.40.165:8080/api/v2';
//   @override
//   void initState() {
//     super.initState();
//     _loadIcon();
//     _loadPlans();
//     _razorpay = Razorpay();
//     _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
//     _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
//     _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
//     _loadUserId();
//     _fetchPaymentSettings();
//   }

//   @override
//   void dispose() {
//     _razorpay.clear();
//     super.dispose();
//   }

//   Future<void> _loadUserId() async {
//     _userId = await Service().getLoggedInUserId();
//     setState(() {});
//   }

//   void _showNotification() {
//     showDialog(
//       context: context,
//       builder: (context) {
//         return AlertDialog(
//           title: const Text('Notification'),
//           content: const Text('New song dropped! Check it out now!'),
//           actions: [
//             TextButton(
//               onPressed: () {
//                 Navigator.of(context).pop();
//               },
//               child: const Text('OK'),
//             ),
//           ],
//         );
//       },
//     );
//   }

//   Future<void> _loadIcon() async {
//     try {
//       final icon = await IconService.fetchIcon();

//       setState(() {
//         iconData = icon;
//       });
//     } catch (e) {
//       print('Error loading icon: $e');
//     }
//   }

//   Future<void> _loadPlans() async {
//     try {
//       List<PlanDetails> fetchedplans = await PlanService.fetchPlan();
//       setState(() {
//         plan = fetchedplans;
//         expandedState = {for (var plans in plan) plans.planname: false};
//       });
//     } catch (e) {
//       print('Error loading plans: $e');
//     }
//   }

//   void _handlePaymentSuccess(PaymentSuccessResponse response) async {
//     PlanDetails selectedPlanDetails = plan.firstWhere(
//         (plan) => plan.planname == selectedPlan,
//         orElse: () => PlanDetails(planname: '', amount: 0, validity: 0));

//     await _sendPaymentDetailsToServer(
//       response.orderId!,
//       response.paymentId!,
//       '200',
//       selectedPlan,
//       selectedPlanDetails.amount,
//       selectedPlanDetails.validity.toString(),
//       response.signature!,
//     );
//   }

//   void _handlePaymentError(PaymentFailureResponse response) {
//     print("Payment failed: ${response.message}");
//     ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Payment failed:${response.message}')));
//   }

//   void _handleExternalWallet(ExternalWalletResponse response) {
//     print('External Wallet:${response.walletName}');
//   }

//   Future<void> _sendPaymentDetailsToServer(
//     String orderId,
//     String paymentId,
//     String statusCode,
//     String planName,
//     double amount,
//     String validity,
//     String signature,
//   ) async {
//     if (_userId == null) {
//       print('Not logged in');
//       return;
//     }
//     final response = await http.post(
//       Uri.parse('$baseUrl/buy'),
//       body: jsonEncode({
//         'orderId': orderId,
//         'paymentId': paymentId,
//         'status_code': statusCode,
//         'planname': planName,
//         'userId': _userId.toString(),
//         'amount': amount,
//         'validity': validity,
//       }),
//       headers: {'Content-type': 'application/json'},
//     );
//     if (response.statusCode == 200) {
//       print('Payment ID and signature sent to server');
//       ScaffoldMessenger.of(context)
//           .showSnackBar(SnackBar(content: Text('Payment successful')));
//     } else {
//       ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text('Failed to confirm payment with server')));
//     }
//   }

//   Future<void> _fetchPaymentSettings() async {
//     try {
//       List<PaymentSettings> settings = await PlanService.fetchPayment();
//       if (settings.isNotEmpty) {
//         setState(() {
//           razorpayKey = settings[0].razorpay_key;
//         });
//       } else {
//         print('No key found');
//       }
//     } catch (e) {
//       print('No key found: $e');
//     }
//   }

//   void _startPayment() async {
//     if (razorpayKey == null) {
//       print('No razorkey found');
//     }

//     if (selectedPlan.isEmpty || selectedDuration.isEmpty) {
//       ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text('Please select a plan and duration')));
//       return;
//     }
//     if (_userId == null) {
//       ScaffoldMessenger.of(context)
//           .showSnackBar(SnackBar(content: Text('User not logged in')));
//       return;
//     }

//     PlanDetails selectedPlanDetails = plan.firstWhere(
//         (plan) => plan.planname == selectedPlan,
//         orElse: () => PlanDetails(planname: '', amount: 0, validity: 0));

//     try {
//       final amount = selectedPlanDetails.amount.toInt().toString();
//       final userId = _userId.toString();
//       final planName = selectedPlan;

//       final requestData = {
//         'amount': amount,
//         'userId': userId,
//         'planname': planName,
//       };

//       print('Sending request to server with data: $requestData');

//       final body = jsonEncode(requestData);

//       print('JSON-encoded body: $body');

//       final orderResponse = await http.post(
//         Uri.parse('$baseUrl/payment'),
//         body: body,
//         headers: {'Content-Type': 'application/json'},
//       );

//       print('Status code: ${orderResponse.statusCode}');
//       print('Response body: ${orderResponse.body}');

//       if (orderResponse.statusCode == 200) {
//         final responseBody = orderResponse.body.trim();

//         if (responseBody == "Invalid data format") {
//           print('Server returned an error: Invalid data format');
//           ScaffoldMessenger.of(context).showSnackBar(
//             SnackBar(
//                 content: Text(
//                     'Server error: Invalid data format. Please check server logs.')),
//           );
//           return;
//         }

//         if (responseBody.isEmpty) {
//           print('Server returned an empty response');
//           ScaffoldMessenger.of(context).showSnackBar(
//             SnackBar(
//                 content: Text(
//                     'Server error: Empty response. Please check server logs.')),
//           );
//           return;
//         }

//         final orderId = responseBody;
//         print('Order ID: $orderId');

//         if (orderId.startsWith('order_')) {
//           var options = {
//             'key': razorpayKey,
//             'amount':
//                 (selectedPlanDetails.amount * 100).toInt(), // Amount in paise
//             'name': 'Meganar',
//             'order_id': orderId,
//             'description': '$selectedPlan plan for $selectedDuration',
//             'prefill': {
//               'contact': '7339600840',
//               'email': 'meganar@gmail.com',
//             },
//           };
//           print('Opening Razorpay with options: $options');
//           try {
//             _razorpay.open(options);
//           } catch (e) {
//             print('Error opening Razorpay: ${e.toString()}');
//             ScaffoldMessenger.of(context).showSnackBar(SnackBar(
//                 content:
//                     Text('Error opening payment gateway: ${e.toString()}')));
//           }
//         } else {
//           print('Invalid order ID format: $orderId');
//           ScaffoldMessenger.of(context).showSnackBar(SnackBar(
//               content: Text(
//                   'Failed to create payment order: Invalid order ID format')));
//         }
//       } else {
//         print('Failed to create payment order: ${orderResponse.body}');
//         ScaffoldMessenger.of(context).showSnackBar(SnackBar(
//             content: Text(
//                 'Failed to create payment order: Server returned status ${orderResponse.statusCode}')));
//       }
//     } catch (e) {
//       print('Error during HTTP request: ${e.toString()}');
//       ScaffoldMessenger.of(context).showSnackBar(SnackBar(
//           content: Text('Failed to create payment order: ${e.toString()}')));
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.transparent,
//       body: Stack(
//         children: [
//           BackgroundImage(),
//           SingleChildScrollView(
//             child: Column(
//               children: [
//                 AppBar(
//                   automaticallyImplyLeading: false,
//                   backgroundColor: Colors.transparent,
//                   title: _showSearch
//                       ? TextField(
//                           controller: _searchController,
//                           style: TextStyle(color: Colors.white),
//                           decoration: InputDecoration(
//                             hintText: 'Search Songs...',
//                             hintStyle: TextStyle(color: Colors.white54),
//                             border: InputBorder.none,
//                           ),
//                           onChanged: (value) {},
//                         )
//                       : Row(
//                           //mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//                           children: [
//                             SizedBox(
//                               height: 20,
//                             ),
//                             if (iconData != null)
//                               Image.memory(
//                                 iconData!.imageBytes,
//                                 height: 60,
//                               )
//                             else
//                               Image.asset('assets/images/bgimg2.jpg',
//                                   height: 30),
//                             Spacer(),
//                             IconButton(
//                                 onPressed: () {},
//                                 icon: Icon(
//                                   Icons.cast_connected_rounded,
//                                   color: kWhite,
//                                 )),
//                             SizedBox(
//                               width: 10,
//                             ),
//                             IconButton(
//                                 onPressed: _showNotification,
//                                 icon: Icon(
//                                   Icons.notifications,
//                                   color: kWhite,
//                                 )),
//                           ],
//                         ),
//                   actions: [
//                     IconButton(
//                         onPressed: () {
//                           setState(() {
//                             _showSearch = !_showSearch;
//                             if (!_showSearch) {
//                               _searchController.clear();
//                               //_filterAudioList('');
//                             }
//                           });
//                         },
//                         icon: Icon(
//                           Icons.search_rounded,
//                           color: kWhite,
//                         )),
//                     SizedBox(
//                       width: 10,
//                     ),
//                     IconButton(
//                         onPressed: () {
//                           Navigator.push(
//                               context,
//                               MaterialPageRoute(
//                                   builder: (context) => ProfilePage()));
//                         },
//                         icon: Icon(
//                           Icons.person_outline_rounded,
//                           color: kWhite,
//                         )),
//                     SizedBox(
//                       width: 10,
//                     ),
//                   ],
//                 ),
//                 Divider(
//                   color: Colors.white,
//                 ),
//                 SizedBox(
//                   height: 20,
//                 ),
//                 Padding(
//                   padding: const EdgeInsets.all(16),
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       SizedBox(
//                         height: 20,
//                       ),
//                       Text(
//                         'Select Your Plan',
//                         style: TextStyle(
//                             color: kWhite,
//                             fontSize: 22,
//                             fontWeight: FontWeight.bold),
//                       ),
//                       SizedBox(
//                         height: 20,
//                       ),
//                       ...plan.map((plans) => _buildPlanSection(plans)).toList(),
//                       SizedBox(
//                         height: 16,
//                       ),
//                       if (selectedPlan.isNotEmpty) _buildSelectedPlanDetails(),
//                       SizedBox(
//                         height: 16,
//                       ),
//                     ],
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildPlanSection(PlanDetails plan) {
//     return Padding(
//       padding: const EdgeInsets.all(8.0),
//       child: Container(
//         decoration: BoxDecoration(
//           gradient: LinearGradient(
//             begin: Alignment.topCenter,
//             end: Alignment.bottomCenter,
//             colors: [
//               Color.fromARGB(255, 15, 19, 58),
//               Color.fromARGB(48, 105, 144, 228)
//             ],
//           ),
//           //color: Color.fromARGB(255, 15, 19, 58),
//           borderRadius: BorderRadius.circular(16),
//         ),
//         child: Column(
//           children: [
//             InkWell(
//               onTap: () {
//                 setState(() {
//                   bool iscurrentlySelected = expandedState[plan.planname]!;
//                   expandedState.updateAll((key, value) => false);
//                   expandedState[plan.planname] = !iscurrentlySelected;
//                 });
//               },
//               child: Padding(
//                 padding: EdgeInsets.all(16),
//                 child: Row(
//                   mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                   children: [
//                     Text(
//                       plan.planname,
//                       style: TextStyle(
//                           color: kWhite,
//                           fontWeight: FontWeight.bold,
//                           fontSize: 18),
//                     ),
//                     Icon(
//                       expandedState[plan.planname]!
//                           ? Icons.keyboard_arrow_up_rounded
//                           : Icons.keyboard_arrow_down_rounded,
//                       color: Colors.white,
//                     ),
//                     //SizedBox(height: 10,),
//                   ],
//                 ),
//               ),
//             ),
//             if (expandedState[plan.planname]!)
//               Padding(
//                 padding: EdgeInsets.all(8),
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Divider(
//                       color: Colors.white,
//                     ),
//                     // _buildQualityIcons(plan),
//                     SizedBox(height: 16),

//                     _buildDurationButton(
//                         '${plan.validity} days', plan.amount, plan.planname),
//                     SizedBox(height: 16),
//                   ],
//                 ),
//               ),
//           ],
//         ),
//       ),
//     );
//   }

// Widget _buildQualityIcons(PlanDetails plan) {
//   bool isBasic = plan.planname == 'Basic';
//   bool isStandard = plan.planname == 'Standard';
//   bool isPremium = plan.planname == 'Premium';
//   return Row(
//     mainAxisAlignment: MainAxisAlignment.spaceAround,
//     children: [
//       _buildQualityIcon('assets/icon/eSmartphone.png',
//           'TV,\nLaptop &\nMobile', isStandard || isPremium),
//       _buildQualityIcon('assets/icon/e4k.png', 'UHD\n4K', isPremium),
//       _buildQualityIcon('assets/icon/eHD 720p.png',
//           'Standard\nHD 720 p\nvideo', isBasic || isStandard || isPremium),
//       _buildQualityIcon('assets/icon/eHD 1080p.png', 'Full HD\n1080p',
//           isBasic || isStandard || isPremium),
//       _buildQualityIcon('assets/icon/eVector.png', 'UHD 2K', isPremium),
//     ],
//   );
// }

// Widget _buildQualityIcon(String assetPath, String label, bool isHighlighted) {
//   return Column(
//     children: [
//       Image.asset(
//         assetPath,
//         height: 24,
//         color: isHighlighted
//             ? const Color.fromARGB(255, 255, 255, 255)
//             : Colors.grey[600],
//       ),
//       SizedBox(
//         height: 4,
//       ),
//       Text(label,
//           textAlign: TextAlign.center,
//           style: TextStyle(
//               color: isHighlighted ? Colors.white : Colors.grey[600],
//               fontSize: 12,
//               height: 1.2)),
//     ],
//   );
// }

//   Widget _buildDurationButton(String validity, double price, String planName) {
//     bool isSelected = selectedPlan == planName && selectedDuration == validity;
//     return GestureDetector(
//       onTap: () {
//         setState(() {
//           selectedPlan = planName;
//           selectedDuration = validity;
//         });
//       },
//       child: Container(
//         decoration: BoxDecoration(
//             gradient: LinearGradient(
//               begin: Alignment.topCenter,
//               end: Alignment.bottomCenter,
//               colors: [
//                 Color.fromRGBO(62, 35, 118, 1),
//                 Color.fromARGB(255, 10, 3, 13)
//               ],
//             ),
//             borderRadius: BorderRadius.circular(8),
//             border:
//                 isSelected ? Border.all(color: Colors.white, width: 0.6) : null,
//             boxShadow: [
//               BoxShadow(
//                 color: Colors.black.withOpacity(0.3),
//                 blurRadius: 5,
//                 offset: Offset(0, 3),
//               ),
//             ]),
//         padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
//         child: Column(
//           children: [
//             Row(
//               mainAxisAlignment: MainAxisAlignment.spaceBetween,
//               children: [
//                 Text(
//                   validity,
//                   style: const TextStyle(color: Colors.white),
//                 ),
//                 Container(
//                   width: 20,
//                   height: 20,
//                   decoration: BoxDecoration(
//                     shape: BoxShape.circle,
//                     border: Border.all(color: Colors.white, width: 2),
//                   ),
//                   child: isSelected
//                       ? Center(
//                           child: Container(
//                             width: 12,
//                             height: 12,
//                             decoration: BoxDecoration(
//                               shape: BoxShape.circle,
//                               color: Colors.white,
//                             ),
//                           ),
//                         )
//                       : null,
//                 ),
//               ],
//             ),
//             SizedBox(height: 8),
//             Text(
//               'Rs: $price',
//               style: const TextStyle(
//                 color: Colors.white,
//                 fontWeight: FontWeight.bold,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildSelectedPlanDetails() {
//     PlanDetails? selectedPlanDetails = plan.firstWhere(
//         (plan) => plan.planname == selectedPlan,
//         orElse: () => PlanDetails(planname: '', amount: 0, validity: 0));

//     return Column(
//       children: [
//         SizedBox(
//           height: 20,
//         ),
//         Row(
//           mainAxisAlignment: MainAxisAlignment.spaceBetween,
//           children: [
//             Text('Rs: ${selectedPlanDetails.amount}',
//                 style: TextStyle(
//                     color: Colors.white,
//                     fontSize: 18,
//                     fontWeight: FontWeight.bold)),
//             ElevatedButton(
//               onPressed: _startPayment,
//               child: Text(
//                 'Continue',
//                 style: TextStyle(color: kWhite),
//               ),
//               style: ElevatedButton.styleFrom(
//                 backgroundColor: Color.fromARGB(255, 127, 21, 193),
//                 padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
//               ),
//             )
//           ],
//         ),
//         SizedBox(
//           height: 8,
//         ),
//         Align(
//           alignment: Alignment.centerLeft,
//           child: Text(
//             '$selectedPlan plan x $selectedDuration',
//             style: TextStyle(color: Colors.white70),
//           ),
//         ),
//       ],
//     );
//   }
// }

class PlanPage extends StatefulWidget {
  const PlanPage({super.key});

  @override
  State<PlanPage> createState() => _PlanPageState();
}

class _PlanPageState extends State<PlanPage> {
  String selectedPlan = '';
  String selectedDuration = '';
  bool _showSearch = false;
  final TextEditingController _searchController = TextEditingController();
  AppIcon? iconData;
  List<PlanDetails> plan = [];
  late Razorpay _razorpay;
  String? razorpayKey;
  Map<String, bool> expandedState = {};
  int? _userId;
  String baseUrl = 'http://192.168.183.129:8080/api/v2';
  @override
  void initState() {
    super.initState();
    _loadIcon();
    _loadPlans();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
    _loadUserId();
    _fetchPaymentSettings();
  }

  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  Future<void> _loadUserId() async {
    _userId = await Service().getLoggedInUserId();
    setState(() {});
  }

  void _showNotification() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Notification'),
          content: const Text('New song dropped! Check it out now!'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
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

  Future<void> _loadPlans() async {
    try {
      List<PlanDetails> fetchedplans = await PlanService.fetchPlan();
      List<Tenures> fetchedTenures = await PlanService.fetchTenures();
      List<Features> fetchedFeatures = await PlanService.fetchFeatures();
      setState(() {
        plan = fetchedplans.map((p) {
          return PlanDetails(
              planname: p.planname,
              amount: p.amount,
              tenure: fetchedTenures,
              feature: fetchedFeatures);
        }).toList();
        expandedState = {for (var plans in plan) plans.planname: false};
      });
    } catch (e) {
      print('Error loading plans: $e');
    }
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    PlanDetails selectedPlanDetails = plan.firstWhere(
        (plan) => plan.planname == selectedPlan,
        orElse: () =>
            PlanDetails(planname: '', amount: 0, tenure: [], feature: []));

    await _sendPaymentDetailsToServer(
      response.orderId!,
      response.paymentId!,
      '200',
      selectedPlan,
      selectedPlanDetails.amount,
      selectedPlanDetails.feature.toString(),
      selectedPlanDetails.tenure.toString(),
      // selectedPlanDetails.validity.toString(),
      response.signature!,
    );
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    print("Payment failed: ${response.message}");
    ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Payment failed:${response.message}')));
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    print('External Wallet:${response.walletName}');
  }

  Future<void> _sendPaymentDetailsToServer(
    String orderId,
    String paymentId,
    String statusCode,
    String planName,
    double amount,
    String tenure,
    String feature,
    String signature,
  ) async {
    if (_userId == null) {
      print('Not logged in');
      return;
    }
    final response = await http.post(
      Uri.parse('$baseUrl/buy'),
      body: jsonEncode({
        'orderId': orderId,
        'paymentId': paymentId,
        'status_code': statusCode,
        'planname': planName,
        'userId': _userId.toString(),
        'amount': amount,
      }),
      headers: {'Content-type': 'application/json'},
    );
    if (response.statusCode == 200) {
      print('Payment ID and signature sent to server');
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Payment successful')));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to confirm payment with server')));
    }
  }

  Future<void> _fetchPaymentSettings() async {
    try {
      List<PaymentSettings> settings = await PlanService.fetchPayment();
      if (settings.isNotEmpty) {
        setState(() {
          razorpayKey = settings[0].razorpay_key;
        });
      } else {
        print('No key found');
      }
    } catch (e) {
      print('No key found: $e');
    }
  }

  void _startPayment() async {
    if (razorpayKey == null) {
      print('No razorkey found');
    }

    if (selectedPlan.isEmpty || selectedDuration.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Please select a plan and duration')));
      return;
    }
    if (_userId == null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('User not logged in')));
      return;
    }

    PlanDetails selectedPlanDetails = plan.firstWhere(
        (plan) => plan.planname == selectedPlan,
        orElse: () =>
            PlanDetails(planname: '', amount: 0, tenure: [], feature: []));

    try {
      final amount = selectedPlanDetails.amount.toInt().toString();
      final userId = _userId.toString();
      final planName = selectedPlan;

      final requestData = {
        'amount': amount,
        'userId': userId,
        'planname': planName,
      };

      print('Sending request to server with data: $requestData');

      final body = jsonEncode(requestData);

      print('JSON-encoded body: $body');

      final orderResponse = await http.post(
        Uri.parse('$baseUrl/payment'),
        body: body,
        headers: {'Content-Type': 'application/json'},
      );

      print('Status code: ${orderResponse.statusCode}');
      print('Response body: ${orderResponse.body}');

      if (orderResponse.statusCode == 200) {
        final responseBody = orderResponse.body.trim();

        if (responseBody == "Invalid data format") {
          print('Server returned an error: Invalid data format');
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
                content: Text(
                    'Server error: Invalid data format. Please check server logs.')),
          );
          return;
        }

        if (responseBody.isEmpty) {
          print('Server returned an empty response');
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
                content: Text(
                    'Server error: Empty response. Please check server logs.')),
          );
          return;
        }

        final orderId = responseBody;
        print('Order ID: $orderId');

        if (orderId.startsWith('order_')) {
          var options = {
            'key': razorpayKey,
            'amount':
                (selectedPlanDetails.amount * 100).toInt(), // Amount in paise
            'name': 'Meganar',
            'order_id': orderId,
            'description': '$selectedPlan plan for $selectedDuration',
            'prefill': {
              'contact': '7339600840',
              'email': 'meganar@gmail.com',
            },
          };
          print('Opening Razorpay with options: $options');
          try {
            _razorpay.open(options);
          } catch (e) {
            print('Error opening Razorpay: ${e.toString()}');
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                content:
                    Text('Error opening payment gateway: ${e.toString()}')));
          }
        } else {
          print('Invalid order ID format: $orderId');
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
              content: Text(
                  'Failed to create payment order: Invalid order ID format')));
        }
      } else {
        print('Failed to create payment order: ${orderResponse.body}');
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text(
                'Failed to create payment order: Server returned status ${orderResponse.statusCode}')));
      }
    } catch (e) {
      print('Error during HTTP request: ${e.toString()}');
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Failed to create payment order: ${e.toString()}')));
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
                                onPressed: _showNotification,
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
                  height: 20,
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: 20,
                      ),
                      Text(
                        'Select Your Plan',
                        style: TextStyle(
                            color: kWhite,
                            fontSize: 22,
                            fontWeight: FontWeight.bold),
                      ),
                      SizedBox(
                        height: 20,
                      ),
                      ...plan.map((plans) => _buildPlanSection(plans)).toList(),
                      SizedBox(
                        height: 16,
                      ),
                      if (selectedPlan.isNotEmpty) _buildSelectedPlanDetails(),
                      SizedBox(
                        height: 16,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlanSection(PlanDetails plan) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color.fromARGB(255, 15, 19, 58),
              Color.fromARGB(48, 105, 144, 228)
            ],
          ),
          //color: Color.fromARGB(255, 15, 19, 58),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            InkWell(
              onTap: () {
                setState(() {
                  bool iscurrentlySelected = expandedState[plan.planname]!;
                  expandedState.updateAll((key, value) => false);
                  expandedState[plan.planname] = !iscurrentlySelected;
                });
              },
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      plan.planname,
                      style: TextStyle(
                          color: kWhite,
                          fontWeight: FontWeight.bold,
                          fontSize: 18),
                    ),
                    Icon(
                      expandedState[plan.planname]!
                          ? Icons.keyboard_arrow_up_rounded
                          : Icons.keyboard_arrow_down_rounded,
                      color: Colors.white,
                    ),
                    //SizedBox(height: 10,),
                  ],
                ),
              ),
            ),
            if (expandedState[plan.planname]!)
              Padding(
                padding: EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Divider(
                      color: Colors.white,
                    ),
                    // _buildQualityIcons(plan),

                    SizedBox(height: 16),
                    // Wrap(
                    //   runSpacing: 8.0,
                    //   spacing: 8.0,
                    //   children: plan.feature.map((feature) {
                    //     return FractionallySizedBox(
                    //       widthFactor: 0.48,
                    //       child: _buildFeature(feature.feature
                    //           // plan.feature as String,
                    //           ),
                    //     );
                    //   }).toList(),
                    // ),

                    Wrap(
                      runSpacing: 8.0,
                      spacing: 8.0,
                      children: plan.tenure.map((tenure) {
                        return FractionallySizedBox(
                          widthFactor: 0.48,
                          child: _buildDurationButton(
                            tenure.tenureName,
                            plan.amount, // Assuming the amount is the same for all tenures for now
                            plan.planname,
                            // plan.feature as String,
                          ),
                        );
                      }).toList(),
                    ),

                    // _buildDurationButton(
                    //     '${plan.tenure.map((t) => t.tenureName).join(',')}',
                    //     plan.amount,
                    //     plan.planname),
                    SizedBox(height: 16),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeature(String feature) {
    return Container(
      child: Text(feature),
    );
  }

  Widget _buildDurationButton(String tenure, double price, String planName) {
    bool isSelected = selectedPlan == planName && selectedDuration == tenure;
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedPlan = planName;
          selectedDuration = tenure;
        });
      },
      child: Container(
        decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color.fromRGBO(62, 35, 118, 1),
                Color.fromARGB(255, 10, 3, 13)
              ],
            ),
            borderRadius: BorderRadius.circular(8),
            border:
                isSelected ? Border.all(color: Colors.white, width: 0.6) : null,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.3),
                blurRadius: 5,
                offset: Offset(0, 3),
              ),
            ]),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  tenure,
                  style: const TextStyle(color: Colors.white),
                ),
                Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                  child: isSelected
                      ? Center(
                          child: Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                            ),
                          ),
                        )
                      : null,
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              'Rs: $price',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSelectedPlanDetails() {
    PlanDetails? selectedPlanDetails = plan.firstWhere(
        (plan) => plan.planname == selectedPlan,
        orElse: () =>
            PlanDetails(planname: '', amount: 0, tenure: [], feature: []));

    return Column(
      children: [
        SizedBox(
          height: 20,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Rs: ${selectedPlanDetails.amount}',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold)),
            ElevatedButton(
              onPressed: _startPayment,
              child: Text(
                'Continue',
                style: TextStyle(color: kWhite),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Color.fromARGB(255, 127, 21, 193),
                padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
              ),
            )
          ],
        ),
        SizedBox(
          height: 8,
        ),
        Align(
          alignment: Alignment.centerLeft,
          child: Text(
            '$selectedPlan plan x $selectedDuration',
            style: TextStyle(color: Colors.white70),
          ),
        ),
      ],
    );
  }
}
