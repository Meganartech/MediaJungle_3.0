import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ott_project/components/library/audio_playlist.dart';
import 'package:ott_project/components/library/playlistDTO.dart';
import 'package:ott_project/service/audio_api_service.dart';

import '../components/music_folder/audio_container.dart';
import '../components/music_folder/playlist.dart';


class PlaylistService {
 
 static const String baseUrl =
    'https://testtomcat.vsmartengine.com/media/api/v2';
   // 'http://localhost:8080/api/v2';
   // 'http://192.168.156.243:8080/api/v2';

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
      print('Raw API Response: ${response.body}');
      if(response.statusCode == 200){
        final decodedResponse = jsonDecode(response.body);
        print('Decoded Response: $decodedResponse'); 
        return AudioPlaylist.fromJson(decodedResponse);
      }else{
        throw Exception('Failed to create playlist with audio id: ${response.body}');
      }
    }

    
  Future<void> addAudiosToPlaylist(int playlistId,int audioId) async{
    final url = Uri.parse('$baseUrl/$playlistId/audio/$audioId');
    final response = await http.post(url,
    headers: {'Content-type' : 'application/json' },  
    );
    print('Audio addition:${response.statusCode}');
    if(response.statusCode == 200){
        print('Audio added successfully to playlist : $playlistId');
    }else {
        throw Exception('Failed to add audio: ${response.body}');
      }
  }

  Future<Map<String, String>?> getPlaylistById(int playlistId) async{
    final url = Uri.parse('$baseUrl/$playlistId/playlists');
    try{
    final response = await http.get(url);
    print('Playlist id:${response.statusCode}');
    if(response.statusCode==200){
      final data = jsonDecode(response.body);
      return{
        'title' : data['title'],
        'description':data['description']
      };
    }else{
      throw Exception('Error to load playlist');
    }
    }catch(e){
      throw Exception('Error to fetch playlist by id:$e');
    }
  }

  // get playlists by userid
  Future<List<AudioPlaylist>> getPlaylistsByUserId(int userId) async{
    final url = Uri.parse('$baseUrl/user/$userId/playlists');
    final response = await http.get(url);
    print('Getting playlists:${response.statusCode}');
    if(response.statusCode == 200){
      List<dynamic> data = jsonDecode(response.body);
      print('Playlist data:$data');
      return data.map((json)=> AudioPlaylist.fromJson(json)).toList();
    }else{
      throw Exception('Failed to get playlists');
    }
  }


  Future<List<PlaylistDTO>> getPlaylistWithAudioDetails(int id) async{
    final url = Uri.parse('$baseUrl/$id/getPlaylistWithAudioDetails');
    final response = await http.get(url);
    print('Getting playlist audio details:${response.statusCode}');
    if(response.statusCode ==200){
      List<dynamic> data = jsonDecode(response.body);
      print('Audio data:$data');
      return data.map((json) => PlaylistDTO.fromJson(json)).toList();
    }else{
      throw Exception('Failed to get audio details');
    }
  }

// Future<List<AudioDescription>> getAudioDetailsForPlaylist(List<int> audioIds) async {
//   List<AudioDescription> audioDetailsList = [];

//   try {
//     for (int audioId in audioIds) {
//       final audio = await AudioApiService().fetchAudioDetails(audioId);
//       if (audio != null) {
//         audioDetailsList.add(audio);
//       }
//     }
//   } catch (e) {
//     print("Error fetching audio details: $e");
//   }

//   return audioDetailsList;
// }
Future<List<AudioDescription>> getAudioDetailsForPlaylist(List<int> audioIds) async {
  try {
    // Use Future.wait to fetch all audio details in parallel
    final List<AudioDescription> audioDetailsList = await Future.wait(
      audioIds.map((audioId) => AudioApiService().fetchAudioDetails(audioId))
    );
    
    print('Fetched ${audioDetailsList.length} audio details');
    return audioDetailsList;
  } catch (e) {
    print("Error fetching audio details: $e");
    throw e; // Rethrow to handle in UI
  }
}

//delete playlist
Future<String> deletePlaylist(int id) async{
  final url = Uri.parse('$baseUrl/$id/delete/playlist');
  try{
    final response = await http.delete(url);
    print('Delete playlist response:${response.statusCode}');
    print('Response body: ${response.body}');

    if(response.statusCode == 200){
      return 'Playlist deleted successfully';
    }else if(response.statusCode ==404){
      return "Playlist not found";
    }else{
      return 'Something went wrong';
    }
  }catch(e){
    return 'Error:${e.toString()}';
  }
}

Future<void> updatePlaylist(int playlistId,String title,String description) async{
final url = Uri.parse('$baseUrl/editplaylist/$playlistId');
try{
  final response = await http.patch(url,
  body: {
    if(title != null) 'title':title,
        if(description != null) 'description':description,
  },
  );
  if(response.statusCode == 200){
    print('Playlist updated successfully');
  }else if(response.statusCode == 404){
     print('Playlist not found');
    }else{
      print('Failed to load playlist');
    }
}catch(e){
  print('Playlist edit error:$e');
  
}
return null;
}

Future<void> removeAudioFromPlaylist(int playlistId,int audioId) async{

  final url = Uri.parse('$baseUrl/$playlistId/audio/$audioId/delete');

  try{
    final response = await http.delete(url);
    if(response.statusCode == 200){
      print('Audio removed from playlist');
    }else if(response.statusCode == 404){
      print('Audio not found');
    }else{
      print('Failed to remove audio');
    }
  }catch(e){
    print('Error removing audio:$e');
  }
}

Future<void> moveAudioToPlaylist(int playlistId,int audioId,int movedPlaylistId) async{

  final url = Uri.parse('$baseUrl/$playlistId/moveAudioToPlaylist/$audioId/$movedPlaylistId');

  try{
    final response = await http.patch(url);
    if(response.statusCode ==200){
      print('Audio moved from $playlistId to playlist:$movedPlaylistId');
    }else if(response.statusCode == 404){
      print('Playlist not found');
    }else{
      print('Failed to move audio');
    }
  }catch(e){
    print('Error moving audio:$e');
  }
}

}