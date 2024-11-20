import 'package:flutter/material.dart';
import 'package:ott_project/components/music_folder/audio_container.dart';
import 'package:ott_project/components/music_folder/audio_provider.dart';
import 'package:ott_project/components/music_folder/music.dart';
import 'package:ott_project/components/music_folder/song_player_page.dart';
import 'package:ott_project/components/video_folder/category_bar.dart';
import 'package:ott_project/components/video_folder/movie.dart';
import 'package:ott_project/components/video_folder/movie_player_page.dart';
import 'package:ott_project/components/video_folder/video_play.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/pages/custom_appbar.dart';
import 'package:ott_project/pages/music_page.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/service/audio_service.dart';
import 'package:ott_project/service/movie_api_service.dart';
import 'package:ott_project/service/movie_service_page.dart';
import 'package:ott_project/service/service.dart';
import 'package:provider/provider.dart';
import '../components/background_image.dart';
import '../components/category/movie_category_section.dart';

import '../components/video_folder/video_container.dart';
import '../service/icon_service.dart';
// Import the movie service

class MoviePage extends StatefulWidget {
  const MoviePage({super.key});

  @override
  State<MoviePage> createState() => _MoviePageState();
}

class _MoviePageState extends State<MoviePage> {
  final Service service = Service();
  List<VideoDescription> allMovies = [];
  List<AudioDescription> allSongs =[];
  final TextEditingController _searchController = TextEditingController();
  List<VideoDescription> _filteredMovies = [];
 

  //int _selectedIndex = 1;
  String selectedCategory = "Movies";
  // bool _showSearch = false;
  AppIcon? iconData;
  bool _isSearching = false;
  List<dynamic> _searchResults = [];

