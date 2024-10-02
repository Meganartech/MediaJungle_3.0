import 'dart:typed_data';

import 'package:ott_project/service/movie_service_page.dart';

class VideoContainer {
  final String value;
  final List<VideoDescription> videoDescriptions;

  VideoContainer({required this.value, required this.videoDescriptions});

  factory VideoContainer.fromJson(Map<String, dynamic> json) {
    var list = json['videoDescriptions'] as List;
    List<VideoDescription> videoDescriptionsList =
        list.map((i) => VideoDescription.fromJson(i)).toList();

    return VideoContainer(
      value: json['value'],
      videoDescriptions: videoDescriptionsList,
    );
  }
}

class VideoDescription {
  final int id;
  final String videoTitle;
  final String mainVideoDuration;
  final String trailerDuration;
  final String rating;
  final String certificateNumber;
  final bool videoAccessType;
  final String description;
  final String productionCompany;
  final String certificateName;
  final String vidofilename;
  final String videotrailerfilename;
  final List<int> castAndCrewList;
  final List<int> tagList;
  final List<int> categoryList;

  Uint8List? thumbnail;

  VideoDescription({
    required this.id,
    required this.videoTitle,
    required this.mainVideoDuration,
    required this.trailerDuration,
    required this.rating,
    required this.certificateNumber,
    required this.videoAccessType,
    required this.description,
    required this.productionCompany,
    required this.certificateName,
    required this.vidofilename,
    required this.videotrailerfilename,
    required this.castAndCrewList,
    required this.tagList,
    required this.categoryList,
  });

  factory VideoDescription.fromJson(Map<String, dynamic> json) {
    return VideoDescription(
      id: json['id'],
      videoTitle: json['videoTitle'],
      mainVideoDuration: json['mainVideoDuration'],
      trailerDuration: json['trailerDuration'],
      rating: json['rating'],
      certificateNumber: json['certificateNumber'],
      videoAccessType: json['videoAccessType'],
      description: json['description'],
      productionCompany: json['productionCompany'],
      certificateName: json['certificateName'],
      vidofilename: json['vidofilename'],
      videotrailerfilename: json['videotrailerfilename'],
      castAndCrewList: List<int>.from(json['castandcrewlist']),
      tagList: List<int>.from(json['taglist']),
      categoryList: List<int>.from(json['categorylist']),
    );
  }

  Future<Uint8List?> get thumbnailImage async {
    if (thumbnail == null) {
      await fetchImage();
    }
    return thumbnail;
  }

  Future<void> fetchImage() async {
    try {
      if (thumbnail == null) {
        thumbnail = await MovieService.fetchvideoImage(id);
        if (thumbnail != null) {
          print('Thumbnail fetched successfully for video ID: $id');
        } else {
          print('Thumbnail not found for video ID: $id');
        }
      }
    } catch (e) {
      print('Error in fetching image:$e');
    }
  }
}
