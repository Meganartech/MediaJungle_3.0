import 'package:flutter/material.dart';
import 'package:ott_project/components/video_folder/movie.dart';
import 'package:ott_project/service/movie_api_service.dart';

 // Assuming you have this class defined

class SuggestedMoviesDrawer extends StatefulWidget {
  final String currentCategory;

  SuggestedMoviesDrawer({required this.currentCategory});

  @override
  _SuggestedMoviesDrawerState createState() => _SuggestedMoviesDrawerState();
}

class _SuggestedMoviesDrawerState extends State<SuggestedMoviesDrawer> {
  late Future<List<Movie>> suggestedMovies;

  @override
  void initState() {
    super.initState();
    suggestedMovies = MovieApiService.fetchMoviesByCategory(widget.currentCategory);
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.1,
      minChildSize: 0.1,
      maxChildSize: 0.5,
      builder: (context, scrollController) {
        return GestureDetector(
          onTap: () {
            // Handle tap if needed
          },
          child: Container(
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.8),
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: FutureBuilder<List<Movie>>(
              future: suggestedMovies,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error loading suggestions', style: TextStyle(color: Colors.white)));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('No suggestions available', style: TextStyle(color: Colors.white)));
                } else {
                  List<Movie> movies = snapshot.data!;
                  return SingleChildScrollView(
                    controller: scrollController,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Center(
                          child: Container(
                            width: 40,
                            height: 5,
                            margin: EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.grey,
                              borderRadius: BorderRadius.circular(2.5),
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              ElevatedButton.icon(
                                onPressed: () {
                                 // _showShareOptions(context);
                                },
                                icon: Icon(
                                  Icons.share_rounded,
                                  color: Colors.white,
                                ),
                                label: Text(
                                  'Share',
                                  style: TextStyle(color: Colors.white),
                                ),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Color.fromARGB(255, 65, 65, 100),
                                ),
                              ),
                              ElevatedButton.icon(
                                onPressed: () {},
                                icon: Icon(
                                  Icons.add_box_outlined,
                                  color: Colors.white,
                                ),
                                label: Text(
                                  'Add To Watchlist',
                                  style: TextStyle(color: Colors.white),
                                ),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Color.fromARGB(255, 65, 65, 100),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.all(16),
                          child: Text(
                            'Suggested Movies',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          padding: EdgeInsets.symmetric(horizontal: 16),
                          child: Row(
                            children: movies.map((movie) {
                              return Container(
                                width: 150,
                                margin: EdgeInsets.only(right: 16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.network(
                                        movie.thumbnail,
                                        width: 130,
                                        height: 100,
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                    SizedBox(height: 8),
                                    Text(
                                      movie.moviename,
                                      style: TextStyle(color: Colors.white),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                      ],
                    ),
                  );
                }
              },
            ),
          ),
        );
      },
    );
  }
}
