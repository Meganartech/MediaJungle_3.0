import 'package:flutter/material.dart';
import 'package:ott_project/components/music_folder/music.dart';
import 'package:ott_project/components/music_folder/song_player_page.dart';
import 'package:ott_project/components/video_folder/category_bar.dart';
import 'package:ott_project/components/video_folder/movie.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/pages/custom_appbar.dart';
import 'package:ott_project/pages/audio_page.dart';
import 'package:ott_project/pages/home_page.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/search/search_result_movie.dart';
import 'package:ott_project/service/movie_service_page.dart';
import 'package:ott_project/service/service.dart';
import '../components/background_image.dart';
import '../components/category/movie_category_section.dart';

import '../components/video_folder/video_play.dart';
import '../service/icon_service.dart';
// Import the movie service

class MoviePage extends StatefulWidget {
  const MoviePage({super.key});

  @override
  State<MoviePage> createState() => _MoviePageState();
}

class _MoviePageState extends State<MoviePage> {
  final Service service = Service();

  late Future<List<Movies>> _allMovies;
  List<Movies> allMovies = [];
  final TextEditingController _searchController = TextEditingController();
  List<Movies> _filteredMovies = [];
  List<String> _moviePageCategories = [];
  Map<String, List<Movies>> _categorizedMovies = {};

  //int _selectedIndex = 1;
  String selectedCategory = "Movies";
  // bool _showSearch = false;
  AppIcon? iconData;
  bool _isSearching = false;
  List<dynamic> _searchResults = [];

  @override
  void initState() {
    super.initState();
    // _filteredMovies = _allMovies;
    _allMovies = _fetchMovies();

    _loadIcon();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _allMovies = MovieService.fetchVideos();
    _fetchMovies();
  }

  Future<void> _loadIcon() async {
    try {
      final icon = await IconService.fetchIcon();

      setState(() {
        iconData = icon;
      });
    } catch (e) {
      print('Error loading icon: $e');
    }
  }

  Future<List<Movies>> _fetchMovies() async {
    try {
      final movies = await MovieService.fetchVideos();
      
      setState(() {
        allMovies = movies;
      });
      _categorizeMovies(allMovies);
      return allMovies;
    } catch (e) {
      throw Exception('Failed to load movies');
    }
  }

  Future<void> _refreshMovies() async {
    await _fetchMovies();
  }

  void _categorizeMovies(List<Movies> movies) {
    _categorizedMovies.clear();
    for (var movie in movies) {
      if (!_categorizedMovies.containsKey(movie.categories)) {
        //_categorizedMovies[movie.categories] = [];
      }
      _categorizedMovies[movie.categories]!.add(movie);
    }
    _filterCategoriesForDisplay();
  }

  void _filterCategoriesForDisplay() {
    List<String> moviePageDesiredCategories = [
      'Popular',
      'Action',
      'Comedy',
      'Horror',
    ];
    _moviePageCategories = moviePageDesiredCategories.where((category) {
      return _categorizedMovies.containsKey(category) &&
          _categorizedMovies[category]!.isNotEmpty;
    }).toList();
  }

  // void _filterMovies(String query) {
  //   setState(() {
  //     if (query.isEmpty) {
  //       _filteredMovies = _categorizedMovies.values.expand((i) => i).toList();
  //     } else {
  //       final Map<String, Movie> uniqueMovies = {};
  //       final input = query.toLowerCase();
  //       for (var categoryMovie in _categorizedMovies.values) {
  //         for (var movie in categoryMovie) {
  //           final movieName = movie.moviename.toLowerCase();
  //           final words = movieName.split(' ');
  //           if (movieName.contains(input) ||
  //               words.any((word) => word.startsWith(input))) {
  //             uniqueMovies.putIfAbsent(movieName, () => movie);
  //           }
  //         }
  //       }
  //       _filteredMovies = uniqueMovies.values.toList();
  //       // _filteredMovies =
  //       //     _categorizedMovies.values.expand((movies) => movies).where((movie) {
  //       //   final movieName = movie.moviename.toLowerCase();
  //       //   final input = query.toLowerCase();
  //       //   return movieName.contains(input);
  //       // }).toList();
  //     }
  //   });
  // }

  // void _onSearchChanged(String query) {
  //   setState(() {
  //     if (query.isEmpty) {
  //       _filteredMovies = allMovies;
  //     } else {
  //       _filteredMovies = allMovies.where((movie) =>
  //           movie.moviename.toLowerCase().contains(query.toLowerCase())).to;
  //     }
  //   });
  // }

