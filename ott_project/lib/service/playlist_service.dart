import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ott_project/components/library/audio_playlist.dart';

class PlaylistService {
 
 static const String baseUrl =
 // 'https://testtomcat.vsmartengine.com/media/api/v2';
  //  'http://localhost:8080/api/v2';
    'http://192.168.118.29:8080/api/v2';

    // create playlist

    Future<AudioPlaylist> createPlayList({
        required String title,
        required String description, required int userId,
    }) async{
      final url = Uri.parse('$baseUrl/createplaylist');
      final response = await http.post(url,
      body: {'title':title, 'description' :description,'userId' : userId.toString()} );
      print('Playlist response:${response.statusCode}');
      if(response.statusCode == 200){
        return AudioPlaylist.fromJson(jsonDecode(response.body));
      }else{
        throw Exception('Failed to create playlist: ${response.body}');
      }
    }

    Future<AudioPlaylist> createPlayListWithAudioId({
        required String title,
        required String description, required int userId,required int audioId,
    }) async{
      final url = Uri.parse('$baseUrl/createplaylistid');
      final response = await http.post(url,
      body: {'title':title, 'description' :description,'userId' : userId.toString(),'audioId' : audioId.toString()} );
      print('Playlist response:${response.statusCode}');
      if(response.statusCode == 200){
        return AudioPlaylist.fromJson(jsonDecode(response.body));
      }else{
        throw Exception('Failed to create playlist with audio id: ${response.body}');
      }
    }

  // get playlists by userid
  Future<List<AudioPlaylist>> getPlaylistsByUserId(int userId) async{
    final url = Uri.parse('$baseUrl/user/$userId/playlists');
    final response = await http.get( url);
    print('Getting playlists:${response.statusCode}');
    if(response.statusCode == 200){
      List<dynamic> data = jsonDecode(response.body);
      print('Playlist data:$data');
      return data.map((json)=> AudioPlaylist.fromJson(json)).toList();
    }else{
      throw Exception('Failed to get playlists');
    }
  }


}