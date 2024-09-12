import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:flutter/material.dart';
import 'package:ott_project/components/notification/notification.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:ott_project/service/audio_service.dart';

import 'package:ott_project/service/movie_service_page.dart';
import 'package:ott_project/service/notification_api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
// import '../components/music_folder/audio.dart';
import '../components/music_folder/music.dart';
import '../components/video_folder/movie.dart';
import '../components/video_folder/video_play.dart';
import '../service/icon_service.dart';

class CustomAppBar extends StatefulWidget implements PreferredSizeWidget {
  final Function(bool, List<dynamic>) onSearchChanged;
  const CustomAppBar({
    super.key,
    required this.onSearchChanged,
  });

  @override
  State<CustomAppBar> createState() => _CustomAppBarState();

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}

class _CustomAppBarState extends State<CustomAppBar> {
  TextEditingController _searchController = TextEditingController();
  bool _showSearch = false;
  List<dynamic> _filteredContent = [];
  late List<Movie> _allMovies = [];
  late List<Music> _music = [];
  AppIcon? iconData;
  List<Notifications>? notifications;
  int unreadCount = 0;
  final storage = FlutterSecureStorage();
  String? token;
  List<String> _recentSearch = [];
  @override
  void initState() {
    super.initState();
    _loadIcon();
    _loadToken();
    _loadMovieandMusic();
    loadRecentSearch();
    //_filterAudioList('');
  }

