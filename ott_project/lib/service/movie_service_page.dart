import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ott_project/components/video_folder/category.dart';
import 'package:ott_project/components/video_folder/movie.dart';

class MovieService {
  static const String baseUrl =
      //'http://192.168.40.165:8080/api/v2/video/getall';
      'https://testtomcat.vsmartengine.com/media/api/v2/videogetall';
  static Future<List<Movie>> fetchMovies() async {
    final response = await http.get(Uri.parse(baseUrl));

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
   
    final response = await http.get(Uri.parse('http://192.168.40.165:8080/api/v2/video/getall'));

    if (response.statusCode == 200) {
      //print(response.statusCode);
      List<dynamic> body = jsonDecode(response.body);

      return body.map((video) {
        // Create Movie object with decoded image
        return Movies.fromJson(video);
      }).toList();
    } else {
      throw Exception("Failed to load movies");
    }
  }

  static Future<List<Category>> fetchAllCategories() async {
    final response = await http.get(Uri.parse('http://localhost:8080/api/v2/GetAllCategories'));

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
}
