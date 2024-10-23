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

  // @override
  // void didChangeDependencies() {
  //   super.didChangeDependencies();
  //   _audio = AudioService.fetchMusic();
  // }

  // Future<Map<String, List<Music>>> _fetchAudios() async {
  //   try {
  //     final audios = await AudioService.fetchMusicByCategory();
  //     print("Fetched ${audios.length} audios");
  //     print('Audios:$audios');
  //     // _buildCategoryMap(audios);
  //     // for (var audio in audios) {
  //     //   await audio.fetchImage();
  //     //   //print("Fetched image for ${audio.songname}");
  //     // }
  //     // _categorizeAudios = _categorizedAFudiosStatic(audios);
  //     return audios;
  //   } catch (e) {
  //     print('Error fetching audios: $e');
  //     throw Exception('Failed to load audios');
  //   }
  // }


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



  void _playSong(AudioDescription audio, List<AudioDescription> playlist) {
    // Provider.of<AudioProvider>(context, listen: false)
    //     .musicsetCurrentlyPlaying(audio, playlist);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SongPlayerPage(
          music: audio,
          musicList: playlist,
          onDislike: (p0) {},
          onChange: (newAudio) {
            setState(() {
              // Provider.of<AudioProvider>(context, listen: false)
              //     .musicsetCurrentlyPlaying(newAudio, playlist);
            });
          },
        ),
      ),
    );
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
                              // SizedBox(
                              //     height: 150, child: _buildRecentlyPlayed()),
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
                                            onDislike: ((p0) {}),
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
                          builder: (context)=>SongPlayerPage(music: audio, onChange: (_){}, onDislike:(_){})));
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
