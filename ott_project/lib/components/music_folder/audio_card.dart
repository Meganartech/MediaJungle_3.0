import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:ott_project/components/pallete.dart';

import 'audio_container.dart';

class AudioCard extends StatelessWidget {
  final AudioDescription audio;
  final int initialIndex;
  final VoidCallback onTap;
  //final List<Audio> Audio;

  const AudioCard({
    Key? key,
    required this.audio,
    required this.initialIndex,
    required this.onTap,
    //this.Audio = const []   
  }) : super(key: key);

  Widget build(BuildContext context) {
    //movie.thumbnailImage;
    // final compressedBytes = base64.decode(movie.thumbnail);
    // final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 100,
        //height: 500,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              flex: 8,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: FutureBuilder<Uint8List?>(
                    future: audio.thumbnailImage,
                    builder: (context, snapshot) {
                      final thumbnail = snapshot.data;
                      print('Audioname:${audio.audioTitle}');
                      // print('thumbanail:{$thumbnail}');
                      if (snapshot.connectionState == ConnectionState.done &&
                          snapshot.hasData) {
                        return Image.memory(thumbnail!,
                            width: 164, height: 130, fit: BoxFit.fill);
                      } else {
                        return Container(
                          width: 164,
                          height: 135,
                          // fit: BoxFit.fill
                          color: Colors.grey,
                          child: Center(child: CircularProgressIndicator()),
                        );
                      }
                    }),
              ),
            ),
            SizedBox(height: MediaQuery.sizeOf(context).height * 0.01),
       
            Text(
              audio.audioTitle,
              style: TextStyle(
                color: kWhite,
              ),
              softWrap: true,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              // maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }
}
