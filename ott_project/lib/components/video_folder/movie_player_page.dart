import 'dart:async';

import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/pallete.dart';
import 'package:ott_project/components/video_folder/cast_crew.dart';
import 'package:ott_project/components/video_folder/suggest_movie.dart';

import 'package:ott_project/components/video_folder/video_container.dart';
import 'package:ott_project/components/library/watch_later.dart';

import 'package:ott_project/service/movie_api_service.dart';
import 'package:ott_project/service/movie_service_page.dart';
import 'package:ott_project/service/service.dart';
import 'package:ott_project/service/watch_later_service.dart';

import 'package:url_launcher/url_launcher.dart' as url_launcher;

import 'package:video_player/video_player.dart';

class MoviesPlayerPage extends StatefulWidget {
  final List<VideoDescription> videoDescriptions;
  final int initialIndex;
  final int categoryId;

  MoviesPlayerPage({
    required this.videoDescriptions,
    required this.categoryId,
    this.initialIndex = 0,
  });

  @override
  _MoviesPlayerPageState createState() => _MoviesPlayerPageState();
}

class _MoviesPlayerPageState extends State<MoviesPlayerPage> {
  late VideoPlayerController _controller;
  late Future<void> _initializeVideoPlayerFuture;
  late int _currentIndex;
  List<CastCrew> castCrew = [];
  List<VideoDescription> suggestedMovies =[];
  late MovieApiService _apiService;
  late WatchLaterService _watchLater;
  late VideoDescription _movieDetails;
  bool isFullScreen = false;
  bool _showControls = true;
  final String currentCategory = '';
  Timer? _hideControlsTimer;
  bool isInWatchList = false;
  bool isAddingtoWatchList= false;
  late int userId;
  

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _apiService = MovieApiService();
    _watchLater = WatchLaterService();
    _initializeVideoPlayerFuture = _fetchVideoScreenDetails(widget.videoDescriptions[_currentIndex].id, widget.categoryId);
    fetchSuggestedMovies();
    _initializeUserWatchList();
  }

  Future<void> _fetchVideoScreenDetails(int videoId,int categoryId) async{

    try{
      print('Video screen....');
      print('VideoId:$videoId, CategoryId : $categoryId');
      _movieDetails = await _apiService.fetchVideoScreenDetails(videoId, categoryId);
     //List<int> castIds = _movieDetails.castAndCrewList;
    if( _movieDetails.castAndCrewList.isNotEmpty){
      castCrew = await _apiService.fetchCastAndCrew(_movieDetails.castAndCrewList);
    }
    //  await _fetchCastAndCrewList(castIds);
      setState(() { });
      return _initializeVideoPlayer(_movieDetails.id);
    }catch(e){
      print('Error fetching video screen details: $e');
    }
  }

  Future<void> _initializeVideoPlayer(int videoId) async {
    try {
      print("Video URL: $videoId");

      String videoStreamUrl = await _apiService.fetchVideoStreamUrl(videoId);
      _controller = VideoPlayerController.network(Uri.parse(videoStreamUrl).toString());

      final videoDetails = await _apiService.fetchMovieDetail(videoId);
      // final Uri videoStreamUrl = Uri.parse(videoUrl);
      // _controller = VideoPlayerController.networkUrl(videoStreamUrl);
      // _initializeVideoPlayerFuture = _controller.initialize();
      await _controller.initialize();
      _controller.setLooping(true);
      _controller.setVolume(1.0);
      _controller.addListener(() {
        setState(() {});
      });
      //await _fetchVideoDetail(id);
     // await  _fetchCastAndCrewList(castIds);
      _showControls = true;
      _startHideControlsTimer();
      return Future.value();
    } catch (e) {
      // Handle error
      return Future.error(e);
    }
  }

  void fetchSuggestedMovies() async{
      try{
        print('Category id for suggestion');
        print(widget.categoryId);
        final videoContainers  = await MovieService.fetchVideoContainer();

        final matchingContainers = videoContainers.firstWhere((container)=> container.categoryId ==  widget.categoryId,orElse:()=> throw Exception('No matching category found'));
        
        final movies = matchingContainers.videoDescriptions;
        for(var movie in movies){
          await movie.fetchImage();
           print("Movie Title: ${movie.videoTitle}, Thumbnail: ${movie.thumbnail}");
        }
        setState(() {
          suggestedMovies = movies.take(5).toList();
          for (var movie in suggestedMovies) {
  print("Movie Title: ${movie.videoTitle}, Thumbnail: ${movie.thumbnail}");
}
        });
        
        print('Suggested movie:${suggestedMovies.length}');
      }catch(e){
          print('Failed to fetch suggested movies:$e');
      }
  }

  Future<void>  _initializeUserWatchList() async{
    try{
      final currentUser = await Service().getLoggedInUserId();
      if(currentUser!= null){
        userId = currentUser;
        await _checkWatchLaterStatus();
      }else{
        print('User not logged in');
      }
    }catch (e) {
      print('Error initializing user watchlist: $e');
    }
  }

  Future<void> _checkWatchLaterStatus() async{
  try{
    final watchList = await _watchLater.getWatchLaterVideos(userId);
    setState(() {
      isInWatchList = watchList.any((item)=> item.videoId == _movieDetails.id);
    });
    
  }catch (e) {
    print('Error checking watchlist status: $e');
  }
    }

  Future<void> _toggleWatchLater() async{
    if(isAddingtoWatchList) return;
    if(userId == null){
        ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Please log in to use watchlist feature'),
          action: SnackBarAction(
            label: 'Login',
            onPressed: () {
              // Navigate to login screen
              Navigator.pushNamed(context, '/login');
            },
          ),
        ),
      );
      return;
    }
    setState(() {
      isAddingtoWatchList = true;
    });
    try{
      if(isInWatchList){
        await _watchLater.removeWatchLater(_movieDetails.id, userId);
      }else{
        await _watchLater.addToWatchLater(_movieDetails.id, userId);
      }
      setState(() {
        isInWatchList = !isInWatchList;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(isInWatchList 
            ? 'Added to your watchlist' 
            : 'Removed from your watchlist'
          ),
          duration: Duration(seconds: 2),
        ),
      );
    } catch (e) {
      print('Error toggling watchlist: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to update your watchlist'),
          duration: Duration(seconds: 2),
        ),
      );
    }finally{
      setState(() {
        isAddingtoWatchList = false;
      });
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
        _initializeVideoPlayer(widget.videoDescriptions[_currentIndex].id);
      });
    }
  }

  void _playNext() {
    if (_currentIndex < widget.videoDescriptions.length - 1) {
      setState(() {
        _currentIndex++;
        _initializeVideoPlayer(widget.videoDescriptions[_currentIndex].id);
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
        'Check out "${_movieDetails.videoTitle}" on Our Movie App!';

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
                  if (!isFullScreen) 
                  _buildSuggestedMoviesDrawer(),
                  //SuggestedMoviesDrawer(currentCategory: widget.categoryId),
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
          aspectRatio: 16/9,
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
              if(_showControls) ...[
  //             Positioned(
  //               top:16,
  //               left:0,
  //               child:IconButton(icon: Icon(Icons.arrow_back_rounded,color: Colors.white,),
  //               onPressed:(){
  //                 if(Navigator.canPop(context)){
  //                 Navigator.pop(context);
  //                 }else{
  //                   print('No page');
  //                 }
                  
  // }),
  //             ),
             buildControls(),
              ],
              // if (isDrawerOpen)
              //   BackdropFilter(
              //     filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
              //     child: Container(
              //       color: Colors.black.withOpacity(0.3),
              //     ),
              //   ),
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
                //width: 170,
                child: Text(
                  _movieDetails.videoTitle,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              // SizedBox(height: 8),
              // Text(
              //   '${_movieDetails.mainVideoDuration}',
              //   style: TextStyle(color: Colors.grey),
              // ),
            ],
          ),
         
             SizedBox(height: 8),
              Text(
                '${_movieDetails.mainVideoDuration}',
                style: TextStyle(color: Colors.grey),
              ),
          SizedBox(height: MediaQuery.sizeOf(context).height * 0.04),
          Text(
            'Cast And Crew',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 8),
          Container(
            height: MediaQuery.sizeOf(context).height * 0.12,
            child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: castCrew.length,
                itemBuilder: (context, index) {
                  CastCrew cast = castCrew[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: Column(
                      children: [

                        // Text('cnvvn',style:TextStyle(color: Colors.white),),
                        CircleAvatar(
                          radius: 30,
                          backgroundImage: cast.image != null ? MemoryImage(cast.image!) :   AssetImage('assets/icon/thupaki.png') as ImageProvider
                                                ),
                        SizedBox(
                          height: 6,
                        ),
                        Container(
                          // padding: EdgeInsets.symmetric(horizontal: 8),
                          width: 79,
                          child: Text(
                            cast.name,
                            style: TextStyle(color: Colors.white, fontSize: 12),
                            textAlign: TextAlign.center,
                            softWrap: true,
                            //maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  );
                }),
          ),
          SizedBox(
            height: MediaQuery.sizeOf(context).height * 0.02,
          ),
          Text('Description',style: TextStyle(color: Colors.white,fontWeight: FontWeight.bold,fontSize: 16),),
           SingleChildScrollView(
             child: Text(
                  '${_movieDetails.description}',
                  style: TextStyle(color: Colors.grey),
                ),
           ),
        ],
      ),
    );
  }

  Widget _buildWatchLaterButton(){
    if(userId == null){
      return ElevatedButton.icon(
        onPressed: () {
          Navigator.pushNamed(context, '/login');
        },
        icon: Icon(
          Icons.login,
          color: Colors.white,
        ),
        label: Text(
          'Login to Add',
          style: TextStyle(color: Colors.white),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: Color.fromARGB(255, 65, 65, 100),
        ),
      );
    }
    return ElevatedButton.icon(
                          onPressed: isAddingtoWatchList ? null : _toggleWatchLater,
                          icon: Icon(
                            isInWatchList ? Icons.check :
                            Icons.add_box_outlined,
                            color: Colors.white,
                          ),
                          label: Text(
                            isInWatchList ? 'Added To Watchlater' : 'Add To Watchlater',
                            style: TextStyle(color: Colors.white),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: isInWatchList ?  Color.fromARGB(255, 65, 65, 100 ) : Color.fromARGB(255, 65, 65, 100),
                          ),
                        );
  }

  bool isDrawerOpen = false;

  Widget _buildSuggestedMoviesDrawer() {
    return DraggableScrollableSheet(
      initialChildSize: 0.2,
      minChildSize: 0.15,
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
                      height: 3,
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
                        _buildWatchLaterButton(),
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
      suggestedMovies.length,
      (index) => Container(
        width: 120,
        margin: EdgeInsets.only(right: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GestureDetector(
              //onTap: () => Navigator.push(context,MaterialPageRoute(builder: (context)=>MoviesPlayerPage(videoDescriptions: widget.videoDescriptions, categoryId: widget.categoryId))),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: FutureBuilder<Uint8List?>(
                  future: suggestedMovies[index].thumbnailImage, // Use the thumbnailImage getter
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return Container(
                        width: 150,
                        height: 200, // Adjust as needed
                        color: Colors.grey, // Placeholder color
                      ); // Show a placeholder while loading
                    } else if (snapshot.hasError) {
                      return Image.asset('assets/icon/media_jungle.png'); // Fallback image on error
                    } else if (snapshot.hasData && snapshot.data != null) {
                      return Container(
                        height: 100,
                        width: 100,
                        child: Image.memory(snapshot.data!,fit: BoxFit.fill,)); // Display the fetched image
                    } else {
                      return Image.asset('assets/icon/media_jungle.png'); // Fallback image if no data
                    }
                  },
                ),
              ),
            ),
            SizedBox(height: 8),
            Text(
              suggestedMovies[index].videoTitle,
              style: TextStyle(color: Colors.white),
             // maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    ),
  ),
),

                  
                  // SingleChildScrollView(
                  //   scrollDirection: Axis.horizontal,
                  //   padding: EdgeInsets.symmetric(horizontal: 16),
                  //   child: Row(
                  //     children: 
                  //     //suggestedMovies.isNotEmpty
                  //        List.generate(
                  //      suggestedMovies.length,
                  //       (index) => Container(
                  //         width: 150,
                  //         margin: EdgeInsets.only(right: 16),
                  //         child: Column(
                  //           crossAxisAlignment: CrossAxisAlignment.start,
                  //           children: [
                  //             ClipRRect(
                  //               borderRadius: BorderRadius.circular(8),
                  //               child: 
                  //               Image.asset('assets/icon/media_jungle.png')
                                
                  //               //Image.memory(suggestedMovies[index].thumbnail!) 
                  //               // : Image.asset('assets/icon/media_jungle.png')
                  //             ),
                  //             SizedBox(height: 8),
                  //             Text(
                  //              suggestedMovies[index].videoTitle,
                  //               style: TextStyle(color: Colors.white),
                  //               maxLines: 2,
                  //               overflow: TextOverflow.ellipsis,
                  //             ),
                  //           ],
                  //         ),
                  //       ),
                  //     ),
                  //      //: [Container(child: Text('No suggested movies available.', style: TextStyle(color: Colors.white),))],
                  //   ),
                  // ),
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
