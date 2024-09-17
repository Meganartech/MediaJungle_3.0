// class PlanDetails {
//   final String planname;
//   final double amount;
//   final int validity;

//   PlanDetails({
//     required this.planname,
//     required this.amount,
//     required this.validity,
//   });

//   factory PlanDetails.fromJson(Map<String, dynamic> json) {
//     return PlanDetails(
//         planname: json['planname'],
//         amount: json['amount'],
//         validity: json['validity']);
//   }
// }

class PlanDetails {
  final int id;
  final String planname;
  final double amount;
  List<Tenures> tenure;
  List<Features> feature;
  PlanDetails({
    required this.id,
    required this.planname,
    this.tenure = const [],
    this.feature = const [],
    required this.amount,
  });

  factory PlanDetails.fromJson(Map<String, dynamic> json) {
    return PlanDetails(
      id: json['id'] ?? '2',
      planname: json['planname'] ?? 'Unkown',
      amount: json['amount'],
      tenure: json['tenure'] != null
          ? (json['tenure'] as List<dynamic>)
              .map((tenureJson) =>
                  Tenures.fromJson(tenureJson as Map<String, dynamic>))
              .toList()
          : [],
      feature: json['features'] != null
          ? (json['features'] as List<dynamic>)
              .map((featureJson) =>
                  Features.fromJson(featureJson as Map<String, dynamic>))
              .toList()
          : [],
    );
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

class Features {
  final int id;
  final int? featureId;
  String featureName;
  final bool active;

  Features({
    required this.id,
    this.featureId,
    this.featureName = 'Unknown',
    required this.active,
  });

  factory Features.fromJson(Map<String, dynamic> json) {
    return Features(
        id: json['id'],
        featureName: json['features'] ?? 'Unknown',
        active: json['active'] ?? false);
  }

  factory Features.fromPlanJson(Map<String, dynamic> json) {
    return Features(
        id: json['id'], featureId: json['featureId'], active: json['active']?? false);
  }
}
