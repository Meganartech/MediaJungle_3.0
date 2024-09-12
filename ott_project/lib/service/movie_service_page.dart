import 'dart:convert';
import 'dart:typed_data';

import 'package:http/http.dart' as http;
import 'package:ott_project/components/video_folder/category.dart';
import 'package:ott_project/components/video_folder/movie.dart';

class MovieService {
  static const String baseUrl = 'http://localhost:8080/api/v2';
  //'https://testtomcat.vsmartengine.com/media/api/v2/videogetall';
  static Future<List<Movie>> fetchMovies() async {
    final response = await http.get(Uri.parse('$baseUrl/video/getall'));

    if (response.statusCode == 200) {
      //print(response.statusCode);
      List<dynamic> body = jsonDecode(response.body);

      return body.map((video) {
        // Create Movie object with decoded image
        return Movie.fromJson(video);
      }).toList();
    } else {
      throw Exception("Failed to load movies");
    }
  }

  static Future<List<Movies>> fetchVideos() async {
    final response = await http.get(Uri.parse('$baseUrl/video/getall'));
    print(response.statusCode);
    if (response.statusCode == 200) {
      //print(response.statusCode);
      List<dynamic> body = jsonDecode(response.body);
      print('Videos:${response.body}');
      return body.map((video) {
        // Create Movie object with decoded image
        return Movies.fromJson(video);
      }).toList();
    } else {
      throw Exception("Failed to load movies");
    }
  }

    static Future<Uint8List?> fetchvideoImage(int videoId) async {
    try {
      final response =
          await http.get(Uri.parse('$baseUrl/$videoId/videothumbnail'));

      print(response.statusCode);

      if (response.statusCode == 200) {
        final Map<String,dynamic> responseBody = jsonDecode(response.body);
        //print(responseBody);
        
        if (responseBody.isNotEmpty) {
          String base64Image = responseBody.values.first;
          return base64Decode(base64Image);
        }
      }
    } catch (e) {
      print("Error fetching image for movie $videoId: $e");
      return null;
    }
    return null;
  }

  static Future<List<Category>> fetchAllCategories() async {
    final response = await http.get(Uri.parse('$baseUrl/GetAllCategories'));
    print('Categories:$response.statusCode');
    if (response.statusCode == 200) {
      print(response.statusCode);
      List<dynamic> categoryJson = jsonDecode(response.body);
      return categoryJson.map((json) => Category.fromJson(json)).toList();
    } else {
      throw Exception("Failed to load categories");
    }
  }

  Future<List<Movies>> getMoviesWithCategories() async {
    final categories = await fetchAllCategories();
    final movies = await fetchVideos();

    for (var movie in movies) {
      movie.setCategoryNames(categories);
    }

    return movies;
  }

  Future<Category> getCategoryById(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/GetCategoryById/$id'));

    if (response.statusCode == 200) {
      return Category.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load category');
    }
  }

  static Future<List<String>> getCategoryNamesById(List<int> categoryId) async {
    final queryParams = categoryId.map((id) => 'categoryId=$id').join('&');
    final response = await http
        .get(Uri.parse('$baseUrl/categorylist/category?$queryParams'));
    print(response.statusCode);
    if (response.statusCode == 200) {
      List<dynamic> categoryNames = jsonDecode(response.body);
      return List<String>.from(categoryNames);
    } else {
      throw Exception('Failed to load category names');
    }
  }
}
