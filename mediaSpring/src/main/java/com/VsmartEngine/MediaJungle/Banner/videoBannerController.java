package com.VsmartEngine.MediaJungle.Banner;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import com.VsmartEngine.MediaJungle.Container.VideoContainer;

@Controller
public class videoBannerController {

	@Autowired
	private VideoBannerRepository videobannerrepository;
	
	
	public ResponseEntity<String> createVideoBanner(@RequestBody VideoBannerRequest videoBannerRequest) {
	    try {
	        int noOfSlides = videoBannerRequest.getNoOfSlides(); // Assuming this is a property in your request
	        List<Long> videoIds = videoBannerRequest.getVideoIds(); // Assuming you have a list of video IDs

	        // Check if the number of video IDs exceeds the allowed number of slides
	        if (videoIds.size() > noOfSlides) {
	            return ResponseEntity.badRequest()
	                                 .body("Error: Number of video IDs exceeds the number of slides allowed.");
	        }

	        // Map the requests to entities
	        for (Long videoId : videoIds) {
	            VideoBanner videobanner = new VideoBanner();
	            videobanner.setVideoId(videoId);
	            
	            // Save to the database
	            videobannerrepository.save(videobanner);
	        }

	        // Return a success response
	        return ResponseEntity.ok("VideoBanner processed successfully");

	    } catch (Exception e) {
	        // Log the exception (optional)
	        // logger.error("Error processing video banners", e);

	        // Return an error response
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Error processing video banners: " + e.getMessage());
	    }
	}
	
	public ResponseEntity<List<VideoBanner>> getAllVideoBanner() {
	    try {
	        // Fetch all video banners from the database
	        List<VideoBanner> videoBanners = videobannerrepository.findAll();

	        // Return the list of video banners
	        return ResponseEntity.ok(videoBanners);
	        
	    } catch (Exception e) {

	        // Return an error response
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body(null); // You might want to return a specific message here
	    }
	}




}
