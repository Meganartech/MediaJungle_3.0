import 'dart:async';

import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/components/video_folder/cast_crew.dart';

import 'package:ott_project/components/video_folder/movie.dart';

import 'package:ott_project/service/movie_api_service.dart';

import 'package:url_launcher/url_launcher.dart' as url_launcher;

import 'package:video_player/video_player.dart';

class VideoPlayerPage extends StatefulWidget {
  final List<Movie> movies;
  final int initialIndex;

  VideoPlayerPage({
    required this.movies,
    this.initialIndex = 0,
  });

  @override
  _VideoPlayerPageState createState() => _VideoPlayerPageState();
}

class _VideoPlayerPageState extends State<VideoPlayerPage> {
  late VideoPlayerController _controller;
  late Future<void> _initializeVideoPlayerFuture;
  late int _currentIndex;
  List<CastMember> _castAndCrew = [];
  late MovieApiService _apiService;
  late Movie _movieDetails;
  bool isFullScreen = false;
  bool _showControls = true;
  final String currentCategory = '';
  Timer? _hideControlsTimer;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _apiService = MovieApiService();
    _initializeVideoPlayerFuture = _fetchVideoDetail(_currentIndex);
  }

  Future<void> _fetchVideoDetail(int movieIndex) async {
    try {
      _movieDetails =
          await _apiService.fetchVideoDetail(widget.movies[movieIndex].id);

     // await _fetchCastAndCrew(widget.movies[movieIndex].id);
      setState(() {});
      return _initializeVideoPlayer(widget.movies[movieIndex].id);
    } catch (e) {
      print('Error fetching video details: $e');
    }
  }

  // Future<void> _fetchCastAndCrew(int movieId) async {
  //   try {
  //     _castAndCrew = await _apiService.fetchCastAndCrew(movieId);
  //     setState(() {});
  //     //return _initializeVideoPlayer(widget.movies[movieIndex].id);
  //   } catch (e) {
  //     print('Error fetching cast and crew: $e');
  //   }
  // }

  Future<void> _initializeVideoPlayer(int id) async {
    try {
      String videoStreamUrl = await _apiService.fetchVideoStreamUrl(id);
      _controller = VideoPlayerController.networkUrl(Uri.parse(videoStreamUrl));
      // _initializeVideoPlayerFuture = _controller.initialize();
      await _controller.initialize();
      _controller.setLooping(true);
      _controller.setVolume(1.0);
      _controller.addListener(() {
        setState(() {});
      });
      //await _fetchVideoDetail(id);
      //await _fetchCastAndCrew(id);
      _showControls = true;
      _startHideControlsTimer();
      return Future.value();
    } catch (e) {
      // Handle error
      return Future.error(e);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _hideControlsTimer?.cancel();
    if (isFullScreen) {
      _exitFullScreen();
    }

    super.dispose();
  }

  void _playPrevious() {
    if (_currentIndex > 0) {
      setState(() {
        _currentIndex--;
        _initializeVideoPlayer(widget.movies[_currentIndex].id);
      });
    }
  }

  void _playNext() {
    if (_currentIndex < widget.movies.length - 1) {
      setState(() {
        _currentIndex++;
        _initializeVideoPlayer(widget.movies[_currentIndex].id);
      });
    }
  }

  void skipForward() {
    final newPosition = _controller.value.position + Duration(seconds: 10);
    _controller.seekTo(newPosition);
  }

  void skipBackward() {
    final newPosition = _controller.value.position - Duration(seconds: 10);
    _controller.seekTo(newPosition);
  }

  void _toggleFullScreen() {
    setState(() {
      isFullScreen = !isFullScreen;
    });
    if (isFullScreen) {
      _enterFullScreen();
    } else {
      _exitFullScreen();
    }
  }

  void _toggleControls() {
    setState(() {
      _showControls = !_showControls;
    });
    print('Controls:$_showControls');
    if (_showControls) {
      _startHideControlsTimer();
    } else {
      _hideControlsTimer?.cancel();
    }
  }

  void _enterFullScreen() {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
    SystemChrome.setPreferredOrientations(
        [DeviceOrientation.landscapeLeft, DeviceOrientation.landscapeRight]);
  }

  void _exitFullScreen() {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    SystemChrome.setPreferredOrientations(
        [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);
  }

  String _formatDuration(Duration duration) {
    final minutes = duration.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  void _startHideControlsTimer() {
    _hideControlsTimer?.cancel();
    _hideControlsTimer = Timer(Duration(seconds: 3), () {
      setState(() {
        _showControls = false;
      });
    });
  }

  void _showShareOptions(BuildContext context) {
    final String shareUrl =
        'http://192.168.12.128:8080/api/GetvideoDetail/${_movieDetails.id}';
    final String shareText =
        'Check out "${_movieDetails.moviename}" on Our Movie App!';

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (BuildContext bc) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.grey[900],
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Wrap(
            children: <Widget>[
              ListTile(
                leading: Icon(Icons.messenger_outline, color: Colors.white),
                title: Text('Send in Messenger',
                    style: TextStyle(color: Colors.white)),
                onTap: () async {
                  Navigator.pop(context);
                  await _launchUrlWithFallback(
                      'fb-messenger://share/?link=$shareUrl',
                      'https://www.messenger.com/share/?link=$shareUrl');
                },
              ),
              ListTile(
                leading: FaIcon(
                  FontAwesomeIcons.whatsapp,
                  color: Colors.white,
                ),
                title: Text('Share on Whatsapp',
                    style: TextStyle(color: Colors.white)),
                onTap: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Opening WhatsApp...')),
                  );
                  _shareViaWhatsApp(shareText, shareUrl);
                  // await _launchUrlWithFallback(
                  //     'whatsapp://send?text=$shareText $shareUrl',
                  //     'https://wa.me/?text=${Uri.encodeComponent('$shareText $shareUrl')}');
                },
              ),
              ListTile(
                leading: Icon(Icons.link, color: Colors.white),
                title: Text('Copy link', style: TextStyle(color: Colors.white)),
                onTap: () {
                  Navigator.pop(context);
                  Clipboard.setData(ClipboardData(text: shareUrl));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Link copied to clipboard')),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _shareViaWhatsApp(String shareText, String shareUrl) async {
    final String encodedText =
        'Check%20out%20%22Thunivu%22%20on%20Our%20Movie%20App!%20http%3A%2F%2F192.168.12.128%3A8080%2Fapi%2FGetvideoDetail%2F2';
    print(encodedText);
    final String whatsappUrl = 'whatsapp://send?text=$encodedText';
    print(whatsappUrl);
    try {
      final Uri whatsappUri = Uri.parse(whatsappUrl);
      if (await url_launcher.canLaunchUrl(whatsappUri)) {
        final bool launched = await url_launcher.launchUrl(whatsappUri);
        if (!launched) {
          throw 'Could not launch WhatsApp';
        }
      } else {
        throw 'WhatsApp is not installed';
      }
    } catch (e) {
      print('Error launching WhatsApp: $e');
      // Fallback to clipboard
      await Clipboard.setData(ClipboardData(text: '$shareText $shareUrl'));
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content:
                Text('Couldn\'t open WhatsApp. Link copied to clipboard.')),
      );
    }
  }

  Future<void> _launchUrlWithFallback(String url, String fallbackUrl) async {
    try {
      bool launched = await url_launcher.launchUrl(Uri.parse(url));
      if (!launched) {
        // If the app-specific URL failed, try the fallback URL
        launched = await url_launcher.launchUrl(Uri.parse(fallbackUrl));
        if (!launched) {
          throw 'Could not launch $fallbackUrl';
        }
      }
    } catch (e) {
      print('Error launching URL: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content:
                Text('Failed to open app. Please try another sharing method.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _initializeVideoPlayerFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          // Handle error
          return Center(child: Text('Error: ${snapshot.error}'));
        } else {
          return Scaffold(
            backgroundColor: Colors.transparent,
            body: SafeArea(
              child: Stack(
                children: [
                  BackgroundImage(),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      if (!isFullScreen)
                        AppBar(
                          backgroundColor: Colors.transparent,
                          elevation: 0,
                          leading: IconButton(
                            icon: Icon(Icons.arrow_back, color: Colors.white),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ),
                      if (!isFullScreen) _buildVideoPlayer(),
                      if (!isFullScreen) _buildMovieDetails(),
                      if (isFullScreen) Expanded(child: _buildVideoPlayer()),
                    ],
                  ),
                  if (!isFullScreen) _buildSuggestedMoviesDrawer(),
                  // SuggestedMoviesDrawer(currentCategory: currentCategory),
                ],
              ),
            ),
          );
        }
      },
    );
  }

  Widget _buildLeftControls() {
    return Row(
      //  mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        IconButton(
          onPressed: _playPrevious,
          icon: Icon(
            Icons.skip_previous,
            size: 25,
            color: Colors.white,
          ),
        ),

        IconButton(
            onPressed: skipBackward,
            icon: Icon(
              Icons.replay_10_rounded,
              size: 25,
              color: kWhite,
            )),
        // SizedBox(width: 10),
        IconButton(
            onPressed: () {
              setState(() {
                if (_controller.value.isPlaying) {
                  _controller.pause();
                } else {
                  _controller.play();
                }
              });
            },
            icon: Icon(
              _controller.value.isPlaying ? Icons.pause : Icons.play_arrow,
              size: 25,
              color: kWhite,
            )),
        // SizedBox(width: 10),
        IconButton(
            onPressed: skipForward,
            icon: Icon(
              Icons.forward_10_rounded,
              size: 25,
              color: kWhite,
            )),
        IconButton(
          onPressed: _playNext,
          icon: Icon(
            Icons.skip_next,
            size: 25,
            color: Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildRightControls() {
    return Row(
      children: [
        IconButton(
            onPressed: _toggleFullScreen,
            icon: Icon(
              isFullScreen
                  ? Icons.fullscreen_exit_rounded
                  : Icons.fullscreen_rounded,
              size: 25,
              color: kWhite,
            )),
      ],
    );
  }

  Widget _buildVideoPlayer() {
    return SafeArea(
      child: Center(
        child: AspectRatio(
          aspectRatio: _controller.value.aspectRatio,
          child: Stack(
            alignment: Alignment.bottomCenter,
            children: [
              GestureDetector(
                onTap: _toggleControls,
                child: VideoPlayer(_controller),
              ),
              if (_controller.value.isBuffering)
                Center(
                  child: CircularProgressIndicator(),
                ),
              if (_showControls) buildControls(),
              if (isDrawerOpen)
                BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
                  child: Container(
                    color: Colors.black.withOpacity(0.3),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildControls() {
    return Container(
      color: Colors.black54,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _formatDuration(_controller.value.position),
                  style: TextStyle(color: Colors.white),
                ),
                Text(
                  _formatDuration(_controller.value.duration),
                  style: TextStyle(color: Colors.white),
                )
              ],
            ),
          ),
          Slider(
            activeColor: Colors.red,
            inactiveColor: Colors.grey,
            value: _controller.value.position.inSeconds.toDouble(),
            max: _controller.value.duration.inSeconds.toDouble(),
            onChanged: (value) {
              _controller.seekTo(Duration(seconds: value.toInt()));
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildLeftControls(),
                _buildRightControls(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMovieDetails() {
    return Container(
      padding: EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 170,
                child: Text(
                  _movieDetails.moviename,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              SizedBox(
                width: 80,
              ),
              Text(
                '${_movieDetails.duration}',
                style: TextStyle(color: Colors.grey),
              ),
            ],
          ),
          SizedBox(height: 8),
          Text(
            '${_movieDetails.language} | ${_movieDetails.category}',
            // ${_movieDetails.year}',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
          SizedBox(height: 40),
          Text(
            'Cast And Crew',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 8),
          Container(
            height: 110,
            child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _castAndCrew.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 30,
                          backgroundImage: Image.memory(
                            _castAndCrew[index].imageBytes,
                            fit: BoxFit.fill,
                          ).image,
                        ),
                        SizedBox(
                          height: 6,
                        ),
                        Container(
                          // padding: EdgeInsets.symmetric(horizontal: 8),
                          width: 79,
                          child: Text(
                            _castAndCrew[index].name,
                            style: TextStyle(color: Colors.white, fontSize: 12),
                            textAlign: TextAlign.center,
                            softWrap: true,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  );
                }),
          ),
          SizedBox(
            height: 16,
          ),
        ],
      ),
    );
  }

  bool isDrawerOpen = false;

  Widget _buildSuggestedMoviesDrawer() {
    return DraggableScrollableSheet(
      initialChildSize: 0.1,
      minChildSize: 0.1,
      maxChildSize: 0.5,
      builder: (context, scrollController) {
        return GestureDetector(
          onTap: () {
            setState(() {
              isDrawerOpen = !isDrawerOpen;
            });
          },
          child: Container(
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.8),
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: SingleChildScrollView(
              controller: scrollController,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 5,
                      margin: EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.grey,
                        borderRadius: BorderRadius.circular(2.5),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () {
                            _showShareOptions(context);
                          },
                          icon: Icon(
                            Icons.share_rounded,
                            color: Colors.white,
                          ),
                          label: Text(
                            'Share',
                            style: TextStyle(color: Colors.white),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color.fromARGB(255, 65, 65, 100),
                          ),
                        ),
                        ElevatedButton.icon(
                          onPressed: () {},
                          icon: Icon(
                            Icons.add_box_outlined,
                            color: Colors.white,
                          ),
                          label: Text(
                            'Add To Watchlist',
                            style: TextStyle(color: Colors.white),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color.fromARGB(255, 65, 65, 100),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.all(16),
                    child: Text(
                      'Suggestion Movie',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: List.generate(
                        5,
                        (index) => Container(
                          width: 150,
                          margin: EdgeInsets.only(right: 16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.asset(
                                  'assets/images/bgimg.jpg',
                                  width: 130,
                                  height: 100,
                                  fit: BoxFit.cover,
                                ),
                              ),
                              SizedBox(height: 8),
                              Text(
                                'Movie Name',
                                style: TextStyle(color: Colors.white),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  // Widget _buildLoadingIndicator() {
  //   return Center(
  //     child: CircularProgressIndicator(),
  //   );
  // }
}
