import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:flutter/material.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/music_folder/music.dart';
import 'package:ott_project/components/music_folder/music_player_page.dart';
import 'package:ott_project/components/music_folder/playlist.dart';
import 'package:ott_project/components/music_folder/song_player_page.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/service/icon_service.dart';

// class PlaylistDetailsPage extends StatefulWidget {
//   final Playlist playlist;

//   const PlaylistDetailsPage({required this.playlist, super.key});

//   @override
//   State<PlaylistDetailsPage> createState() => _PlaylistDetailsPageState();
// }

// class _PlaylistDetailsPageState extends State<PlaylistDetailsPage> {
//   @override
//   void initState() {
//     super.initState();
//     _loadIcon();
//   }

//   bool _showSearch = false;
//   TextEditingController _searchController = TextEditingController();
//   AppIcon? iconData;

//   Future<void> _loadIcon() async {
//     try {
//       final icon = await IconService.fetchIcon();

//       setState(() {
//         iconData = icon;
//       });
//     } catch (e) {
//       print('Error loading icon: $e');
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     // final String base64Image = widget.playlist.audios.first.thumbnail;
//     // final Uint8List thumbnail = base64.decode(base64Image);
//     // final compressedBytes =
//     //     base64.decode(widget.playlist.audios.first.thumbnail);
//     //final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);
//     return Scaffold(
//       backgroundColor: Colors.transparent,
//       body: Stack(
//         children: [
//           BackgroundImage(),
//           Column(
//             children: [
//               AppBar(
//                 automaticallyImplyLeading: false,
//                 backgroundColor: Colors.transparent,
//                 title: _showSearch
//                     ? TextField(
//                         controller: _searchController,
//                         style: TextStyle(color: Colors.white),
//                         decoration: InputDecoration(
//                           hintText: 'Search Songs...',
//                           hintStyle: Theme.of(context)
//                               .textTheme
//                               .bodyLarge!
//                               .copyWith(color: Colors.white60),
//                           border: InputBorder.none,
//                         ),
//                         onChanged: (value) {
//                           // _filterAudioList(value);
//                         },
//                       )
//                     : Row(
//                         //mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//                         children: [
//                           SizedBox(
//                             height: 20,
//                           ),
//                           if (iconData != null)
//                             Image.memory(
//                               iconData!.imageBytes,
//                               height: 60,
//                             )
//                           else
//                             Image.asset('assets/images/bgimg2.jpg', height: 30),
//                           Spacer(),
//                           IconButton(
//                               onPressed: () {},
//                               icon: Icon(
//                                 Icons.cast_connected_rounded,
//                                 color: kWhite,
//                               )),
//                           SizedBox(
//                             width: 10,
//                           ),
//                           IconButton(
//                               onPressed: () {},
//                               //_showNotification,
//                               icon: Icon(
//                                 Icons.notifications,
//                                 color: kWhite,
//                               )),
//                         ],
//                       ),
//                 actions: [
//                   IconButton(
//                       onPressed: () {
//                         setState(() {
//                           _showSearch = !_showSearch;
//                           if (!_showSearch) {
//                             _searchController.clear();
//                             // _filterAudioList('');
//                           }
//                         });
//                       },
//                       icon: Icon(
//                         Icons.search_rounded,
//                         color: kWhite,
//                       )),
//                   SizedBox(
//                     width: 10,
//                   ),
//                   IconButton(
//                       onPressed: () {
//                         Navigator.push(
//                             context,
//                             MaterialPageRoute(
//                                 builder: (context) => ProfilePage()));
//                       },
//                       icon: Icon(
//                         Icons.person_outline_rounded,
//                         color: kWhite,
//                       )),
//                   SizedBox(
//                     width: 10,
//                   ),
//                 ],
//               ),

