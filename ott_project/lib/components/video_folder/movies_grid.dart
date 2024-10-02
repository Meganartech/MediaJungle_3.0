// import 'package:flutter/material.dart';
// import 'package:ott_project/components/video_folder/movie.dart';
// import 'package:ott_project/components/video_folder/movies_card.dart';

// class MoviesGrid extends StatelessWidget {
//   //final List<Movie> movies;
//   final List<Movies> videos;
//   const MoviesGrid({super.key, required this.videos});
//   @override
//   Widget build(BuildContext context) {
//     if (videos.isEmpty) {
//       return Center(
//         child: Text('No Movies Found'),
//       );
//     } else {
//       //final movies = snapshot.data!;
//       return GridView.builder(
//           gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
//             crossAxisCount: MediaQuery.of(context).size.width < 800 ? 2 : 3,
//             childAspectRatio: 0.75,
//             mainAxisSpacing: 16.0,
//             crossAxisSpacing: 16.0,
//           ),
//           itemCount: videos.length,
//           itemBuilder: ((context, index) {
//             //final movie = movies[index];
//             return MoviesCard(
//               movie: videos[index],
//               movies: videos,
//               initialIndex: index,
//             );
//           }));
//     }
//   }
// }
