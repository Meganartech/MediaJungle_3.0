package com.VsmartEngine.MediaJungle.test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
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
import com.VsmartEngine.MediaJungle.model.AddNewCategories;
import com.VsmartEngine.MediaJungle.model.AudioCastAndCrew;
import com.VsmartEngine.MediaJungle.model.Audiodescription;
import com.VsmartEngine.MediaJungle.model.AudiodetailsDTO;
import com.VsmartEngine.MediaJungle.model.Audioimages;
import com.VsmartEngine.MediaJungle.model.AudiolistdetailsDTO;
import com.VsmartEngine.MediaJungle.model.Tag;
import com.VsmartEngine.MediaJungle.repository.AddAudiodescription;
import com.VsmartEngine.MediaJungle.repository.AudioCastandCrewRepository;
import com.VsmartEngine.MediaJungle.repository.AudioCategoriesRepository;
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
	
	@Autowired
	private AudioCategoriesRepository AudioCategoriesRepository;
	
	@Autowired
	private AudioCastandCrewRepository Audiocastandcrewrepository;
	
	
	@Autowired
	private testRepo testRepo;
	
	@Autowired
	private JavaMailSender sender ;
	
	
    
  
	
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
//	         castandcrew.saveAudioCastAndCrew(savedData.getId(), castAndCrewIds);
	         
	         
	         AudioCastAndCrew AudioCastAndCrew = new AudioCastAndCrew();;
	         AudioCastAndCrew.setAudio_id(savedData.getId());
	         AudioCastAndCrew.setCastandcrewlist(castAndCrewIds);
         

           Audiocastandcrewrepository.save(AudioCastAndCrew);
	         Category.saveCategories(savedData.getId(), category);
	         Category.savetags(savedData.getId(), tag);
	         byte[] audiothumbnailBytes = ImageUtils.compressImage(audio_thumbnail.getBytes());
	         byte[] bannerthumbnailBytes = ImageUtils.compressImage(banner_thumbnail.getBytes());

	         Audioimages cast = new Audioimages();
//	            cast.setImage(thumbnailBytes);
//	         cast.setId(savedData.getId());
	         
	         	cast.setAudioId(savedData.getId());
	            cast.setAudio_thumbnail(audiothumbnailBytes);
	            cast.setBannerthumbnail(bannerthumbnailBytes);
	            audioI.save(cast);
