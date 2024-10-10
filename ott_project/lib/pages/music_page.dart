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
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/pages/video_page.dart';
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
    _musicByCategory = _fetchAudios();

    //_fetchMovies();
    Provider.of<AudioProvider>(context, listen: false).loadCurrentlyPlaying();

    // _filterAudioList('');
  }

  // @override
  // void didChangeDependencies() {
  //   super.didChangeDependencies();
  //   _audio = AudioService.fetchMusic();
  // }

  Future<Map<String, List<Music>>> _fetchAudios() async {
    try {
      final audios = await AudioService.fetchMusicByCategory();
      print("Fetched ${audios.length} audios");
      print('Audios:$audios');
      // _buildCategoryMap(audios);
      // for (var audio in audios) {
      //   await audio.fetchImage();
      //   //print("Fetched image for ${audio.songname}");
      // }
      // _categorizeAudios = _categorizedAFudiosStatic(audios);
      return audios;
    } catch (e) {
      print('Error fetching audios: $e');
      throw Exception('Failed to load audios');
    }
  }

  // Future<List<Movie>> _fetchMovies() async {
  //   try {
  //     final movies = await MovieService.fetchMovies();
  //     setState(() {
  //       _allMovies = movies;
  //     });
  //     // _categorizeMovies(_allMovies);
  //     return _allMovies;
  //   } catch (e) {
  //     throw Exception('Failed to load movies');
  //   }
  // }

  // Map<String, List<Music>> _categorizedAudiosStatic(List<Music> audios) {
  //   final categories = ['Anirudh Songs', 'Yuvan', 'Tamil Hits'];
  //   Map<String, List<Music>> categorized = {};
  //   int startIndex = 0;
  //   for (var category in categories) {
  //     int endIndex = startIndex + 5;
  //     if (endIndex > audios.length) endIndex = audios.length;
  //     if (startIndex < audios.length) {
  //       categorized[category] = audios.sublist(startIndex, endIndex);
  //       startIndex = endIndex;
  //     }
  //   }
  //   return categorized;
  // }

  // void _buildCategoryMap(List<Audio> audios) {
  //   for (var audio in audios) {
  //     if (!_categoryMap.containsKey(audio.categoryName)) {
  //       _categoryMap[audio.categoryName] = audio.categoryName;
  //     }
  //   }
  // }

  // Map<String, List<Audio>> _categorizedAudios(List<Audio> audios) {
  //   Map<String, List<Audio>> categorized = {};
  //   for (var audio in audios) {
  //     String categoryName =
  //         _categoryMap[audio.categoryName] ?? 'Unknown Category';
  //     if (!categorized.containsKey(categoryName)) {
  //       categorized[categoryName] = [];
  //     }
  //     categorized[categoryName]!.add(audio);
  //   }
  //   return categorized;
  // }

  // void _filterAudioList(String query) {
  //   setState(() {
  //     if (query.isEmpty) {
  //       _filteredAudios = _categorizeAudios.values.expand((i) => i).toList();
  //       print('Filtered Audio All:$_filteredAudios');
  //     } else {
  //       final Map<String, Music> uniqueAudios = {};
  //       final input = query.toLowerCase();

  //       for (var categoryAudios in _categorizeAudios.values) {
  //         for (var audio in categoryAudios) {
  //           final audioName = audio.songname.toLowerCase();
  //           final words = audioName.split(' ');

  //           if (audioName.contains(input) ||
  //               words.any((word) => word.startsWith(input))) {
  //             uniqueAudios.putIfAbsent(audioName, () => audio);
  //           }
  //         }
  //       }

  //       _filteredAudios = uniqueAudios.values.toList();
  //       print('Filtered Audio:$_filteredAudios');
  //     }
  //   });
  // }

  // Future<void> _refreshAudio() async {
  //   await _fetchAudios();
  // }

  void _navigateToCategory(String category) {
    switch (category) {
      case "All":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => HomePage()),
        );
        break;
      case "Movies":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => VideoPage()),
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

  // void _playSong(Music audio) {
  //   //_mrecentlyPlayed.addRecentlyPlayed(audio);
  //   _mrecentlyPlayed.addRecentlyPlayed(audio);

  //   String? category = _categorizeAudios.entries
  //       .firstWhere((entry) => entry.value.contains(audio),
  //           orElse: () => MapEntry('', []))
  //       .key;
  //   List<Music> categoryPlayList = _categorizeAudios[category] ?? [];
  //   Provider.of<AudioProvider>(context, listen: false)
  //       .musicsetCurrentlyPlaying(audio, categoryPlayList);
  //   Navigator.push(
  //     context,
  //     MaterialPageRoute(
  //       builder: (context) => SongPlayerPage(
  //         music: audio,
  //         musicList: categoryPlayList,
  //         onDislike: (p0) {},
  //         onChange: (newAudio) {
  //           setState(() {
  //             Provider.of<AudioProvider>(context, listen: false)
  //                 .musicsetCurrentlyPlaying(newAudio, categoryPlayList);
  //           });
  //         }, // You'll need to implement this
  //       ),
  //     ),
  //   );
  // }

  void _playSong(Music audio, List<Music> playlist) {
    Provider.of<AudioProvider>(context, listen: false)
        .musicsetCurrentlyPlaying(audio, playlist);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SongPlayerPage(
          music: audio,
          musicList: playlist,
          onDislike: (p0) {},
          onChange: (newAudio) {
            setState(() {
              Provider.of<AudioProvider>(context, listen: false)
                  .musicsetCurrentlyPlaying(newAudio, playlist);
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
                          return audioProvider.musiccurrentlyPlaying != null
                              ? CurrentlyPlayingBar(
                                  musicCurrentlyPlaying:
                                      audioProvider.musiccurrentlyPlaying,
                                  onTap: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => SongPlayerPage(
                                            music: audioProvider
                                                .musiccurrentlyPlaying!,
                                            onChange: (newAudio) {
                                              audioProvider
                                                  .musicsetCurrentlyPlaying(
                                                      newAudio,
                                                      audioProvider
                                                          .music_playlist);
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
                      onTap: (_) {},
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

  Widget _buildRecentlyPlayed() {
    return SingleChildScrollView(
      child: RecentlyPlayedSongs(
          recentlyPlayed: _mrecentlyPlayed,
          onTap: (audio) =>
              _playSong(audio, _mrecentlyPlayed.getRecentlyPlayed())),
    );
  }

  Widget _buildSearchResults() {
    return Container(
      margin: EdgeInsets.only(top: 90),
      child: ListView.builder(
        itemCount: _searchResults.length,
        itemBuilder: (context, index) {
          final item = _searchResults[index];
          return ListTile(
            title: Text(item is AudioDescription ? item.audioTitle : 'unknown',
                style: TextStyle(color: Colors.white)),
            subtitle: Text(item is Movie ? 'Movie' : 'Song',
                style: TextStyle(color: Colors.white70)),
            onTap: () {
              if (item is Movie) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => VideoPlayerPage(
                      movies: _allMovies,
                      initialIndex: _allMovies.indexOf(item),
                    ),
                  ),
                );
                // } else {
                //   if (item is Music) {
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
              }
            },
          );
        },
      ),
    );
  }
}