  void _navigateToCategory(String category) {
    setState(() {
      selectedCategory = category;
    });
    switch (category) {
      case "All":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => HomePage()),
        );
        break;
      case "Movies":
        // Navigator.push(
        //   context,
        //   MaterialPageRoute(builder: (context) => VideoPage()),
        // );
        break;
      case "Music":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => AudioPage(userId: 24)),
        );
        break;
      case "Profile":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => ProfilePage()),
        );
        break;
    }
  }

  void handleSearchState(bool isSearching, List<dynamic> results) {
    setState(() {
      _isSearching = isSearching;
      _searchResults = results;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          BackgroundImage(),
          CustomAppBar(
            onSearchChanged: handleSearchState,
          ),
          _isSearching
              ? _buildSearchResults()
              : Container(
                  padding: const EdgeInsets.all(16.0),
                  margin: EdgeInsets.only(top: 90),
                  child: RefreshIndicator(
                    onRefresh: _refreshMovies,
                    child:
                        // Padding(
                        //   padding: const EdgeInsets.all(16.0),
                        //   child:
                        Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const Divider(
                          color: Colors.white,
                          height: 1,
                        ),
                        SizedBox(
                          height: 7,
                        ),
                        CategoryBar(
                            selectedCategory: selectedCategory,
                            onCategorySelected: _navigateToCategory),
                        SizedBox(
                          height: 7,
                        ),
                        const Divider(
                          color: Colors.white,
                          height: 1,
                        ),
                        SizedBox(
                          height: 5,
                        ),
                        Expanded(
                          child: _searchController.text.isNotEmpty &&
                                  _filteredMovies.isEmpty
                              ? Center(
                                  child: Text(
                                    'No movies found',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                )
                              // : _searchController.text.isNotEmpty
                              //     ? ListView.builder(
                              //         shrinkWrap: true,
                              //         physics: NeverScrollableScrollPhysics(),
                              //         itemCount: _filteredMovies.length,
                              //         itemBuilder: (context, index) {
                              //           return SearchResultMovie(
                              //               movie: _filteredMovies[index],
                              //               allMovies: _filteredMovies,
                              //               index: index);
                              //         },
                              //       )
                                  : FutureBuilder<List<Movies>>(
                                      future: _allMovies,
                                      builder: (context, snapshot) {
                                        if (snapshot.connectionState ==
                                            ConnectionState.waiting) {
                                          return Center(
                                              child:
                                                  CircularProgressIndicator());
                                        } else if (snapshot.hasError) {
                                          return Center(
                                              child: Text(
                                            'Error: ${snapshot.error}',
                                            style:
                                                TextStyle(color: Colors.white),
                                          ));
                                        } else if (!snapshot.hasData ||
                                            snapshot.data!.isEmpty) {
                                          return Center(
                                            child: Text(
                                              'No movies found',
                                              style: TextStyle(
                                                  color: Colors.white),
                                            ),
                                          );
                                        } else {
                                          return ListView(
                                            children: _moviePageCategories
                                                .map((category) {
                                              return MoviesCategorySection(
                                                  title: '${category} Movies',
                                                  movies: _categorizedMovies[
                                                      category]!);
                                            }).toList(),
                                          );
                                        }
                                      },
                                    ),
                        ),
                      ],
                    ),
                    //),
                  ),
                ),
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    return Container(
      margin: EdgeInsets.only(top: 90),
      child: ListView.builder(
        itemCount: _searchResults.length,
        itemBuilder: (context, index) {
          final item = _searchResults[index];
          if (item is Map && item['type'] == 'recent') {
            return ListTile(
              leading: Icon(Icons.history, color: Colors.white),
              title: Text(item['query'], style: TextStyle(color: Colors.white)),
              onTap: () {
                // Perform search with this recent query
              },
            );
          } else {
            return ListTile(
              title: Text(item is Movie ? item.moviename : item.songname,
                  style: TextStyle(color: Colors.white)),
              subtitle: Text(item is Movie ? 'Movie' : 'Song',
                  style: TextStyle(color: Colors.white70)),
              onTap: () {
                if (item is Movie) {
                  // Navigator.push(
                  //   context,
                  //   MaterialPageRoute(
                  //     builder: (context) => VideoPlayerPage(
                  //       movies: allMovies,
                  //       initialIndex: allMovies.indexOf(item),
                  //     ),
                  //   ),
                  // );
                } else {
                  if (item is Music) {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => SongPlayerPage(
                                  music: item,
                                  onChange: (p0) {},
                                  onDislike: (p0) {},
                                )));
                  }
                }
              },
            );
          }
        },
      ),
    );
  }
}
