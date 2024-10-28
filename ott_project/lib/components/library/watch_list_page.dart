import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/video_folder/movie_player_page.dart';
import 'package:ott_project/components/video_folder/video_container.dart';
import 'package:ott_project/components/video_folder/watch_later.dart';
import 'package:ott_project/service/movie_api_service.dart';
import 'package:ott_project/service/watch_later_service.dart';

class WatchListPage extends StatefulWidget {
  final int userId;
  const WatchListPage({super.key,required this.userId});

  @override
  State<WatchListPage> createState() => _WatchListPageState();
}

class _WatchListPageState extends State<WatchListPage> {
  late StreamController<List<WatchLater>> watchlaterController;
  bool isLoading = true;
  Map<int,VideoDescription?> videoDetails={};
  final _movieApiService = MovieApiService();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    watchlaterController = StreamController<List<WatchLater>>();
    _loadWatchLater();
  }

Future<void> _loadWatchLater() async{
  try{
    List<WatchLater> watchLaterVideos = await WatchLaterService().getWatchLaterVideos(widget.userId);
    watchlaterController.add(watchLaterVideos);
  }catch(e){
    watchlaterController.addError('Failed to load videos: $e');
  }
}

Future<VideoDescription?> fetchVideoDetails(int videoId) async{
  if(videoDetails.containsKey(videoId)){
    return videoDetails[videoId];
  }
  try{
    final video = await _movieApiService.fetchMovieDetail(videoId);
    videoDetails[videoId] = video;
    return video;
  }catch (e) {
      print('Failed to fetch video details for videoId $videoId: $e');
      return null;
    }
}

  @override
  Widget build(BuildContext context) {
return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(  
        children: [
          BackgroundImage(),
          Expanded(
            child: StreamBuilder(stream: watchlaterController.stream, 
            builder: (context,snapshot){
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
                              child: Text('No videos available in your watchlist',
                                  style: TextStyle(color: Colors.white)));
                        }else{
                          final watchLaterVideos = snapshot.data!;
                          return RefreshIndicator(
                             onRefresh: () async {
                              await Future.delayed(Duration(seconds: 2));
                            },
                            child: Padding(
                              padding:  EdgeInsets.only(top: MediaQuery.sizeOf(context).height * 0.10,
                              left:  MediaQuery.sizeOf(context).width * 0.05,),
                              child: ListView.builder(
                                itemCount: watchLaterVideos.length,
                                itemBuilder:(context,index){
                                    final video = watchLaterVideos[index];
                                    return FutureBuilder<VideoDescription?>(
                                      future: fetchVideoDetails(video.videoId), 
                                      builder: (context,videoSnapShot){
                                        if(videoSnapShot.connectionState ==ConnectionState.waiting ){
                                          return ListTile(
                                     leading: CircularProgressIndicator(), 
                                    title: Text(video.videoTitle,style: TextStyle(color: Colors.white),),
                                 
                                   );
                                        }else if(videoSnapShot.hasError || !videoSnapShot.hasData){
                                           return ListTile(
                                     leading: Icon(Icons.broken_image,), 
                                    title: Text(video.videoTitle,style: TextStyle(color: Colors.white),),
                                   );
                                        }else{
                                          final videoDetails = videoSnapShot.data!;
                                          return ListTile(
                                            leading: ClipRect(
                                             child: FutureBuilder<Uint8List?>(
                                                future: videoDetails.thumbnailImage,
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
                                             title: Text(video.videoTitle,style: TextStyle(color: Colors.white),),
                                             onTap: () {
                                              int category = videoDetails.categoryList.first;
                                               Navigator.push(context, MaterialPageRoute(
                                                builder: (context)=> MoviesPlayerPage(videoDescriptions: [videoDetails], categoryId:category)
                                               ));
                                             },
                                          );
                                        }
                                      });
                                 
                                } ,

                              ),
                              ),
                               );
                        }
            } ),),
          
        ],
      ),
    );
  }
}