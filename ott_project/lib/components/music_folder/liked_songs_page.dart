import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';
import 'package:archive/archive.dart';
import 'package:flutter/material.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/music_folder/audio.dart';
import 'package:ott_project/components/music_folder/music_player_page.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/service/audio_api_service.dart';
import '../../pages/app_icon.dart';

class LikedSongsPage extends StatefulWidget {
  final int userId;
  const LikedSongsPage({
    Key? key,
    required this.userId,
  }) : super(key: key);

  @override
  _LikedSongsPageState createState() => _LikedSongsPageState();
}

class _LikedSongsPageState extends State<LikedSongsPage> {
  List<Audio> _filteredLikedSongs = [];
  //bool _isFetching = false;
  //Future<List<Audio>>? _futureLikedSongs;
  final TextEditingController _searchController = TextEditingController();
  bool isLoading = true;
  //bool _showSearch = false;
  AppIcon? iconData;
  late StreamController<List<Audio>> likedSongsController;
  @override
  void initState() {
    likedSongsController = StreamController<List<Audio>>();
    _fetchLikedSongs();
    _searchController.addListener(() {
      _filterLikedSongs(_searchController.text);
    });
    super.initState();

    //filteredLikedSongs = widget.likedSongs; // Initially display all liked songs
  }

  void _filterLikedSongs(String query) {
    setState(() {
      if (query.isEmpty) {
        _fetchLikedSongs().then((songs) => _filteredLikedSongs = songs);
        Text('No songs found');
      } else {
        _fetchLikedSongs().then((songs) {
          _filteredLikedSongs = songs.where((song) {
            final songName = song.songname.toLowerCase();
            final input = query.toLowerCase();
            return songName.contains(input);
          }).toList();
        });
      }
    });
  }

  Future<List<Audio>> _fetchLikedSongs() async {
    try {
      List<int> likedSongsIds =
          await AudioApiService().getLikedSongs(widget.userId);
      print('Fetched ids: ${likedSongsIds.length}');
      List<Audio> likedSongs = await Future.wait(
          likedSongsIds.map((id) => AudioApiService().getAudioDetails(id)));
      print('Fetched audio: ${likedSongs.length}');
      likedSongsController.add(likedSongs);
      _filteredLikedSongs = likedSongs;
      return _filteredLikedSongs;
    } catch (e) {
      print('Failed to fetch liked songs: $e');
      likedSongsController.addError(e);
      return [];
    }
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
                //CustomAppBar(),
                Expanded(
                  child: StreamBuilder<List<Audio>>(
                      stream: likedSongsController.stream,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return Center(child: CircularProgressIndicator());
                        } else if (snapshot.hasError) {
                          return Center(
                              child: Text('Error: ${snapshot.error}',
                                  style: TextStyle(color: Colors.white)));
                        } else if (!snapshot.hasData ||
                            snapshot.data!.isEmpty) {
                          return Center(
                              child: Text('No audios available',
                                  style: TextStyle(color: Colors.white)));
                        } else {
                          return RefreshIndicator(
                            onRefresh: () async {
                              await Future.delayed(Duration(seconds: 2));
                            },
                            child: ListView.builder(
                                itemCount: snapshot.data!.length,
                                itemBuilder: (context, index) {
                                  Audio song = snapshot.data![index];
                                  final compressedBytes =
                                      base64.decode(song.thumbnail);
                                  final decompressedBytes = ZLibDecoder()
                                      .decodeBytes(compressedBytes);
                                  return ListTile(
                                    leading: Image.memory(
                                      Uint8List.fromList(decompressedBytes),
                                      width: 50,
                                      height: 50,
                                      fit: BoxFit.fill,
                                    ),
                                    title: Text(
                                      song.songname,
                                      style: TextStyle(color: kWhite),
                                    ),
                                    subtitle: Text(song.categoryName),
                                    subtitleTextStyle:
                                        TextStyle(color: Colors.white60),
                                    onTap: () {
                                      Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                              builder: (context) =>
                                                  MusicPlayerPage(
                                                      audio: song,
                                                      audioList:
                                                          _filteredLikedSongs,
                                                      onDislike: (dislikeSong) {
                                                        setState(() {
                                                          _filteredLikedSongs
                                                              .removeWhere(
                                                                  (audio) =>
                                                                      audio
                                                                          .id ==
                                                                      dislikeSong
                                                                          .id);
                                                        });
                                                       
                                                      },
                                                      onChange: (newAudio) {
                                                        _fetchLikedSongs();
                                                      }))).then(
                                          (value) => setState(() {}));
                                    },
                                  );
                                }),
                          );
                        }
                      }),
                ),
                //),
              ],
            ),
          ],
        ));
  }
}
