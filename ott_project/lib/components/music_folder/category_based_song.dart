import 'package:flutter/material.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/category/category_service.dart';
import 'package:ott_project/components/music_folder/audio_card.dart';
import 'package:ott_project/components/music_folder/audio_container.dart';
import 'package:ott_project/components/music_folder/song_player_page.dart';
import 'package:ott_project/pages/custom_appbar.dart';

class CategoryBasedSong extends StatefulWidget {

  final String categoryName;
  final List<AudioDescription> audioDescriptions;
  const CategoryBasedSong({super.key, required this.categoryName, required this.audioDescriptions});

  @override
  State<CategoryBasedSong> createState() => _CategoryBasedSongState();
}

class _CategoryBasedSongState extends State<CategoryBasedSong> {

   final TextEditingController _searchController = TextEditingController();
   bool _isSearching = false;
    List<dynamic> _searchResults = [];

  void handleSearchState(bool isSearching, List<dynamic> results) {
    setState(() {
      _isSearching = isSearching;
      _searchResults = results;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          BackgroundImage(),
        CustomAppBar(onSearchChanged: handleSearchState),
        Padding(
          padding:  EdgeInsets.only(top: MediaQuery.sizeOf(context).height * 0.15,
          left: MediaQuery.sizeOf(context).width * 0.02,
          ),
          child: Row(
            children: [
              IconButton(onPressed: ()=>Navigator.pop(context), icon: Icon(Icons.arrow_back_rounded,color: Colors.white,)),
              Text(widget.categoryName + '  Songs',style: TextStyle(color:Colors.white,fontWeight: FontWeight.bold,fontSize: 22),),
            ],
          ),
        ),
        Expanded(
          child: Padding(padding: EdgeInsets.only(top: MediaQuery.sizeOf(context).height * 0.20,
          right: MediaQuery.sizeOf(context).width * 0.06,
          left: MediaQuery.sizeOf(context).width * 0.06,
          ),
          child: GridView.builder(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
          crossAxisSpacing: 20,
          //mainAxisSpacing: 20,
          childAspectRatio: 3/4
          ),
          itemCount: widget.audioDescriptions.length,
           itemBuilder: (context,index){
            final song = widget.audioDescriptions[index];
          
            return AudioCard(
            audio: song,
            initialIndex: index, 
            onTap: (){
              // final categoryId = CategoryService().getCategoryId(song.id, widget.categoryName);
          
              // Navigator.push(context, MaterialPageRoute(builder: (context)=>SongPlayerPage(music: song,onChange: (_){},onDislike: (_){})));
            }, 
            );
           }
           ),
          ),
        )
        ],
      ),
    );
  }
}