import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:flutter/material.dart';
import 'package:ott_project/components/video_folder/video_play.dart';

import '../components/video_folder/movie.dart';

class SearchResultMovie extends StatelessWidget {
  final Movie movie;
  final List<Movie> allMovies;
  final int index;
  const SearchResultMovie(
      {super.key,
      required this.movie,
      required this.allMovies,
      required this.index});

  @override
  Widget build(BuildContext context) {
    final compressedBytes = base64.decode(movie.thumbnail);

    final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);
    return GestureDetector(
      onTap: () {
        Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => VideoPlayerPage(
                movies: allMovies,
                initialIndex: index,
              ),
            ));
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
                height: 120,
                fit: BoxFit.cover,
              ),
            ),
            SizedBox(width: 16),
            Expanded(
              child: Text(
                movie.moviename,
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
