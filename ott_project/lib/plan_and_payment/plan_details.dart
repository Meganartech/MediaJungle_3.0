class PlanDetails {
  final String planname;
  final double amount;
  final int validity;

  PlanDetails({
    required this.planname,
    required this.amount,
    required this.validity,
  });

  factory PlanDetails.fromJson(Map<String, dynamic> json) {
    return PlanDetails(
        planname: json['planname'],
        amount: json['amount'],
        validity: json['validity']);
  }
}
