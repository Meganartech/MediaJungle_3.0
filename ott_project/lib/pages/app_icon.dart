import 'dart:convert';
import 'dart:typed_data';



class AppIcon {
  final String icon;

  AppIcon({required this.icon});

  //  factory AppIcon.fromJson(Map<String, dynamic> json) {
  //   return AppIcon(
  //     icon: json['icon'],

  //   );
  // }

  Uint8List get imageBytes {
    // final compressedBytes = base64Decode(icon);
    // return Uint8List.fromList(ZLibDecoder().decodeBytes(compressedBytes));
    try {
      return base64Decode(icon);
    } catch (e) {
      print('Error decoding icon: $e');
      return Uint8List(0);
    }
  }
}