  @override
  void initState() {
    super.initState();
    loadMovies();
    loadSongs();    
    _loadIcon();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
   
    //_fetchMovies();
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

  Future<void> loadMovies() async {
  try {
    // Fetch the video containers
    List<VideoContainer> videoContainers = await MovieService.fetchVideoContainer();

    // Extract VideoDescription objects from the containers and populate allMovies
    allMovies = videoContainers
        .expand((container) => container.videoDescriptions)
        .toList();
  print('all movies:${allMovies}');
    // Ensure the UI updates after data is fetched
    setState(() {});
  } catch (e) {
    print('Error fetching movies: $e');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Failed to load movies. Please try again.')),
    );
  }
}
 Future<void> loadSongs() async {
  try {
    // Fetch the video containers
    List<AudioContainer> audioContainers = await AudioService.fetchAudioContainer();

    // Extract VideoDescription objects from the containers and populate allMovies
    allSongs = audioContainers
        .expand((container) => container.audiolist)
        .toList();
  print('all movies:${allSongs}');
    // Ensure the UI updates after data is fetched
    setState(() {});
  } catch (e) {
    print('Error fetching songs: $e');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Failed to load songs. Please try again.')),
    );
  }
}



  

  Future<void> _refreshMovies() async {
     await loadMovies();
  }


  void _navigateToCategory(String category) {
    setState(() {
      selectedCategory = category;
    });
    switch (category) {
      case "All":
        // Navigator.push(
        //   context,
        //   MaterialPageRoute(builder: (context) => HomePage()),
        // );
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
          MaterialPageRoute(builder: (context) => MusicPage(userId: 24)),
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
    return WillPopScope(
      onWillPop: () async{
        return false;  
      },
      child: Scaffold(
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
                          Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          const Divider(
                            color: Colors.white54,
                            height: 1,
                          ),
                          SizedBox(
                            height: MediaQuery.sizeOf(context).height * 0.01,
                          ),
                          CategoryBar(
                              selectedCategory: selectedCategory,
                              onCategorySelected: _navigateToCategory),
                          SizedBox(
                            height: MediaQuery.sizeOf(context).height * 0.01,
                          ),
                          const Divider(
                            color: Colors.white54,
                            height: 1,
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
                                
                                : FutureBuilder<List<VideoContainer>>(
                                    future: MovieService.fetchVideoContainer(),
                                    builder: (context, snapshot) {
                                      if (snapshot.connectionState ==
                                          ConnectionState.waiting) {
                                        return Center(
                                            child: CircularProgressIndicator());
                                      } else if (snapshot.hasError) {
                                        return Center(
                                            child: Text(
                                          'Error: ${snapshot.error}',
                                          style: TextStyle(color: Colors.white),
                                        ));
                                      } else if (!snapshot.hasData ||
                                          snapshot.data!.isEmpty) {
                                        return Center(
                                          child: Text(
                                            'No movies found',
                                            style: TextStyle(color: Colors.white),
                                          ),
                                        );
                                      } else {
                                        // final movie = snapshot.data!;
                                        // final categories = movie
                                        //     .expand((movie) => movie.categories)
                                        //     .toSet()
                                        //     .toList();
                                        final videoContainer = snapshot.data!;
                                        print(
                                            'Video container details:${videoContainer}');
                                        return ListView.builder(
                                            itemCount: videoContainer.length,
                                            itemBuilder: (context, index) {
                                              final container =
                                                  videoContainer[index];
                                              // final containerVideos =
                                              //     container.video;
                                              return Column(
                                                children: [
                                                  MoviesCategorySection(
                                                    videoContainer: container,
                                                  ),
                                                ],
                                              );
                                            });
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
          print('All Movies: ${allMovies.length}');
 print('Search Result: ${item is VideoDescription ? item.videoTitle : item is AudioDescription ? item.audioTitle : 'unknown'}');


// final index1 = allMovies.indexOf(item);
// print('Index of ${item.videoTitle}: $index1');


           if (item is VideoDescription) {

    print('Search Result (Video): ${item.videoTitle}');
  } else if (item is AudioDescription) {
    print('Search Result (Audio): ${item.audioTitle}');
  } else {
    print('Search Result: Unknown type');
  }
          return ListTile(
            title: Text(item is VideoDescription ? item.videoTitle : item is AudioDescription ? item.audioTitle : 'unknown',
                style: TextStyle(color: Colors.white)),
            subtitle: Text(item is VideoDescription ? 'Movie' : item is AudioDescription ? 'Song' : 'Unknown',
                style: TextStyle(color: Colors.white70)),
            onTap: () {
              if (item is VideoDescription) {
                if(allMovies.isNotEmpty){
                final movieIndex = allMovies.indexWhere((video)=> video.id == item.id);
                print('Movie index:$movieIndex');
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => MoviesPlayerPage(
                      videoDescriptions: allMovies,
                      categoryId: (item.categoryList.isNotEmpty && index < item.categoryList.length) ? item.categoryList[index] : 0,
                      initialIndex: movieIndex)
                  ),
                );
                }
                }
  
                else {
                  if (item is AudioDescription) {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => SongPlayerPage(
                                music: item,
                                  musicList: allSongs,
                                  onChange: (newAudio) {
                                     Provider.of<AudioProvider>(context,listen: true)
                                    .setCurrentlyPlayingSong(
                                                  newAudio,_searchResults.cast<AudioDescription>(),
                                                  );
                                  },
                                  onDislike: (p0) {},
                                )));
                  }
              }
            },
          );
        },
      ),
    );
  }
}



  // Widget _buildSearchResults() {
  //   return Container(
  //     margin: EdgeInsets.only(top: 90),
  //     child: ListView.builder(
  //       itemCount: _searchResults.length,
  //       itemBuilder: (context, index) {
  //         final item = _searchResults[index];
  //         if (item is Map && item['type'] == 'recent') {
  //           return ListTile(
  //             leading: Icon(Icons.history, color: Colors.white),
  //             title: Text(item['query'], style: TextStyle(color: Colors.white)),
  //             onTap: () {
  //               // Perform search with this recent query
  //             },
  //           );
  //         } else {
  //           return ListTile(
  //             title: Text(item is VideoDescription ? item.videoTitle : 'null',
  //                 style: TextStyle(color: Colors.white)),
  //             subtitle: Text(item is VideoDescription ? 'Movie' : 'Song',
  //                 style: TextStyle(color: Colors.white70)),
  //             onTap: () {
  //               if (item is Movie) {
  //                 // Navigator.push(
  //                 //   context,
  //                 //   MaterialPageRoute(
  //                 //     builder: (context) => VideoPlayerPage(
  //                 //       movies: allMovies,
  //                 //       initialIndex: allMovies.indexOf(item),
  //                 //     ),
  //                 //   ),
  //                 // );
  //               } else {
  //                 if (item is Music) {
  //                   Navigator.push(
  //                       context,
  //                       MaterialPageRoute(
  //                           builder: (context) => SongPlayerPage(
  //                                 music: item,
  //                                 onChange: (p0) {},
  //                                 onDislike: (p0) {},
  //                               )));
  //                 }
  //               }
  //             },
  //           );
  //         }
  //       },
  //     ),
  //   );
  // }

