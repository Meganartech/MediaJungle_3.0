import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:ott_project/components/library/audio_playlist.dart';
import 'package:ott_project/components/music_folder/audio.dart';
import 'package:ott_project/components/music_folder/audio_container.dart';
import 'package:ott_project/components/music_folder/music.dart';
import 'package:ott_project/components/music_folder/playlist.dart';
import 'package:ott_project/components/music_folder/recently_played.dart';
import 'package:ott_project/components/music_folder/recently_played_manager.dart';
import 'package:ott_project/service/audio_api_service.dart';
import 'package:ott_project/service/playlist_service.dart';

import 'package:shared_preferences/shared_preferences.dart';

import '../../service/service.dart';
import '../library/likedSongsDTO.dart';

enum RepeatMode { off, all, one }

class AudioProvider with ChangeNotifier {
  Audio? _currentlyPlaying;
  Audio? get currentlyPlaying => _currentlyPlaying;

  final AudioPlayer audioPlayer = AudioPlayer();
  bool isPlaying = false;
  List<Audio> playList = [];

  String? audioUrl;
  int currentIndex = -1;
  Duration duration = Duration.zero;
  Duration position = Duration.zero;
  bool _isShuffleOn = false;
  bool _isRepeatOn = false;
  List<Audio> _originalPlaylist = [];

  final RecentlyPlayedManager _recentlyPlayedManager = RecentlyPlayedManager();

  bool get isShuffleOn => _isShuffleOn;
  bool get isRepeatOn => _isRepeatOn;
  List<Playlist> _playlists = [];
  List<Playlist> get playlists => _playlists;

// music
  Music? _musiccurrentlyPlaying;
  Music? get musiccurrentlyPlaying => _musiccurrentlyPlaying;
  final RecentlyPlayed _recentlyPlayed = RecentlyPlayed();
  List<Music> music_playlist = [];
  List<Music> _originalmusicPlaylist = [];
  List<MusicPlaylist> musicplaylists = [];
  List<MusicPlaylist> get mplaylists => musicplaylists;

  // audioDescription

  AudioDescription? _audioDescriptioncurrently;
  AudioDescription? get audioDescriptioncurrently => _audioDescriptioncurrently;
  List<AudioDescription> audio_playlist=[];
  List<AudioDescription> originalaudioPlaylist =[];
  List<AudioPlaylist> audioPlaylists=[];
  List<AudioPlaylist> get aplaylists => audioPlaylists;

   final PlaylistService playlistService;
   final _secureStorage = FlutterSecureStorage();

  

  AudioProvider(this.playlistService) {
    
    loadMusicPlaylists();
    audioPlayer.onDurationChanged.listen((newDuration) {
      duration = newDuration;
      notifyListeners();
    });

    audioPlayer.onPositionChanged.listen((newPosition) {
      position = newPosition;
      notifyListeners();
    });

    audioPlayer.onPlayerComplete.listen((_) {
      isPlaying = false;
      notifyListeners();
      handleAudioCompletion();
    });

   
  }

  //audio description providers

  Future<void> prepareSong() async{
    if(currentIndex >= 0 && currentIndex < audio_playlist.length){
      try{
        final currentSong = audio_playlist[currentIndex];
        print('currentsong:$currentSong');
        audioUrl = await AudioApiService().fetchAudioStreamUrl(currentSong.audioFileName!);
        print('Audio url:$audioUrl');
        if(audioUrl != null){
          await audioPlayer.setSource(UrlSource(audioUrl!));
          notifyListeners();
        }
      }catch(e){
        print('Error preparing song: $e');
      }
    }else{
      print('Error: Invalid song index');
    }
  }
  // Updates the currently playing audio description

  void updateCurrentlyPlayingSong(AudioDescription audioDescription){
    _audioDescriptioncurrently = audioDescription;
    notifyListeners();
  }

   // Sets the currently playing audio and playlist

