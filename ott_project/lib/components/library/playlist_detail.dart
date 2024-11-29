
import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/library/playlistDTO.dart';
import 'package:ott_project/components/music_folder/audio_provider.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/app_icon.dart';

import 'package:ott_project/service/audio_api_service.dart';
import 'package:ott_project/service/icon_service.dart';
import 'package:ott_project/service/playlist_service.dart';
import 'package:provider/provider.dart';
import '../../service/service.dart';
import '../music_folder/audio_container.dart';
import '../music_folder/song_player_page.dart';
import 'audio_playlist.dart';
import 'likedSongsDTO.dart';


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
  List<PlaylistDTO> _playlists=[];
  bool _isLoading = true;
  String? _error;
  Map<int,Uint8List> audioImages = {};

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
      print('PlaylistData from playlistdto:$playlistData');
      
      // Assuming the first item is our playlist since we queried by ID
      if (playlistData.isNotEmpty) {
       await Future.wait(playlistData.map((playlist)async{
          print('Playlist data: $playlist');
        print('Audio details: ${playlist.audioDetails}');
        await _loadAudioImages(playlist.audioDetails);
        return playlist;
       }));
        
        setState(() {
          _playlists = playlistData;        
          //_isLoading = false;
        });
        
        setState(() {
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

  Future<void> _loadAudioImages(List<LikedsongsDTO> audioDetails) async{
    for(var audio in audioDetails){
       print('Loading image for audio: ${audio.audioId}');
      try{
        final audioDesc = await AudioApiService().fetchAudioDetails(audio.audioId);
        if(audioDesc != null){
          
            final image = await audioDesc.thumbnailImage;
            print('Playlist image:$image');
            if(image != null){
              setState(() {
                audioImages[audio.audioId] = image;
              });     
              print('Image loaded for ${audio.audioId}');  
            }
        }
      }catch (e) {
        print('Error loading image for audio ${audio.audioId}: $e');
      }
    }
  }

   Widget buildAudioImage(LikedsongsDTO audio){
    final audioImage = audioImages[audio.audioId];
    print('Audio ID: ${audio.audioId}, Image: $audioImage'); 
    if(audioImage != null){
      
      return Image.memory(
        audioImage,
        height: 50,
        width: 50,
        fit: BoxFit.cover,
      );
    }
    return Container(
      height: 50,
      width: 50,
      child: Icon(Icons.music_note_rounded,color: Colors.white,),
    );
  } 

   void _showMenu(BuildContext context,LikedsongsDTO audio,int playlistId,int movedPlaylistId) {
    final RenderBox button = context.findRenderObject() as RenderBox;
    final RenderBox overlay = Overlay.of(context).context.findRenderObject() as RenderBox;

    final RelativeRect position = RelativeRect.fromRect(
      Rect.fromPoints(
        button.localToGlobal(Offset.zero, ancestor: overlay),
        button.localToGlobal(button.size.bottomCenter(Offset.zero), ancestor: overlay),
      ),
      Offset.zero & overlay.size,
    );

    showMenu(
      context: context,
      position: position,
      color:Colors.grey[500],
      items: [
        PopupMenuItem(
          value: 'move',
          child: 
              Text('Move',style: TextStyle(color: Colors.white),),
        ),
        PopupMenuItem(
          value: 'remove',
          child:
              Text('Remove',style: TextStyle(color: Colors.white)),
        ),
      ],
    ).then((value) async{
      if (value == 'move') {
        print('move selected');
        _showMoveDialog(context, movedPlaylistId, audio.audioId);

        // _loadPlaylistDetails();
      
      } else if (value == 'remove') {
        print('Delete selected');
        await PlaylistService().removeAudioFromPlaylist(playlistId, audio.audioId);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Audio removed from this playlist')));        
       await _loadPlaylistDetails();
      }
    });
  } 

  void _showMoveDialog(BuildContext context, int currentPlaylistId, int audioId) async {
    final userId = await Service().getLoggedInUserId();
  final playlists = await PlaylistService().getPlaylistsByUserId(userId!); // Fetch all playlists
  int? selectedPlaylistId;

  await showDialog(
    context: context,
    builder: (BuildContext context) {
      return BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 2.0,sigmaY: 2.0),
        child: AlertDialog(
          backgroundColor: Color.fromARGB(69, 178, 174, 174),
          title: Text('Move to Playlist',style: TextStyle(color: Colors.white),),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              for (var playlist in playlists)
                ListTile(
                  leading: Icon(Icons.playlist_play_rounded,color: Colors.white,),
                  title: Text(playlist.title,style: TextStyle(color: Colors.white),),
                  onTap: () {
                    selectedPlaylistId = playlist.id;
                    Navigator.of(context).pop();
                  },
                ),
              // ListTile(
              //   leading: Icon(Icons.add,color: Colors.white,),
              //   title: Text('Create New Playlist',style: TextStyle(color: Colors.white),),
              //   onTap: () {
              //     Navigator.of(context).pop();
              //   //  _showCreatePlaylistDialog(context, audioId: audioId);
              //   },
              // ),
            ],
          ),
        ),
      );
    },
  );

  if (selectedPlaylistId != null) {
    await PlaylistService().moveAudioToPlaylist(currentPlaylistId, audioId, selectedPlaylistId!);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Audio moved successfully')),
    );
  
      _loadPlaylistDetails();
 
  } 
  }

  // void _showCreatePlaylistDialog(BuildContext context,{int? audioId}) {
  //   final TextEditingController titleController = TextEditingController();
  //   final TextEditingController descriptionController = TextEditingController();
  //   showDialog(
  //     context: context,
  //     builder: (BuildContext context) {
  //       return BackdropFilter(
  //         filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
  //         child: AlertDialog(
  //           backgroundColor: Color.fromARGB(119, 68, 66, 66),
  //           title: Text('New playlist', style: TextStyle(color: Colors.white)),
  //           content: SingleChildScrollView(
  //             child: Column(
  //               mainAxisSize: MainAxisSize.min,
  //               children: [
  //                 TextField(
  //                   controller: titleController,
  //                   decoration: InputDecoration(
  //                     hintText: 'Title',
  //                     hintStyle: TextStyle(color: Colors.white60),
  //                     enabledBorder: UnderlineInputBorder(
  //                       borderSide: BorderSide(color: Colors.white60),
  //                     ),
  //                     focusedBorder: UnderlineInputBorder(
  //                       borderSide: BorderSide(color: Colors.white),
  //                     ),
  //                   ),
  //                   style: TextStyle(color: Colors.white),
  //                 ),
  //                 SizedBox(height: 10),
  //                 TextField(
  //                   controller: descriptionController,
  //                   decoration: InputDecoration(
  //                     hintText: 'Description',
  //                     hintStyle: TextStyle(color: Colors.white60),
  //                     enabledBorder: UnderlineInputBorder(
  //                       borderSide: BorderSide(color: Colors.white60),
  //                     ),
  //                     focusedBorder: UnderlineInputBorder(
  //                       borderSide: BorderSide(color: Colors.white),
  //                     ),
  //                   ),
  //                   style: TextStyle(color: Colors.white),
  //                 ),
  //               ],
  //             ),
  //           ),
  //           actions: [
  //             TextButton(
  //               onPressed: () => Navigator.pop(context),
  //               child: Text('Cancel', style: TextStyle(color: Colors.white)),
  //             ),
  //             TextButton(
  //               onPressed: () {
  //                 final title = titleController.text;
  //                 final description = descriptionController.text;
  //                 if (title.isNotEmpty) {
  //                   try{
  //                   final audioProvider =
  //                       Provider.of<AudioProvider>(context, listen: false);
                        
  //           audioProvider.createPlayListWithAudioId(title, description, widget.playlist.id);
  //            Navigator.pop(context);
  //                   ScaffoldMessenger.of(context).showSnackBar(
  //                     SnackBar(content: Text('Playlist "$title" created')),
  //                   );
  //                  // audioProvider.fetchPlaylists();
  //                   }catch(e) {
  //                     Navigator.pop(context);
  //                     ScaffoldMessenger.of(context).showSnackBar(
  //                       SnackBar(
  //                         content: Text('Failed to create playlist: ${e.toString()}'),
  //                         backgroundColor: Colors.red,
  //                         duration: Duration(seconds: 3),
  //                       ),
  //                     );
  //                   }
                    
                   
  //                 }
  //               },
  //               child: Text('Create', style: TextStyle(color: Colors.white)),
  //             ),
  //           ],
  //         ),
  //       );
  //     },
  //   );
  // }

 
  @override
  Widget build(BuildContext context) {
     if (_isLoading) {
    return Center(child: CircularProgressIndicator());
  }
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
                            height: MediaQuery.sizeOf(context).height * 0.02,
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
                            width:  MediaQuery.sizeOf(context).width * 0.04,
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
                    width: MediaQuery.sizeOf(context).width * 0.05,
                  ),
                
                ],
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  _playlists.first.title  ,
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 18),
                ),
              ),
              Expanded(
               child:  _playlists.first.audioDetails.isEmpty
                ? Center(
                  child: _playlists.isEmpty 
                        ? CircularProgressIndicator()
                                     :  Text(
                          'No songs in this playlist',
                          style: TextStyle(color: Colors.white),
                        )
                )
                    : ListView.builder(
                        itemCount: _playlists.first.audioDetails.length,
                        itemBuilder: (context, index) {
                          final audio = _playlists.first.audioDetails[index];
                          print('Audio in playlists:$audio');
                          
                          return SizedBox(
                          
                            child: ListTile(
                              leading: ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: buildAudioImage(audio),
                                
                              ),
                              title: Text( 
                                audio.audioTitle,
                                style: TextStyle(color: Colors.white),
                              ),
                              trailing: Builder(builder: (context)=> IconButton(
                                onPressed: () => _showMenu(context,
                                audio,
                                _playlists.first.playlistId,
                                _playlists.first.playlistId
                                
                                ),
                               icon: Icon(Icons.more_vert_rounded,color: Colors.white,)),),
                              onTap: () async{
                                try{

                                  showDialog( 
                                        context: context,
                                        barrierDismissible: false,
                                        builder: (BuildContext context) {
                                          return Center(child: CircularProgressIndicator());
                                        },
                                      );

                                
                                final selectedAudioId = _playlists.first.audioDetails[index].audioId;
                                final AudioDescription selectedAudio = await AudioApiService().fetchAudioDetails(selectedAudioId);
                                
                                await selectedAudio.fetchImage();
                          
                              final audioProvider = Provider.of<AudioProvider>(context, listen: false);
                              audioProvider.updateCurrentlyPlayingSong(selectedAudio);
                             final playlistAudios = audioProvider.convertPlaylistToAudioDescriptions(_playlists.first.audioDetails);
                             await audioProvider.setCurrentlyPlayingSong(selectedAudio, playlistAudios);

                          print('Audio Provider State:');
                          print('Current Audio: ${audioProvider.audioDescriptioncurrently?.audioTitle}');
                          print('Thumbnail Present: ${audioProvider.audioDescriptioncurrently?.thumbnail != null}');

                          // Dismiss loading dialog
                          if (context.mounted && Navigator.canPop(context)) {
                            Navigator.pop(context);
                          }
                          // Set thumbnail if available
                          // if (selectedAudio.thumbnail != null) {
                          //   p.thumbnail = selectedAudio.thumbnail;
                          // }
                                 print('Playlist SelectedAudio:$selectedAudio');
                                 print('Selected Audio Title: ${selectedAudio.audioTitle}');
                                 if(!context.mounted) return;
                                 print('Selected Audio Thumbnail: ${selectedAudio.thumbnail}');
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => SongPlayerPage(
                                          music: selectedAudio,
                                          onChange: (newAudio) {
                                            setState(() {

                                              int index = 
                                              _playlists.first.audioDetails.indexWhere((audio)=>audio.audioId == newAudio.id);
                                              print('Song index:$index');
                                              // widget
                                              //     .playlist.audioIds
                                              //     .indexOf(newAudio.id);
                                                  if(index != -1){
                                                    _playlists.first.audioDetails[index] = LikedsongsDTO(audioId: newAudio.id, audioTitle: newAudio.audioTitle);
                                                    //widget.playlist.audioIds[index] = newAudio.id;
                                                  }
                                            });
                                          },
                                          onDislike: (p0) {}
                                          )
                                  ));
                                                              }catch(e){
                                   print("Error fetching audio details: $e");
                                }
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
