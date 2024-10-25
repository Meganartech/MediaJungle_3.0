import 'dart:convert';
import 'dart:ui';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:ott_project/components/music_folder/audio_container.dart';
import 'package:ott_project/components/music_folder/audio_provider.dart';
import 'package:ott_project/components/music_folder/liked_songs_page.dart';
import 'package:ott_project/components/music_folder/listen_again.dart';
import 'package:ott_project/components/music_folder/recently_played_manager.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/components/music_folder/audio.dart';
import 'package:ott_project/service/audio_api_service.dart';
import 'package:ott_project/service/service.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../background_image.dart';

class MusicPlayerPage extends StatefulWidget {
  final AudioDescription audio;
  // final bool isLiked;
  // final Function(Audio, bool) onLike;
  final Function(AudioDescription) onChange;
  final List<AudioDescription> audioList;
  final Function(AudioDescription) onDislike;

  MusicPlayerPage({
    Key? key,
    required this.audio,
    // required this.onLike,
    // required this.isLiked,
    this.audioList = const [],
    required this.onChange,
    required this.onDislike,
  }) : super(key: key);

  @override
  State<MusicPlayerPage> createState() => _MusicPlayerPageState();
}

class _MusicPlayerPageState extends State<MusicPlayerPage> {
  int? currentUserId;
  bool isLiked = false;
  late AudioProvider audioProvider;
  late AudioPlayer audioPlayer;
  int currentSongIndex = 0;
  Duration duration = Duration.zero;
  Duration position = Duration.zero;
  late AudioApiService audioApiService;
  List<String> likedSongIds = [];

  @override
  void initState() {
    super.initState();
    _getCurrentUserId().then((_) => _loadLikedStatus());
    _checkLikedStatus();
    audioApiService = AudioApiService();
    audioPlayer = AudioPlayer();

    currentSongIndex = widget.audioList.indexOf(widget.audio);
    audioPlayer.onDurationChanged.listen((d) {
      setState(() {
        duration = d;
      });
    });
    audioPlayer.onPositionChanged.listen((newPosition) {
      setState(() {
        position = newPosition;
      });
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {

      //need to change this to audiodescription!!!!!

      // audioProvider = Provider.of<AudioProvider>(context, listen: false);
      // audioProvider.setCurrentlyPlaying(widget.audio, widget.audioList);
      // _updateListeningHistory(widget.audio);
    });

    // decodeImage(widget.audio.thumbnail);
  }

  // Future<void> _initializeUserAndLikedStatus() async {
  //   await _getCurrentUSerId();
  //   if (currentUserId != null) {
  //     await _fetchLikedAudios();
  //     _checkIfLiked();
  //   }
  // }

  Future<void> _getCurrentUserId() async {
    currentUserId = await Service().getLoggedInUserId();
    setState(() {});
  }

  Future<void> _loadLikedStatus() async {
    if (currentUserId != null) {
      try {
        List<int> likedSongs =
            await audioApiService.getLikedSongs(currentUserId!);
        setState(() {
          isLiked = likedSongs.contains(widget.audio.id);
          likedSongIds = likedSongs.map((id) => id.toString()).toList();
        });
      } catch (e) {
        print('Error loading liked status: $e');
      }
    }
  }

  Future<void> _checkLikedStatus() async {
    setState(() {
      isLiked = likedSongIds.contains(widget.audio.id.toString());
    });
  }

  // void _handleLike(Audio audio, bool isLiked) {
  //   setState(() {
  //     isLiked = isLiked;
  //   });
  //   if (isLiked) {
  //     likedSongIds.add(audio.id.toString());
  //   } else {
  //     likedSongIds.remove(audio.id.toString());
  //   }
  //   _saveLikeStatus();
  // }

  Future<void> _toggleLike() async {
    if (currentUserId == null) {
      // Handle case where user is not logged in
      return;
    }
    bool success;
    if (isLiked) {
      success =
          await audioApiService.unlikeAudio(widget.audio.id, currentUserId!);
      if (success) {
        setState(() {
          isLiked = false;
          likedSongIds.remove(widget.audio.id.toString());
        });
      }
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Song removed')));
    } else {
      success =
          await audioApiService.likeAudio(widget.audio.id, currentUserId!);
      if (success) {
        setState(() {
          isLiked = true;
          likedSongIds.add(widget.audio.id.toString());
        });
      }
      widget.onChange(widget.audio);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Song added to likes')));
    }
    // if (!success) {
    //   print('Falied to like/unike');
    //   //Navigator.pop(context, isLiked);
    // } else {
    //   // Show error message to user
    //   ScaffoldMessenger.of(context).showSnackBar(
    //     SnackBar(content: Text('Failed to like audio. Please try again.')),
    //   );
    // }
  }

  // Future<void> _saveLikeStatus(int audioId, bool isLiked) async {
  //   if (isLiked)
  //     likedSongIds.add(audioId.toString());
  //   else {
  //     likedSongIds.remove(audioId.toString());
  //   }
  // }

  void _updateListeningHistory(Audio song) async {
    print("Updating listening history for song: ${song.songname}");
    final prefs = await SharedPreferences.getInstance();
    final String? encodedMap = prefs.getString('ListenAgain');
    Map<int, ListenAgain> listenAgain = {};
    if (encodedMap != null) {
      Map<String, dynamic> decodedMap = jsonDecode(encodedMap);
      listenAgain = decodedMap.map((key, value) =>
          MapEntry(int.parse(key), ListenAgain.fromJson(value)));
    }

    setState(() {
      if (listenAgain.containsKey(song.id)) {
        listenAgain[song.id]!.playCount++;
        listenAgain[song.id]!.lastPlayed = DateTime.now();
      } else {
        listenAgain[song.id] =
            ListenAgain(songId: song.id, lastPlayed: DateTime.now());
      }
    });

    final String encoded = jsonEncode(listenAgain
        .map((key, value) => MapEntry(key.toString(), value.toJson())));
    await prefs.setString('ListenAgain', encoded);
    print(
        "Updated listening history for song ${song.songname}: ${listenAgain[song.id]!.playCount} plays");

    final recentlyPlayedManager =
        Provider.of<RecentlyPlayedManager>(context, listen: false);
    recentlyPlayedManager.addRecentlyPlayed(song);
  }

  String formatTime(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    final hours = twoDigits(duration.inHours);
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));

