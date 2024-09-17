package com.VsmartEngine.MediaJungle.Container;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@Controller
public class VideoContainerController {
	
	@Autowired
	private VideoContainerRepository videocontainerrepository;
	
	
	public ResponseEntity<String> createVideoContainer(@RequestBody List<VideoContainer> videoContainerRequests) {
        // Map the requests to entities
        for (VideoContainer request : videoContainerRequests) {
            VideoContainer videocontainer = new VideoContainer();
            videocontainer.setValue(request.getValue());
            videocontainer.setCategory(request.getCategory());
            
            // Save to the database
            videocontainerrepository.save(videocontainer);
        }

        // Return a response
        return ResponseEntity.ok("VideoContainer processed successfully");
    }
	

    public ResponseEntity<List<VideoContainer>> getAllVideoContainers() {
        // Fetch all video containers from the database
        List<VideoContainer> videoContainers = videocontainerrepository.findAll();

        // Return the list of video containers
        return ResponseEntity.ok(videoContainers);
    }

	
}
