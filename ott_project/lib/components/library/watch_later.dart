class WatchLater {

  final int videoId;
  final String videoTitle;

  WatchLater({required this.videoId,required this.videoTitle});

  factory WatchLater.fromJson(Map<String,dynamic> json){
    return WatchLater(videoId: json['videoId'], videoTitle: json['videoTitle']);
  }
}