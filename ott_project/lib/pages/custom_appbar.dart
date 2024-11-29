
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:ott_project/components/music_folder/audio_container.dart';
import 'package:ott_project/components/notification/notification.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/components/video_folder/video_container.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:ott_project/pages/main_tab.dart';
import 'package:ott_project/pages/movie_page.dart';
import 'package:ott_project/service/audio_service.dart';
import 'package:ott_project/service/movie_service_page.dart';
import 'package:ott_project/service/notification_api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
// import '../components/music_folder/audio.dart';
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
  List<AudioContainer> _audio = [];
  List<VideoContainer> _video = [];
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
    _loadVideoAndAudioContainers();
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

  // Future<void> _loadMovieandMusic() async {
  //   _allMovies = await MovieService.fetchMovies();
  //   _music = await AudioService.fetchMusic();
  // }
  Future<void> _loadVideoAndAudioContainers() async {
    _video = await MovieService.fetchVideoContainer();
    _audio = await AudioService.fetchAudioContainer();
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

   Future<void> saveRecentSearch(String query,String type,String title) async {
    final prefs = await SharedPreferences.getInstance();
    final recentSearch = {'query':query,'type':type,'title':title};
    final recentSearchJson = jsonEncode(recentSearch);
      setState(() {
       
        _recentSearch.insert(0, recentSearchJson);
        if (_recentSearch.length > 5) {
          _recentSearch = _recentSearch.sublist(0, 5);
        }
      });
     
      await prefs.setStringList('recentSearch', _recentSearch);
  }

  Future<void> loadRecentSearch() async {
    final prefs = await SharedPreferences.getInstance();
    final savedSearches = prefs.getStringList('recentSearch') ?? [];
    setState(() {
      _recentSearch = savedSearches.map((search){
        return jsonDecode(search) as Map<String,dynamic>;
      }).cast<String>().toList();
    });
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
                  children: [
                    SizedBox(
                      height: MediaQuery.sizeOf(context).height * 0.04,
                    ),
                    if (iconData != null)
                      IconButton(onPressed: (){
                        Navigator.pushAndRemoveUntil(
              context, MaterialPageRoute(builder: (context) => const MainTab(initialTab: 0,)),(route)=> false);
                      }, 
                      icon: Image.memory(
                        iconData!.imageBytes,
                        height: 70,
                      ))
                    else
                      Image.asset('assets/icon/media_jungle.png', height: 70),
                    Spacer(),
                    IconButton(
                        onPressed: () {},
                        icon: Icon(
                          Icons.cast_connected_rounded,
                          color: kWhite,
                          size: 25,
                        )),
                    SizedBox(
                      width: MediaQuery.sizeOf(context).width * 0.05,
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
              width: MediaQuery.sizeOf(context).width * 0.01,
            ),
         
            SizedBox(
              width: MediaQuery.sizeOf(context).width * 0.02,
            ),
          ],
        ),

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
        final uniqueVideos = <VideoDescription>{};
        final uniqueAudios = <AudioDescription>{};

        // Search through video titles
        for (var container in _video) {
          for (var video in container.videoDescriptions) {
            // Assuming 'videos' is a List<VideoDescription>
            if (video.videoTitle.toLowerCase().contains(query.toLowerCase())) {
              uniqueVideos.add(video);
            }
          }
        }

        // Search through audio titles
        for (var container in _audio) {
          for (var audio in container.audiolist) {
            // Assuming 'audios' is a List<AudioDescription>
            if (audio.audioTitle.toLowerCase().contains(query.toLowerCase())) {
              uniqueAudios.add(audio);
            }
          }
        }
        _filteredContent = [
          ...uniqueVideos,
          ...uniqueAudios,
        ];
      }
    });
    widget.onSearchChanged(_showSearch, _filteredContent);
  }

  void _performSearch(String query) {
    _filterContent(query);
    //saveRecentSearch(query);
  }


}