  Future<void> _loadToken() async {
    try {
      token = await storage.read(key: 'token');
      if (token != null) {
        _loadNotifications();
        _loadUnreadCount();
      } else {
        print('Token not found');
      }
    } catch (e) {
      print('No token found');
    }
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

  Future<void> _loadMovieandMusic() async {
    _allMovies = await MovieService.fetchMovies();
    _music = await AudioService.fetchMusic();
  }

  Future<void> _loadNotifications() async {
    if (token == null) print('Token not found');
    final notifications =
        await NotificationApiService().fetchNotification(token!);
    setState(() {
      this.notifications = notifications;
    });
  }

  Future<void> _loadUnreadCount() async {
    if (token == null) print('Token not found');
    try {
      final count = await NotificationApiService().fetchUnreadCount(token!);
      setState(() {
        unreadCount = count;
      });
    } catch (e) {
      print('Error loading unread count: $e');
    }
  }

  Future<void> _markAllAsRead() async {
    if (token == null) print('Token not found');
    try {
      await NotificationApiService().markAllasRead(token!);
      setState(() {
        unreadCount = 0;
      });
      _loadNotifications();
      Navigator.of(context).pop();
      print('Read');
    } catch (e) {
      print('Error making all as read: $e');
    }
  }

  Future<void> _clearAllNotifications() async {
    if (token == null) print('Token not found');
    try {
      await NotificationApiService().clearAllNotifications(token!);
      setState(() {
        notifications = [];
        unreadCount = 0;
      });
      //_loadNotifications();
      Navigator.of(context).pop();
      print('Read');
    } catch (e) {
      print('Error making all as read: $e');
    }
  }

  void _showNotification() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Notifications'),
              IconButton(
                  tooltip: 'Clear All',
                  onPressed: () {
                    _clearAllNotifications();
                  },
                  icon: Icon(Icons.clear_all_rounded)),
            ],
          ),
          content: Container(
            width: double.maxFinite,
            child: notifications == null
                ? Center(
                    child: CircularProgressIndicator(),
                  )
                : ListView.builder(
                    itemCount: notifications!.length,
                    itemBuilder: (context, index) {
                      final notification = notifications![index];
                      return ListTile(
                        // leading: notification.image != null
                        //     ? Image.memory(
                        //         Uint8List.fromList(notification.image))
                        //     : Icon(Icons.movie),
                        title: Text(notification.title),
                        subtitle: Text(notification.message),
                      );
                    }),
          ),
          actions: [
            TextButton(
                onPressed: () {
                  _markAllAsRead();
                },
                child: Text('Mark all as read')),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  void _toggleSearch() {
    setState(() {
      _showSearch = !_showSearch;
      if (!_showSearch) {
        _searchController.clear();
        _filteredContent.clear();
      } else {
        _filteredContent = _recentSearch
            .map((query) => {'type': 'recent', 'query': query})
            .toList();
      }
      widget.onSearchChanged(_showSearch, _filteredContent);
    });
  }

  Future<void> loadRecentSearch() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _recentSearch = prefs.getStringList('recentSearch') ?? [];
    });
  }

  Future<void> saveRecentSearch(String query) async {
    if (query.isNotEmpty) {
      setState(() {
        _recentSearch.add(query);
        _recentSearch.insert(0, query);
        if (_recentSearch.length > 5) {
          _recentSearch = _recentSearch.sublist(0, 5);
        }
      });
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList('recentSearch', _recentSearch);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AppBar(
          backgroundColor: Colors.transparent,
          automaticallyImplyLeading: false,
          title: _showSearch
              ? TextField(
                  controller: _searchController,
                  style: TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Search Movies and Songs...',
                    hintStyle: Theme.of(context)
                        .textTheme
                        .bodyLarge!
                        .copyWith(color: Colors.white60),
                    border: InputBorder.none,
                  ),
                  onChanged: _filterContent,
                  onSubmitted: _performSearch,
                )
              : Row(
                  //mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    SizedBox(
                      height: 20,
                    ),
                    if (iconData != null)
                      Image.memory(
                        iconData!.imageBytes,
                        height: 60,
                      )
                    else
                      Image.asset('assets/icon/media_jungle.png', height: 30),
                    Spacer(),
                    IconButton(
                        onPressed: () {},
                        icon: Icon(
                          Icons.cast_connected_rounded,
                          color: kWhite,
                          size: 25,
                        )),
                    SizedBox(
                      width: 15,
                    ),
                    GestureDetector(
                      onTap: _showNotification,
                      child: Icon(
                        Icons.notifications_rounded,
                        color: Colors.white,
                        size: 25,
                      ),
                    ),
                    if (unreadCount > 0)
                      Positioned(
                        right: 0,
                        child: Container(
                          padding: EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(5),
                          ),
                          constraints:
                              BoxConstraints(minHeight: 16, minWidth: 16),
                          child: Text(
                            '$unreadCount',
                            style: TextStyle(color: kWhite, fontSize: 12),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                  ],
                ),
          actions: [
            IconButton(
              onPressed: _toggleSearch,
              icon: Icon(
                _showSearch ? Icons.close : Icons.search_rounded,
                color: kWhite,
              ),
            ),
            SizedBox(
              width: 6,
            ),
            IconButton(
                onPressed: () {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (context) => ProfilePage()));
                },
                icon: Icon(
                  Icons.person_outline_rounded,
                  color: kWhite,
                  size: 25,
                )),
            SizedBox(
              width: 10,
            ),
          ],
        ),
        // if (_showSearch && _filteredContent.isNotEmpty)
        //   Expanded(child: _buildSearchResults()),
      ],
    );
  }

  void _filterContent(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredContent = _recentSearch
            .map((query) => {'type': 'recent', 'query': query})
            .toList();
      } else {
        final uniqueMovies = <Movie>{};
        final uniqueSongs = <Music>{};

        uniqueMovies.addAll(_allMovies.where((movie) =>
            movie.moviename.toLowerCase().contains(query.toLowerCase())));
        uniqueSongs.addAll(_music.where((song) =>
            song.songname.toLowerCase().contains(query.toLowerCase())));
        _filteredContent = [
          ...uniqueMovies,
          ...uniqueSongs,
        ];
      }
    });
    widget.onSearchChanged(_showSearch, _filteredContent);
  }

  void _performSearch(String query) {
    _filterContent(query);
    saveRecentSearch(query);
  }

  // Widget _buildSearchResults() {
  //   if (_searchController.text.isEmpty) {
  //     return Container();
  //   }
  //   if (_filteredContent.isEmpty) {
  //     return Center(
  //       child: Text(
  //         'No movies or songs found',
  //         style: TextStyle(color: Colors.white, fontSize: 18),
  //       ),
  //     );
  //   }
  //   return ListView.builder(
  //       itemCount: _filteredContent.length,
  //       itemBuilder: (context, index) {
  //         final item = _filteredContent[index];
  //         // final compressedBytes = base64.decode(item.thumbnail);
  //         // final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);
  //         return ListTile(
  //           title: Text(item is Movie ? item.moviename : item.songname,
  //               style: TextStyle(color: Colors.white)),
  //           subtitle: Text(item is Movie ? 'Movie' : 'Song',
  //               style: TextStyle(color: Colors.white70)),
  //           // leading: ClipRRect(
  //           //   borderRadius: BorderRadius.circular(8),
  //           //   child: Image.memory(
  //           //     Uint8List.fromList(decompressedBytes),
  //           //     width: 35,
  //           //     height: 35,
  //           //     fit: BoxFit.fill,
  //           //   ),
  //           // ),
  //           onTap: () {
  //             if (item is Movie) {
  //               Navigator.push(
  //                 context,
  //                 MaterialPageRoute(
  //                   builder: (context) => VideoPlayerPage(
  //                     movies: _allMovies,
  //                     initialIndex: _allMovies.indexOf(item),
  //                   ),
  //                 ),
  //               );
  //             } else if (item is Music) {
  //               // Navigator.push(
  //               //   context,
  //               //   MaterialPageRoute(
  //               //     builder: (context) => MusicPlayerPage(
  //               //       audio: item,
  //               //       onDislike: (p0) {},
  //               //       audioList: _music,
  //               //       onChange: (newAudio) {
  //               //         Provider.of<AudioProvider>(context, listen: false)
  //               //             .setCurrentlyPlaying(newAudio, _music);
  //               //       },
  //               //     ),
  //               //   ),
  //               // );
  //             }
  //           },
  //         );
  //       });
  // }
}
