import 'category.dart';

class Movie {
  final int id;
  final String moviename;
  final String year;
  final String duration;
  final String thumbnail;
  final String language;
  final String description;
  final String category;
  //final int categoryId;

  Movie({
    required this.id,
    required this.moviename,
    required this.year,
    required this.duration,
    required this.thumbnail,
    required this.language,
    required this.description,
    required this.category,
    //required this.categoryId,
  });

  factory Movie.fromJson(Map<String, dynamic> json) {
    return Movie(
      id: json['id'],
      moviename: json['moviename'],
      year: json['year'],
      duration: json['duration'],
      thumbnail: json['thumbnail'],
      language: json['language'],
      description: json['description'],
      category: json['category'] ?? 'Action',
      //categoryId: json['category']['id']
    );
  }
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Movie &&
          runtimeType == other.runtimeType &&
          moviename == other.moviename &&
          category == other.category;

  @override
  int get hashCode => moviename.hashCode ^ category.hashCode;
}

class Movies {
  final int id;
  final String moviename;
  //final String year;
  final String duration;
  final String thumbnail;
  final String language;
  final String description;
  final List<int> categoryId;
  List<Category> categories = [];
  //final int categoryId;

  Movies({
    required this.id,
    required this.moviename,
    //required this.year,
    required this.duration,
    required this.thumbnail,
    required this.language,
    required this.description,
    required this.categoryId,
    //required this.categoryId,
  });

  factory Movies.fromJson(Map<String, dynamic> json) {
    return Movies(
        id: json['id'],
        moviename: json['videoTitle'],
        // year: json['year'],
        duration: json['duration'],
        thumbnail: json['thumbnail'],
        language: json['language'],
        description: json['description'],
        categoryId: List<int>.from(json['categorylist'])
        //categoryId: json['category']['id']
        );
  }
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Movie &&
          runtimeType == other.runtimeType &&
          moviename == other.moviename;
  //&& category == other.category;

  @override
  int get hashCode => moviename.hashCode;
  //^ category.hashCode;

  void setCategoryNames(List<Category> allCategories) {
    categories = allCategories
        .where((category) => categoryId.contains(category.id))
        .toList();
  }
}
