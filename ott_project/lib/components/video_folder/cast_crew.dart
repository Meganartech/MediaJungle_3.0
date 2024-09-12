import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';

class CastMember {
  final String name;
  final String image;
  final int videoId;

  CastMember({required this.name, required this.image, required this.videoId});

  factory CastMember.fromJson(Map<String, dynamic> json) {
    return CastMember(
      name: json['castAndCrew']['name'],
      image: json['castAndCrew']['image'],
      videoId: json['videoDescription']['id'],
    );
  }

  Uint8List get imageBytes {
    final compressedBytes = base64Decode(image);
    return Uint8List.fromList(ZLibDecoder().decodeBytes(compressedBytes));
  }
}
