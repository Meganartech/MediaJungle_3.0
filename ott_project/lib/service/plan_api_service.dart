import 'dart:convert';

import 'package:ott_project/plan_and_payment/payment_settings.dart';
import 'package:ott_project/plan_and_payment/plan_details.dart';
import 'package:http/http.dart' as http;

class PlanService {
  static const String baseUrl = 'http://localhost:8080/api/v2';
  //'http://192.168.40.165:8080/api/v2';

  static Future<List<PlanDetails>> fetchPlan() async {
    final response = await http.get(Uri.parse('$baseUrl/GetAllPlans'));
    // print(response.statusCode);
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);

      return body.map((dynamic plan) {
        return PlanDetails.fromJson(plan);
      }).toList();
    } else {
      throw Exception("Failed to fetch plans");
    }
  }

  static Future<List<PaymentSettings>> fetchPayment() async {
    final response = await http.get(Uri.parse('$baseUrl/getrazorpay'));

    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);

      return body.map((data) {
        return PaymentSettings.fromJson(data);
      }).toList();
    } else {
      throw Exception("Failed to fetch payment key");
    }
  }
}