    return [
      if (duration.inHours > 0) hours,
      minutes,
      seconds,
    ].join(":");
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AudioProvider>(
      builder: (context, audioProvider, child) {
        final currentAudio = audioProvider.audioDescriptioncurrently;
        final isPlaying = audioProvider.isPlaying;
        final duration = audioProvider.duration;
        final position = audioProvider.position;
        // final decodedImage =
        //     audioProvider.getDecodedImage(currentAudio!.thumbnail);
        IconData repeatIcon;
        Color repeatColor;
        switch (audioProvider.repeatMode) {
          case RepeatMode.off:
            repeatIcon = Icons.repeat;
            repeatColor = Colors.white;
            break;
          case RepeatMode.all:
            repeatIcon = Icons.repeat;
            repeatColor = Colors.green;
            break;
          case RepeatMode.one:
            repeatIcon = Icons.repeat_one;
            repeatColor = Colors.green;
            break;
        }
        return Stack(
          children: [
            BackgroundImage(),
            SizedBox(height: 10),
            Scaffold(
              resizeToAvoidBottomInset: false,
              appBar: AppBar(
                backgroundColor: Colors.transparent,
                automaticallyImplyLeading: false,
                leading: IconButton(
                    onPressed: () {
                      widget.onDislike;
                      Navigator.pop(context);
                    },
                    icon: Icon(
                      Icons.arrow_back_rounded,
                      color: Colors.white,
                    )),
                actions: [
                  IconButton(
                    onPressed: () => _showDrawer(context),
                    icon: Icon(
                      Icons.more_vert_rounded,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              backgroundColor: Colors.transparent,
              body: Container(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 300,
                      height: 300,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        color: Colors.grey[300],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.asset('assets/icon/media_jungle.png'),
                        // Image.memory(
                        //   ,
                        //   fit: BoxFit.fill,
                        //   // width: double.infinity,
                        //   // height: double.infinity,
                        // ),
                      ),
                    ),
                    SizedBox(height: 20),
                    Text(
                      currentAudio!.audioTitle,
                      style: TextStyle(
                          color: kWhite,
                          fontSize: 20,
                          fontWeight: FontWeight.bold),
                    ),
                    Text(
                      currentAudio.movieName,
                      style: TextStyle(fontSize: 16, color: Colors.white70),
                    ),
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        IconButton(
                            onPressed: _toggleLike,
                            icon: Icon(
                              isLiked
                                  ? Icons.favorite_rounded
                                  : Icons.favorite_border_rounded,
                              color: isLiked ? Colors.red : Colors.white,
                              size: 30,
                            )),
                        IconButton(
                            onPressed: () => _showCreatePlaylistOption(context),
                            icon: Icon(
                              Icons.add_circle_outline_rounded,
                              color: Colors.white,
                              size: 30,
                            )),
                        IconButton(
                            onPressed: () {},
                            icon: Icon(
                              Icons.share_rounded,
                              color: Colors.white,
                              size: 30,
                            ))
                      ],
                    ),
                    SafeArea(
                      child: Padding(
                        padding: const EdgeInsets.only(left: 7),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            Text(
                              'Like',
                              style: TextStyle(color: kWhite),
                            ),
                            Text(
                              'Playlist',
                              style: TextStyle(color: kWhite),
                            ),
                            Text(
                              'Share',
                              style: TextStyle(color: kWhite),
                            ),
                          ],
                        ),
                      ),
                    ),
                    SizedBox(height: 20),
                    Slider(
                      min: 0,
                      max: duration.inSeconds.toDouble(),
                      value: position.inSeconds
                          .toDouble()
                          .clamp(0, duration.inSeconds.toDouble()),
                      onChanged: (value) {
                        final newPosition = Duration(seconds: value.toInt());
                        audioProvider.seekTo(newPosition);
                      },
                      activeColor: Colors.white,
                      inactiveColor: Colors.grey,
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(formatTime(position),
                              style: TextStyle(color: Colors.white)),
                          Text(formatTime(duration),
                              style: TextStyle(color: Colors.white)),
                        ],
                      ),
                    ),
                    SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        IconButton(
                          onPressed: audioProvider.toggleShuffle,
                          icon: Icon(Icons.shuffle_rounded,
                              color: audioProvider.isShuffleOn
                                  ? Colors.green
                                  : Colors.white,
                              size: 40),
                        ),
                        IconButton(
                          onPressed: audioProvider.playPrevious,
                          icon: Icon(Icons.skip_previous_rounded,
                              color: Colors.white, size: 40),
                        ),
                        IconButton(
                          onPressed: audioProvider.playPause,
                          icon: Icon(
                            isPlaying
                                ? Icons.pause_circle_filled_rounded
                                : Icons.play_circle_filled_rounded,
                            color: Colors.white,
                            size: 45,
                          ),
                        ),
                        IconButton(
                          onPressed: audioProvider.playNext,
                          icon: Icon(Icons.skip_next_rounded,
                              color: Colors.white, size: 40),
                        ),
                        IconButton(
                          onPressed: audioProvider.toggleRepeat,
                          icon: Icon(repeatIcon, color: repeatColor, size: 40),
                        ),
                      ],
                    ),
                    Spacer(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        TextButton(
                          onPressed: () {},
                          child: Text("LYRICS",
                              style: TextStyle(color: Colors.white)),
                        ),
                        TextButton(
                          onPressed: () {},
                          child: Text("RELATED",
                              style: TextStyle(color: Colors.white)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  void _showDrawer(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.black.withOpacity(0.8),
      builder: (BuildContext context) {
        // return BackdropFilter(
        //   filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
        //   child:
        return Container(
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: Icon(Icons.add, color: Colors.white),
                title: Text('Add to Playlist',
                    style: TextStyle(color: Colors.white)),
                onTap: () {
                  Navigator.pop(context);
                  _showCreatePlaylistOption(context);
                },
              ),
              ...audioProvider.playlists.map((likedsong) {
                final isAudioInlikedsong = likedsong.audios
                    .any((audio) => audio.id == widget.audio.id);
                return ListTile(
                  leading: Icon(
                    Icons.favorite_outline_rounded,
                    color: Colors.white,
                  ),
                  title: Text(
                    'Add to Liked Songs',
                    style: TextStyle(color: Colors.white),
                  ),
                  onTap: isAudioInlikedsong
                      ? null // Disable onTap if the song is already in the playlist
                      : () {
                        //need to change to audioDescription!!!

                          // audioProvider.addAudioToLikedsong(
                          //     likedsong, widget.audio);
                          // Navigator.pop(context);
                          // ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                          //   content: Text('Added to Liked Songs'),
                          // ));
                        },
                  // Optionally, you can visually indicate if the song is already in the playlist
                  trailing: isAudioInlikedsong
                      ? Icon(Icons.check,
                          color: Colors
                              .green) // A checkmark to show the song is already added
                      : null,
                );
              }).toList(),
              ListTile(
                leading: Icon(Icons.share_rounded, color: Colors.white),
                title: Text('Share', style: TextStyle(color: Colors.white)),
                onTap: () {
                  Navigator.pop(context);
                  //_showCreatePlaylistDialog(context);
                },
              ),
            ],
          ),
        );
        //);
      },
    );
  }

  void _showCreatePlaylistOption(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.black.withOpacity(0.8),
      builder: (BuildContext context) {
        final audioProvider =
            Provider.of<AudioProvider>(context, listen: false);
        return BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.transparent,
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  leading: Icon(Icons.add, color: Colors.white),
                  title: Text('Create Playlist',
                      style: TextStyle(color: Colors.white)),
                  onTap: () {
                    Navigator.pop(context);
                    _showCreatePlaylistDialog(context);
                  },
                ),
                ListTile(
                  leading: Icon(
                    Icons.favorite_outline_rounded,
                    color: Colors.white,
                  ),
                  title: Text(
                    'Liked Songs',
                    style: TextStyle(color: Colors.white),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => LikedSongsPage(userId: 7)));
                  },
                ),
                ...audioProvider.playlists.map((playlist) {
                  // Check if the current song is already in the playlist
                  final isAudioInPlaylist = playlist.audios
                      .any((audio) => audio.id == widget.audio.id);
                  print(playlist.title);
                  return ListTile(
                    leading:
                        Icon(Icons.playlist_play_rounded, color: Colors.white),
                    title: Text(
                      playlist.title,
                      style: TextStyle(color: Colors.white),
                    ),
                    onTap: isAudioInPlaylist
                        ? null // Disable onTap if the song is already in the playlist
                        : () {
                            // audioProvider.addAudioToPlaylist(
                            //     playlist, widget.audio);
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text('Added to ${playlist.title}'),
                            ));
                          },
                    // Optionally, you can visually indicate if the song is already in the playlist
                    trailing: isAudioInPlaylist
                        ? Icon(Icons.check,
                            color: Colors
                                .green) // A checkmark to show the song is already added
                        : null,
                  );
                }).toList(),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showCreatePlaylistDialog(BuildContext context) {
    final TextEditingController titleController = TextEditingController();
    final TextEditingController descriptionController = TextEditingController();
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
          child: AlertDialog(
            backgroundColor: Color.fromARGB(119, 68, 66, 66),
            title: Text('New playlist', style: TextStyle(color: Colors.white)),
            content: SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.7,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: titleController,
                      decoration: InputDecoration(
                        hintText: 'Title',
                        hintStyle: TextStyle(color: Colors.white60),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white60),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white),
                        ),
                      ),
                      style: TextStyle(color: Colors.white),
                    ),
                    SizedBox(height: 10),
                    TextField(
                      controller: descriptionController,
                      decoration: InputDecoration(
                        hintText: 'Description',
                        hintStyle: TextStyle(color: Colors.white60),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white60),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white),
                        ),
                      ),
                      style: TextStyle(color: Colors.white),
                    ),
                  ],
                ),
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('Cancel', style: TextStyle(color: Colors.white)),
              ),
              TextButton(
                onPressed: () {
                  final title = titleController.text;
                  final description = descriptionController.text;
                  if (title.isNotEmpty) {
                    final audioProvider =
                        Provider.of<AudioProvider>(context, listen: false);
                    audioProvider.createPlaylist(title, description);
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Playlist "$title" created')),
                    );
                  }
                },
                child: Text('Create', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        );
      },
    );
  }
}
