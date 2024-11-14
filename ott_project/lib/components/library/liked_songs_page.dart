import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';
import 'package:archive/archive.dart';
import 'package:flutter/material.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/music_folder/audio.dart';
import 'package:ott_project/components/music_folder/audio_container.dart';
import 'package:ott_project/components/music_folder/music_player_page.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/service/audio_api_service.dart';
import '../../pages/app_icon.dart';
import '../music_folder/song_player_page.dart';

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
  List<AudioDescription> _filterLikedAudio = [];
  //bool _isFetching = false;
  //Future<List<Audio>>? _futureLikedSongs;
  final TextEditingController _searchController = TextEditingController();
  bool isLoading = true;
 late AudioDescription audioDescription;
 Uint8List? thumbnail;
  //bool _showSearch = false;
 // AppIcon? iconData;
  late StreamController<List<Audio>> likedSongsController;
  late StreamController<List<AudioDescription>> likedAudioController;

  // Future<void> _loadThumbnail() async{
  //   final image = await audioDescription.thumbnailImage;
  //   setState(() {
  //     thumbnail = image;
  //   });
  // }
  
  @override
  void initState() {
    //likedSongsController = StreamController<List<Audio>>();
    likedAudioController = StreamController<List<AudioDescription>>();
    _fetchLikedAudios();
    //_loadThumbnail();
    //_fetchLikedSongs();
    _searchController.addListener((){
      _filterLikedAudios(_searchController.text);
    });
    // _searchController.addListener(() {
    //   _filterLikedSongs(_searchController.text);
    // });
    super.initState();

    //filteredLikedSongs = widget.likedSongs; // Initially display all liked songs
  }

    // new Audio like methods(AudioDescription)

   void _filterLikedAudios(String query){
    setState(() {
      if(query.isEmpty){
        _fetchLikedAudios().then((audios)=> _filterLikedAudio = audios);
        Text('No audio found');
      }else{
        _fetchLikedAudios().then((audios){
          _filterLikedAudio = audios.where((audio){
            final audioName = audio.audioTitle.toLowerCase();
            final input = query.toLowerCase();
            return audioName.contains(input);
          }).toList();
        });
      }
    });
  }

  Future<List<AudioDescription>> _fetchLikedAudios() async{
    try{
       print('Fetched ids: ');
      List<int> likedAudioIds = await AudioApiService().getLikedSongs(widget.userId);
      
       print('Fetched ids: ${likedAudioIds.length}');
       print('Fetched ids: ${likedAudioIds}');
       
       for(var id in likedAudioIds){
        print('Audio ID type:${id.runtimeType}');
       }

       List<AudioDescription> likedAudio = await Future.wait(
  likedAudioIds.map((id) async {
    try {
      final audio = await AudioApiService().fetchAudioDetails(id);
        print('Successfully fetched audio ID $id: ${audio.audioTitle}'); // Debug print
        return audio;
    } catch (e) {
      print('Error fetching audio details for ID $id: $e');
      throw Exception('Error:$e');
      // Return null for failed requests
    }
  }),
);
       print('Fetched audio: ${likedAudio.length}'); 
       likedAudioController.add(likedAudio);
       _filterLikedAudio = likedAudio;
       return _filterLikedAudio;
    }catch (e) {
      print('Failed to fetch liked songs: $e');
      likedAudioController.addError(e);
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
                  flex:8,
                  child: StreamBuilder<List<AudioDescription>>(
                      stream: likedAudioController.stream,
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
                            child: Padding(
                              padding:  EdgeInsets.only(top: MediaQuery.sizeOf(context).height * 0.10,
                              left:  MediaQuery.sizeOf(context).width * 0.05,),
                              child: ListView.builder(
                                  itemCount: snapshot.data!.length,
                                  itemBuilder: (context, index) {
                                    AudioDescription song = snapshot.data![index];
                                    print('Liked song audio name:${song}');
                                    return ListTile(
                                      leading:  ClipRRect(
                                            borderRadius: BorderRadius.circular(8),
                                            child:
                                            //  thumbnail != null 
                                            // ? Image.memory(thumbnail!,)
                                            // : Container(height: 50,width: 50,child: CircularProgressIndicator(),)
                                            
                                            FutureBuilder<Uint8List?>(
                                                future: song.thumbnailImage,
                                                builder: (context, snapshot) {
                                                  final thumbnail = snapshot.data;
                                                  if (snapshot.connectionState == ConnectionState.done &&
                                                      snapshot.hasData) {
                                                    return Image.memory(thumbnail!,
                                                        width: 50, height: 50, fit: BoxFit.fill);
                                                  } else {
                                                    return Container(
                                                      width: 50,
                                                      height: 50,
                                                      // fit: BoxFit.fill
                                                      color: Colors.grey,
                                                      child: Center(child: CircularProgressIndicator()),
                                                    );
                                                  }
                                                }),
                                          ),
                                      title: Text(
                                        song.audioTitle,
                                        style: TextStyle(color: kWhite),
                                      ),
                                      // subtitle: Text(song.movieName),
                                      
                                      onTap: () {
                                        Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                                builder: (context) =>
                                                   SongPlayerPage(
                                                        music: song,
                                                        musicList:
                                                            _filterLikedAudio,
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
                                                          _fetchLikedAudios();
                                                        }))).then(
                                            (value) => setState(() {}));
                                      },
                                    );
                                  }),
                            ),
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