   Future<void> setCurrentlyPlayingSong(AudioDescription audioDescription,List<AudioDescription> newPlaylist) async{
      if(newPlaylist.isEmpty){
        print('Error:Playlist is empty');
        return;
      }
      _audioDescriptioncurrently = audioDescription;
      audio_playlist = newPlaylist;
      currentIndex = audio_playlist.indexWhere((audio)=> audio.id == audioDescription.id);
       if (currentIndex == -1) {
        print('Error: Selected audio not found in playlist');
        return;
      }
      await _saveCurrentlyPlayingSong();
      notifyListeners();
      await prepareSong();
   }

    List<AudioDescription> convertPlaylistToAudioDescriptions(List<LikedsongsDTO> playlistItems) {
    return playlistItems.map((item) => AudioDescription(
      id: item.audioId,
      audioTitle: item.audioTitle,
      paid: false,
      audioFileName: audioDescriptioncurrently!.audioFileName,
      
      )).toList();
  }


  // Save currently playing audio to shared preferences
  Future<void> _saveCurrentlyPlayingSong() async{
    final prefs = await SharedPreferences.getInstance();
    if(_audioDescriptioncurrently!= null){
      prefs.setString('currentlyPlayingSong', jsonEncode(_audioDescriptioncurrently!.toJson()));
      prefs.setInt('currentIndex', currentIndex);
      prefs.setString('songPlayList', jsonEncode(audio_playlist.map((a)=> a.toJson()).toList()));
    }
  }


  // Load currently playing audio from shared preferences
  Future<void> loadCurrentlyPlayingSong() async{
    final prefs = await SharedPreferences.getInstance();
    final savedIndex = prefs.getInt('currentIndex');
    final audioJSon = prefs.getString('currentlyPlayingSong');
    final playListJson = prefs.getString('songPlayList');

    if(audioJSon != null){
      final audioMap = jsonDecode(audioJSon) as Map<String,dynamic>;
      _audioDescriptioncurrently = AudioDescription.fromJson(audioMap);
      notifyListeners();
    }
    if(savedIndex != null){
      currentIndex = savedIndex;
    }
    if(playListJson != null){
      originalaudioPlaylist = (jsonDecode(playListJson) as List).map((audioMap)=>AudioDescription.fromJson(audioMap)).toList();
    }
    if(currentIndex < 0 || currentIndex >= audio_playlist.length){
      print('Error:Invalid song index after loading');
      currentIndex = -1;
    }
    notifyListeners();
  }

  //Play song

  Future<void> playSong() async {
    print('Current Index: $currentIndex');
    print('Playlist Length: ${audio_playlist.length}');

    if (currentIndex >= 0 && currentIndex < audio_playlist.length) {
      try {
        final currentAudio = audio_playlist[currentIndex];
        audioUrl =
            await AudioApiService().fetchAudioStreamUrl(currentAudio.audioFileName!);
        await audioPlayer.stop();
        await audioPlayer.play(UrlSource(audioUrl!));
        isPlaying = true;
        updateCurrentlyPlayingSong(currentAudio);
        notifyListeners();
      } catch (e) {
        print('Error playing audio: $e');
      }
    } else {
      print('Error: Invalid song index');
    }
  }

  //play or pause song
  void playPauseSong() async {
    try {
      if (isPlaying) {
        await audioPlayer.pause();
        isPlaying = false;
      } else {
        if (audioUrl == null && _audioDescriptioncurrently != null) {
          // audioUrl = await AudioApiService()
          //     .fetchAudioStreamUrl(_currentlyPlaying!.fileName);
          await prepareSong();
        }
        await audioPlayer.resume();
        isPlaying = true;
        // await audioPlayer.play(UrlSource(audioUrl!));
      }
      // isPlaying = !isPlaying;
      notifyListeners();
    } catch (e) {
      print('Error playing/pausing audio: $e');
    }
  }

   

