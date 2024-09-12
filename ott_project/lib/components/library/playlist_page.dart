import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/library/playlist_detail.dart';
import 'package:ott_project/components/music_folder/audio_provider.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:provider/provider.dart';

import '../../service/icon_service.dart';

// class PlayListPage extends StatefulWidget {
//   const PlayListPage({super.key});

//   @override
//   State<PlayListPage> createState() => _PlayListPageState();
// }

// class _PlayListPageState extends State<PlayListPage> {
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
//     return Consumer<AudioProvider>(builder: (context, audioProvider, child) {
//       final playlists = audioProvider.playlists;

//       return Scaffold(
//         backgroundColor: Colors.transparent,
//         body: Stack(
//           children: [
//             BackgroundImage(),
//             Column(
//               children: [
//                 AppBar(
//                   automaticallyImplyLeading: false,
//                   backgroundColor: Colors.transparent,
//                   title: _showSearch
//                       ? TextField(
//                           controller: _searchController,
//                           style: TextStyle(color: Colors.white),
//                           decoration: InputDecoration(
//                             hintText: 'Search Playlists...',
//                             hintStyle: Theme.of(context)
//                                 .textTheme
//                                 .bodyLarge!
//                                 .copyWith(color: Colors.white60),
//                             border: InputBorder.none,
//                           ),
//                           onChanged: (value) {
//                             // _filterAudioList(value);
//                           },
//                         )
//                       : Row(
//                           //mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//                           children: [
//                             SizedBox(
//                               height: 20,
//                             ),
//                             if (iconData != null)
//                               Image.memory(
//                                 iconData!.imageBytes,
//                                 height: 60,
//                               )
//                             else
//                               Image.asset('assets/images/bgimg2.jpg',
//                                   height: 30),
//                             Spacer(),
//                             IconButton(
//                                 onPressed: () {},
//                                 icon: Icon(
//                                   Icons.cast_connected_rounded,
//                                   color: kWhite,
//                                 )),
//                             SizedBox(
//                               width: 10,
//                             ),
//                             IconButton(
//                                 onPressed: _showNotification,
//                                 icon: Icon(
//                                   Icons.notifications,
//                                   color: kWhite,
//                                 )),
//                           ],
//                         ),
//                   actions: [
//                     IconButton(
//                         onPressed: () {
//                           setState(() {
//                             _showSearch = !_showSearch;
//                             if (!_showSearch) {
//                               _searchController.clear();
//                               // _filterAudioList('');
//                             }
//                           });
//                         },
//                         icon: Icon(
//                           Icons.search_rounded,
//                           color: kWhite,
//                         )),
//                     SizedBox(
//                       width: 10,
//                     ),
//                     IconButton(
//                         onPressed: () {
//                           Navigator.push(
//                               context,
//                               MaterialPageRoute(
//                                   builder: (context) => ProfilePage()));
//                         },
//                         icon: Icon(
//                           Icons.person_outline_rounded,
//                           color: kWhite,
//                         )),
//                     SizedBox(
//                       width: 10,
//                     ),
//                   ],
//                 ),
//                 SizedBox(
//                   height: 20,
//                 ),
//                 Container(
//                   margin: EdgeInsets.only(right: 25, top: 10, left: 10),
//                   alignment: Alignment.topLeft,
//                   // child: Padding(
//                   //     padding: EdgeInsets.only(right: 50),
//                   child: Row(
//                     mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                     children: [
//                       Text(
//                         'Playlists',
//                         style: TextStyle(
//                             fontSize: 20,
//                             fontWeight: FontWeight.bold,
//                             color: Colors.white,
//                             decoration: TextDecoration.underline,
//                             decorationColor: Colors.white,
//                             decorationStyle: TextDecorationStyle.solid),
//                       ),
//                       IconButton(
//                           onPressed: () => _showCreatePlaylistDialog(context),
//                           icon: Icon(
//                             Icons.add_rounded,
//                             color: Colors.white,
//                             size: 25,
//                           ))
//                     ],
//                   ),
//                   //),
//                 ),
//                 Expanded(
//                   child: Container(
//                     margin: EdgeInsets.symmetric(vertical: 2, horizontal: 10),
//                     child: playlists.isEmpty
//                         ? Center(
//                             child: Text(
//                               'No plalists available',
//                               style: TextStyle(color: kWhite),
//                             ),
//                           )
//                         : ListView.builder(
//                             // gridDelegate:
//                             //     SliverGridDelegateWithFixedCrossAxisCount(
//                             //         crossAxisCount: 2,
//                             //         childAspectRatio: 0.75,
//                             //         crossAxisSpacing: 16,
//                             //         mainAxisSpacing: 16),
//                             itemCount: playlists.length,
//                             itemBuilder: (context, index) {
//                               final playlist = playlists[index];
//                               final playlistImage = playlist.getPlaylistImage();

