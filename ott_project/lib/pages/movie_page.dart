import 'dart:typed_data';

import 'package:carousel_slider/carousel_slider.dart';
import 'package:dots_indicator/dots_indicator.dart';
import 'package:flutter/material.dart';
import 'package:ott_project/components/banners/video_banner.dart';
import 'package:ott_project/components/category/category_service.dart';
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
import 'package:ott_project/pages/main_tab.dart';
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
 int currentBannerIndex = 0;
 List<VideoContainer> _videoContainers =[];
  List<VideoBanner> videobanners =[];
  Map<int,VideoDescription> _videoDetails = {};
  Map<int,Uint8List?> bannerImages = {};
  bool _isLoading = true;
  bool _isBannerLoading = true;
  //int _selectedIndex = 1;
  String selectedCategory = "Movies";
  // bool _showSearch = false;
  AppIcon? iconData;
  bool _isSearching = false;
  List<dynamic> _searchResults = [];

  @override
  void initState() {
    super.initState();
     _loadData();
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
  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    
   await Future.wait([loadMovies(), _loadBannerDetails()]);
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
     setState(() {
      _videoContainers = videoContainers;
     _isLoading = false;
    });
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
Future<void> _loadBannerDetails() async {
  try {
    final banners = await MovieApiService().fetchAllVideoBanner();
    final detailsMap = <int, VideoDescription>{};
    final imageMap = <int,Uint8List?>{};
    for (var banner in banners) {
      try {
        final details = await MovieApiService().fetchMovieDetail(banner.videoId);
        detailsMap[banner.videoId] = details;

        final image = await MovieApiService.fetchVideoBannerImage(banner.videoId);
        imageMap[banner.videoId] = image;
      } catch (e) {
        print('Error fetching details for video ${banner.videoId}: $e');
      }
    }
     setState(() {
      videobanners = banners;
      _videoDetails = detailsMap;
      bannerImages = imageMap;
      _isBannerLoading = false;
    });
  } catch (e) {
    print('Error loading banner: $e');
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
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => MainTab(initialTab: 0,)),
        );
        break;
      case "Movies":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => MainTab(initialTab: 0)),
        );
        break;
      case "Music":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => MainTab(initialTab: 1)),
        );
        break;
      case "Library":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => MainTab(initialTab: 2)),
        );
        break;
      case "Profile":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => MainTab(initialTab: 3)),
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
  Widget build(BuildContext context){
    return WillPopScope(onWillPop: () async{
      return false;
    },
    child: Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          BackgroundImage(),
          CustomAppBar(onSearchChanged: handleSearchState),
          _isSearching ?
          _buildSearchResults()
          : Container(
            padding: EdgeInsets.all(16.0),
            margin: EdgeInsets.only(top: 50),
            child: Expanded(
              child: RefreshIndicator(
                onRefresh: _refreshMovies,
                child: ListView(
                  children: [
                    if(_isBannerLoading)
                       const Center(child: CircularProgressIndicator(),)
                    else
                     Stack(
                      children: [
                        Container(
                          height: MediaQuery.sizeOf(context).height * 0.25,
                         child:  CarouselSlider(
                                  options: CarouselOptions(
                                    height: double.infinity,
                                    viewportFraction: 1.0,
                                    autoPlay: true,
                                    autoPlayInterval: const Duration(seconds: 5),
                                    onPageChanged: (index, reason) {
                                      setState(() {
                                        currentBannerIndex = index;
                                      });
                                    },
                                  ),
                                  items: videobanners.map((banner) {
                                    final details = _videoDetails[banner.videoId];
                                    final image = bannerImages[banner.videoId];
                                    return Builder(
                                      builder: (BuildContext context) {
                                         print('VideoContainers length: ${_videoContainers.length}');
                                         print('Banner videoId: ${banner.videoId}');
                                         print('Details: $details');
                                        final matchingMovie = allMovies.firstWhere((movie)=> movie.id == banner.videoId);
                                        final matchingValue = _videoContainers.firstWhere((container)=>container.videoDescriptions.any((desc)=> desc.id == banner.videoId));
                                        final index = matchingMovie != null ? allMovies.indexOf(matchingMovie) : 0;
                                        print('Matching container value:${matchingValue}');
                                        return GestureDetector(
                                          onTap: (){
                                            final categoryId = CategoryService().getCategoryId(details!.categoryList,matchingValue.value);
                                            Navigator.push(context,
                                             // ignore: unnecessary_null_comparison
                                             MaterialPageRoute(builder: (context)=>MoviesPlayerPage(videoDescriptions: allMovies, categoryId:categoryId ,initialIndex:index ,)));
                                          },
                                          child: Container(
                                                decoration: BoxDecoration(
                                                  image: DecorationImage(
                                                    image: MemoryImage(image!),
                                                    fit: BoxFit.cover,
                                                  ),
                                                ),
                                                child: Container(
                                                  decoration: BoxDecoration(
                                                    gradient: LinearGradient(
                                                      begin: Alignment.topCenter,
                                                      end: Alignment.bottomCenter,
                                                      colors: [
                                                        Colors.transparent,
                                                        Colors.black.withOpacity(0.4),
                                                        Colors.black.withOpacity(0.5), // Stronger blur at bottom
                                                        Colors.black.withOpacity(0.6),
                                                      ],
                                                    ),
                                                  ),
                                              
                                                ),
                                              ),
                                        );
                                         
                                      },
                                    );
                                  }).toList(),
                                ),
                        ),
                        Positioned(
                          top: 180,
                          left: 0,
                          right: 0,
                          child: Center(
                          child:videobanners.isNotEmpty ?
                           DotsIndicator(
                            dotsCount: videobanners.length,
                            position: currentBannerIndex,
                            decorator: const DotsDecorator( 
                              color: Colors.grey,
                              activeColor: Colors.white,
                              size: Size(7, 7),
                              activeSize: Size(8, 8),
                              spacing: EdgeInsets.all(4),
                            ),
                          ) : SizedBox.shrink(),
                        ),
                        ),
                      ],
                     ),
                     SizedBox(height: MediaQuery.sizeOf(context).height * 0.03,),
                      _searchController.text.isNotEmpty && _filteredMovies.isEmpty
                                  ? Center(
                                      child: Text(
                                        'No movies found',
                                        style: TextStyle(color: Colors.white),
                                      ),
                                    )
                                  : ListView.builder(
                                    physics: NeverScrollableScrollPhysics(),
                                    shrinkWrap: true,
                                            itemCount: _videoContainers.length,
                                            itemBuilder: (context, index) {
                                              final container = _videoContainers[index];
                                              return MoviesCategorySection(
                                                videoContainer: container,
                                              );
                                            },
                                          ),

                  ],
                  
                ),
              ),
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

