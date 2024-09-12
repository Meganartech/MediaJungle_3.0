import 'package:http/http.dart' as http;
import 'package:ott_project/components/video_folder/cast_crew.dart';
import 'dart:convert';

import 'package:ott_project/components/video_folder/movie.dart';

class MovieApiService {
  static const String baseUrl =
      'https://testtomcat.vsmartengine.com/media/api/v2';

  Future<Movie> fetchVideoDetail(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/GetvideoDetail/$id'));

    print(response.statusCode);
    if (response.statusCode == 200) {
      return Movie.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load video details');
    }
  }

  Future<String> fetchVideoStreamUrl(int id) async {
    final response = await http.get(
        Uri.parse('https://mjdemotomcat.vsmartengine.com/media/api/play/1'));
    print(response.statusCode);
    if (response.statusCode == 206 || response.statusCode == 200) {
      return 'https://mjdemotomcat.vsmartengine.com/media/api/play/1';
    } else {
      throw Exception('Failed to load video stream');
    }
  }

  Future<List<CastMember>> fetchCastAndCrew(int movieId) async {
    final response =
        await http.get(Uri.parse('$baseUrl/Getvideocast?movieId=$movieId'));
    print(response.statusCode);

    if (response.statusCode == 200) {
      List castData = jsonDecode(response.body);
      return castData
          .map((json) => CastMember.fromJson(json))
          .where((CastMember) => CastMember.videoId == movieId)
          .toList();
    } else {
      throw Exception('Faild to load cast and crew');
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