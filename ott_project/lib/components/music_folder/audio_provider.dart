import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/cupertino.dart';
import 'package:ott_project/components/music_folder/audio.dart';
import 'package:ott_project/components/music_folder/music.dart';
import 'package:ott_project/components/music_folder/playlist.dart';
import 'package:ott_project/components/music_folder/recently_played.dart';
import 'package:ott_project/components/music_folder/recently_played_manager.dart';
import 'package:ott_project/service/audio_api_service.dart';
import 'package:ott_project/service/audio_service.dart';

import 'package:shared_preferences/shared_preferences.dart';

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

  // String newPlaylistTitle = '';
  // String newPlaylistDescription = '';

  AudioProvider() {
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
    });

    audioPlayer.onPlayerComplete.listen((_) {
      handleMusicCompletion();
    });
  }

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

  Future<void> createPlaylist(String title, String description) async {
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
