import 'dart:convert';
import 'dart:typed_data';
import 'package:archive/archive.dart';
import 'package:flutter/material.dart';
import 'package:ott_project/components/music_folder/audio.dart';
import 'package:ott_project/components/music_folder/music_player_page.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/service/audio_api_service.dart';

// audio_card.dart
class AudioCard extends StatefulWidget {
  final String thumbnail;
  final String songname;
  final Audio audio;
  final int userId;

  const AudioCard(
      {super.key,
      required this.thumbnail,
      required this.songname,
      required this.audio,
      required this.userId});

  @override
  State<AudioCard> createState() => _AudioCardState();
}

class _AudioCardState extends State<AudioCard> {
  bool _isLiked = false;
  List<String> likedSongIds = [];
  @override
  void initState() {
    super.initState();
    //_loadLikedSongs();
  }

  // Future<void> _loadLikedSongs() async {
  //   try {
  //     // Fetch liked songs from the backend API for the current user
  //     final likedSongIds = await AudioApiService().getLikedSongs(widget.userId);
  //     this.likedSongIds =
  //         likedSongIds.map((audio) => audio.id.toString()).toList();
  //     _checkLikedStatus();
  //   } catch (e) {
  //     print('Failed to load liked songs: $e');
  //   }
  // }

  void handleLike(Audio audio, bool isLiked) {
    setState(() {
      _isLiked = _isLiked;
    });
    if (_isLiked) {
      likedSongIds.add(audio.id.toString());
    } else {
      likedSongIds.remove(audio.id.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    // final _isLiked = likedSongIds.contains(widget.audio.id.toString());
    final compressedBytes = base64.decode(widget.thumbnail);
    final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => MusicPlayerPage(
              audio: widget.audio,
              // isLiked: _isLiked,
              // onLike: handleLike,
              audioList: [],
              onDislike: (p0) {},
              onChange: (p0) {},
            ),
          ),
        );
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: ClipRect(
                  child: Image.memory(
                Uint8List.fromList(decompressedBytes),
                width: 50,
                height: 50,
              )),
            ),
            // SizedBox(
            //   width: 10,
            // ),
            Text(widget.songname,
                style: TextStyle(
                    color: kWhite, fontSize: 16, fontWeight: FontWeight.bold)),
            const Spacer(),
            IconButton(
                onPressed: () {
                  _toggleLikedStatus(widget.audio.id, widget.userId);
                },
                icon: Icon(
                  _isLiked ? Icons.favorite : Icons.favorite_border_rounded,
                  size: 25,
                  color: Colors.red,
                )),
            // SizedBox(
            //   width: 2,
            // ),
            IconButton(
                onPressed: () {},
                icon: Icon(Icons.more_vert_rounded,
                    size: 25, color: Colors.white))
          ],
        ),
      ),
    );
  }

  Future<void> _toggleLikedStatus(int audioId, int userId) async {
    try {
      if (_isLiked) {
        // Unlike the audio
        //await AudioApiService().unlikeAudio(audioId, userId);
        likedSongIds.remove(audioId.toString());
      } else {
        // Like the audio
        await AudioApiService().likeAudio(audioId, userId);
        likedSongIds.add(audioId.toString());
      }
      setState(() {
        _isLiked = !_isLiked;
      });
    } catch (e) {
      // Handle error
      print('Failed to toggle liked status: $e');
    }
  }
}

// class AudioCard extends StatelessWidget {
//   final Audio audio;
//   final VoidCallback onTap;
//   final bool showMoreButton;

//   const AudioCard({
//     Key? key,
//     required this.audio,
//     required this.onTap,
//     this.showMoreButton = true,
//   }) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     final compressedBytes = base64.decode(audio.thumbnail);
//     final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);

//     return ListTile(
//       onTap: onTap,
//       leading: ClipRRect(
//         borderRadius: BorderRadius.circular(8),
//         child: Image.memory(
//           Uint8List.fromList(decompressedBytes),
//           width: 50,
//           height: 50,
//           fit: BoxFit.cover,
//         ),
//       ),
//       title: Text(
//         audio.songname,
//         style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
//       ),
//       trailing: showMoreButton
//           ? IconButton(
//               icon: Icon(Icons.more_vert, color: Colors.white),
//               onPressed: () {
//                 // Implement more options menu
//               },
//             )
//           : null,
//     );
//   }
// }