//	            
//	            this.getAudio();O
	        System.out.println("Audio Title: ");

	        return ResponseEntity.ok().build();
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data");
	    }
	}
	 @GetMapping("/getaudio/{id}")
	    public ResponseEntity<AudiolistdetailsDTO> Audiolistdetails(@PathVariable("id") long id) {
	        
	        Optional<Audiodescription> audioList = audio.findById(id);
	        List<Tag>audioTag= AudioTagRepository.findByAudio_Id(id);
	        List<AddNewCategories>audioCategorie= AudioCategoriesRepository.findByCategorie_Id(id);
	        Optional<Audioimages>audioImage=audioI.findById(id);
	        Optional<AudioCastAndCrew>audioCastandCrew=Audiocastandcrewrepository.findById(id);
	        
	        AudioCastAndCrew castandcrew= audioCastandCrew.get();
	        List<Long> sam=castandcrew.getCastandcrewlist();
	        sam.forEach(System.out::println);
	        
	        
	       
	        AudiolistdetailsDTO dto = new AudiolistdetailsDTO();
	        if (audioList.isPresent()) {
	            Audiodescription audio = audioList.get();
	            
	            // Map to DTO
	           
	            dto.setId(audio.getId());
	            dto.setAudioTitle(audio.getAudio_title());
	            dto.setMovie_name(audio.getMovie_name());
	            dto.setRating(audio.getRating());
	            dto.setDescription(audio.getDescription());
	            dto.setProduction_company(audio.getProduction_company());
	            dto.setPaid(audio.getPaid());
	            dto.setAudio_file_name(audio.getAudio_file_name());
	            dto.setCertificate_name(audio.getCertificate_name());
	            dto.setAudio_Duration(audio.getAudio_Duration());
	            dto.setCertificate_no(audio.getCertificate_no());
	            dto.setTag(audioTag);
	            dto.setCategory(audioCategorie);
	            dto.setCastandCrew(sam);
//	            return ResponseEntity.ok(dto);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	        
	        
	        
	        
//	        List<AudiolistdetailsDTO> dtoList = audioList.stream()
//	    	        .map(a -> new AudiolistdetailsDTO(a.getAudio_Duration()) )
//	    	        .collect(Collectors.toList());
	        
//	        AddNewCategories 
	        audioTag.forEach(System.out::println);

	        // Print the list to the console (for debugging purposes)
//	        audioList.forEach(System.out::println);
//	        audioTag.ifPresent(tag -> {
//	            System.out.println("AudioTags ID: " + tag.getAudioTags_id());
//	            System.out.println("Audio ID: " + tag.getAudio_id().getId());
//	            System.out.println("Tag ID: " + tag.getTag_id());
//	        });
	        
	        // Return the list in the response body
	        return ResponseEntity.ok(dto);
	    }
	 

//	 @GetMapping("/getaudiohomedto")
//	 public ResponseEntity<  List<CastandCrewDTO>   > getAudiohomedto() {
//	     // Fetch all audio descriptions from the database
//		 long a=4l;
////		  List<CastandCrewDTO> findByAudio_Id
//		 List<CastandCrewDTO> audioList1= Audiocastandcrewrepository.findByAudio_Id(a);
////	     List<Audiodescription> audioList = audio.findAll();
////	     Optional<Audioimages>audioImage=audioI.findById(a);
////	     AudioimagesDTO dto = new AudioimagesDTO();
////	     
////	     if (audioImage.isPresent()) {
////	    	 
////	    	 Audioimages audio = audioImage.get();
////	    	 
////	    	 dto.setThumbnail(audio.getAudio_thumbnail());
////	    	 
////	    	 
////	     }
//	     
//	     
////	     Optional<byte[]> sam=audioI.findBannerByaudio_Id(a);
////	     List<Audioimages> findByaudio_Id(@Param("audioId") long audioId);
//	     // Map to DTOs
////	     List<AudiodetailsDTO> dtoList = audioList.stream()
////	    	        .map(a -> new AudiodetailsDTO(a.getId(), a.getAudio_title()) )
////	    	        .collect(Collectors.toList());
//
//	    	    // Print the list to the console (for debugging purposes)
////	    	    dtoList.forEach(System.out::println);
////		        System.out.println("Audio Title: "+audioImage);
//
//	    	    
////	    	    audioImage.forEach(System.out::println);
//	     // Return the list in the response body
//	     return ResponseEntity.ok(audioList1);
//	 }
	 
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
	 
//	 @PostMapping("/afliater")
//	 public ResponseEntity<Map<String, Object>> getAfliater(@RequestBody testModel data) {
//	     testModel savedData = testRepo.save(data);
//	     System.out.println(data);
//	     System.out.println(savedData.getId());
//	     String UseremailID=savedData.getEmailId();
//	     long id=savedData.getId();
//	     String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//	        Random random = new Random();
//	        StringBuilder sb = new StringBuilder();
//	        StringBuilder sb1 = new StringBuilder();
//	        StringBuilder sb2 = new StringBuilder();
//	        for (int i = 0; i < 4; i++) {
//	            int index = random.nextInt(characters.length());
//	            sb.append(characters.charAt(index));
//	            int index1 = random.nextInt(characters.length());
//	            sb1.append(characters.charAt(index1));
//	            int index2 = random.nextInt(characters.length());
//	            sb2.append(characters.charAt(index2));
//	        }
//	        String randomAlphanumeric = sb.toString();
//	        String randomAlphanumeric10 = sb1.toString();
//	        String randomAlphanumeric20 = sb2.toString();
//	        String idStr = String.format("%02d", id % 100);
//	        String combinedtoken = randomAlphanumeric + idStr;
//	        String combinedtoken10 = randomAlphanumeric10 + "10";
//	        String combinedtoken20 = randomAlphanumeric20 + "20";
//	        Optional<testModel> editdata=testRepo.findById(id);
//	        if (editdata.isPresent()) {
//	        	testModel testdata=editdata.get();
//	        	testdata.setCoupon10(combinedtoken10);
//	        	testdata.setCoupon20(combinedtoken20);
//	        	testdata.setReferalid(combinedtoken);
//	        	testRepo.save(testdata);
//	        }
//	        this.mail(UseremailID,combinedtoken,combinedtoken10,combinedtoken20 );
//	       
//	     Map<String, Object> response = new HashMap<>();
//	     response.put("message", "Data saved successfully");
//	     return ResponseEntity.ok(response); // Returning JSON response
//	 }
//	 public void  mail(String UseremailID,String combinedtoken,String combinedtoken10,String combinedtoken20 ) {	 
//		 SimpleMailMessage message = new SimpleMailMessage();
//		 message.setTo(UseremailID);
//		 message.setText("token \t"+combinedtoken+"\n"+"10 % coupon \t"+combinedtoken10+"\n"+"20 % coupone \t"+combinedtoken20);
//		 message.setSubject("Learnhub");
//		 sender.send(message); 
//	 }
	 

@PostMapping("/afliater")
public ResponseEntity<Map<String, Object>> getAfliater(@RequestBody testModel data) {
    testModel savedData = testRepo.save(data);
    System.out.println(data);
    System.out.println(savedData.getId());
    String UseremailID = savedData.getEmailId();
    long id = savedData.getId();

    // Random generation logic
    String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    Random random = new Random();
    StringBuilder sb = new StringBuilder();
    StringBuilder sb1 = new StringBuilder();
    StringBuilder sb2 = new StringBuilder();

    for (int i = 0; i < 4; i++) {
        sb.append(characters.charAt(random.nextInt(characters.length())));
        sb1.append(characters.charAt(random.nextInt(characters.length())));
        sb2.append(characters.charAt(random.nextInt(characters.length())));
    }

    String randomAlphanumeric = sb.toString();
    String randomAlphanumeric10 = sb1.toString();
    String randomAlphanumeric20 = sb2.toString();

    String idStr = String.format("%02d", id % 100);
    String combinedtoken = randomAlphanumeric + idStr;
    String combinedtoken10 = randomAlphanumeric10 + "10";
    String combinedtoken20 = randomAlphanumeric20 + "20";

//    // Update the record using custom query
//    testRepo.updateCoupons(id, combinedtoken10, combinedtoken20, combinedtoken);
    
    Optional<testModel> editdata=testRepo.findById(id);
    if (editdata.isPresent()) {
    	testModel testdata=editdata.get();
    	testdata.setCoupon10(combinedtoken10);
    	testdata.setCoupon20(combinedtoken20);
    	testdata.setReferalid(combinedtoken);
    	testRepo.save(testdata);
    }

    // Send email asynchronously
    this.mail(UseremailID, combinedtoken, combinedtoken10, combinedtoken20);

    // Prepare response
    Map<String, Object> response = new HashMap<>();
    response.put("message", "Data saved successfully");
    return ResponseEntity.ok(response);
}

@Async
public void mail(String UseremailID, String combinedtoken, String combinedtoken10, String combinedtoken20) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(UseremailID);
    message.setText("token \t" + combinedtoken + "\n" + "10 % coupon \t" + combinedtoken10 + "\n" + "20 % coupon \t" + combinedtoken20);
    message.setSubject("Learnhub");
    sender.send(message);
}
	 
	 
	 

	
}