  void toggleShuffleSong() {
    _isShuffleOn = !_isShuffleOn;
    print('Shuffle:$_isShuffleOn');
    if (_isShuffleOn) {
      originalaudioPlaylist = List.from(audio_playlist);
      print('original audio playlist:$originalaudioPlaylist');
      audio_playlist.shuffle();
      currentIndex = audio_playlist.indexOf(audioDescriptioncurrently!);
      print('Current song:$currentIndex');
    } else {
      audio_playlist = List.from(originalaudioPlaylist);
      currentIndex = audio_playlist.indexOf(audioDescriptioncurrently!);
    }
    notifyListeners();
  }

  RepeatMode _repeatModeSong = RepeatMode.off;
  RepeatMode get repeatModeSong => _repeatModeSong;

  void toggleRepeatSong() {
    switch (_repeatModeSong) {
      case RepeatMode.off:
        _repeatModeSong = RepeatMode.all;
        break;
      case RepeatMode.all:
        _repeatModeSong = RepeatMode.one;
        break;
      case RepeatMode.one:
        _repeatModeSong = RepeatMode.off;
        break;
    }
    notifyListeners();
  }

  //Play next audio description

Future<void> playNextSong() async {
    if (_repeatModeSong == RepeatMode.one) {
      await playSong();
    } else {
      if (currentIndex < audio_playlist.length - 1) {
        currentIndex++;
      } else if (_repeatModeSong == RepeatMode.all || _isShuffleOn) {
        currentIndex = 0;
      } else {
        print('End of playlist reached.');
        return;
      }
      updateCurrentlyPlayingSong(audio_playlist[currentIndex]);
      notifyListeners();
      await playSong();
      _recentlyPlayedManager.addRecentlyPlayed(playList[currentIndex]);
    }
  }
//play previous audio description
  Future<void> playPreviousSong() async {
    if (_repeatModeSong == RepeatMode.one) {
      await playSong();
    } else {
      if (currentIndex > 0) {
        currentIndex--;
      } else if (_repeatModeSong == RepeatMode.all || _isShuffleOn) {
        currentIndex = audio_playlist.length - 1;
      } else {
        print('Beginning of playlist reached.');
        return;
      }
      updateCurrentlyPlayingSong(audio_playlist[currentIndex]);
      notifyListeners();
      await playSong();
      _recentlyPlayedManager.addRecentlyPlayed(playList[currentIndex]);
    }
  }

  //song completion
  void handleAudioCompletion() async {
    if (_repeatModeSong == RepeatMode.one) {
      await playSong();
    } else if (_repeatModeSong == RepeatMode.all ||
        _isShuffleOn ||
        currentIndex < audio_playlist.length - 1) {
      await playNextSong();
    } else {
      isPlaying = false;
      notifyListeners();
    }
  }
// audio playlist creation
Future <void> createPlayList(String title,String description) async{
 if (playlistService == null) {
        throw Exception('PlaylistService is not initialized.');
      }
try{
 

  String? userIDStr = await _secureStorage.read(key: 'userId');
  if(userIDStr == null){
     throw Exception('User ID not found. Please log in again.');
  }
  final userId = int.parse(userIDStr);
  AudioPlaylist audioPlaylist = await playlistService.createPlayList(title: title, description: description, userId: userId);
 audioPlaylists.add(audioPlaylist);
  notifyListeners();
}catch (e) {
      debugPrint('Failed to create playlist: $e');
      throw Exception('Error creating playlist: $e');
    }
}

Future <void> createPlayListWithAudioId(String title,String description,int audioId) async{
try{
  String? userIDStr = await _secureStorage.read(key: 'userId');
  if(userIDStr == null){
     throw Exception('User ID not found. Please log in again.');
  }
  final userId = int.parse(userIDStr);
  AudioPlaylist audioPlaylist = await playlistService.createPlayListWithAudioId(title: title, description: description, userId: userId,audioId: audioId);
  audioPlaylists.add(audioPlaylist);
  await fetchUserPlaylists();
  notifyListeners();
}catch (e) {
      debugPrint('Failed to create playlist: $e');
      throw Exception('Error creating playlist: $e');
    }
}

Future<void> fetchUserPlaylists() async {
  try {
    String? userIDStr = await _secureStorage.read(key: 'userId');
    if (userIDStr == null) {
      throw Exception('User ID not found. Please log in again.');
    }
    final userId = int.parse(userIDStr);

    // Fetch playlists from backend
    final fetchedPlaylists = await playlistService.getPlaylistsByUserId(userId);
    audioPlaylists = fetchedPlaylists;

    notifyListeners();
  } catch (e) {
    debugPrint('Failed to fetch playlists: $e');
    throw Exception('Error fetching playlists: $e');
  }
}

Future<void> loadPlaylistsFromLocal() async {
  final prefs = await SharedPreferences.getInstance();
  final playlistJsonList = prefs.getStringList('playlists') ?? [];
  
  if (playlistJsonList.isNotEmpty) {
    audioPlaylists = playlistJsonList
        .map((jsonString) => AudioPlaylist.fromJson(jsonDecode(jsonString)))
        .toList();
    notifyListeners();
  }
}



