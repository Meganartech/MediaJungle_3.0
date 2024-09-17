import 'package:flutter/material.dart';
import 'package:ott_project/plan_and_payment/plan_details.dart';
import 'package:ott_project/service/plan_api_service.dart';

class FeatureList extends StatelessWidget {
  final int planId;
  const FeatureList({super.key, required this.planId});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Features>>(
        future: PlanService.fetchFeaturesByPlanId(planId),
        builder: (context, snapshot) {
          print('Connection state: ${snapshot.connectionState}');
          print('Snapshot data: ${snapshot.data}');
          print('Snapshot error: ${snapshot.error}');
          print('Feature data:$snapshot.data');
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(),
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Text('Error in features'),
            );
          } else if (snapshot.data!.isEmpty && !snapshot.hasData) {
            return Center(
              child: Text('No feature available'),
            );
          } else {
            print(
                'Fetched Features: ${snapshot.data!.map((f) => '${f.id}: ${f.featureName}').toList()}');
            return Wrap(
              runSpacing: 5.0,
              spacing: 6.0,
              children: snapshot.data!.map((feature) {
                return FractionallySizedBox(
                  widthFactor: 0.20,
                  child: Padding(
                    padding: EdgeInsets.only(),
                    child: Text(feature.featureName,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis),
                  ),
                );
              }).toList(),
            );
            //   ],
            // );
          }
        });
  }
}
