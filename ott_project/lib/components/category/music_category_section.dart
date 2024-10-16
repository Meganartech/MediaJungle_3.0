
import 'package:flutter/material.dart';
import 'package:ott_project/components/music_folder/audio_container.dart';
import 'package:ott_project/components/music_folder/music.dart';
import 'package:ott_project/components/pallete.dart';

import '../music_folder/audio_card.dart';

// class MusicCategorySection extends StatelessWidget {
//   final String title;
//   final List<Music> audios;
//   final int userId;
//   final Function(Music) onTap;

//   const MusicCategorySection(
//       {super.key,
//       required this.title,
//       required this.audios,
//       required this.userId,
//       required this.onTap});

//   @override
//   Widget build(BuildContext context) {
//     // final displayedAudios = audios.length > 5 ? audios.sublist(0, 5) : audios;
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Row(
//           mainAxisAlignment: MainAxisAlignment.spaceBetween,
//           children: [
//             Text(
//               title,
//               style: TextStyle(
//                 fontSize: 16,
//                 fontWeight: FontWeight.bold,
//                 color: Colors.white,
//               ),
//             ),
//             TextButton(
//                 onPressed: () {},
//                 child: Text('See more', style: TextStyle(color: Colors.green))),
//           ],
//         ),
//         SizedBox(
//           height: 10,
//         ),
//         Container(
//           height: 200,
//           child: ListView.builder(
//               scrollDirection: Axis.horizontal,
//               itemCount: audios.length,
//               itemBuilder: (context, index) {
//                 final audio = audios[index];
//                 //Widget imageWidget;
//                 // final compressedBytes = base64.decode(audio.thumbnailImage!);
//                 // final decompressedBytes =
//                 //     ZLibDecoder().decodeBytes(compressedBytes);
//                 // if (audio.thumbnail != null && audio.thumbnail!.isNotEmpty) {
//                 //   try {
//                 //      final decodedBytes = base64Decode(audio.thumbnailImage!);
//                 //     imageWidget = Image.memory(
//                 //       Uint8List.fromList(),
//                 //       fit: BoxFit.fill,
//                 //       width: 164,
//                 //       height: 155,
//                 //     );
//                 //   } catch (e) {
//                 //     print('Error decoding image: $e');
//                 //     imageWidget = Container(
//                 //       width: 164,
//                 //       height: 155,
//                 //       color: Colors.grey,
//                 //       child: Icon(Icons.music_note, color: Colors.white),
//                 //     );
//                 //   }
//                 // } else {
//                 //   imageWidget = Container(
//                 //     width: 164,
//                 //     height: 155,
//                 //     color: Colors.grey,
//                 //     child: Icon(Icons.music_note, color: Colors.white),
//                 //   );
//                 // }
//                 return GestureDetector(
//                   onTap: () => onTap(audio),
//                   child: Container(
//                     width: 120,
//                     margin: EdgeInsets.only(right: 15),
//                     child: Column(
//                       crossAxisAlignment: CrossAxisAlignment.center,
//                       children: [
//                         Stack(
//                           alignment: Alignment.center,
//                           children: [
//                             ClipRRect(
//                               borderRadius: BorderRadius.circular(8),
//                               child: FutureBuilder<Uint8List?>(
//                                 future:
//                                     //audio.thumbnailImage,
//                                     audio.bannerImage,
//                                 builder: (context, snapshot) {
//                                   if (snapshot.connectionState ==
//                                           ConnectionState.done &&
//                                       snapshot.hasData) {
//                                     return Image.memory(snapshot.data!,
//                                         width: 164,
//                                         height: 135,
//                                         fit: BoxFit.fill);
//                                   } else {
//                                     return Container(
//                                       width: 164,
//                                       height: 155,
//                                       // fit: BoxFit.fill
//                                       color: Colors.grey,
//                                       child: Center(
//                                           child: CircularProgressIndicator()),
//                                     );
//                                   }
//                                 },
//                               ),
//                             ),
//                             // Image.asset(
//                             //   'assets/images/remo.jpg',
//                             //   width: 164,
//                             //   height: 155,
//                             //   fit: BoxFit.fill,
//                             // ),
//                             //     Image.memory(
//                             //   Uint8List.fromList(decompressedBytes),
//                             //   width: 164,
//                             //   height: 155,
//                             //   fit: BoxFit.fill,
//                             // ),
//                             //  ),
//                             Icon(Icons.play_circle,
//                                 color: Colors.white, size: 35),
//                           ],
//                         ),
//                         SizedBox(height: 10),
//                         Text(
//                           audios[index].songname,
//                           //audio.songname,
//                           style: TextStyle(color: Colors.white),
//                           maxLines: 1,
//                           overflow: TextOverflow.ellipsis,
//                         ),
//                       ],
//                     ),
//                   ),
//                   // Container(
//                   //   width: 120,
//                   //   margin: EdgeInsets.only(right: 10),
//                   //   child: Column(
//                   //     crossAxisAlignment: CrossAxisAlignment.start,
//                   //     children: [
//                   //       Image.memory(
//                   //         Uint8List.fromList(decompressedBytes),
//                   //         width: 120,
//                   //         height: 120,
//                   //         fit: BoxFit.cover,
//                   //       ),
//                   //       SizedBox(
//                   //         height: 5,
//                   //       ),
//                   //       Text(
//                   //         audio.songname,
//                   //         style: TextStyle(color: Colors.white),
//                   //         maxLines: 2,
//                   //         overflow: TextOverflow.ellipsis,
//                   //       ),
//                   //     ],
//                   //   ),
//                   // ),
//                 );
//               }),
//         ),
//         SizedBox(
//           height: 20,
//         ),
//       ],
//     );
//   }

//   // Future<Uint8List?> _decompressImage(String base64Image) async {
//   //   //if (base64Image == null || base64Image.isEmpty) return null;
//   //   try {
//   //     final compressedBytes = base64.decode(base64Image);
//   //     final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);
//   //     return Uint8List.fromList(decompressedBytes);
//   //   } catch (e) {
//   //     print('Error decompressing image: $e');
//   //     return Uint8List(0); // Return an empty list in case of error
//   //   }
//   // }
// }
class MusicCategorySection extends StatelessWidget {
  final AudioContainer audioContainer;
  final int userId;
  final Function(Music) onTap;

  const MusicCategorySection({
    super.key,
   // required this.title,
    required this.audioContainer,
    required this.userId,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
   final displayedAudio = audioContainer.audiolist.length > 5
        ? audioContainer.audiolist.sublist(0, 5)
        : audioContainer.audiolist;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              audioContainer.categoryName,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: kWhite,
              ),
            ),
            TextButton(
                onPressed: () {},
                child: Text('See more', style: TextStyle(color: Colors.green))),
          ],
        ),
        // SizedBox(
        //   height: MediaQuery.sizeOf(context).height * 0.01,
        // ),
        SizedBox(
          height: MediaQuery.sizeOf(context).height * 0.22,
          child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: displayedAudio.length,
              itemBuilder: (context, index) {
                return Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: AudioCard(
                    audio: displayedAudio[index],
                    //movies: videoContainer.videoDescriptions,
                    initialIndex: index,
                  ),
                );
              }),
        ),
      ],
    );
       
  }
}
