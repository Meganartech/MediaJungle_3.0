import 'package:flutter/material.dart';
import 'package:ott_project/components/category/category_service.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/components/video_folder/movie.dart';
import 'package:ott_project/components/video_folder/movie_player_page.dart';
import 'package:ott_project/components/video_folder/movies_card.dart';

import '../video_folder/video_container.dart';

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

class MoviesCategorySection extends StatefulWidget {
  final VideoContainer videoContainer;
  const MoviesCategorySection({super.key, required this.videoContainer});

  @override
  State<MoviesCategorySection> createState() => _MoviesCategorySectionState();
}

class _MoviesCategorySectionState extends State<MoviesCategorySection> {

  @override
void initState() {
  super.initState();
  CategoryService().loadCategories(); // Load categories once
}


  @override
  Widget build(BuildContext context) {
    final displayedMovies = widget.videoContainer.videoDescriptions.length > 5
        ? widget.videoContainer.videoDescriptions.sublist(0, 5)
        : widget.videoContainer.videoDescriptions;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              widget.videoContainer.value,
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
        // SizedBox(
        //   height: MediaQuery.sizeOf(context).height * 0.01,
        // ),
        SizedBox(
          height: MediaQuery.sizeOf(context).height * 0.22,
          child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: displayedMovies.length,
              itemBuilder: (context, index) {
                final movie = displayedMovies[index];
               
                return Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: MoviesCard(
                    movie: displayedMovies[index],
                    onTap: () {
                      final categoryId = CategoryService().getCategoryId(movie.categoryList, widget.videoContainer.value);
                     // final categoryIndex = movie.categoryList.indexOf(int.parse(videoContainer.value));
                     //  final categoryId =movie.categoryList.isNotEmpty 
                 // ? movie.categoryList.first
                  //: 1; 
                      Navigator.push(context, MaterialPageRoute(builder: (context)=> 
                      MoviesPlayerPage(categoryId: categoryId,videoDescriptions: widget.videoContainer.videoDescriptions,initialIndex: index,),));

                      print('Tapped category: ${widget.videoContainer.value}, CategoryID: $categoryId');
                    },
                    categoryList: movie.categoryList,
                    
                    initialIndex: index,
                  ),
                );
              }),
        ),
      ],
    );
  }
}