  Future<void> fetchPlaylists() async{
   try{
      final userId =await Service().getLoggedInUserId();
      print('UserId: ${userId}');
      if(userId != null){
      final playlists = await PlaylistService().getPlaylistsByUserId(userId);
      audioPlaylists = playlists;
      notifyListeners();
      
      }
   }catch(e){
    print('Error fetching playlists: $e');
   }   
  }

  //save audio playlist
   Future<void> _saveaudiosPlaylists() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> playlistJsonList = audioPlaylists
        .map((aplaylist) => jsonEncode(aplaylist.toJson()))
        .toList();
        print('Saving Playlists: $playlistJsonList');
    prefs.setStringList('playlists', playlistJsonList);
  }

  Future<void> addAudiosToPlaylist(AudioPlaylist playlist,int audioId) async {
    
    // if (music.thumbnailImage == null && playlist.audios.isNotEmpty) {
    // playlist.imageUrl = audio.thumbnail;
    // }
  // final initialAudioIds = List<int>.from(playlist.audioIds);
    try{
      playlist.audioIds.add(audioId);
      notifyListeners();

      final playlistService = PlaylistService();
      await playlistService.addAudiosToPlaylist(playlist.id, audioId);
      await _saveaudiosPlaylists();
      notifyListeners();
    }catch (e) {
    // Rollback local changes if backend update fails
   // playlist.audioIds = initialAudioIds;
    await _saveaudiosPlaylists();
    notifyListeners();

    throw Exception('Failed to add audio to playlist on server: $e');
  }
    notifyListeners();
  }