//               Padding(
//                 padding: const EdgeInsets.all(16.0),
//                 child: Text(
//                   widget.playlist.title,
//                   style: TextStyle(
//                       color: Colors.white,
//                       fontWeight: FontWeight.bold,
//                       fontSize: 18),
//                 ),
//               ),
//               Expanded(
//                 // child: Padding(
//                 //   padding: const EdgeInsets.all(3.0),
//                 child: widget.playlist.audios.isEmpty
//                     ? Center(
//                         child: Text(
//                           'No songs in this playlist',
//                           style: TextStyle(color: Colors.white),
//                         ),
//                       )
//                     : ListView.builder(
//                         itemCount: widget.playlist.audios.length,
//                         itemBuilder: (context, index) {
//                           final audio = widget.playlist.audios[index];
//                           final compressedBytes =
//                               base64.decode(audio.thumbnail);
//                           final decompressedBytes =
//                               ZLibDecoder().decodeBytes(compressedBytes);
//                           return SizedBox(
//                             // child: Container(
//                             //   margin: EdgeInsets.symmetric(
//                             //     vertical: 5,
//                             //   ),
//                             //   decoration: BoxDecoration(
//                             //     color: Colors.white30.withOpacity(0.1),
//                             //     borderRadius: BorderRadius.circular(5),
//                             //   ),
//                             // padding: EdgeInsets.only(
//                             //     top: 50, right: 20, left: 20),
//                             child: ListTile(
//                               leading: ClipRRect(
//                                 child: Image.memory(
//                                   Uint8List.fromList(decompressedBytes),
//                                   fit: BoxFit.fill,
//                                   height: 50,
//                                   width: 50,
//                                 ),
//                               ),
//                               title: Text(
//                                 audio.songname,
//                                 style: TextStyle(color: Colors.white),
//                               ),
//                               subtitle: Text(
//                                 audio.categoryName,
//                                 style: TextStyle(color: Colors.white70),
//                               ),
//                               onTap: () {
//                                 Navigator.push(
//                                     context,
//                                     MaterialPageRoute(
//                                         builder: (context) => MusicPlayerPage(
//                                             audio: audio,
//                                             audioList: widget.playlist.audios,
//                                             onDislike: (p0) {},
//                                             onChange: (newAudio) {
//                                               setState(() {
//                                                 int index = widget
//                                                     .playlist.audios
//                                                     .indexWhere((a) =>
//                                                         a.id == newAudio.id);
//                                                 if (index != -1) {
//                                                   widget.playlist
//                                                       .audios[index] = newAudio;
//                                                 }
//                                               });
//                                             })));
//                               },
//                             ),
//                             // ),
//                           );
//                         },
//                       ),
//                 // ),
//               ),
//             ],
//           ),
//         ],
//       ),
//     );
//   }
// }
class PlaylistDetailsPage extends StatefulWidget {
  final MusicPlaylist playlist;

  const PlaylistDetailsPage({required this.playlist, super.key});

  @override
  State<PlaylistDetailsPage> createState() => _PlaylistDetailsPageState();
}

class _PlaylistDetailsPageState extends State<PlaylistDetailsPage> {
  @override
  void initState() {
    super.initState();
    _loadIcon();
  }

  bool _showSearch = false;
  TextEditingController _searchController = TextEditingController();
  AppIcon? iconData;

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

  @override
  Widget build(BuildContext context) {
    // final String base64Image = widget.playlist.audios.first.thumbnail;
    // final Uint8List thumbnail = base64.decode(base64Image);
    // final compressedBytes =
    //     base64.decode(widget.playlist.audios.first.thumbnail);
    //final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);
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
                          // _filterAudioList(value);
                        },
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
                  widget.playlist.title,
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 18),
                ),
              ),
              Expanded(
                // child: Padding(
                //   padding: const EdgeInsets.all(3.0),
                child: widget.playlist.music.isEmpty
                    ? Center(
                        child: Text(
                          'No songs in this playlist',
                          style: TextStyle(color: Colors.white),
                        ),
                      )
                    : ListView.builder(
                        itemCount: widget.playlist.music.length,
                        itemBuilder: (context, index) {
                          final audio = widget.playlist.music[index];
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
                                child: FutureBuilder<Uint8List?>(
                                  future: audio.bannerImage,
                                  //audio.bannerImage,

                                  builder: (context, snapshot) {
                                    if (snapshot.connectionState ==
                                            ConnectionState.done &&
                                        snapshot.hasData) {
                                      return Image.memory(snapshot.data!,
                                          width: 50,
                                          height: 50,
                                          fit: BoxFit.fill);
                                    } else {
                                      return Container(
                                        width: 164,
                                        height: 155,
                                        // fit: BoxFit.fill
                                        color: Colors.grey,
                                        child: Center(
                                            child: CircularProgressIndicator()),
                                      );
                                    }
                                  },
                                ),
                              ),
                              title: Text(
                                audio.songname,
                                style: TextStyle(color: Colors.white),
                              ),
                              // subtitle: Text(
                              //   audio.categoryName,
                              //   style: TextStyle(color: Colors.white70),
                              // ),
                              onTap: () {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) => SongPlayerPage(
                                            music: audio,
                                            onChange: (newAudio) {
                                              setState(() {
                                                int index = widget
                                                    .playlist.music
                                                    .indexWhere((a) => a.id == newAudio.id);
                                                    if(index != -1){
                                                      widget.playlist.music[index] = newAudio;
                                                    }
                                              });
                                            },
                                            onDislike: (p0) {})
                                        //  MusicPlayerPage(
                                        //     audio: audio,
                                        //     audioList: widget.playlist.audios,
                                        //     onDislike: (p0) {},
                                        //     onChange: (newAudio) {
                                        //       setState(() {
                                        //         int index = widget
                                        //             .playlist.audios
                                        //             .indexWhere((a) =>
                                        //                 a.id == newAudio.id);
                                        //         if (index != -1) {
                                        //           widget.playlist
                                        //               .audios[index] = newAudio;
                                        //         }
                                        //       });
                                        //     })
                                        ));
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
