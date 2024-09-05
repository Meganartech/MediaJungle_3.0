import 'package:flutter/material.dart';


class Square extends StatelessWidget {
  const Square({super.key, required this.imagePath, required this.onTap});

  

  final String imagePath;
  final Function() onTap;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        decoration: BoxDecoration(
          border: Border.all(
            color: Colors.blueGrey,
          ),
          borderRadius: BorderRadius.circular(8),
          color: Colors.black26,
        ),
        child: Image.asset(
          imagePath,
          height: 22,
        ),
      ),
    );
  }
}