// audio class providers
  Future<void> prepareAudio() async {
    if (currentIndex >= 0 && currentIndex < playList.length) {
      try {
        final currentAudio = playList[currentIndex];
        audioUrl =
            await AudioApiService().fetchAudioStreamUrl(currentAudio.fileName);
        if (audioUrl != null) {
          await audioPlayer.setSource(UrlSource(audioUrl!));
          // Don't start playing here
          notifyListeners();
        }
      } catch (e) {
        print('Error preparing audio: $e');
      }
    } else {
      print('Error: Invalid song index');
    }
  }

  Map<String, Uint8List> _decodedImages = {};

  Uint8List getDecodedImage(String thumbnail) {
    if (!_decodedImages.containsKey(thumbnail)) {
      final compressedBytes = base64.decode(thumbnail);
      _decodedImages[thumbnail] =
          Uint8List.fromList(ZLibDecoder().decodeBytes(compressedBytes));
    }
    return _decodedImages[thumbnail]!;
  }

  void _updateCurrentlyPlaying(Audio audio) {
    _currentlyPlaying = audio;
    getDecodedImage(audio.thumbnail);
    notifyListeners();
  }

  Future<void> setCurrentlyPlaying(Audio audio, List<Audio> newPlaylist) async {
    if (newPlaylist.isEmpty) {
      print('Error: Provided playlist is empty');
      return;
    }
    _currentlyPlaying = audio;
    playList = newPlaylist;
    currentIndex = playList.indexOf(audio);
    await _saveCurrentlyPlaying();
    notifyListeners();
    await prepareAudio();
  }

  Future _saveCurrentlyPlaying() async {
    final prefs = await SharedPreferences.getInstance();
    if (_currentlyPlaying != null) {
      prefs.setString(
          'currentlyPlaying', jsonEncode(_currentlyPlaying!.toJson()));
      prefs.setInt('currentIndex', currentIndex);
      prefs.setString(
          'playList', jsonEncode(playList.map((a) => a.toJson()).toList()));
    }
  }

  Future<void> loadCurrentlyPlaying() async {
    final prefs = await SharedPreferences.getInstance();
    final savedIndex = prefs.getInt('currentIndex');
    final audioJson = prefs.getString('currentlyPlaying');
    final playListJson = prefs.getString('playList');

    if (audioJson != null) {
      final audioMap = jsonDecode(audioJson) as Map<String, dynamic>;
      _currentlyPlaying = Audio.fromJson(audioMap);
      notifyListeners();
    }
    if (savedIndex != null) {
      currentIndex = savedIndex;
    }
    if (playListJson != null) {
      playList = (jsonDecode(playListJson) as List)
          .map((audioMap) => Audio.fromJson(audioMap))
          .toList();
    }
    // if (playListJson != null) {
    //   try {
    //     final List<dynamic> playlistMap = jsonDecode(playListJson);
    //     playList = playlistMap
    //         .map((audioMap) => Audio.fromJson(audioMap as Map<String, dynamic>))
    //         .toList();
    //   } catch (e) {
    //     print('Error parsing playlist JSON: $e');
    //   }
    // }

    if (currentIndex < 0 || currentIndex >= playList.length) {
      print('Error: Invalid song index after loading');
      currentIndex = -1; // or set to a valid index or handle as needed
    }
    print(
        "Loaded playlist length: ${playList.length}, Current index: $currentIndex");
    notifyListeners();
  }

  Future<void> playAudio() async {
    print('Current Index: $currentIndex');
    print('Playlist Length: ${playList.length}');

    if (currentIndex >= 0 && currentIndex < playList.length) {
      try {
        final currentAudio = playList[currentIndex];
        audioUrl =
            await AudioApiService().fetchAudioStreamUrl(currentAudio.fileName);
        await audioPlayer.stop();
        await audioPlayer.play(UrlSource(audioUrl!));
        isPlaying = true;
        _updateCurrentlyPlaying(currentAudio);
        notifyListeners();
      } catch (e) {
        print('Error playing audio: $e');
      }
    } else {
      print('Error: Invalid song index');
    }
  }

  void playPause() async {
    try {
      if (isPlaying) {
        await audioPlayer.pause();
        isPlaying = false;
      } else {
        if (audioUrl == null && _currentlyPlaying != null) {
          // audioUrl = await AudioApiService()
          //     .fetchAudioStreamUrl(_currentlyPlaying!.fileName);
          await prepareAudio();
        }
        await audioPlayer.resume();
        isPlaying = true;
        // await audioPlayer.play(UrlSource(audioUrl!));
      }
      // isPlaying = !isPlaying;
      notifyListeners();
    } catch (e) {
      print('Error playing/pausing audio: $e');
    }
  }

  RepeatMode _repeatMode = RepeatMode.off;
  RepeatMode get repeatMode => _repeatMode;

  void toggleShuffle() {
    _isShuffleOn = !_isShuffleOn;
    if (_isShuffleOn) {
      _originalPlaylist = List.from(playList);
      playList.shuffle();
      currentIndex = playList.indexOf(_currentlyPlaying!);
    } else {
      playList = List.from(_originalPlaylist);
      currentIndex = playList.indexOf(_currentlyPlaying!);
    }
    notifyListeners();
  }

  void toggleRepeat() {
    switch (_repeatMode) {
      case RepeatMode.off:
        _repeatMode = RepeatMode.all;
        break;
      case RepeatMode.all:
        _repeatMode = RepeatMode.one;
        break;
      case RepeatMode.one:
        _repeatMode = RepeatMode.off;
        break;
    }
    notifyListeners();
  }

  Future<void> playNext() async {
    if (_repeatMode == RepeatMode.one) {
      await playAudio();
    } else {
      if (currentIndex < playList.length - 1) {
        currentIndex++;
      } else if (_repeatMode == RepeatMode.all || _isShuffleOn) {
        currentIndex = 0;
      } else {
        print('End of playlist reached.');
        return;
      }
      _updateCurrentlyPlaying(playList[currentIndex]);
      notifyListeners();
      await playAudio();
      _recentlyPlayedManager.addRecentlyPlayed(playList[currentIndex]);
    }
  }

  Future<void> playPrevious() async {
    if (_repeatMode == RepeatMode.one) {
      await playAudio();
    } else {
      if (currentIndex > 0) {
        currentIndex--;
      } else if (_repeatMode == RepeatMode.all || _isShuffleOn) {
        currentIndex = playList.length - 1;
      } else {
        print('Beginning of playlist reached.');
        return;
      }
      _updateCurrentlyPlaying(playList[currentIndex]);
      notifyListeners();
      await playAudio();
      _recentlyPlayedManager.addRecentlyPlayed(playList[currentIndex]);
    }
  }

  void handleSongCompletion() async {
    if (_repeatMode == RepeatMode.one) {
      await playAudio();
    } else if (_repeatMode == RepeatMode.all ||
        _isShuffleOn ||
        currentIndex < playList.length - 1) {
      await playNext();
    } else {
      isPlaying = false;
      notifyListeners();
    }
  }

  Future<void> seekTo(Duration position) async {
    await audioPlayer.seek(position);
    notifyListeners();
  }

  Future<void> createPlaylistAudio(String title, String description) async {
    final newPlaylist =
        Playlist(title: title, description: description, audios: []);
    _playlists.add(newPlaylist);
    await _savePlaylists();
    notifyListeners();
  }

  Future<void> deletePlaylist(Playlist playlist) async {
    _playlists.remove(playlist);
    await _savePlaylists();
    notifyListeners();
  }

  Future<void> addAudioToPlaylist(Playlist playlist, Audio audio) async {
    playlist.audios.add(audio);
    //if (playlist.imageUrl == null && playlist.audios.isNotEmpty) {
    //playlist.imageUrl = audio.thumbnail;
    //}
    await _savePlaylists();
    notifyListeners();
  }

  Future<void> addAudioToLikedsong(Playlist playlist, Audio audio) async {
    playlist.audios.add(audio);
    //if (playlist.imageUrl == null && playlist.audios.isNotEmpty) {
    //playlist.imageUrl = audio.thumbnail;
    //}
    await _savePlaylists();
    notifyListeners();
  }

  Future<void> removeAudioFromPlayList(Playlist playlist, Audio audio) async {
    playlist.audios.remove(audio);
    await _savePlaylists();
    notifyListeners();
  }

  Future<void> _savePlaylists() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> playlistJsonList =
        _playlists.map((playlist) => jsonEncode(playlist.toJson())).toList();
    prefs.setStringList('playlists', playlistJsonList);
  }

  Future<void> loadPlaylists() async {
    final prefs = await SharedPreferences.getInstance();
    final playlistJsonList = prefs.getStringList('playlists');

    if (playlistJsonList != null) {
      _playlists = playlistJsonList
          .map((playlistJson) => Playlist.fromJson(jsonDecode(playlistJson)))
          .toList();
      notifyListeners();
    }
  }

  // music
