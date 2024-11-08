import 'package:flutter/material.dart';

import 'package:ott_project/components/category/music_category_section.dart';

import 'package:ott_project/components/music_folder/audio_provider.dart';
import 'package:ott_project/components/music_folder/currently_playing_bar.dart';
import 'package:ott_project/components/music_folder/music.dart';
import 'package:ott_project/components/music_folder/recently_played.dart';
import 'package:ott_project/components/video_folder/category_bar.dart';
import 'package:ott_project/components/video_folder/video_container.dart';
import 'package:ott_project/pages/custom_appbar.dart';
import 'package:ott_project/pages/home_page.dart';
import 'package:ott_project/pages/movie_page.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/service/audio_api_service.dart';
import 'package:ott_project/service/audio_service.dart';
import 'package:provider/provider.dart';
import '../components/background_image.dart';
import '../components/music_folder/audio_container.dart';
import '../components/music_folder/song_player_page.dart';
import '../components/video_folder/movie.dart';
import '../components/video_folder/video_play.dart';

class MusicPage extends StatefulWidget {
  final int userId;
  const MusicPage({super.key, required this.userId});

  @override
  State<MusicPage> createState() => _MusicPageState();
}

class _MusicPageState extends State<MusicPage> {
  // late Future<List<Audio>> _audio;
  // Map<String, List<Audio>> _categorizeAudios = {};
  // final TextEditingController _searchController = TextEditingController();
  // List<Audio> _filteredAudios = [];

  late Future<List<Music>> _audio;
  Map<String, List<Music>> _categorizeAudios = {};
  final TextEditingController _searchController = TextEditingController();
  List<Music> _filteredAudios = [];
  late List<Movie> _allMovies = [];
  late List<VideoDescription> _allVideos =[];
  bool _isSearching = false;
  List<dynamic> _searchResults = [];
  late Future<Map<String, List<Music>>> _musicByCategory;
  // Map<String, String> _categoryMap = {};

  // bool _showSearch = false;
  final RecentlyPlayed _mrecentlyPlayed = RecentlyPlayed();

  @override
  void initState() {
    super.initState();
    //_audio = _fetchAudios();
   // _musicByCategory = _fetchAudios();

    //_fetchMovies();
    Provider.of<AudioProvider>(context, listen: false).loadCurrentlyPlaying();

    // _filterAudioList('');
  }