//                               // return AspectRatio(
//                               //   aspectRatio: 0.75,
//                               //   child:
//                               return GestureDetector(
//                                 onTap: () {
//                                   Navigator.push(
//                                       context,
//                                       MaterialPageRoute(
//                                           builder: (context) =>
//                                               PlaylistDetailsPage(
//                                                   playlist: playlist)));
//                                 },
//                                 child: Container(
//                                   margin: EdgeInsets.all(16),
//                                   decoration: BoxDecoration(
//                                     color: Colors.transparent,
//                                     borderRadius: BorderRadius.circular(12),
//                                     boxShadow: [
//                                       BoxShadow(
//                                         color: Colors.transparent,
//                                         spreadRadius: 2,
//                                         blurRadius: 5,
//                                         offset: Offset(0, 3),
//                                       ),
//                                     ],
//                                   ),
//                                   child: Row(
//                                     crossAxisAlignment:
//                                         CrossAxisAlignment.center,
//                                     children: [
//                                       // Expanded(
//                                       SafeArea(
//                                         child: ClipRRect(
//                                             // borderRadius: BorderRadius.vertical(
//                                             //     top: Radius.circular(12.0),
//                                             //     bottom: Radius.circular(12.0)),
//                                             child: Container(
//                                           width: 75,
//                                           height: 75,
//                                           child: playlistImage != null
//                                               ? Image.memory(
//                                                   playlistImage,
//                                                   fit: BoxFit.fill,
//                                                 )
//                                               : Icon(
//                                                   Icons.music_note_rounded,
//                                                   color: Colors.white,
//                                                   size: 50,
//                                                 ),
//                                         )),
//                                       ),
//                                       // ),
//                                       //),
//                                       // Expanded(
//                                       //   child: imageCount == 1
//                                       //       ? SafeArea(
//                                       //           child: ClipRRect(
//                                       //           //borderRadius:
//                                       //           // BorderRadius.vertical(
//                                       //           //     top:
//                                       //           //         Radius.circular(12.0),
//                                       //           //     bottom: Radius.circular(
//                                       //           //         12.0)),
//                                       //           child: Image.memory(
//                                       //               playlistImage[0]!),
//                                       //         )):
//                                       // GridView.builder(
//                                       //     padding: EdgeInsets.zero,
//                                       //     shrinkWrap: true,
//                                       //     itemCount: 4,
//                                       //     gridDelegate:
//                                       //         SliverGridDelegateWithFixedCrossAxisCount(
//                                       //       crossAxisCount: 2,
//                                       //       childAspectRatio: 1.0,
//                                       //       mainAxisSpacing: 2.0,
//                                       //       crossAxisSpacing: 2.0,
//                                       //     ),
//                                       //     itemBuilder: (context, index) {
//                                       //     }
//                                       //     ),
//                                       // if (index < playlistImage.length &&
//                                       //     playlistImage[index] != null) {
//                                       //   return Container(
//                                       //     decoration: BoxDecoration(
//                                       //       borderRadius:
//                                       //           BorderRadius.circular(12),
//                                       //       color: Colors.transparent,
//                                       //     ),
//                                       //     child: ClipRRect(
//                                       //         // borderRadius:
//                                       //         //     BorderRadius.circular(
//                                       //         //         12),
//                                       //         child: Image.memory(
//                                       //       playlistImage[index]!,
//                                       //       fit: BoxFit.fill,
//                                       //     )),
//                                       //   );
//                                       // } else { return
//                                       // Container(
//                                       //   decoration: BoxDecoration(
//                                       //     // borderRadius:
//                                       //     //     BorderRadius.circular(
//                                       //     //         12),
//                                       //     color: Colors.transparent,
//                                       //   ),
//                                       //   child: ClipRRect(
//                                       //       child: Container()),
//                                       // );
//                                       //}
//                                       // : Icon(
//                                       //     Icons
//                                       //         .music_note_rounded,
//                                       //     color: Colors.white,
//                                       //   ),
//                                       // );
//                                       //},

