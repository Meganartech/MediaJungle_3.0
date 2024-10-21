package com.VsmartEngine.MediaJungle.Library;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.mobile.favouriteRepository;
import com.VsmartEngine.MediaJungle.repository.AddAudioRepository;
import com.VsmartEngine.MediaJungle.userregister.JwtUtil;
import com.VsmartEngine.MediaJungle.userregister.TokenBlacklist;
import com.VsmartEngine.MediaJungle.userregister.UserRegister;
import com.VsmartEngine.MediaJungle.userregister.UserRegisterRepository;
import com.VsmartEngine.MediaJungle.video.AddVideoDescriptionRepository;
import com.VsmartEngine.MediaJungle.video.VideoDescription;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class LibraryController {
	
	@Autowired
    private UserRegisterRepository userregisterrepository;
    
    @Autowired
   	private AddVideoDescriptionRepository videodescriptionRepository;
    
    @PostMapping("/watchlater/video")
    public ResponseEntity<String> watchlaterVideo(@RequestBody Map<String, Long> requestData) {
        try {
            Long videoId = requestData.get("videoId");
            Long userId = requestData.get("userId");

            if (videoId == null || userId == null) {
                return new ResponseEntity<>("Invalid request data", HttpStatus.BAD_REQUEST);
            }

            Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
            Optional<VideoDescription> optionalVideo = videodescriptionRepository.findById(videoId);

            if (optionalUser.isPresent() && optionalVideo.isPresent()) {
                UserRegister user = optionalUser.get();

                // Check if the user has already added this audioId to favorites
                if (user.getWatchlaterIds().contains(videoId)) {
                    return ResponseEntity.badRequest().body("User has already added this video to watchlater");
                }

                // Add the audioId to the user's favoriteAudioIds
                user.getWatchlaterIds().add(videoId);
                userregisterrepository.save(user);

                return ResponseEntity.ok("Watchlater video added successfully");
            } else {
            	StringBuilder errorMessage = new StringBuilder();

                if (!optionalUser.isPresent()) {
                    errorMessage.append("User with ID ").append(userId).append(" not found. ");
                }
                if (!optionalVideo.isPresent()) {
                    errorMessage.append("Video with ID ").append(videoId).append(" not found.");
                }

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage.toString().trim());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding to favourites: " + e.getMessage());
        }
    }


    @GetMapping("/getwatchlater/video")
    public ResponseEntity<String> getwatchlaterVideo(@RequestParam Long videoId, @RequestParam Long userId) {
        try {
            // Check if videoId or userId is null
            if (videoId == null || userId == null) {
                return new ResponseEntity<>("Invalid request data", HttpStatus.BAD_REQUEST);
            }

            // Retrieve the user and video data
            Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
            Optional<VideoDescription> optionalVideo = videodescriptionRepository.findById(videoId);

            // Check if user and video both exist
            if (optionalUser.isPresent() && optionalVideo.isPresent()) {
                UserRegister user = optionalUser.get();

                // Check if the videoId is already in the user's watchlaterIds
                boolean isVideoInWatchLater = user.getWatchlaterIds().contains(videoId);
                
                // Return true or false as a JSON response
                return ResponseEntity.ok(isVideoInWatchLater ? "true" : "false");
            } else {
                StringBuilder errorMessage = new StringBuilder();

                if (!optionalUser.isPresent()) {
                    errorMessage.append("User with ID ").append(userId).append(" not found. ");
                }
                if (!optionalVideo.isPresent()) {
                    errorMessage.append("Video with ID ").append(videoId).append(" not found.");
                }

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage.toString().trim());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking watch later status: " + e.getMessage());
        }
    }

    
//    @GetMapping("/{userId}/Watchlater")
//    public ResponseEntity<List<Long>> getVideoForwatchlater(@PathVariable Long userId) {
//        Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
//        if (optionalUser.isPresent()) {
//            UserRegister user = optionalUser.get();
//            // Get the set of favorite audio IDs
//            Set<Long> WatchlaterVideosIdsSet = user.getWatchlaterIds();
//            // Convert the set to a list if needed
//            List<Long> watchlaterIdsList = new ArrayList<>(WatchlaterVideosIdsSet);
//            // Return the list of audio IDs
//            return ResponseEntity.ok(watchlaterIdsList);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
    
    @GetMapping("/{userId}/Watchlater")
    public ResponseEntity<List<WatchLaterDTO>> getVideosForWatchlater(@PathVariable Long userId) {
        Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
        if (optionalUser.isPresent()) {
            UserRegister user = optionalUser.get();
            
            // Get the set of watchlater video IDs
            Set<Long> watchlaterVideoIdsSet = user.getWatchlaterIds();
            
            // Create a list to hold WatchLaterDTO objects
            List<WatchLaterDTO> watchLaterDTOList = new ArrayList<>();
            
            // Loop through each video ID and fetch video details (ID and Title)
            for (Long videoId : watchlaterVideoIdsSet) {
                // Fetch video using repository and handle Optional
                Optional<VideoDescription> optionalVideo = videodescriptionRepository.findById(videoId);
                
                if (optionalVideo.isPresent()) {
                    VideoDescription video = optionalVideo.get();
                    
                    // Create a new WatchLaterDTO with video ID and video title
                    WatchLaterDTO watchLaterDTO = new WatchLaterDTO(video.getId(), video.getVideoTitle());
                    
                    // Add to the list
                    watchLaterDTOList.add(watchLaterDTO);
                } else {
                    // Handle the case where the video does not exist (if needed)
                    // You can choose to log or skip the missing video
                    System.out.println("Video with ID " + videoId + " not found.");
                }
            }
            
            // Return the list of WatchLaterDTO objects
            return ResponseEntity.ok(watchLaterDTOList);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    @DeleteMapping("/{userId}/removewatchlater")
    public ResponseEntity<String> removeWatchlater(@PathVariable Long userId, @RequestParam Long videoId) {
        try {
            if (videoId == null) {
                return new ResponseEntity<>("Invalid request data", HttpStatus.BAD_REQUEST);
            }

            Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
            Optional<VideoDescription> optionalVideo = videodescriptionRepository.findById(videoId);
            
            if (optionalUser.isPresent() && optionalVideo.isPresent()) {
                UserRegister user = optionalUser.get();

                // Remove the videoId from the user's favoriteVideosIds
                if (user.getWatchlaterIds().remove(videoId)) {
                    userregisterrepository.save(user); // Save the updated user

                    return ResponseEntity.ok("Video removed from watchlater successfully");
                } else {
                    return ResponseEntity.badRequest().body("Video ID not found in user's watchlater");
                }
            } else {
                StringBuilder errorMessage = new StringBuilder();

                if (!optionalUser.isPresent()) {
                    errorMessage.append("User with ID ").append(userId).append(" not found. ");
                }
                if (!optionalVideo.isPresent()) {
                    errorMessage.append("Video with ID ").append(videoId).append(" not found.");
                }

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage.toString().trim());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error removing video from watchlater: " + e.getMessage());
        }
    }




}