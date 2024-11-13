import 'dart:typed_data';
import 'dart:ui';
import 'package:ott_project/components/music_folder/audio_container.dart';
import 'package:ott_project/service/playlist_service.dart';
import 'package:ott_project/service/service.dart';
import 'package:flutter/material.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/library/audio_playlist.dart';
import 'package:ott_project/components/library/playlist_detail.dart';
import 'package:ott_project/components/music_folder/audio_provider.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/profile/profile_page.dart';

import 'package:provider/provider.dart';

import '../../service/icon_service.dart';

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
    _playList = Future.value([]);
    _fetchPlaylists();
    CircularProgressIndicator();
  }

  bool _showSearch = false;
  TextEditingController _searchController = TextEditingController();
  AppIcon? iconData;
  late Future<List<AudioPlaylist>> _playList;
   final GlobalKey _menuKey = GlobalKey();
 

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

  Future<void> _fetchPlaylists() async{
   try{
      final userId =await Service().getLoggedInUserId();
      print('UserId: ${userId}');
      if(userId != null){
      final playlists = await PlaylistService().getPlaylistsByUserId(userId);
      setState(() {
        _playList = Future.value(playlists);
      });
      }
   }catch(e){
    print('Error fetching playlists: $e');
   }    
  }

  void _showMenu(BuildContext context,int playlistId) {
    final RenderBox button = context.findRenderObject() as RenderBox;
    final RenderBox overlay = Overlay.of(context).context.findRenderObject() as RenderBox;

    final RelativeRect position = RelativeRect.fromRect(
      Rect.fromPoints(
        button.localToGlobal(Offset.zero, ancestor: overlay),
        button.localToGlobal(button.size.center(Offset.zero), ancestor: overlay),
      ),
      Offset.zero & overlay.size,
    );

    showMenu(
      context: context,
      position: position,
      items: [
        PopupMenuItem(
          value: 'edit',
          child: 
              Text('Edit'),
            
          
        ),
        PopupMenuItem(
          value: 'delete',
          child:
              Text('Delete'),
            
        ),
      ],
    ).then((value) async{
      if (value == 'edit') {
        print('Edit selected');
      } else if (value == 'delete') {
        print('Delete selected');
        //final playlist = PlaylistService().getPlaylistById(playlistId);
        String result =await  PlaylistService().deletePlaylist(playlistId);
        print(result);
        ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(content: Text(result)),
);
  setState(() {
    _playList = _playList.then((list){
      list.removeWhere((playlist)=> playlist.id == playlistId);
      return list;
    });
  });
      }
    });
  } 

  @override
  Widget build(BuildContext context) {
    return Consumer<AudioProvider>(builder: (context, audioProvider, child) {
      
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
                          onPressed: () async{
                            final currentAudioId = audioProvider.audioDescriptioncurrently?.id;
                            if(currentAudioId != null){
                              _showCreatePlaylistDialog(context,audioId: currentAudioId);
                             
                            }else{
                              _showCreatePlaylistDialog(context);
                            }
                            await  _fetchPlaylists();
                          },
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
                  child: FutureBuilder<List<AudioPlaylist>>(
                    future:_playList,
                   // margin: EdgeInsets.symmetric(vertical: 2, horizontal: 10),
                   builder:(context, snapshot) {
                     if (snapshot.connectionState == ConnectionState.waiting) {
        return Center(child: CircularProgressIndicator());
      }
      if (snapshot.hasError) {
        return Center(child: Text('Error: ${snapshot.error}'));
      }
      if (!snapshot.hasData || snapshot.data!.isEmpty) {
        return Center(child: Text('No playlists available', style: TextStyle(color: kWhite)));
      }
                    print('Snapshot data:${snapshot.data}');

                   final audioplaylist = snapshot.data!;

                   print('AudioPlaylist:$audioplaylist');

                   return  ListView.builder(
                          
                            itemCount: audioplaylist.length,
                            itemBuilder: (context, index) {
                              final playlist = audioplaylist[index];
                              print('playlist: $playlist');
                             // final audioList = playlist.audios;
                            
                              return FutureBuilder<List<AudioDescription>>(
                                      future:playlist.getAudios(),
                                      builder: (context, audioSnapshot) {
                                        final playlistImage = audioSnapshot.hasData && audioSnapshot.data!.isNotEmpty
                                        ? audioSnapshot.data![0].thumbnailImage : null;
                                        return GestureDetector(
                                  onTap: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                PlaylistDetailsPage(
                                                    playlist: playlist,playlistId: playlist.id,)));
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
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                                                            return 
                                                            Container(
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
                                                    : 
                                                    Icon(
                                                        Icons.music_note_rounded,
                                                        color: Colors.white,
                                                        size: 50,
                                                      ),
                                              )),
                                        ),
                                      
                                        // SizedBox(
                                        //   width: 20,
                                        // ),
                                        Text(
                                          playlist.title,
                                          style: TextStyle(
                                              color: kWhite,
                                              fontSize: 20,
                                              fontWeight: FontWeight.bold),
                                        ),
                                        SizedBox(width: MediaQuery.sizeOf(context).width * 0.09,),
                                        IconButton(
                                        
                                          onPressed: ()=> _showMenu(context,playlist.id)
                                           
                                          // showMenu(context: context, position:  RelativeRect.fromDirectional(textDirection: TextDirection.ltr, start: 100, top: 100, end: 100, bottom: 100), 
                                          // items:[
                                          //   PopupMenuItem(value:'edit',child: Text('Edit')),
                                          //   PopupMenuItem(value:'delete',child: Text('Delete'))
                                          // ]
                                          // ).then((value){
                                          //   if(value == 'edit'){
                                          //     print('Edit is selected');
                                          //   }else if(value == 'delete'){
                                          //     print('Delete is selected');
                                          //   }
                                          // });
                                          //}
                                        , icon: Icon(Icons.more_vert_rounded,color: Colors.white,))
                                      ],
                                    ),
                                  ),
                                );
                                      }
                                
                              );
                              //);
                            });
                   }
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

  void _showCreatePlaylistDialog(BuildContext context,{int? audioId}) {
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
                        if(audioId != null){
            audioProvider.createPlayListWithAudioId(title, description, audioId);
             Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Playlist "$title" created')),
                    );
                        }else{
                          audioProvider.createPlayList(title, description);
                           Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Playlist "$title" created')),
                    );
                        }
                    _fetchPlaylists(); 
                   
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