//                                       //),
//                                       //),
//                                       SizedBox(
//                                         width: 20,
//                                       ),
//                                       Text(
//                                         playlist.title,
//                                         style: TextStyle(
//                                             color: kWhite,
//                                             fontSize: 20,
//                                             fontWeight: FontWeight.bold),
//                                       )
//                                     ],
//                                   ),
//                                 ),
//                               );
//                               //);
//                             }),
//                   ),
//                 ),
//               ],
//             ),
//           ],
//         ),
//       );
//     });
//   }

//   void _showNotification() {
//     showDialog(
//       context: context,
//       builder: (context) {
//         return AlertDialog(
//           title: const Text('Notification'),
//           content: const Text('New song dropped! Check it out now!'),
//           actions: [
//             TextButton(
//               onPressed: () {
//                 Navigator.of(context).pop();
//               },
//               child: const Text('OK'),
//             ),
//           ],
//         );
//       },
//     );
//   }

//   void _showCreatePlaylistDialog(BuildContext context) {
//     final TextEditingController titleController = TextEditingController();
//     final TextEditingController descriptionController = TextEditingController();
//     showDialog(
//       context: context,
//       builder: (BuildContext context) {
//         return BackdropFilter(
//           filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
//           child: AlertDialog(
//             backgroundColor: Color.fromARGB(119, 68, 66, 66),
//             title: Text('New playlist', style: TextStyle(color: Colors.white)),
//             content: SingleChildScrollView(
//               child: Column(
//                 mainAxisSize: MainAxisSize.min,
//                 children: [
//                   TextField(
//                     controller: titleController,
//                     decoration: InputDecoration(
//                       hintText: 'Title',
//                       hintStyle: TextStyle(color: Colors.white60),
//                       enabledBorder: UnderlineInputBorder(
//                         borderSide: BorderSide(color: Colors.white60),
//                       ),
//                       focusedBorder: UnderlineInputBorder(
//                         borderSide: BorderSide(color: Colors.white),
//                       ),
//                     ),
//                     style: TextStyle(color: Colors.white),
//                   ),
//                   SizedBox(height: 10),
//                   TextField(
//                     controller: descriptionController,
//                     decoration: InputDecoration(
//                       hintText: 'Description',
//                       hintStyle: TextStyle(color: Colors.white60),
//                       enabledBorder: UnderlineInputBorder(
//                         borderSide: BorderSide(color: Colors.white60),
//                       ),
//                       focusedBorder: UnderlineInputBorder(
//                         borderSide: BorderSide(color: Colors.white),
//                       ),
//                     ),
//                     style: TextStyle(color: Colors.white),
//                   ),
//                 ],
//               ),
//             ),
//             actions: [
//               TextButton(
//                 onPressed: () => Navigator.pop(context),
//                 child: Text('Cancel', style: TextStyle(color: Colors.white)),
//               ),
//               TextButton(
//                 onPressed: () {
//                   final title = titleController.text;
//                   final description = descriptionController.text;
//                   if (title.isNotEmpty) {
//                     final audioProvider =
//                         Provider.of<AudioProvider>(context, listen: false);
//                     audioProvider.createPlaylist(title, description);
//                     Navigator.pop(context);
//                     ScaffoldMessenger.of(context).showSnackBar(
//                       SnackBar(content: Text('Playlist "$title" created')),
//                     );
//                   }
//                 },
//                 child: Text('Create', style: TextStyle(color: Colors.white)),
//               ),
//             ],
//           ),
//         );
//       },
//     );
//   }
// }
class PlayListPage extends StatefulWidget {
  const PlayListPage({super.key});

