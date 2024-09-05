import 'package:flutter/material.dart';
import 'package:ott_project/components/music_folder/audio.dart';
import 'package:ott_project/components/music_folder/audio_provider.dart';
import 'package:ott_project/components/music_folder/music_player_page.dart';
import 'package:ott_project/components/video_folder/movie.dart';
import 'package:ott_project/components/video_folder/video_play.dart';
import 'package:provider/provider.dart';

class SearchAudioVideo extends StatefulWidget {
  final List<Movie> allMovies;
  final List<Audio> allmusic;
  const SearchAudioVideo(
      {super.key, required this.allMovies, required this.allmusic});

  @override
  State<SearchAudioVideo> createState() => _SearchAudioVideoState();
}

class _SearchAudioVideoState extends State<SearchAudioVideo> {
  final TextEditingController _searchController = TextEditingController();
  List<dynamic> _filteredContent = [];

  void _filterContent(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredContent = [];
      } else {
        _filteredContent = [
          ...widget.allMovies.where((movie) =>
              movie.moviename.toLowerCase().contains(query.toLowerCase())),
          ...widget.allmusic.where((music) =>
              music.songname.toLowerCase().contains(query.toLowerCase())),
        ];
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          controller: _searchController,
          style: TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Search Movies and Songs...',
            hintStyle: TextStyle(color: Colors.white54),
            border: InputBorder.none,
          ),
          onChanged: _filterContent,
        ),
        Expanded(
          child: ListView.builder(
            itemCount: _filteredContent.length,
            itemBuilder: (context, index) {
              final item = _filteredContent[index];
              return ListTile(
                title: Text(
                  item is Movie ? item.moviename : item.songname,
                  style: TextStyle(color: Colors.white),
                ),
                subtitle: Text(
                  item is Movie ? 'Movie' : 'Song',
                  style: TextStyle(color: Colors.white70),
                ),
                leading: item is Movie
                    ? Icon(Icons.movie, color: Colors.white)
                    : Icon(Icons.music_note, color: Colors.white),
                onTap: () {
                  if (item is Movie) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => VideoPlayerPage(
                          movies: widget.allMovies,
                          initialIndex: widget.allMovies.indexOf(item),
                        ),
                      ),
                    );
                  } else if (item is Audio) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => MusicPlayerPage(
                          audio: item,
                          audioList: widget.allmusic,
                          onDislike: (p0) {},
                          onChange: (newAudio) {
                            Provider.of<AudioProvider>(context, listen: false)
                                .setCurrentlyPlaying(newAudio, widget.allmusic);
                          },
                        ),
                      ),
                    );
                  }
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
