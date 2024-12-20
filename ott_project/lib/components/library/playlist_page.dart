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
    _fetchPlaylists();
    _playList = Future.value([]);
    
    CircularProgressIndicator();
  }

  bool _showSearch = false;
  TextEditingController _searchController = TextEditingController();
  AppIcon? iconData;
  late Future<List<AudioPlaylist>> _playList;
   final GlobalKey _menuKey = GlobalKey();
   bool _isLoading = false;
 

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
    if(_isLoading) return;
   try{
     setState(() {
       _isLoading = true;
     });
      final userId =await Service().getLoggedInUserId();
      print('UserId: ${userId}');
      if(userId != null){
      final playlists = await PlaylistService().getPlaylistsByUserId(userId);
      if(mounted){
      setState(() {
        _playList = Future.value(playlists);
        _isLoading = false;
      });
      }
      }
   }catch(e){
    print('Error fetching playlists: $e');
   }    
  }




  void _showEditPlaylistDialog(BuildContext context,{required int playlistId,String? initialtitle, String? initialdescription}) {
    final TextEditingController titleController = TextEditingController(text: initialtitle);
    final TextEditingController descriptionController = TextEditingController(text: initialdescription);
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
          child: AlertDialog(
            backgroundColor: Color.fromARGB(69, 178, 174, 174),
            title: Text('Edit playlist', style: TextStyle(color: Colors.white)),
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
                  SizedBox(height:  MediaQuery.sizeOf(context).height * 0.02),
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
                onPressed: () async {
                  final title = titleController.text;
                  final description = descriptionController.text;
                  if (title.isNotEmpty) {
                    await PlaylistService().updatePlaylist(playlistId, title, description);
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Playlist Updated successfully')));
                    _fetchPlaylists(); 
                   
                  }
                },
                child: Text('Save', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        );
      },
    );
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
                              height:  MediaQuery.sizeOf(context).height * 0.02,
                            ),
                            if (iconData != null)
                              Image.memory(
                                iconData!.imageBytes,
                                height: 60,
                              )
                            else
                              Image.asset('assets/images/bgimg2.jpg',
                                  height:  MediaQuery.sizeOf(context).height * 0.05),
                            Spacer(),
                            IconButton(
                                onPressed: () {},
                                icon: Icon(
                                  Icons.cast_connected_rounded,
                                  color: kWhite,
                                )),
                            SizedBox(
                              width: MediaQuery.sizeOf(context).width * 0.04,
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
                      width:  MediaQuery.sizeOf(context).width * 0.05,
                    ),
                   
                    
                  ],
                ),
                SizedBox(
                  height:  MediaQuery.sizeOf(context).height * 0.04,
                ),
                Container(
                  margin: EdgeInsets.only(right:  MediaQuery.sizeOf(context).width * 0.05,
                   top:  MediaQuery.sizeOf(context).height * 0.02, 
                   left: MediaQuery.sizeOf(context).width * 0.05 ),
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
                            ),
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
                                        // IconButton(
                                        
                                        //   onPressed: (){
                                            PopupMenuButton<Map<String, dynamic>>(
                                              color: Colors.grey[600],
                                                onSelected: (value) async{
                                                  final action = value['action'];
                                                  final playlistId = value['playlistId'];

                                                  if (action == 'edit') {
                                                    // Handle edit action
                                                    print('Edit playlist with ID: $playlistId');
                                                    final playlistDetails = await PlaylistService().getPlaylistById(playlistId);
                                                    if(playlistDetails != null){
                                                      _showEditPlaylistDialog(context,
                                                      playlistId: playlistId,initialtitle: playlistDetails['title'] ?? '',
                                                      initialdescription: playlistDetails['description']??'');
                                                      await _fetchPlaylists();
                                                    }
                                                  } else if (action == 'delete') {
                                                    // Handle delete action
                                                    print('Delete playlist with ID: $playlistId');
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
                                                },
                                                itemBuilder: (context) => [
                                                  PopupMenuItem(
                                                    value: {'action': 'edit', 'playlistId': playlist.id},
                                                    child: Text('Edit',style: TextStyle(color: Colors.white)),
                                                  ),
                                                  PopupMenuItem(
                                                    value: {'action': 'delete', 'playlistId': playlist.id},
                                                    child: Text('Delete',style: TextStyle(color: Colors.white)),
                                                  ),
                                                ],
                                                icon: Icon(Icons.more_vert_rounded, color: Colors.white),                         
                                              ),
                                      ],
                                    ),
                                  ),
                                );
                              },
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
    bool isCreating= false;

    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(builder: (BuildContext context, StateSetter setDialogState){
          return BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
          child: AlertDialog(           
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
            backgroundColor: Color.fromARGB(119, 68, 66, 66),
            title: Text('New playlist', style: TextStyle(color: Colors.white)),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  

                  TextField(
                    controller: titleController,
                    enabled: !isCreating,
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
                  SizedBox(height:  MediaQuery.sizeOf(context).width * 0.02),
                  TextField(
                    controller: descriptionController,
                    enabled: !isCreating,
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
                onPressed: isCreating ? null : () => Navigator.pop(dialogContext),
                    child: Text('Cancel', style: TextStyle(color: Colors.white)),
              ),
              TextButton(
                onPressed: isCreating ? null : ()  async{
                  final title = titleController.text;
                  final description = descriptionController.text;
                  
                  if (title.isNotEmpty) {
                    try{
                      setDialogState(){
                        isCreating = true;
                      }
                    
                    final audioProvider =
                        Provider.of<AudioProvider>(context, listen: false);
                        if(audioId != null){
            audioProvider.createPlayListWithAudioId(title, description, audioId);
              Navigator.pop(dialogContext);            
            //         ScaffoldMessenger.of(context).showSnackBar(
            //           SnackBar(content: Text('Playlist "$title" created')),
            //         );
                        }else{
                          audioProvider.createPlayList(title, description);
                          
                        }
                        Navigator.pop(dialogContext);

                         await Future.delayed(Duration(milliseconds: 500));
                        
                        if(mounted){
                          await _fetchPlaylists();
                           ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Playlist "$title" created')),
                    );
                        }
                    }catch(e){
                       print('Error creating playlist: $e');
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Error creating playlist. Please try again.'),
                                backgroundColor: Colors.red,
                              ),
                            );
                          }
                    }finally{
                      if (mounted) {
                            setDialogState(() {
                              isCreating = false;
                            });
                          }
                    }
                  }
                },
                child: Text('Create', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        );
        });
        
      },
    );
  }
}
