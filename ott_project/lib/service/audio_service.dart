import 'dart:convert';
import 'dart:typed_data';

import 'package:http/http.dart' as http;
import 'package:ott_project/components/music_folder/audio.dart';
import 'package:ott_project/components/music_folder/music.dart';
import 'package:ott_project/service/audio_api_service.dart';

class AudioService {
  static const String baseUrl =
   'http://localhost:8080/api/v2';
  // 'http://192.168.40.165:8080/api/v2';
  static Future<List<Audio>> fetchAudio() async {
    final response = await http.get(Uri.parse('$baseUrl/getaudiodetailsdto'));
    //print(response.statusCode);
    if (response.statusCode == 200) {
      //print(response.statusCode);

      List<dynamic> body = jsonDecode(response.body);
      //print(response.body);
      return body.map((audio) => Audio.fromJson(audio)).toList();
    } else {
      throw Exception("Failed to load songs");
    }
  }

  static Future<List<Music>> fetchMusic() async {
    final response = await http.get(Uri.parse('$baseUrl/getaudiodetailsdto'));
    // print(response.statusCode);
    if (response.statusCode == 200) {
      //print(response.statusCode);

      List<dynamic> body = jsonDecode(response.body);
      //print(response.body);
      List<Music> musicList =
          body.map((audio) => Music.fromJson(audio)).toList();
      //await fetchMusicImage(id);
      return musicList;
    } else {
      throw Exception("Failed to load songs");
    }
  }

  static Future<Uint8List?> fetchMusicImage(int id) async {
    try {
      final response =
          await http.get(Uri.parse('$baseUrl/getaudiothumbnailsbyid/$id'));

      print(response.statusCode);

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseBody = jsonDecode(response.body);
        //print(responseBody);

        if (responseBody.containsKey('thumbnail')) {
          String base64Image = responseBody['thumbnail'] as String;
          return base64Decode(base64Image);
        }
      }
    } catch (e) {
      print("Error fetching thumbnail for music $id: $e");
      return null;
    }
    return null;
  }

  static Future<Uint8List?> fetchMusicBanner(int id) async {
    try {
      final response =
          await http.get(Uri.parse('$baseUrl/getbannerthumbnailsbyid/$id'));

      print(response.statusCode);

      if (response.statusCode == 200) {
        final List<dynamic> responseBody = jsonDecode(response.body);
        //print(responseBody);

        if (responseBody.isNotEmpty) {
          String base64Image = responseBody[0] as String;
          return base64Decode(base64Image);
        }
      }
    } catch (e) {
      print("Error fetching banner for music $id: $e");
      return null;
    }
    return null;
  }

  static Future<Map<String, List<Music>>> fetchMusicByCategory() async {
    final allMusic = await fetchAllMusic();
    print('All Music:$allMusic');
    Map<String, List<Music>> musicByCategory = {};
    for (var music in allMusic) {
      final image = await music.thumbnailImage;
      print('Music name:${music.songname}');
      //print('Music image:$image');
      print('Categories: ${music.categories}');
      for (var category in music.categories) {
        if (!musicByCategory.containsKey(category.category_name)) {
          musicByCategory[category.category_name] = [];
        }
        musicByCategory[category.category_name]?.add(music);
      }
    }
    return musicByCategory;
  }

  static Future<List<Music>> fetchAllMusic() async {
    List<Music> allMusic = [];
    for (int i = 1; i <= 16; i++) {
      try {
        Music music = await AudioApiService().fetchMusicDetail(i);

        print(
            'Music: ${music.songname}, Categories: ${music.categories},thumbnail:${music.thumbnailImage}');
        allMusic.add(music);
        print('Fetching music: $allMusic');
      } catch (e) {
        print('Error fetching music with id $i: $e');
        // Continue to the next id if there's an error
      }
    }
    return allMusic;
  }
}