  @override
  State<PlayListPage> createState() => _PlayListPageState();
}

class _PlayListPageState extends State<PlayListPage> {
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
    return Consumer<AudioProvider>(builder: (context, audioProvider, child) {
      final playlists = audioProvider.mplaylists;

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
                            hintText: 'Search Playlists...',
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
                              Image.asset('assets/images/bgimg2.jpg',
                                  height: 30),
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
                                onPressed: _showNotification,
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
                SizedBox(
                  height: 20,
                ),
                Container(
                  margin: EdgeInsets.only(right: 25, top: 10, left: 10),
                  alignment: Alignment.topLeft,
                  // child: Padding(
                  //     padding: EdgeInsets.only(right: 50),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Playlists',
                        style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            decoration: TextDecoration.underline,
                            decorationColor: Colors.white,
                            decorationStyle: TextDecorationStyle.solid),
                      ),
                      IconButton(
                          onPressed: () => _showCreatePlaylistDialog(context),
                          icon: Icon(
                            Icons.add_rounded,
                            color: Colors.white,
                            size: 25,
                          ))
                    ],
                  ),
                  //),
                ),
                Expanded(
                  child: Container(
                    margin: EdgeInsets.symmetric(vertical: 2, horizontal: 10),
                    child: playlists.isEmpty
                        ? Center(
                            child: Text(
                              'No playlists available',
                              style: TextStyle(color: kWhite),
                            ),
                          )
                        : ListView.builder(
                            // gridDelegate:
                            //     SliverGridDelegateWithFixedCrossAxisCount(
                            //         crossAxisCount: 2,
                            //         childAspectRatio: 0.75,
                            //         crossAxisSpacing: 16,
                            //         mainAxisSpacing: 16),
                            itemCount: playlists.length,
                            itemBuilder: (context, index) {
                              final playlist = playlists[index];
                              final playlistImage =
                                  playlist.music.first.bannerImage;
                              // final playlistImage =
                              //     playlist.getPlaylistImage();
                              // print(playlistImage);
                              // return AspectRatio(
                              //   aspectRatio: 0.75,
                              //   child:
                              return GestureDetector(
                                onTap: () {
                                  Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                          builder: (context) =>
                                              PlaylistDetailsPage(
                                                  playlist: playlist)));
                                },
                                child: Container(
                                  margin: EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: Colors.transparent,
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.transparent,
                                        spreadRadius: 2,
                                        blurRadius: 5,
                                        offset: Offset(0, 3),
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      SafeArea(
                                        child: ClipRRect(
                                            borderRadius: BorderRadius.vertical(
                                                top: Radius.circular(12.0),
                                                bottom: Radius.circular(12.0)),
                                            child: Container(
                                              width: 75,
                                              height: 75,
                                              child: playlistImage != null
                                                  ? FutureBuilder<Uint8List?>(
                                                      future: playlistImage,
                                                      //audio.bannerImage,
                                                      builder:
                                                          (context, snapshot) {
                                                        if (snapshot.connectionState ==
                                                                ConnectionState
                                                                    .done &&
                                                            snapshot.hasData) {
                                                          return Image.memory(
                                                              snapshot.data!,
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
                                                                child:
                                                                    CircularProgressIndicator()),
                                                          );
                                                        }
                                                      },
                                                    )
                                                  : Icon(
                                                      Icons.music_note_rounded,
                                                      color: Colors.white,
                                                      size: 50,
                                                    ),
                                            )),
                                      ),
                                      // Expanded(
                                      // SafeArea(
                                      //   child: ClipRRect(
                                      //       // borderRadius: BorderRadius.vertical(
                                      //       //     top: Radius.circular(12.0),
                                      //       //     bottom: Radius.circular(12.0)),
                                      //       child: Container(
                                      //     width: 75,
                                      //     height: 75,
                                      //     child: playlistImage != null
                                      //         ? Image.memory(
                                      //             playlistImage,
                                      //             fit: BoxFit.fill,
                                      //           )
                                      //         : Icon(
                                      //             Icons.music_note_rounded,
                                      //             color: Colors.white,
                                      //             size: 50,
                                      //           ),
                                      //   )),
                                      // ),
                                      // ),
                                      //),
                                      // Expanded(
                                      //   child: imageCount == 1
                                      //       ? SafeArea(
                                      //           child: ClipRRect(
                                      //           //borderRadius:
                                      //           // BorderRadius.vertical(
                                      //           //     top:
                                      //           //         Radius.circular(12.0),
                                      //           //     bottom: Radius.circular(
                                      //           //         12.0)),
                                      //           child: Image.memory(
                                      //               playlistImage[0]!),
                                      //         )):
                                      // GridView.builder(
                                      //     padding: EdgeInsets.zero,
                                      //     shrinkWrap: true,
                                      //     itemCount: 4,
                                      //     gridDelegate:
                                      //         SliverGridDelegateWithFixedCrossAxisCount(
                                      //       crossAxisCount: 2,
                                      //       childAspectRatio: 1.0,
                                      //       mainAxisSpacing: 2.0,
                                      //       crossAxisSpacing: 2.0,
                                      //     ),
                                      //     itemBuilder: (context, index) {
                                      //     }
                                      //     ),
                                      // if (index < playlistImage.length &&
                                      //     playlistImage[index] != null) {
                                      //   return Container(
                                      //     decoration: BoxDecoration(
                                      //       borderRadius:
                                      //           BorderRadius.circular(12),
                                      //       color: Colors.transparent,
                                      //     ),
                                      //     child: ClipRRect(
                                      //         // borderRadius:
                                      //         //     BorderRadius.circular(
                                      //         //         12),
                                      //         child: Image.memory(
                                      //       playlistImage[index]!,
                                      //       fit: BoxFit.fill,
                                      //     )),
                                      //   );
                                      // } else { return
                                      // Container(
                                      //   decoration: BoxDecoration(
                                      //     // borderRadius:
                                      //     //     BorderRadius.circular(
                                      //     //         12),
                                      //     color: Colors.transparent,
                                      //   ),
                                      //   child: ClipRRect(
                                      //       child: Container()),
                                      // );
                                      //}
                                      // : Icon(
                                      //     Icons
                                      //         .music_note_rounded,
                                      //     color: Colors.white,
                                      //   ),
                                      // );
                                      //},

                                      //),
                                      //),
                                      SizedBox(
                                        width: 20,
                                      ),
                                      Text(
                                        playlist.title,
                                        style: TextStyle(
                                            color: kWhite,
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold),
                                      )
                                    ],
                                  ),
                                ),
                              );
                              //);
                            }),
                  ),
                ),
              ],
            ),
          ],
        ),
      );
    });
  }

  void _showNotification() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Notification'),
          content: const Text('New song dropped! Check it out now!'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void _showCreatePlaylistDialog(BuildContext context) {
    final TextEditingController titleController = TextEditingController();
    final TextEditingController descriptionController = TextEditingController();
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
          child: AlertDialog(
            backgroundColor: Color.fromARGB(119, 68, 66, 66),
            title: Text('New playlist', style: TextStyle(color: Colors.white)),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: titleController,
                    decoration: InputDecoration(
                      hintText: 'Title',
                      hintStyle: TextStyle(color: Colors.white60),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white60),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                    ),
                    style: TextStyle(color: Colors.white),
                  ),
                  SizedBox(height: 10),
                  TextField(
                    controller: descriptionController,
                    decoration: InputDecoration(
                      hintText: 'Description',
                      hintStyle: TextStyle(color: Colors.white60),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white60),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                    ),
                    style: TextStyle(color: Colors.white),
                  ),
                ],
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('Cancel', style: TextStyle(color: Colors.white)),
              ),
              TextButton(
                onPressed: () {
                  final title = titleController.text;
                  final description = descriptionController.text;
                  if (title.isNotEmpty) {
                    final audioProvider =
                        Provider.of<AudioProvider>(context, listen: false);
                    audioProvider.createPlaylist(title, description);
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Playlist "$title" created')),
                    );
                  }
                },
                child: Text('Create', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        );
      },
    );
  }
}
