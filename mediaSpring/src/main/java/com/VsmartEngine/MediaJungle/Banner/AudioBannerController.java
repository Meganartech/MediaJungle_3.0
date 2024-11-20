package com.VsmartEngine.MediaJungle.Banner;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.model.AudioMovieNameBanner;
import com.VsmartEngine.MediaJungle.model.Audiodescription;
import com.VsmartEngine.MediaJungle.repository.AddAudiodescription;
import com.VsmartEngine.MediaJungle.repository.AudioMovieNameBannerRepository;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class AudioBannerController {
	
	@Autowired
	private AudiobannerRepository audiobannerrepository;
	
	@Autowired
	private AddAudiodescription audio;
	
	@Autowired
	private AudioMovieNameBannerRepository audiomovienamebannerrepository;
	
	@PostMapping("/createaudiobanner")
	public ResponseEntity<?> createAudioBanner(@RequestBody List<AudioBanner> audioBannerRequest) {
		try {
	        for (int i = 0; i < audioBannerRequest.size(); i++) {
	            AudioBanner container = audioBannerRequest.get(i);
	            Long id = container.getId();  // Use the wrapper class 'Long' to allow null values
	            
	            if (id == null || id == 0) {  // Handle null or new records (id == 0)
	                System.out.println("Creating new container. Id: " + id);
	                audiobannerrepository.save(container);  // Save new container
	            } else {
	                // Update existing container
	                Optional<AudioBanner> containerData = audiobannerrepository.findById(id);
	                
	                if (containerData.isPresent()) {
	                    AudioBanner edit = containerData.get();
	                    edit.setMovienameID(container.getMovienameID());
	                    audiobannerrepository.save(edit);  // Save updated container
	                } else {
	                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                                         .body("banner with id " + id + " not found");
	                }
	            }
	        }
	        return ResponseEntity.ok().build();
	    } catch (Exception e) {
	        e.printStackTrace();  // Print the stack trace for debugging
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("An error occurred while processing the banner: " + e.getMessage());
	    }
	}
	
	@GetMapping("/getallaudiobanner")
	public ResponseEntity<List<AudioBanner>> getAllAudioBanner() {
	    try {
	        // Fetch all video banners from the database
	        List<AudioBanner> audioBanners = audiobannerrepository.findAll();

	        // Sort the list by id
	        audioBanners.sort(Comparator.comparing(AudioBanner::getId)); // Assuming getId() returns the id

	        // Return the sorted list of video banners
	        return ResponseEntity.ok(audioBanners);
	        
	    } catch (Exception e) {
	        // Log the exception if needed
	        e.printStackTrace(); // Optional: Print the stack trace for debugging

	        // Return an error response
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body(null); // You might want to return a specific message here
	    }
	}


        @DeleteMapping("/deleteaudiobanner/{id}")
	   	public ResponseEntity<?> Deleteaudiobanner(@PathVariable("id") long id) {
	   		
	    	audiobannerrepository.deleteById(id);
	    	return ResponseEntity.ok().build();
	   	}
       
        
        @GetMapping("/getaudiodetails/{movie_name}")
        public ResponseEntity<?> getaudiodetailsbyId(@PathVariable("movie_name") long movie_name){
        	List<Audiodescription> optionaladddescription = audio.findMovie_nameById(movie_name); 
        	
        	 if (!optionaladddescription.isEmpty()) {
        	        return ResponseEntity.ok(optionaladddescription); // Return the list if found
        	    } else {
        	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
        	                             .body("No audio details found for movie name: " + movie_name);
        	    }
        	
        }


}