//music load playlists
  Future<void> loadMusicPlaylists() async {
    final prefs = await SharedPreferences.getInstance();
    final playlistJsonList = prefs.getStringList('playlists');

    if (playlistJsonList != null) {
      musicplaylists = playlistJsonList
          .map((playlistJson) =>
              MusicPlaylist.fromJson(jsonDecode(playlistJson)))
          .toList();
      notifyListeners();
    }
  }

//musicsetcurrentlyplaying
  Future<void> musicsetCurrentlyPlaying(
      Music music, List<Music> musicPlaylist) async {
    if (musicPlaylist.isEmpty) {
      print('Error: Provided playlist is empty');
      return;
    }
    _musiccurrentlyPlaying = music;
    music_playlist = musicPlaylist;
    currentIndex = music_playlist.indexOf(music);
    final banner = await music.bannerImage;
    // _musiccurrentlyPlaying = musiccurrentlyPlaying?.copyWith(banner: banner);
    await _saveMusicCurrentlyPlaying();
    notifyListeners();
    await prepareMusic();
  }

  Future _saveMusicCurrentlyPlaying() async {
    final prefs = await SharedPreferences.getInstance();
    if (_currentlyPlaying != null) {
      prefs.setString(
          'currentlyPlaying', jsonEncode(_musiccurrentlyPlaying!.toJson()));
      prefs.setInt('currentIndex', currentIndex);
      prefs.setString(
          'playList', jsonEncode(playList.map((a) => a.toJson()).toList()));
    }
  }

  Future<void> prepareMusic() async {
    if (currentIndex >= 0 && currentIndex < music_playlist.length) {
      try {
        final currentAudio = music_playlist[currentIndex];
        audioUrl =
            await AudioApiService().fetchAudioStreamUrl(currentAudio.fileName);
        if (audioUrl != null) {
          await audioPlayer.setSource(UrlSource(audioUrl!));
          // Don't start playing here
        }

        notifyListeners();
      } catch (e) {
        print('Error preparing audio: $e');
      }
    } else {
      print('Error: Invalid song index');
    }
  }

  //updatemusiccurrentlyplaying

  void _updateMusicCurrentlyPlaying(Music music) {
    _musiccurrentlyPlaying = music;
    //getDecodedImage(audio.thumbnail);
    notifyListeners();
  }

  //musicloadcurrentlyplaying

  Future<void> musicloadCurrentlyPlaying() async {
    final prefs = await SharedPreferences.getInstance();
    final savedIndex = prefs.getInt('currentIndex');
    final audioJson = prefs.getString('musiccurrentlyPlaying');
    final playListJson = prefs.getString('music_playList');

    if (audioJson != null) {
      final audioMap = jsonDecode(audioJson) as Map<String, dynamic>;
      _musiccurrentlyPlaying = Music.fromJson(audioMap);
      notifyListeners();
    }
    if (savedIndex != null) {
      currentIndex = savedIndex;
    }
    if (playListJson != null) {
      music_playlist = (jsonDecode(playListJson) as List)
          .map((audioMap) => Music.fromJson(audioMap))
          .toList();
    }

    if (currentIndex < 0 || currentIndex >= music_playlist.length) {
      print('Error: Invalid song index after loading');
      currentIndex = -1; // or set to a valid index or handle as needed
    }
    print(
        "Loaded playlist length: ${music_playlist.length}, Current index: $currentIndex");
    notifyListeners();
  }

