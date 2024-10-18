import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';

import 'package:flutter/material.dart';
import 'package:ott_project/components/music_folder/audio_provider.dart';
import 'package:provider/provider.dart';

import '../components/music_folder/audio.dart';
import '../components/music_folder/music_player_page.dart';

class SearchResultAudio extends StatelessWidget {
  final Audio audio;
  final List<Audio> allAudios;
  final int index;
  const SearchResultAudio(
      {super.key,
      required this.allAudios,
      required this.audio,
      required this.index});

  @override
  Widget build(BuildContext context) {
    final compressedBytes = base64.decode(audio.thumbnail);
    final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);

    return GestureDetector(
      onTap: () {
        List<Audio> categoryPlayList = allAudios
            .where((a) => a.categoryName == audio.categoryName)
            .toList();
        Provider.of<AudioProvider>(context, listen: false)
            .setCurrentlyPlaying(audio, categoryPlayList);
        // Navigator.push(
        //     context,
        //     MaterialPageRoute(
        //       builder: (context) => MusicPlayerPage(
        //         audio: audio,

        //         audioList: categoryPlayList,
        //         onDislike: (p0) {},
        //         onChange: (newAudio) {
        //           Provider.of<AudioProvider>(context, listen: false)
        //               .setCurrentlyPlaying(newAudio, categoryPlayList);
        //         }, // Implement this if needed
        //       ),
        //     ));
      },
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.memory(
                Uint8List.fromList(decompressedBytes),
                width: 100,
                height: 100,
                fit: BoxFit.cover,
              ),
            ),
            SizedBox(width: 16),
            Expanded(
              child: Text(
                audio.songname,
                style: TextStyle(color: Colors.white, fontSize: 16),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
