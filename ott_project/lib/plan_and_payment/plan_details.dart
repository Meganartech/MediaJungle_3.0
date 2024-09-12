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

class Tenures {
  final int id;
  final String tenureName;
  Tenures({
    required this.id,
    required this.tenureName,
  });

  factory Tenures.fromJson(Map<String, dynamic> json) {
    return Tenures(
      id: json['id'],
      tenureName: json['tenure_name'],
    );
  }
}
