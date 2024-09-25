import 'package:flutter/cupertino.dart';

import 'package:http/http.dart' as http;
import 'package:ott_project/components/music_folder/audio.dart';
import 'dart:convert';

import '../components/music_folder/music.dart';

class AudioApiService with ChangeNotifier {
  static const String baseUrl =
  //  'http://localhost:8080/api/v2';
      'http://192.168.183.129:8080/api/v2';

  Future<Audio> fetchAudioDetail(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/audio/$id'));

    //print(response.statusCode);
    if (response.statusCode == 200) {
      return Audio.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load audio details');
    }
  }

  Future<Music> fetchMusicDetail(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/getaudio/$id'));

    //print(response.statusCode);
    if (response.statusCode == 200) {
      //   print('Response Audio:${response.body}');
      return Music.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load audio details');
    }
  }

  Future<String> fetchAudioStreamUrl(String fileName) async {
    final response = await http.get(Uri.parse('$baseUrl/$fileName/file'));
    if (response.statusCode == 206 || response.statusCode == 200) {
      return '$baseUrl/$fileName/file';
    } else {
      throw Exception('Failed to load audio stream');
    }
  }

  Future<bool> likeAudio(int audioId, int userId) async {
    final url = Uri.parse('$baseUrl/mobile/favourite/audio');
    final response = await http.post(url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'audioId': audioId, 'userId': userId}));
    if (response.statusCode == 200) {
      return true;
    } else {
      print('Error liking audio:${response.body}');
      return false;
    }
  }

  Future<List<int>> getLikedSongs(int userId) async {
    final url = Uri.parse('$baseUrl/mobile/$userId/UserAudios');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      List<dynamic> likedAudiosJson = jsonDecode(response.body);
      //  print(response.body);

      return likedAudiosJson.map((audio) => audio as int).toList();

      //return likedAudiosJson.map((audio) => audio['id'].toString()).toList();
    } else {
      throw Exception('Failed to load liked songs');
    }
  }

  Future<Audio> getAudioDetails(int audioId) async {
    final url = Uri.parse('$baseUrl/audio/$audioId');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      Map<String, dynamic> audioJson = jsonDecode(response.body);

      return Audio.fromJson(audioJson);
    } else {
      throw Exception('Failed to load audio details');
    }
  }

  Future<bool> unlikeAudio(int audioId, int userId) async {
    final url = Uri.parse(
        '$baseUrl/mobile/$userId/removeFavoriteAudio?audioId=$audioId');
    final response = await http.delete(url);
    print(response.statusCode);
    if (response.statusCode == 200) {
      return true;
    } else {
      print('Error in unlike:${response.statusCode}-${response.body}');
      return false;
    }
  }
}
