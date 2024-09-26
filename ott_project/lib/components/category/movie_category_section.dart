import 'package:flutter/material.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/components/video_folder/movie.dart';
import 'package:ott_project/components/video_folder/movies_card.dart';

class MovieCategorySection extends StatelessWidget {
  final String title;
  final List<Movie> movies;
  const MovieCategorySection(
      {super.key, required this.title, required this.movies});

  @override
  Widget build(BuildContext context) {
    final displayedMovies = movies.length > 5 ? movies.sublist(0, 5) : movies;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: kWhite,
              ),
            ),
            TextButton(
                onPressed: () {},
                child: Text('See more', style: TextStyle(color: Colors.green))),
          ],
        ),
        SizedBox(height: 10),
        SizedBox(
          height: 180,
          child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: displayedMovies.length,
              itemBuilder: (context, index) {
                return Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: MovieCard(
                    movie: movies[index],
                    movies: movies,
                    initialIndex: index,
                  ),
                );
              }),
        ),
      ],
    );
  }
}

class MoviesCategorySection extends StatelessWidget {
  final String title;
  final List<Movies> movies;
  const MoviesCategorySection(
      {super.key, required this.title, required this.movies});

  @override
  Widget build(BuildContext context) {
    final displayedMovies = movies.length > 5 ? movies.sublist(0, 5) : movies;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: kWhite,
              ),
            ),
            TextButton(
                onPressed: () {},
                child: Text('See more', style: TextStyle(color: Colors.green))),
          ],
        ),
        SizedBox(
          height: MediaQuery.sizeOf(context).height * 0.01,
        ),
        SizedBox(
          height: MediaQuery.sizeOf(context).height * 0.25,
          child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: displayedMovies.length,
              itemBuilder: (context, index) {
                return Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: MoviesCard(
                    movie: movies[index],
                    movies: movies,
                    initialIndex: index,
                  ),
                );
              }),
        ),
      ],
    );
  }
}
