package com.VsmartEngine.MediaJungle;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.compresser.ImageUtils;
import com.VsmartEngine.MediaJungle.controller.CategoryController;
import com.VsmartEngine.MediaJungle.controller.VideoCastAndCrewController;
import com.VsmartEngine.MediaJungle.fileservice.AudioFileService;
import com.VsmartEngine.MediaJungle.model.Audiodescription;
import com.VsmartEngine.MediaJungle.model.AudiodescriptionDTO;
import com.VsmartEngine.MediaJungle.model.Audioimages;
import com.VsmartEngine.MediaJungle.repository.AddAudiodescription;
import com.VsmartEngine.MediaJungle.repository.Audioimage;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class test {

	@Autowired
	private AddAudiodescription audio ;
	
	@Autowired
	private Audioimage audioI;
	
	@Autowired
	private VideoCastAndCrewController castandcrew;
	
	
	@Autowired
	private CategoryController Category;
	
    @Autowired
    private AudioFileService fileService;
	
	
	@PostMapping("/test")
	public ResponseEntity<?> testaudio(
			@RequestBody Audiodescription data,
			@RequestParam("thumbnail") MultipartFile audio_thumbnail,
			@RequestParam("Bannerthumbnail") MultipartFile banner_thumbnail,
			@RequestParam("castAndCrewIds") List<Long> castAndCrewIds,
			@RequestParam("category") List<Long> category,
			@RequestParam("tag") List<Long> tag,
			 @RequestParam("audioFile") MultipartFile audioFile
			
			
			
		) {
		    try {
		    	  String audioFilePath = fileService.saveAudioFile(audioFile);
			         data.setAudio_file_name(audioFilePath);
	         Audiodescription savedData = audio.save(data);
	         castandcrew.saveAudioCastAndCrew(savedData.getId(), castAndCrewIds);
	         Category.saveCategories(savedData.getId(), category);
	         Category.savetags(savedData.getId(), tag);
	         byte[] audiothumbnailBytes = ImageUtils.compressImage(audio_thumbnail.getBytes());
	         byte[] bannerthumbnailBytes = ImageUtils.compressImage(banner_thumbnail.getBytes());

	         Audioimages cast = new Audioimages();
//	            cast.setImage(thumbnailBytes);
	         	cast.setAudio_id(savedData.getId());
	            cast.setAudio_thumbnail(audiothumbnailBytes);
	            cast.setBannerthumbnail(bannerthumbnailBytes);
	            audioI.save(cast);
	            
//	            this.getAudio();O
	        System.out.println("Audio Title: ");

	        return ResponseEntity.ok().build();
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data");
	    }
	}
	
	 @GetMapping("/getaudio")
	    public ResponseEntity<List<Audiodescription>> getaudio() {
	        // Fetch all audio descriptions from the database
	        List<Audiodescription> audioList = audio.findAll();

	        // Print the list to the console (for debugging purposes)
	        audioList.forEach(System.out::println);
	        
	        // Return the list in the response body
	        return ResponseEntity.ok(audioList);
	    }
	 
	 @GetMapping("/getaudiodto")
	 public ResponseEntity<List<AudiodescriptionDTO>> getAudio() {
	     // Fetch all audio descriptions from the database
	     List<Audiodescription> audioList = audio.findAll();
//	     List<Audioimages>audioImage=audioI.findAll();

	     // Map to DTOs
	     List<AudiodescriptionDTO> dtoList = audioList.stream()
	    	        .map(a -> new AudiodescriptionDTO(a.getId(), a.getAudio_title()) )
	    	        .collect(Collectors.toList());

	    	    // Print the list to the console (for debugging purposes)
	    	    dtoList.forEach(System.out::println);
//		        System.out.println("Audio Title: "+audioImage);

	    	    
//	    	    audioImage.forEach(System.out::println);
	     // Return the list in the response body
	     return ResponseEntity.ok(dtoList);
	 }
	 
	 

	
}
