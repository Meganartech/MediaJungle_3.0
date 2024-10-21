import 'dart:typed_data';

import 'package:ott_project/service/audio_service.dart';

class AudioContainer {
  final String categoryName;
  final List<AudioDescription> audiolist;

  AudioContainer({
    required this.categoryName,
    required this.audiolist,
  });

  factory AudioContainer.fromJson(Map<String, dynamic> json) {
    var audioListFromJson = json['audiolist'] as List;
    List<AudioDescription> audioList = audioListFromJson
        .map((audio) => AudioDescription.fromJson(audio))
        .toList();

    return AudioContainer(
      categoryName: json['category_name'],
      audiolist: audioList,
    );
  }
}

class AudioDescription {
  final int id;
  final String audioTitle;
  final String movieName;
  final String rating;
  final String description;
  final String productionCompany;
  final bool paid;
  final String audioFileName;
  final String certificateName;
  final String audioDuration;
  final String certificateNo;

   Uint8List? thumbnail;

  AudioDescription({
    required this.id,
    required this.audioTitle,
    required this.movieName,
    required this.rating,
    required this.description,
    required this.productionCompany,
    required this.paid,
    required this.audioFileName,
    required this.certificateName,
    required this.audioDuration,
    required this.certificateNo,
  });

  factory AudioDescription.fromJson(Map<String, dynamic> json) {
    return AudioDescription(
      id: json['id'],
      audioTitle: json['audio_title'],
      movieName: json['movie_name'],
      rating: json['rating'],
      description: json['description'],
      productionCompany: json['production_company'],
      paid: json['paid'],
      audioFileName: json['audio_file_name'],
      certificateName: json['certificate_name'],
      audioDuration: json['audio_Duration'],
      certificateNo: json['certificate_no'],
    );
  }
  Map<String, dynamic> toJson(){
    return{
      'id':id,
      'audioTitle' : audioTitle,
      'movieName' : movieName,
      'rating' : rating,
      'description': description,
      'productionCompany' :productionCompany,
      'paid' : paid,
      'audioFileName' : audioFileName,
      'certificateName':certificateName,
      'audioDuration' : audioDuration,
      'certificateNo' : certificateNo
    };
  }

  Future<Uint8List?> get thumbnailImage async {
    if (thumbnail == null) {
      await fetchImage();
    }
    return thumbnail;
  }

  Future<void> fetchImage() async {
    try {
      thumbnail = await AudioService.fetchMusicImage(id);
      if (thumbnail != null) {
        print('Thumbnail fetched successfully for music ID: $id');
      } else {
        print('Thumbnail not found for music ID: $id');
      }
    } catch (e) {
      print('Error in fetching image:$e');
    }
  }
}