//playMusic
  Future<void> playMusic() async {
    print('Current Index: $currentIndex');
    print('Playlist Length: ${music_playlist.length}');

    if (currentIndex >= 0 && currentIndex < music_playlist.length) {
      try {
        final currentAudio = music_playlist[currentIndex];
        audioUrl =
            await AudioApiService().fetchAudioStreamUrl(currentAudio.fileName);
        await audioPlayer.stop();
        await audioPlayer.play(UrlSource(audioUrl!));
        isPlaying = true;
        _updateMusicCurrentlyPlaying(currentAudio);
        notifyListeners();
      } catch (e) {
        print('Error playing audio: $e');
      }
    } else {
      print('Error: Invalid song index');
    }
  }

//playpausemusic
  void playPauseMusic() async {
    try {
      if (isPlaying) {
        await audioPlayer.pause();
        isPlaying = false;
      } else {
        if (audioUrl == null && _musiccurrentlyPlaying != null) {
          // audioUrl = await AudioApiService()
          //     .fetchAudioStreamUrl(_currentlyPlaying!.fileName);
          await prepareMusic();
        }
        await audioPlayer.resume();
        isPlaying = true;
        // await audioPlayer.play(UrlSource(audioUrl!));
      }
      // isPlaying = !isPlaying;
      notifyListeners();
    } catch (e) {
      print('Error playing/pausing audio: $e');
    }
  }

