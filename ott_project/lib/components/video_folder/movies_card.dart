import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:flutter/material.dart';

import 'package:ott_project/components/video_folder/movie.dart';
import 'package:ott_project/components/video_folder/video_play.dart';

import '../pallete.dart';
import 'movie_player_page.dart';

class MovieCard extends StatelessWidget {
  final Movie movie;
  final List<Movie> movies;
  final int initialIndex;

  const MovieCard(
      {Key? key,
      required this.movie,
      required this.movies,
      required this.initialIndex})
      : super(key: key);

  Widget build(BuildContext context) {
    final compressedBytes = base64.decode(movie.thumbnail);
    final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => VideoPlayerPage(
              initialIndex: initialIndex,
              movies: movies,
            ),
          ),
        );
      },
      child: Container(
        width: 100,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: decompressedBytes.isNotEmpty
                  ? Image.memory(
                      Uint8List.fromList(decompressedBytes),
                      width: 100,
                      height: 100,
                      fit: BoxFit.fill,
                    )
                  : Container(
                      color: Colors.grey,
                      width: 100,
                      height: 115,
                    ),
            ),
            SizedBox(height: 3),
            Text(
              movie.moviename,
              style: TextStyle(
                color: kWhite,
              ),
              softWrap: true,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }
}

class MoviesCard extends StatelessWidget {
  final Movies movie;
  final List<Movies> movies;
  final int initialIndex;

  const MoviesCard(
      {Key? key,
      required this.movie,
      required this.movies,
      required this.initialIndex})
      : super(key: key);

  Widget build(BuildContext context) {
    // final compressedBytes = base64.decode(movie.thumbnail);
    // final decompressedBytes = ZLibDecoder().decodeBytes(compressedBytes);
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => MoviePlayerPage(
              initialIndex: initialIndex,
              movies: movies,
            ),
          ),
        );
      },
      child: Container(
        width: 100,
        //height: 500,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: FutureBuilder<Uint8List?>(
                  future: movie.thumbnailImage,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.done &&
                        snapshot.hasData) {
                      return Image.memory(snapshot.data!,
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
            SizedBox(height: MediaQuery.sizeOf(context).height * 0.01),
            Text(
              movie.moviename,
              style: TextStyle(
                color: kWhite,
              ),
              softWrap: true,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }
}
