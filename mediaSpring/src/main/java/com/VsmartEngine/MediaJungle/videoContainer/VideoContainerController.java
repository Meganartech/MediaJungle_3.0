package com.VsmartEngine.MediaJungle.videoContainer;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class VideoContainerController {
	
	@Autowired
	private VideoContainerRepository videocontainerrepository;
	
//	@PostMapping("/SubmitContainers")
//    public ResponseEntity<String> submitContainers(@RequestBody List<Map<String, Object>> containers) {
//        try {
//        	for (Map<String, Object> containerData : containers) {
//                String value = (String) containerData.get("value");
//                String categoryId = (String) containerData.get("category");
//
//                VideoContainer entity = new VideoContainer();
//                entity.setName(value);
//                entity.setCategoryName(categoryId);
//                videocontainerrepository.save(entity);
//            }
//            return ResponseEntity.ok("Containers saved successfully");
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Error saving containers: " + e.getMessage());
//        }
//    }
	
	
	 @PostMapping("/SubmitContainers")
	    public ResponseEntity<String> submitContainers(@RequestBody List<VideoContainerDTO> containers) {
	        try {
	            for (VideoContainerDTO containerData : containers) {
	                String value = containerData.getValue();
	                String categoryId = containerData.getCategory();

	                VideoContainer entity = new VideoContainer();
	                entity.setName(value);
	                entity.setCategoryName(categoryId);
	                videocontainerrepository.save(entity);
	            }
	            return ResponseEntity.ok("Containers saved successfully");
	        } catch (Exception e) {
	            // Log the exception
	            return ResponseEntity.status(500).body("Error saving containers: " + e.getMessage());
	        }
	    }
}
