import 'package:flutter/material.dart';
import 'package:ott_project/components/pallete.dart';

class MyTextField extends StatefulWidget {
  const MyTextField(
      {super.key,
      required this.icon,
      required this.hint,
      this.controller,
      required this.inputType,
      required this.inputAction,
      required this.obscureText,
      this.validator,
      this.confirmPasswordController});

  final IconData icon;
  final String hint;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final TextInputType inputType;
  final TextInputAction inputAction;
  final bool obscureText;
  final TextEditingController? confirmPasswordController;

  @override
  State<MyTextField> createState() => _MyTextFieldState();
}

class _MyTextFieldState extends State<MyTextField> {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Container(
            height: size.height * 0.07,
            width: size.width * 0.9,
            decoration: BoxDecoration(
              color: Color.fromRGBO(28, 38, 74, 0),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white),
            ),
            child: Center(
              //constraints: BoxConstraints(minHeight: size.height * 0.07),
              child: TextFormField(
                controller: widget.controller,
                decoration: InputDecoration(
                  border: InputBorder.none,
                  prefixIcon: Padding(
                    padding: const EdgeInsets.only(left: 20, right: 10),
                    child: Icon(
                      widget.icon,
                      size: 20,
                      color: kWhite,
                    ),
                  ),
                  hintText: widget.hint,
                  hintStyle: Theme.of(context)
                      .textTheme
                      .bodyLarge!
                      .copyWith(color: Colors.white60),
                  contentPadding:
                      EdgeInsets.symmetric(vertical: 11, horizontal: 16),
                ),
                obscureText: widget.obscureText,
                style: TextStyle(fontSize: 18, color: Colors.white),
                keyboardType: widget.inputType,
                textInputAction: widget.inputAction,
                validator: widget.validator != null
                    ? (value) {
                        if (widget.validator!(value) != null) {
                          return widget.validator!(value);
                        } else if (widget.confirmPasswordController != null &&
                            widget.confirmPasswordController!.text != value) {
                          return 'Passwords do not match';
                        }
                        return null;
                      }
                    : null,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
