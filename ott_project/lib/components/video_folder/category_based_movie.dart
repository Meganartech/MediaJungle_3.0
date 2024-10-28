import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:ott_project/components/background_image.dart';
import 'package:ott_project/components/category/category_service.dart';
import 'package:ott_project/components/video_folder/movie_player_page.dart';
import 'package:ott_project/components/video_folder/movies_card.dart';
import 'package:ott_project/components/video_folder/video_container.dart';
import 'package:ott_project/pages/custom_appbar.dart';

class CategoryBasedMovie extends StatefulWidget{

  final String categoryName;
  final List<VideoDescription> videoDescriptions;

  CategoryBasedMovie({required this.categoryName,required this.videoDescriptions});

  @override
  State<CategoryBasedMovie> createState() => _CategoryBasedMovieState();
}

class _CategoryBasedMovieState extends State<CategoryBasedMovie> {
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
         padding:  EdgeInsets.only(top: MediaQuery.sizeOf(context).height * 0.10,
          left: MediaQuery.sizeOf(context).width * 0.02,
          ),
          child: IconButton(onPressed: ()=>Navigator.pop(context), icon: Icon(Icons.arrow_back_rounded,color: Colors.white,)),
        ),

        Padding(
          padding:  EdgeInsets.only(top: MediaQuery.sizeOf(context).height * 0.15,
          left: MediaQuery.sizeOf(context).width * 0.07,
          ),
          child: 
          // Row(
          //   children: [
              //IconButton(onPressed: ()=>Navigator.pop(context), icon: Icon(Icons.arrow_back_rounded,color: Colors.white,)),
              Text(widget.categoryName + '  Movies',style: TextStyle(color:Colors.white,fontWeight: FontWeight.bold,fontSize: 22),),
          //   ],
          // ),
        ),

        // Expanded(
         // child: 
          Padding(
          padding: EdgeInsets.only(top: MediaQuery.sizeOf(context).height * 0.20,
          right: MediaQuery.sizeOf(context).width * 0.08,
          left: MediaQuery.sizeOf(context).width * 0.08,
          ),
           child: GridView.builder(
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 35,
                  mainAxisSpacing: 20,
                  childAspectRatio: 0.62,
                
                ),
                itemCount: widget.videoDescriptions.length,
                
                 itemBuilder: (context,index){
                  final movie = widget.videoDescriptions[index];
                
                  return MoviesCard(movie: movie, 
                    initialIndex: index, 
                    onTap: (){
                      final categoryId = CategoryService().getCategoryId(movie.categoryList, widget.categoryName);
                                    
                      Navigator.push(context, MaterialPageRoute(builder: (context)=>MoviesPlayerPage(videoDescriptions: widget.videoDescriptions, categoryId: categoryId,initialIndex: index,)));
                    }, categoryList: movie.categoryList);
                  //);
                 }
                 ),
          ),
    
      ],
    ),
   );
    
  }
}