//playnextmusic
  Future<void> playNextMusic() async {
    if (_repeatMode == RepeatMode.one) {
      await playMusic();
    } else {
      if (currentIndex < music_playlist.length - 1) {
        currentIndex++;
      } else if (_repeatMode == RepeatMode.all || _isShuffleOn) {
        currentIndex = 0;
      } else {
        print('End of playlist reached.');
        return;
      }
      _updateMusicCurrentlyPlaying(music_playlist[currentIndex]);
      notifyListeners();
      //await prepareMusic();
      await playMusic();
      _recentlyPlayed.addRecentlyPlayed(music_playlist[currentIndex]);
    }
  }

//playpreviousmusic
  Future<void> playPreviousMusic() async {
    if (_repeatMode == RepeatMode.one) {
      await playMusic();
    } else {
      if (currentIndex > 0) {
        currentIndex--;
      } else if (_repeatMode == RepeatMode.all || _isShuffleOn) {
        currentIndex = music_playlist.length - 1;
      } else {
        print('Beginning of playlist reached.');
        return;
      }
      _updateMusicCurrentlyPlaying(music_playlist[currentIndex]);
      notifyListeners();
      //await prepareMusic();
      await playMusic();
      _recentlyPlayed.addRecentlyPlayed(music_playlist[currentIndex]);
    }
  }

  //shuffle and repeat
  void toggleShuffleMusic() {
    _isShuffleOn = !_isShuffleOn;
    if (_isShuffleOn) {
      _originalmusicPlaylist = List.from(music_playlist);
      playList.shuffle();
      currentIndex = music_playlist.indexOf(_musiccurrentlyPlaying!);
    } else {
      music_playlist = List.from(_originalmusicPlaylist);
      currentIndex = music_playlist.indexOf(_musiccurrentlyPlaying!);
    }
    notifyListeners();
  }

  void toggleRepeatMusic() {
    switch (_repeatMode) {
      case RepeatMode.off:
        _repeatMode = RepeatMode.all;
        break;
      case RepeatMode.all:
        _repeatMode = RepeatMode.one;
        break;
      case RepeatMode.one:
        _repeatMode = RepeatMode.off;
        break;
    }
    notifyListeners();
  }

  void handleMusicCompletion() async {
    if (_repeatMode == RepeatMode.one) {
      await playMusic();
    } else if (_repeatMode == RepeatMode.all ||
        _isShuffleOn ||
        currentIndex < playList.length - 1) {
      await playNextMusic();
    } else {
      isPlaying = false;
      notifyListeners();
    }
  }

  //savemusicplaylist
  //
  Future<void> _savemusicPlaylists() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> playlistJsonList = musicplaylists
        .map((mplaylist) => jsonEncode(mplaylist.toJson()))
        .toList();
    prefs.setStringList('playlists', playlistJsonList);
  }
//create playlist

  Future<void> createmusicPlaylist(String title, String description) async {
    final newPlaylist =
        MusicPlaylist(title: title, description: description, music: []);
    musicplaylists.add(newPlaylist);
    await _savePlaylists();
    notifyListeners();
  }

//add to liked song
  Future<void> addMusicToLikedsong(MusicPlaylist playlist, Music music) async {
    playlist.music.add(music);
    //if (playlist.imageUrl == null && playlist.audios.isNotEmpty) {
    //playlist.imageUrl = audio.thumbnail;
    //}
    await _savemusicPlaylists();
    notifyListeners();
  }

//add music to playlist
  Future<void> addMusicToPlaylist(MusicPlaylist playlist, Music music) async {
    playlist.music.add(music);
    //if (playlist.imageUrl == null && playlist.audios.isNotEmpty) {
    //playlist.imageUrl = audio.thumbnail;
    //}
    await _savemusicPlaylists();
    notifyListeners();
  }

  @override
  void dispose() {
    audioPlayer.dispose();
    super.dispose();
  }
}
