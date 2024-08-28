package com.VsmartEngine.MediaJungle;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
import com.VsmartEngine.MediaJungle.model.AudiodetailsDTO;
import com.VsmartEngine.MediaJungle.model.Audioimages;
import com.VsmartEngine.MediaJungle.model.Tag;
import com.VsmartEngine.MediaJungle.repository.AddAudiodescription;
import com.VsmartEngine.MediaJungle.repository.AudioTagRepository;
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
    
	@Autowired
	private AudioTagRepository AudioTagRepository;
	
    
  
	
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
	         cast.setId(savedData.getId());
	         	cast.setAudioId(savedData.getId());
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
	    public ResponseEntity<List<Tag>> Audiolistdetails() {
	        // Fetch all audio descriptions from the database
	        List<Audiodescription> audioList = audio.findAll();
	        long a=1;
	        List<Tag>audioTag= AudioTagRepository.findByAudio_Id(a);
	        audioTag.forEach(System.out::println);

	        // Print the list to the console (for debugging purposes)
//	        audioList.forEach(System.out::println);
//	        audioTag.ifPresent(tag -> {
//	            System.out.println("AudioTags ID: " + tag.getAudioTags_id());
//	            System.out.println("Audio ID: " + tag.getAudio_id().getId());
//	            System.out.println("Tag ID: " + tag.getTag_id());
//	        });
	        
	        // Return the list in the response body
	        return ResponseEntity.ok(audioTag);
	    }
	 
	 @GetMapping("/getaudiohomedto")
	 public ResponseEntity<List<AudiodetailsDTO>> getAudiohomedto() {
	     // Fetch all audio descriptions from the database
	     List<Audiodescription> audioList = audio.findAll();
//	     List<Audioimages>audioImage=audioI.findAll();

	     // Map to DTOs
	     List<AudiodetailsDTO> dtoList = audioList.stream()
	    	        .map(a -> new AudiodetailsDTO(a.getId(), a.getAudio_title()) )
	    	        .collect(Collectors.toList());

	    	    // Print the list to the console (for debugging purposes)
	    	    dtoList.forEach(System.out::println);
//		        System.out.println("Audio Title: "+audioImage);

	    	    
//	    	    audioImage.forEach(System.out::println);
	     // Return the list in the response body
	     return ResponseEntity.ok(dtoList);
	 }
	 
	 @GetMapping("/getaudiodetailsdto")
	 public ResponseEntity<List<AudiodetailsDTO>> getAudio() {
	     // Fetch all audio descriptions from the database
	     List<Audiodescription> audioList = audio.findAll();
//	     List<Audioimages>audioImage=audioI.findAll();

	     // Map to DTOs
	     List<AudiodetailsDTO> dtoList = audioList.stream()
	    	        .map(a -> new AudiodetailsDTO(a.getId(), a.getAudio_title()) )
	    	        .collect(Collectors.toList());

	    	    // Print the list to the console (for debugging purposes)
	    	    dtoList.forEach(System.out::println);
//		        System.out.println("Audio Title: "+audioImage);

	    	    
//	    	    audioImage.forEach(System.out::println);
	     // Return the list in the response body
	     return ResponseEntity.ok(dtoList);
	 }
	 
	 @GetMapping("/test/{id}")
	 public ResponseEntity<List> getToken(@PathVariable("id") long id) {
		 
	        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	        Random random = new Random();
	        StringBuilder sb = new StringBuilder();
	        for (int i = 0; i < 4; i++) {
	            int index = random.nextInt(characters.length());
	            sb.append(characters.charAt(index));
	        }
	        
	        String randomAlphanumeric = sb.toString();
	        
	        String idStr = String.format("%02d", id % 100);
	        
	        String combined = randomAlphanumeric + idStr;
	        
	        
	        List<String> test = new ArrayList<>();
	        String jsonString = String.format("token: %s", combined);
	        test.add(jsonString);
	   
	     return ResponseEntity.ok(test);
	 }
	 
	 
	 
	 
	 
	 

	
}
