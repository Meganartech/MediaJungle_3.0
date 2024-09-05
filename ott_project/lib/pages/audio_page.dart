import 'package:flutter/material.dart';
import 'package:ott_project/components/category/audio_category_section.dart';

import 'package:ott_project/components/music_folder/audio.dart';

import 'package:ott_project/components/music_folder/audio_provider.dart';
import 'package:ott_project/components/music_folder/currently_playing_bar.dart';
import 'package:ott_project/components/music_folder/recently_played_manager.dart';
import 'package:ott_project/components/video_folder/category_bar.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/pages/custom_appbar.dart';
import 'package:ott_project/pages/home_page.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/pages/video_page.dart';
import 'package:ott_project/search/search_result_audio.dart';

import 'package:ott_project/service/audio_service.dart';
import 'package:ott_project/service/icon_service.dart';

import 'package:provider/provider.dart';

import '../components/background_image.dart';

import '../components/music_folder/music_player_page.dart';

class AudioPage extends StatefulWidget {
  final int userId;
  const AudioPage({super.key, required this.userId});

  @override
  State<AudioPage> createState() => _AudioPageState();
}

class _AudioPageState extends State<AudioPage> {
  late Future<List<Audio>> _audio;
  Map<int, List<Audio>> _categorizeAudios = {};
  final TextEditingController _searchController = TextEditingController();
  List<Audio> _filteredAudios = [];
  Map<String, String> _categoryMap = {};
  AppIcon? iconData;
  // bool _showSearch = false;
  final RecentlyPlayedManager _recentlyPlayedManager = RecentlyPlayedManager();

