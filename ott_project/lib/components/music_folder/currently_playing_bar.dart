import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:ott_project/components/music_folder/audio.dart';
import 'package:ott_project/components/music_folder/audio_provider.dart';
import 'package:ott_project/components/music_folder/music.dart';
import 'package:provider/provider.dart';

class CurrentlyPlayingBar extends StatefulWidget {
  // final Audio? currentlyPlaying;
  final VoidCallback onTap;
  final Music? musicCurrentlyPlaying;

  const CurrentlyPlayingBar({
    super.key,
    required this.musicCurrentlyPlaying,
    required this.onTap,
  });

  @override
  State<CurrentlyPlayingBar> createState() => _CurrentlyPlayingBarState();
}

class _CurrentlyPlayingBarState extends State<CurrentlyPlayingBar> {
  @override
  void initState() {
    _loadThumbnailImage();
    super.initState();
  }

  Uint8List? thumbnail;

  @override
  void didUpdateWidget(CurrentlyPlayingBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.musicCurrentlyPlaying != widget.musicCurrentlyPlaying) {
      _loadThumbnailImage();
    }
  }

  Future<void> _loadThumbnailImage() async {
    final image = await widget.musicCurrentlyPlaying!.thumbnailImage;
    setState(() {
      thumbnail = image;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (widget.musicCurrentlyPlaying == null) return SizedBox.shrink();

    return Consumer<AudioProvider>(builder: (context, audioProvider, child) {
      // final decodedImage =
      //     audioProvider.getDecodImage(thumbnail);
      return GestureDetector(
        onTap: widget.onTap,
        child: Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: Container(
            height: 60,
            decoration: BoxDecoration(
              color: Color.fromARGB(255, 190, 104, 105),
              borderRadius: BorderRadius.circular(8),
            ),
            //margin: EdgeInsets.all(8),
            padding: EdgeInsets.symmetric(horizontal: 10),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(25),
                  child: thumbnail != null
                      ? Image.memory(
                          //decompressedBytes,
                          // decodedImage,
                          thumbnail!,
                          width: 50,
                          height: 50,
                          fit: BoxFit.fill,
                        )
                      : Container(),
                  // FutureBuilder<Uint8List?>(
                  //   future: musicCurrentlyPlaying!
                  //       .thumbnailImage, // Ensure this future returns a Uint8List or null
                  //   builder: (context, snapshot) {
                  //     if (snapshot.connectionState == ConnectionState.waiting) {
                  //       return Container(
                  //         width: 120,
                  //         height: 135,
                  //         color: Colors.grey,
                  //         child: Center(child: CircularProgressIndicator()),
                  //       );
                  //     } else if (snapshot.connectionState ==
                  //         ConnectionState.done) {
                  //       if (snapshot.hasData && snapshot.data != null) {
                  //         return Image.memory(
                  //           snapshot.data!,
                  //           width: 50,
                  //           height: 50,
                  //           fit: BoxFit.fill,
                  //         );
                  //       } else {
                  //         return Center(
                  //           child: Icon(
                  //             Icons.music_note_rounded,
                  //             color: Colors.white,
                  //             size: 50,
                  //           ),
                  //         );
                  //       }
                  //     } else {
                  //       return Container(
                  //         width: 120,
                  //         height: 135,
                  //         color: Colors.grey,
                  //         child: Center(
                  //           child: CircularProgressIndicator(),
                  //         ),
                  //       );
                  //     }
                  //   },
                  // ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: GestureDetector(
                    onTap: widget.onTap,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          widget.musicCurrentlyPlaying!.songname,
                          style: TextStyle(
                              color: Colors.white, fontWeight: FontWeight.bold),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.skip_previous, color: Colors.white),
                  onPressed: audioProvider.playPreviousMusic,
                ),
                IconButton(
                    icon: Icon(
                      audioProvider.isPlaying ? Icons.pause : Icons.play_arrow,
                      color: Colors.white,
                    ),
                    onPressed: audioProvider.playPauseMusic),
                IconButton(
                  icon: Icon(Icons.skip_next, color: Colors.white),
                  onPressed: audioProvider.playNextMusic,
                ),
              ],
            ),
          ),
        ),
      );
    });
  }
}
