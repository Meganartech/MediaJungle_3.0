import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/library/playlistDTO.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/service/icon_service.dart';
import 'package:ott_project/service/playlist_service.dart';
import '../music_folder/song_player_page.dart';
import 'audio_playlist.dart';


class PlaylistDetailsPage extends StatefulWidget {
 final AudioPlaylist playlist;
  final int playlistId;

  const PlaylistDetailsPage({required this.playlistId,required this.playlist,super.key});

  @override
  State<PlaylistDetailsPage> createState() => _PlaylistDetailsPageState();
}

class _PlaylistDetailsPageState extends State<PlaylistDetailsPage> {
  @override
  void initState() {
    super.initState();
    _loadIcon();
    _loadPlaylistDetails();
  }

  bool _showSearch = false;
  TextEditingController _searchController = TextEditingController();
  AppIcon? iconData;
  PlaylistDTO? _playlist;
  bool _isLoading = true;
  String? _error;

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

  Future<void> _loadPlaylistDetails() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      }); 

      final List<PlaylistDTO> playlistData = await PlaylistService().getPlaylistWithAudioDetails(widget.playlistId);
      
      // Assuming the first item is our playlist since we queried by ID
      if (playlistData.isNotEmpty) {
        setState(() {
          _playlist = playlistData.first;
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = 'Playlist not found';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to load playlist: ${e.toString()}';
        _isLoading = false;
      });
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
              AppBar(
                automaticallyImplyLeading: false,
                backgroundColor: Colors.transparent,
                title: _showSearch
                    ? TextField(
                        controller: _searchController,
                        style: TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Search Songs...',
                          hintStyle: Theme.of(context)
                              .textTheme
                              .bodyLarge!
                              .copyWith(color: Colors.white60),
                          border: InputBorder.none,
                        ),
                        onChanged: (value) {

                        },
                      )
                    : Row(                        
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
                            Image.asset('assets/images/bgimg2.jpg', height: 30),
                          Spacer(),
                          IconButton(
                              onPressed: () {},
                              icon: Icon(
                                Icons.cast_connected_rounded,
                                color: kWhite,
                              )),
                          SizedBox(
                            width: 10,
                          ),
                          IconButton(
                              onPressed: () {},
                              //_showNotification,
                              icon: Icon(
                                Icons.notifications,
                                color: kWhite,
                              )),
                        ],
                      ),
                actions: [   
                  IconButton(
                      onPressed: () {
                        setState(() {
                          _showSearch = !_showSearch;
                          if (!_showSearch) {
                            _searchController.clear();
                            // _filterAudioList('');
                          }
                        });
                      },
                      icon: Icon(
                        Icons.search_rounded,
                        color: kWhite,
                      )),
                  SizedBox(
                    width: 10,
                  ),
                  IconButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => ProfilePage()));
                      },
                      icon: Icon(
                        Icons.person_outline_rounded,
                        color: kWhite,
                      )),
                  SizedBox(
                    width: 10,
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  _playlist?.title ?? 'Untitled Playlist',
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 18),
                ),
              ),
              Expanded(
                // child: Padding(
                //   padding: const EdgeInsets.all(3.0),
                child: _playlist!.audioDetails.isEmpty 
                                     ?  Text(
                          'No songs in this playlist',
                          style: TextStyle(color: Colors.white),
                        )
                      
                    : ListView.builder(
                        itemCount: _playlist!.audioDetails.length,
                        itemBuilder: (context, index) {
                          final audio = _playlist!.audioDetails[index];
                          print('Audio in playlists:${audio}');
                          // final compressedBytes =
                          //     base64.decode(audio.thumbnail);
                          // final decompressedBytes =
                          //     ZLibDecoder().decodeBytes(compressedBytes);
                          return SizedBox(
                            // child: Container(
                            //   margin: EdgeInsets.symmetric(
                            //     vertical: 5,
                            //   ),
                            //   decoration: BoxDecoration(
                            //     color: Colors.white30.withOpacity(0.1),
                            //     borderRadius: BorderRadius.circular(5),
                            //   ),
                            // padding: EdgeInsets.only(
                            //     top: 50, right: 20, left: 20),
                            child: ListTile(
                              leading: ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Image.asset('assets/icon/media_jungle.png')
                                // child: FutureBuilder<Uint8List?>(
                                //   //future: audio.thumbnailImage,
                                //   future:
                                //   //audio.bannerImage,

                                //   builder: (context, snapshot) {
                                //     if (snapshot.connectionState ==
                                //             ConnectionState.done &&
                                //         snapshot.hasData) {
                                //       return Image.memory(snapshot.data!,
                                //           width: 50,
                                //           height: 50,
                                //           fit: BoxFit.fill);
                                //     } else {
                                //       return Container(
                                //         width: 164,
                                //         height: 155,
                                //         // fit: BoxFit.fill
                                //         color: Colors.grey,
                                //         child: Center(
                                //             child: CircularProgressIndicator()),
                                //       );
                                //     }
                                //   },
                                // ),
                              ),
                              title: Text( 
                                audio.audioTitle,
                                style: TextStyle(color: Colors.white),
                              ),
                              
                              onTap: () {
                                // Navigator.push(
                                //     context,
                                //     MaterialPageRoute(
                                //         builder: (context) => SongPlayerPage(
                                //             music: widget.playlist.audios,
                                //             onChange: (newAudio) {
                                //               setState(() {
                                //                 int index = widget
                                //                     .playlist.audios
                                //                     .indexWhere((a) => a.id == newAudio.id);
                                //                     if(index != -1){
                                //                       widget.playlist.audios[index] = newAudio;
                                //                     }
                                //               });
                                //             },
                                //             onDislike: (p0) {})
                                //     ));
                              },
                            ),
                            // ),
                          );
                        },
                      ),
                // ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