  @override
  void initState() {
    super.initState();
    _audio = _fetchAudios();
    Provider.of<AudioProvider>(context, listen: false).loadCurrentlyPlaying();
    _loadIcon();
    _filterAudioList('');
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _audio = AudioService.fetchAudio();
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

  Future<List<Audio>> _fetchAudios() async {
    try {
      final audios = await AudioService.fetchAudio();
      _buildCategoryMap(audios);
      _categorizeAudios = _categorizedAudios(audios).cast<int, List<Audio>>();
      return audios;
    } catch (e) {
      print('Error fetching audios: $e');
      throw Exception('Failed to load movies');
    }
  }

  void _buildCategoryMap(List<Audio> audios) {
    for (var audio in audios) {
      if (!_categoryMap.containsKey(audio.categoryName)) {
        _categoryMap[audio.categoryName] = audio.categoryName;
      }
    }
  }

  Map<String, List<Audio>> _categorizedAudios(List<Audio> audios) {
    Map<String, List<Audio>> categorized = {};
    for (var audio in audios) {
      String categoryName =
          _categoryMap[audio.categoryName] ?? 'Unknown Category';
      if (!categorized.containsKey(categoryName)) {
        categorized[categoryName] = [];
      }
      categorized[categoryName]!.add(audio);
    }
    return categorized;
  }

  void _filterAudioList(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredAudios = _categorizeAudios.values.expand((i) => i).toList();
        print('Filtered Audio All:$_filteredAudios');
      } else {
        final Map<String, Audio> uniqueAudios = {};
        final input = query.toLowerCase();

        for (var categoryAudios in _categorizeAudios.values) {
          for (var audio in categoryAudios) {
            final audioName = audio.songname.toLowerCase();
            final words = audioName.split(' ');

            if (audioName.contains(input) ||
                words.any((word) => word.startsWith(input))) {
              uniqueAudios.putIfAbsent(audioName, () => audio);
            }
          }
        }

        _filteredAudios = uniqueAudios.values.toList();
        print('Filtered Audio:$_filteredAudios');
      }
    });
  }

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
              builder: (context) => AudioPage(userId: widget.userId)),
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

  void _playSong(Audio audio) {
    _recentlyPlayedManager.addRecentlyPlayed(audio);
    List<Audio> categoryPlayList = _categorizeAudios[audio.categoryName] ?? [];
    Provider.of<AudioProvider>(context, listen: false)
        .setCurrentlyPlaying(audio, categoryPlayList);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MusicPlayerPage(
          audio: audio,

          audioList: categoryPlayList,
          onDislike: (p0) {},
          onChange: (newAudio) {
            setState(() {
              Provider.of<AudioProvider>(context, listen: false)
                  .setCurrentlyPlaying(newAudio, categoryPlayList);
            });
          }, // You'll need to implement this
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          BackgroundImage(),
          Column(
            children: [
             // CustomAppBar(),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
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
                        selectedCategory: 'Music',
                        onCategorySelected: _navigateToCategory),
                    SizedBox(
                      height: 7,
                    ),
                    const Divider(
                      color: Colors.white,
                      height: 1,
                    ),
                    SizedBox(
                      height: 20,
                    ),
                  ],
                ),
              ),
              //),
              Expanded(
                child: SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _searchController.text.isNotEmpty &&
                                _filteredAudios.isEmpty
                            ? Center(
                                child: Text(
                                  'No audios found',
                                  style: TextStyle(color: Colors.white),
                                ),
                              )
                            : _searchController.text.isNotEmpty
                                ? ListView.builder(
                                    shrinkWrap: true,
                                    physics: NeverScrollableScrollPhysics(),
                                    itemCount: _filteredAudios.length,
                                    itemBuilder: (context, index) {
                                      return SearchResultAudio(
                                          audio: _filteredAudios[index],
                                          allAudios: _filteredAudios,
                                          index: index);
                                    },
                                  )
                                : FutureBuilder<List<Audio>>(
                                    future: _audio,
                                    builder: (context, snapshot) {
                                      if (snapshot.connectionState ==
                                          ConnectionState.waiting) {
                                        return Center(
                                            child: CircularProgressIndicator());
                                      } else if (snapshot.hasError) {
                                        return Center(
                                            child: Text(
                                                'Error: ${snapshot.error}',
                                                style: TextStyle(
                                                    color: Colors.white)));
                                      } else if (!snapshot.hasData ||
                                          snapshot.data!.isEmpty) {
                                        return Center(
                                            child: Text('No audios available',
                                                style: TextStyle(
                                                    color: Colors.white)));
                                      } else {
                                        final categoryCounts = <String, int>{};
                                        for (var audio in snapshot.data!) {
                                          categoryCounts[audio.categoryName] =
                                              (categoryCounts[
                                                          audio.categoryName] ??
                                                      0) +
                                                  1;
                                        }

                                        // Sort categories by the number of songs, in descending order
                                        final sortedCategories =
                                            categoryCounts.entries.toList()
                                              ..sort((a, b) =>
                                                  b.value.compareTo(a.value));

                                        // Select the top two categories
                                        final topCategories = sortedCategories
                                            .take(2)
                                            .map((e) => e.key)
                                            .toList();

                                        return Column(
                                          children: [
                                            // Iterate over each of the top two categories to create a section
                                            for (String categoryName
                                                in topCategories)
                                              Column(
                                                children: [
                                                  AudioCategorySection(
                                                    title:
                                                        categoryName, // Fetch the category name from the map
                                                    audios: snapshot.data!
                                                        .where((audio) =>
                                                            audio
                                                                .categoryName ==
                                                            categoryName)
                                                        .toList(),
                                                    onTap: _playSong,
                                                    userId: widget.userId,
                                                  ),
                                                  SizedBox(height: 20),
                                                ],
                                              ),
                                            // Add the RecentlyPlayedSection
                                            RecentlyPlayedSection(
                                              recentlyPlayedManager:
                                                  _recentlyPlayedManager,
                                              onTap: _playSong,
                                            ),
                                          ],
                                        );

                                   
                                      }
                                    },
                                  ),
                      ],
                    ),
                  ),
                ),
              ),
              // Consumer<AudioProvider>(
              //   builder: (context, audioProvider, child) {
              //     return audioProvider.currentlyPlaying != null
              //         ? CurrentlyPlayingBar(
              //             currentlyPlaying: audioProvider.currentlyPlaying,
              //             onTap: () {
              //               Navigator.push(
              //                 context,
              //                 MaterialPageRoute(
              //                   builder: (context) => MusicPlayerPage(
              //                     audio: audioProvider.currentlyPlaying!,
              //                     audioList: audioProvider.playList,
              //                     onDislike: (p0) {},
              //                     onChange: (newAudio) {
              //                       audioProvider.setCurrentlyPlaying(
              //                           newAudio, audioProvider.playList);
              //                     },
              //                   ),
              //                 ),
              //               );
              //             },
              //           )
              //         : Container();
              //   },
              // ),
            ],

            //),
          ),
        ],
      ),
    );
  }
}


