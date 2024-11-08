import 'package:ott_project/components/music_folder/audio_container.dart';

class AudioPlaylist {
  final int? id;
  final int userId;
  final String title;
  final String description;
  List<AudioDescription> audios;

  AudioPlaylist({this.id,required this.userId, required this.audios,required this.description,required this.title});

  factory AudioPlaylist.fromJson(Map<String, dynamic> json){
    return AudioPlaylist(id:json['id'] as int?, userId:json['userId'], audios:json['audios'] != null ? (json['audios'] as List<dynamic>).map((e) => AudioDescription.fromJson(e as Map<String, dynamic>))
          .toList() : [], description:json['description'] , title:json['title'] );
  }

 @override
  String toString() {
    return 'AudioPlaylist(id: $id, userId: $userId, audios: $audios, description: $description, title: $title)';
  }

  Map<String, dynamic> toJson() {
    return {
      'id' : id,
      'userId' : userId,
      'title': title,
      'description': description,
      'audios': audios.map((audio) => audio.toJson()).toList(),
    };
  }
}