   void _navigateToCategory(String category) {
    switch (category) {
      case "All":
        // Navigator.push(
        //   context,
        //   MaterialPageRoute(builder: (context) => HomePage()),
        // );
        break;
      case "Movies":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => MoviePage()),
        );
        break;
      case "Music":
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => MusicPage(userId: widget.userId)),
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
                    child: Column(
                      children: [
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
                            height: MediaQuery.sizeOf(context).height * 0.01,
                          ),
                            CategoryBar(
                                selectedCategory: 'Music',
                                onCategorySelected: _navigateToCategory),
                            SizedBox(
                              height: 7,
                            ),
                            const Divider(
                              color: Colors.white,
                              height: 1,
                            ),
                            
                          ],
                        ),
                        //),
                        //),
                        Expanded(
                          child: ListView(                       
                            children: [
                              if (_searchController.text.isNotEmpty &&
                                  _filteredAudios.isEmpty)
                                Center(
                                  child: Text(
                                    'No audios found',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                )
                              else ...[
                                SizedBox(
                                  height: 500,
                                  child: _buildMusicCategories(),
                                ),
                               
                              ]
                            ],
                            //),
                            // ),
                          ),
                        ),
      
                        Consumer<AudioProvider>(
                          builder: (context, audioProvider, child) {
                            return audioProvider.audioDescriptioncurrently != null
                                ? CurrentlyPlayingBar(
                                    audioCurrentlyPlaying:
                                        audioProvider.audioDescriptioncurrently,
                                    onTap: () {
                                      Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) => SongPlayerPage(
                                              music: audioProvider.audioDescriptioncurrently!,                                              
                                              onChange: (newAudio) {
                                                audioProvider
                                                    .setCurrentlyPlayingSong(
                                                        newAudio,
                                                        audioProvider
                                                            .audio_playlist);
                                              },
                                              onDislike: ((audio) {
                                                handleDislike(audio, context);
                                              }),
                                            ),
                                          ));
                                    },
                                  )
                                : Container();
                          },
                        ),
                      ],
      
                      //),
                    ),
                  ),
          ],
        ),
      ),
    );
  }

  Widget _buildMusicCategories() {
    return FutureBuilder<List<AudioContainer>>(
      future: AudioService.fetchAudioContainer(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(
              child: Text(
            'Error: ${snapshot.error}',
            style: TextStyle(color: Colors.white),
          ));
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return Center(
            child: Text(
              'No audios found',
              style: TextStyle(color: Colors.white),
            ),
          );
        } else {
          // final movie = snapshot.data!;
          // final categories = movie
          //     .expand((movie) => movie.categories)
          //     .toSet()
          //     .toList();
          final audioContainer = snapshot.data!;
          print('Audio container details:${audioContainer}');
          return ListView.builder(
              itemCount: audioContainer.length,
              itemBuilder: (context, index) {
                final container = audioContainer[index];
                // final containerVideos =
                //     container.video;
                return Column(
                  children: [
                    MusicCategorySection(
                      audioContainer: container,
                      userId: widget.userId,
                      onTap: (audio) {
                        Navigator.push(context, MaterialPageRoute(
                          builder: (context)=>SongPlayerPage(music: audio, onChange: (newAudio){
                        
                          }, onDislike:(audio){handleDislike(audio, context);})));
                      },
                    ),
                    SizedBox(
                      height: MediaQuery.sizeOf(context).height * 0.02,
                    ),
                  ],
                );
              });
        }
      },
    );
  }
  void handleDislike(AudioDescription audio, BuildContext context) async {
  try {
    // You can add these to your existing state or provider
    final userId = widget.userId;
    
    // Make API call to update dislike status
    final response = await AudioApiService().unlikeAudio(audio.id,userId);
    
    if (response) {
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Song disliked successfully'),
          backgroundColor: Colors.red,
        ),
      );
      
      // Optionally, you can update the UI or remove the song from the current playlist
      // For example, if using AudioProvider:
      // Provider.of<AudioProvider>(context, listen: false).removeFromPlaylist(audio);
    } else {
      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to dislike song'),
          backgroundColor: Colors.grey,
        ),
      );
    }
  } catch (e) {
    // Handle any errors
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Error: Something went wrong'),
        backgroundColor: Colors.red,
      ),
    );
    print('Error in handleDislike: $e');
  }
}


  // Widget _buildRecentlyPlayed() {
  //   return SingleChildScrollView(
  //     child: RecentlyPlayedSongs(
  //         recentlyPlayed: _mrecentlyPlayed,
  //         onTap: (audio) =>
  //             _playSong(audio, _mrecentlyPlayed.getRecentlyPlayed())),
  //   );
  // }

  Widget _buildSearchResults() {
    return Container(
      margin: EdgeInsets.only(top: 90),
      child: ListView.builder(
        itemCount: _searchResults.length,
        itemBuilder: (context, index) {
          final item = _searchResults[index];
          return ListTile(
            title: Text(item is VideoDescription ? item.videoTitle : item is AudioDescription ? item.audioTitle : 'unknown',
                style: TextStyle(color: Colors.white)),
            subtitle: Text(item is VideoDescription ? 'Movie' : item is AudioDescription ? 'Song' : 'Unknown',
                style: TextStyle(color: Colors.white70)),
            onTap: () {
              // if (item is VideoDescription) {
              //   Navigator.push(
              //     context,
              //     MaterialPageRoute(
              //       builder: (context) => VideoPlayerPage(
              //         movies: _allVideos,
              //         initialIndex: _allVideos.indexOf(item),
              //       ),
              //     ),
              //   );
              //   } 
                // else {
                //   if (item is AudioDescription) {
                //     Navigator.push(
                //         context,
                //         MaterialPageRoute(
                //             builder: (context) => SongPlayerPage(
                //                   music: item,
                //                   onChange: (newAudio) {
                //                     //  Provider.of<AudioProvider>(context,listen: true)
                //                     // .musicsetCurrentlyPlaying(
                //                     //               newAudio,
                //                     //               );
                //                   },
                //                   onDislike: (p0) {},
                //                 )));
                //   }
              //}
            },
          );
        },
      ),
    );
  }
}
