import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/library/playlistDTO.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/pages/app_icon.dart';
import 'package:ott_project/profile/profile_page.dart';
import 'package:ott_project/service/audio_api_service.dart';
import 'package:ott_project/service/icon_service.dart';
import 'package:ott_project/service/playlist_service.dart';
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
  PlaylistDTO? _playlist;
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
        final playlist = playlistData.first;
        print('Playlist data: $_playlist');
        print('Audio details: ${_playlist?.audioDetails}');
        setState(() {
          _playlist = playlist;        
          //_isLoading = false;
        });
        await _loadAudioImages(playlist.audioDetails);
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
                  _playlist!.title ?? 'Untitled Playlist',
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 18),
                ),
              ),
              Expanded(
                // child: Padding(
                //   padding: const EdgeInsets.all(3.0),
                
                child: _playlist == null || _playlist!.audioDetails.isEmpty
                ? Center(
                  child: _playlist == null 
                        ? CircularProgressIndicator()
                                     :  Text(
                          'No songs in this playlist',
                          style: TextStyle(color: Colors.white),
                        )
                )
                    : ListView.builder(
                        itemCount: _playlist!.audioDetails.length,
                        itemBuilder: (context, index) {
                          final audio = _playlist!.audioDetails[index];
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
                              
                              onTap: () async{
                                try{
                                final selectedAudioId = widget.playlist.audioIds[index];
                                final List<AudioDescription> audioDetailsList = await PlaylistService().getAudioDetailsForPlaylist(widget.playlist.audioIds);
                                print('Audio details 1: $audioDetailsList');
                                final selectedAudio = audioDetailsList.firstWhere((audio)=> audio.id == selectedAudioId);
                                print('SelectedAudio:$selectedAudio');
                                if(selectedAudio != null){
                                   print('SelectedAudio:$selectedAudio');
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) => SongPlayerPage(
                                            music: selectedAudio,
                                            onChange: (newAudio) {
                                              setState(() {
                                                int index = 
                                                //_playlist!.audioDetails.indexOf(newAudio.id as LikedsongsDTO);
                                                widget
                                                    .playlist.audioIds
                                                    .indexOf(newAudio.id);
                                                    if(index != -1){
                                                      //_playlist!.audioDetails[index] = newAudio.id as LikedsongsDTO;
                                                      widget.playlist.audioIds[index] = newAudio.id;
                                                    }
                                              });
                                            },
                                            onDislike: (p0) {})
                                    ));
                                }else{
                                  print("Audio details not found for ID: $selectedAudioId");
                                }
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
