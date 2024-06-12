package com.example.demo.mobile;

import java.io.IOException;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.compresser.ImageUtils;

import com.example.demo.model.Addaudio1;
import com.example.demo.model.VideoDescription;
import com.example.demo.repository.AddAudioRepository;

import com.example.demo.repository.AddVideoDescriptionRepository;

import com.example.demo.userregister.JwtUtil;
import com.example.demo.userregister.TokenBlacklist;
import com.example.demo.userregister.UserRegister;
import com.example.demo.userregister.UserRegisterRepository;



@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class MobileAppController {
	
	@Autowired
    private UserRegisterRepository userregisterrepository;
	
	@Autowired
    private JwtUtil jwtUtil; // Autowire JwtUtil

    @Autowired
    private TokenBlacklist tokenBlacklist;
    
   
	
	@PostMapping("/register/mobile")
    public ResponseEntity<UserRegister> registerMobile(@RequestParam("username") String username,
                                                       @RequestParam("email") String email,
                                                       @RequestParam("password") String password,
                                                       @RequestParam("mobnum") String mobnum,
                                                       @RequestParam("confirmPassword") String confirmPassword,
                                                       @RequestParam(value = "profile", required = false) MultipartFile profile) throws IOException {
        if (!password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(null);
        }

        UserRegister newRegister = new UserRegister();
        newRegister.setUsername(username);
        newRegister.setEmail(email);
        newRegister.setPassword(password);
        newRegister.setConfirmPassword(confirmPassword);
        newRegister.setMobnum(mobnum);

        if (profile != null && !profile.isEmpty()) {
            byte[] thumbnailBytes = ImageUtils.compressImage(profile.getBytes());
            newRegister.setProfile(thumbnailBytes);
        }

        UserRegister savedUser = userregisterrepository.save(newRegister);
        return ResponseEntity.ok(savedUser);
    }
	
	@GetMapping("/GetUserById/mobile/{id}")
    public ResponseEntity<UserRegister> getUserByIdmobile(@PathVariable Long id) {
        Optional<UserRegister> userOptional = userregisterrepository.findById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
	
	@GetMapping("/mobile/GetThumbnailsById/{id}")
    public ResponseEntity<List<String>> getThumbnailsById(@PathVariable Long id) {
        try {
            Optional<UserRegister> profileOptional = userregisterrepository.findById(id);

            if (profileOptional.isPresent()) {
                UserRegister profile = profileOptional.get();

                // Assuming decompressImage returns the raw thumbnail data
                byte[] thumbnailData = ImageUtils.decompressImage(profile.getProfile());

                // Convert the byte array to Base64
                String base64Thumbnail = Base64.getEncoder().encodeToString(thumbnailData);

                // Return a list with a single Base64-encoded thumbnail
                return ResponseEntity.ok(Collections.singletonList(base64Thumbnail));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    
    @PatchMapping("/UpdateUser/mobile/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable Long userId,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "mobnum", required = false) String mobnum,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "confirmPassword", required = false) String confirmPassword,
            @RequestParam(value = "profile", required = false) MultipartFile profile) {

        try {
            // Retrieve existing user data from the repository
            Optional<UserRegister> optionalUserRegister = userregisterrepository.findById(userId);
            if (!optionalUserRegister.isPresent()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            UserRegister existingUser = optionalUserRegister.get();

            // Apply partial updates to the existing user data if provided
            if (username != null) {
                existingUser.setUsername(username);
            }
            if (email != null) {
                existingUser.setEmail(email);
            }
            if (mobnum != null) {
                existingUser.setMobnum(mobnum);
            }
//            if (password != null) {
//                if (!password.equals(confirmPassword)) {
//                    return new ResponseEntity<>("Passwords do not match", HttpStatus.BAD_REQUEST);
//                }
//                // Encrypt the password before saving
//                String encryptedPassword = passwordEncoder.encode(password);
//                existingUser.setPassword(encryptedPassword);
//                existingUser.setConfirmPassword(encryptedPassword); // Assuming this is required
//            }
            
            if (password != null) {
	            existingUser.setPassword(password);
	        }

	        if (confirmPassword!= null) {
	            existingUser.setConfirmPassword(confirmPassword);
	        }
            if (profile != null && !profile.isEmpty()) {
                byte[] thumbnailBytes = ImageUtils.compressImage(profile.getBytes());
                existingUser.setProfile(thumbnailBytes);
            }

            // Save the updated user data back to the repository
            userregisterrepository.save(existingUser);

            return new ResponseEntity<>("User details updated successfully", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error processing profile image", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating user details", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
        
    @PostMapping("/mobile/forgetPassword")
    public ResponseEntity<?> resetPasswordmobile(@RequestBody Map<String, String> loginRequest) {
        // Finding the user by email
    	
    	String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        String confirmpassword = loginRequest.get("confirmPassword");
        Optional<UserRegister> userOptional = userregisterrepository.findByEmail(email);

        // If the user doesn't exist, return 404 Not Found
        if (!userOptional.isPresent()) {
            System.out.println("User not found: " + email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        UserRegister user = userOptional.get();

        // If passwords do not match, return 400 Bad Request
        if (!password.equals(confirmpassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match");
        }

        // Assuming you have a method to hash the password
        user.setPassword(password);
        user.setConfirmPassword(confirmpassword);
        // Do not set confirmPassword in the entity, it's used only for validation

        userregisterrepository.save(user);

        return ResponseEntity.ok("Password reset successfully");
    }

        
    //-------------------------favorite audio---------------------------
    
    @Autowired
    private favouriteRepository favouriterepository;
    
    @Autowired
    private AddAudioRepository audiorepository;
    

    @PostMapping("/mobile/favourite/audio")
    public ResponseEntity<String> createOrder(@RequestBody Map<String, Long> requestData) {
        try {
            Long audioId = requestData.get("audioId");
            Long userId = requestData.get("userId");

            if (audioId == null || userId == null) {
                return new ResponseEntity<>("Invalid request data", HttpStatus.BAD_REQUEST);
            }

            Optional<Addaudio1> audioOptional = audiorepository.findById(audioId);
            if (audioOptional.isPresent()) {
                Addaudio1 audio = audioOptional.get();

                favourite ordertable = new favourite();
               
                ordertable.setAudioId(audioId);
                ordertable.setUserId(userId);
                favouriterepository.save(ordertable);
                
                Long favaudio = ordertable.getAudioId();
                Long userid = ordertable.getUserId();
                
                Optional<UserRegister> optionalUser = userregisterrepository.findById(userid);
                Optional<Addaudio1> optionalAudio = audiorepository.findById(favaudio);
                
                if (optionalUser.isPresent() && optionalAudio.isPresent()) {
                    UserRegister user = optionalUser.get();
                    Addaudio1 favvaudio = optionalAudio.get();

                    // Check if the user is already enrolled in the course
                    if (user.getFavoriteAudios().contains(favvaudio)) {
                        return ResponseEntity.badRequest().body("User is already add this audio in favourite");
                    }
                    
                    user.getFavoriteAudios().add(audio);
                    userregisterrepository.save(user);
     
                    return ResponseEntity.ok("Favourite audio added successfully");
                } else {
                    // If a user or course with the specified ID doesn't exist, return 404
                    String errorMessage = "";
                    if (!optionalUser.isPresent()) {
                        errorMessage += "User with ID " + userId + " not found. ";
                    }
                    if (!optionalAudio.isPresent()) {
                        errorMessage += "audio with ID " + favaudio+ " not found. ";
                    }
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage.trim());
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating payment ID: " + e.getMessage());
        }
    }
    
    
    @GetMapping("/mobile/{userId}/UserAudios")
    public ResponseEntity<List<Addaudio1>> getAudioForUsermobile(@PathVariable Long userId) {
        Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
        if (optionalUser.isPresent()) {
            UserRegister user = optionalUser.get();
            Set<Addaudio1> favoriteAudiosSet = user.getFavoriteAudios();
            List<Addaudio1> audios = new ArrayList<>(favoriteAudiosSet);
            // Thumbnails set for all audios, now return the response
            return ResponseEntity.ok(audios);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    
    //----------------------------favourite video ---------------------------------
    
//    @Autowired
//   	private AddVideoDescriptionRepository videodescriptionRepository;
//    
//    @PostMapping("/mobile/favourite/video")
//    public ResponseEntity<String> createfavouritevidfeo(@RequestBody Map<String, Long> requestData) {
//        try {
//            Long videoId = requestData.get("videoId");
//            Long userId = requestData.get("userId");
//
//            if (videoId == null || userId == null) {
//                return new ResponseEntity<>("Invalid request data", HttpStatus.BAD_REQUEST);
//            }
//
//            Optional<VideoDescription> videoOptional = videodescriptionRepository.findById(videoId);
//            if (videoOptional.isPresent()) {
//                VideoDescription video = videoOptional.get();
//
//                favourite ordertable = new favourite();
//               
//                ordertable.setAudioId(videoId);
//                ordertable.setUserId(userId);
//                favouriterepository.save(ordertable);
//                
//                Long favvideo = ordertable.getVideoId();
//                Long userid = ordertable.getUserId();
//                
//                Optional<UserRegister> optionalUser = userregisterrepository.findById(userid);
//                Optional<VideoDescription> optionalVideo = videodescriptionRepository.findById(favvideo);
//                
//                if (optionalUser.isPresent() && optionalVideo.isPresent()) {
//                    UserRegister user = optionalUser.get();
//                    VideoDescription favVideo = optionalVideo.get();
//
//                    // Check if the user is already added this video to favorites
//                    if (user.getFavoriteVideos().contains(favVideo)) {
//                        return ResponseEntity.badRequest().body("User has already added this video to favorites");
//                    }
//                    
//                    user.getFavoriteVideos().add(video); // Add the video object, not favVideo
//                    userregisterrepository.save(user);
//     
//                    return ResponseEntity.ok("Favorite video added successfully");
//                } else {
//                    // If a user or video with the specified ID doesn't exist, return 404
//                    String errorMessage = "";
//                    if (!optionalUser.isPresent()) {
//                        errorMessage += "User with ID " + userId + " not found. ";
//                    }
//                    if (!optionalVideo.isPresent()) {
//                        errorMessage += "Video with ID " + favvideo+ " not found. ";
//                    }
//                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage.trim());
//                }
//            } else {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating favorite video: " + e.getMessage());
//        }
//    }
//
//    @GetMapping("/mobile/{userId}/UserVideos")
//    public ResponseEntity<List<VideoDescription>> getForVideoUser(@PathVariable Long userId) {
//        Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
//        if (optionalUser.isPresent()) {
//            UserRegister user = optionalUser.get();
//            
//            Set<VideoDescription> favoriteVideosSet = user.getFavoriteVideos();
//            List<VideoDescription> videos = new ArrayList<>(favoriteVideosSet);
//            // Thumbnails set for all audios, now return the response
//            return ResponseEntity.ok(videos);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//    
//
//
//

}
