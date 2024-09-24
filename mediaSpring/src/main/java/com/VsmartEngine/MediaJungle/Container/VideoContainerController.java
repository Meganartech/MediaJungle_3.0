package com.VsmartEngine.MediaJungle.Container;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.video.AddVideoDescriptionRepository;
import com.VsmartEngine.MediaJungle.video.VideoDescription;




@Controller
public class VideoContainerController {
	
	@Autowired
	private VideoContainerRepository videocontainerrepository;
	
	@Autowired
	private AddVideoDescriptionRepository videodescriptionRepository;
	
	
//	public ResponseEntity<String> createVideoContainer(@RequestBody List<VideoContainer> videoContainerRequests) {
//        // Map the requests to entities
//        for (VideoContainer request : videoContainerRequests) {
//            VideoContainer videocontainer = new VideoContainer();
//            videocontainer.setValue(request.getValue());
//            videocontainer.setCategory(request.getCategory());
//            
//            // Save to the database
//            videocontainerrepository.save(videocontainer);
//        }
//
//        // Return a response
//        return ResponseEntity.ok("VideoContainer processed successfully");
//    }
	
	public ResponseEntity<String> createVideoContainer(@RequestBody List<VideoContainer> videoContainerRequests) {
	    try {
	        // Map the requests to entities
	        for (VideoContainer request : videoContainerRequests) {
	            VideoContainer videocontainer = new VideoContainer();
	            videocontainer.setValue(request.getValue());
	            videocontainer.setCategory(request.getCategory());
	            
	            // Save to the database
	            videocontainerrepository.save(videocontainer);
	        }

	        // Return a success response
	        return ResponseEntity.ok("VideoContainer processed successfully");
	        
	    } catch (Exception e) {
	        // Log the exception (optional)
	        // logger.error("Error processing video containers", e);

	        // Return an error response
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Error processing video containers: " + e.getMessage());
	    }
	}

	

//    public ResponseEntity<List<VideoContainer>> getAllVideoContainers() {
//        // Fetch all video containers from the database
//        List<VideoContainer> videoContainers = videocontainerrepository.findAll();
//        // Return the list of video containers
//        return ResponseEntity.ok(videoContainers);
//    }
	
	
	public ResponseEntity<List<VideoContainerDTO>> getVideoContainersWithDetails() {
	    // Step 1: Fetch all video containers from the repository
	    List<VideoContainer> videoContainers = videocontainerrepository.findAll();
	    
	    // Step 2: Fetch all videos from the repository
	    List<VideoDescription> videos = videodescriptionRepository.findAll();

	    // Step 3: Create a list to hold the custom response objects
	    List<VideoContainerDTO> responseList = new ArrayList<>();

	    // Step 4: Iterate over each video container
	    for (VideoContainer container : videoContainers) {
	        // Extract category ID from the container
	        Long categoryId = Long.parseLong(container.getCategory());
	        
	        // Initialize a list to store VideoDescription objects that match the category
	        List<VideoDescription> matchingVideos = new ArrayList<>();

	        // Step 5: Filter videos by the current category ID
	        for (VideoDescription video : videos) {
	            if (video.getCategorylist().contains(categoryId)) {
	                matchingVideos.add(video); // Add full video description to the list
	            }
	        }

	        // Step 6: Create a custom response object with the container's value and matching videos
	        VideoContainerDTO response = new VideoContainerDTO(container.getValue(), matchingVideos);

	        // Step 7: Add the response object to the list
	        responseList.add(response);
	    }

	    // Step 8: Return the list of custom response objects
	    return ResponseEntity.ok(responseList);
	}

    
    

	
}
