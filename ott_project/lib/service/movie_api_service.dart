import 'dart:typed_data';

import 'package:http/http.dart' as http;
import 'package:ott_project/components/video_folder/cast_crew.dart';
import 'dart:convert';

import 'package:ott_project/components/video_folder/movie.dart';
import 'package:ott_project/components/video_folder/video_container.dart';

class MovieApiService {
  static const String baseUrl =
   // 'http://localhost:8080/api/v2';
      //'https://testtomcat.vsmartengine.com/media/api/v2';
    'http://192.168.183.42:8080/api/v2';
  Future<Movie> fetchVideoDetail(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/GetvideoDetail/$id'));

    print(response.statusCode);
    if (response.statusCode == 200) {
      return Movie.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load video details');
    }
  }

  Future<Movies> fetchVideoDetails(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/GetvideoDetail/$id'));

    print(response.statusCode);
    if (response.statusCode == 200) {
      return Movies.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load video details');
    }
  }

    Future<VideoDescription> fetchMovieDetail(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/GetvideoDetail/$id'));

    print(response.statusCode);
    if (response.statusCode == 200) {
      return VideoDescription.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load video details');
    }
  }

  Future<VideoDescription> fetchVideoScreenDetails(int videoId,int categoryId) async{
    final response = await http.get(Uri.parse('$baseUrl/videoscreen?videoId=$videoId&categoryId=$categoryId'));
  print('Response:${response.statusCode}');
    print('Response: ${response.body}');
    if(response.statusCode ==200){
      final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
      List<VideoDescription> videoDescriptions = (jsonResponse['videoDescriptions'] as List)
        .map((item) => VideoDescription.fromJson(item))
        .toList();
       try {
      return videoDescriptions.firstWhere(
        (video) => video.id == videoId,
        orElse: () => throw Exception('Video not found'),
      );
    } catch (e) {
      throw Exception('Failed to find video with ID: $videoId');
    }
        //return videoDescriptions.first;
      //return VideoDescription.fromJson(jsonDecode(response.body));
    }else{
      throw Exception('Failed to load video screen details');
    }
  }

  Future<String> fetchVideoStreamUrl(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/$id/videofile'));
    print(response.statusCode);
    if (response.statusCode == 206 || response.statusCode == 200) {
      return '$baseUrl/$id/videofile';
    } else {
      throw Exception('Failed to load video stream');
    }
  }

  // Future<List<CastMember>> fetchCastAndCrew(int movieId) async {
  //   final response =
  //       await http.get(Uri.parse('$baseUrl/Getvideocast?movieId=$movieId'));
  //   print(response.statusCode);

  //   if (response.statusCode == 200) {
  //     List castData = jsonDecode(response.body);
  //     return castData
  //         .map((json) => CastMember.fromJson(json))
  //         .where((CastMember) => CastMember.videoId == movieId)
  //         .toList();
  //   } else {
  //     throw Exception('Faild to load cast and crew');
  //   }
  // }

 Future<Uint8List?> fetchCastAndCrewImage(int castId) async{
  final response = await http.get(Uri.parse('$baseUrl/getcastimage/$castId'));

  print('CastImage: ${response.statusCode}');
  if(response.statusCode ==200){
    return response.bodyBytes;
  }else{
    throw Exception('Failed to load cast images');
  }
 } 
  static Future<List<String>> fetchCategories() async {
    final response = await http.get(Uri.parse('$baseUrl/GetAllCategories'));
    if (response.statusCode == 200) {
      print('Categories :${response.body}');
      List<dynamic> body = jsonDecode(response.body);
      return body.cast<String>();
    } else {
      throw Exception('Falied to load Categories');
    }
  }

  static Future<List<Movie>> fetchMoviesByCategory(String categoryId) async {
    final response =
        await http.get(Uri.parse('$baseUrl/GetCategoryById/$categoryId'));
    if (response.statusCode == 200) {
      print('Categorize movie:${response.body}');
      List<dynamic> body = jsonDecode(response.body);
      return body.map((video) => Movie.fromJson(video)).toList();
    } else {
      throw Exception("Failed to load movies by category");
    }
  }
}
