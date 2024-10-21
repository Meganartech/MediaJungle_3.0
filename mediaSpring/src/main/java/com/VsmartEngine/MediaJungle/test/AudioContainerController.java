package com.VsmartEngine.MediaJungle.test;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.compresser.ImageUtils;
import com.VsmartEngine.MediaJungle.controller.CategoryController;
import com.VsmartEngine.MediaJungle.controller.VideoCastAndCrewController;
import com.VsmartEngine.MediaJungle.fileservice.AudioFileService;
import com.VsmartEngine.MediaJungle.model.AddNewCategories;
import com.VsmartEngine.MediaJungle.model.AudioCastAndCrew;
import com.VsmartEngine.MediaJungle.model.AudioContainersDetailsDTO;
import com.VsmartEngine.MediaJungle.model.Audiodescription;
import com.VsmartEngine.MediaJungle.model.AudiodetailsDTO;
import com.VsmartEngine.MediaJungle.model.Audioimages;
import com.VsmartEngine.MediaJungle.model.AudiolistdetailsDTO;
import com.VsmartEngine.MediaJungle.model.CastandCrew;
import com.VsmartEngine.MediaJungle.model.CastandCrewDTO;
import com.VsmartEngine.MediaJungle.model.Tag;
import com.VsmartEngine.MediaJungle.repository.AddAudiodescription;
import com.VsmartEngine.MediaJungle.repository.AudioCastandCrewRepository;
import com.VsmartEngine.MediaJungle.repository.AudioCategoriesRepository;
import com.VsmartEngine.MediaJungle.repository.AudioTagRepository;
import com.VsmartEngine.MediaJungle.repository.Audioimage;
import com.VsmartEngine.MediaJungle.repository.CastandcrewRepository;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class AudioContainerController {
	
	@Autowired
	private AudioContainerRepository AudioContainerRepository;
	
	@Autowired
	private AudioCategoriesRepository AudioCategoriesRepository;
	
	@Autowired
	private Audioimage audioI;
	
//	----------------------------------add audio --------------------------
	
	@Autowired
	private AddAudiodescription audio;


	@Autowired
	private VideoCastAndCrewController castandcrew;

	@Autowired
	private CategoryController Category;

	@Autowired
	private AudioFileService fileService;

	@Autowired
	private AudioTagRepository AudioTagRepository;



	@Autowired
	private AudioCastandCrewRepository Audiocastandcrewrepository;

	@Autowired
	private CastandcrewRepository CastandcrewRepository;
	
    @PostMapping("/audiocontainer")
	public ResponseEntity<?> Audioconatiner(@RequestBody List<AudioContainer> data) {
		
    	System.out.println(data);
//    	AudioContainerRepository.deleteAll();
    	for (int i = 0; i < data.size(); i++) {
            AudioContainer container = data.get(i);
            long id =container.getId();
            
            if (id==0){
            	 System.out.println("Id: " + id);
            	 container.getCategoryId();
            	 container.getContainer_name();
            	 AudioContainerRepository.save(container);  
            }
            else
            {   Optional<AudioContainer> containerdata= AudioContainerRepository.findById(id);
            AudioContainer edit =containerdata.get();
            edit.setCategoryId(container.getCategoryId());
            edit.setContainer_name(container.getContainer_name());
            	 AudioContainerRepository.save(container);              	
            }
        }	
		 return ResponseEntity.ok().build();
	}
    @GetMapping("/audiocontainer")
   	public ResponseEntity<?> GetAudioconatiner() {
   		
       	List<AudioContainer> audiocontainer=AudioContainerRepository.findAll();
       
    	return ResponseEntity.ok(audiocontainer);
   	}
    
    @DeleteMapping("/audiocontainer/{id}")
   	public ResponseEntity<?> DeleteAudioconatiner(@PathVariable("id") long id) {
   		
    	AudioContainerRepository.deleteById(id);
    	return ResponseEntity.ok().build();
   	}
    
    @GetMapping("/audioContainerDetails")
	public ResponseEntity<List<AudioContainersDetailsDTO>> AudiolistdetailsBycategoryids() {
    	
    	List<AudioContainer> data=AudioContainerRepository.findAll();

     	List<AudioContainersDetailsDTO> AudioContainerDetails=new ArrayList<>();
    	for (int i = 0; i < data.size(); i++) {
            AudioContainer container = data.get(i);
            long id =container.getCategoryId();
            String categoryname =container.getContainer_name();
            List<Audiodescription> audiocat= AudioCategoriesRepository.findaudiobyCategorie_Id(id);
            AudioContainerDetails.add(new AudioContainersDetailsDTO(categoryname,audiocat) );
            if (id==0){
            	 System.out.println("Id: " + id);
            	 container.getCategoryId();
            	 container.getContainer_name();
            	 AudioContainerRepository.save(container);  
            }
        }	
		long id=1l;
		 List<Audiodescription> audiocat= AudioCategoriesRepository.findaudiobyCategorie_Id(id);
				
		 return ResponseEntity.ok(AudioContainerDetails);
	}

    public byte[] getaudiobannerimageById(Long id) {
    	 
          	
         	 Optional<Audioimages> audioTumbnail = audioI.findById(id);
//             Optional<Addaudio1> audioOptional = audiorepository.findById(id);
         	  byte[] thumbnailData=null;
             if (audioTumbnail.isPresent()) {
             	Audioimages audioImage = audioTumbnail.get();  

                 // Assuming decompressImage returns the raw thumbnail data
                 thumbnailData = ImageUtils.decompressImage(audioImage.getBannerthumbnail());

                 // Convert the byte array to Base64
                 String base64Thumbnail = Base64.getEncoder().encodeToString(thumbnailData);

                 // Return a list with a single Base64-encoded thumbnail
                
             }
             return thumbnailData;
    }
    
    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getMovieImage(@PathVariable Long id) {
        byte[] image = this.getaudiobannerimageById(id);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "image/jpeg"); // Set appropriate content type (image/jpeg, image/png, etc.)

        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }
    
    
    
    
    @GetMapping("/getaudiodetailsdto")
	public ResponseEntity<List<AudiodetailsDTO>> getAudio() {
		List<Audiodescription> audioList = audio.findAll();
		List<AudiodetailsDTO> dtoList = audioList.stream().map(a -> {
			List<AddNewCategories> audioCategorie = AudioCategoriesRepository.findByCategorie_Id(a.getId());
			audioCategorie.forEach(System.out::println);
			String firstCategoryName = audioCategorie.isEmpty() ? "No Category" : audioCategorie.get(0).getCategories();
			return new AudiodetailsDTO(a.getId(), a.getAudio_title(), a.getPaid(), a.getProduction_company(),
					a.getRating(), firstCategoryName);
		}).collect(Collectors.toList());
		dtoList.forEach(System.out::println);
		return ResponseEntity.ok(dtoList);
	}
    
    
    @DeleteMapping("/testaudio/{id}")
	public ResponseEntity<String> deleteAudio(@PathVariable Long id) {
		try {

			AudioTagRepository.deletetagByAudioId(id);
			AudioCategoriesRepository.deletecategoriesByAudioId(id);
			Audiocastandcrewrepository.deleteById(id);
			audioI.deleteById(id);
			audio.deleteById(id);

			if (true) {
				return new ResponseEntity<>("Audio with ID " + id + " deleted successfully.", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Audio not found with ID: " + id, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>("An error occurred while deleting audio with ID: " + id,
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
    
    @GetMapping("/getaudio/{id}")
	public ResponseEntity<AudiolistdetailsDTO> Audiolistdetails(@PathVariable("id") long id) {

		Optional<Audiodescription> audioList = audio.findById(id);
		List<Tag> audioTag = AudioTagRepository.findByAudio_Id(id);
		List<AddNewCategories> audioCategorie = AudioCategoriesRepository.findByCategorie_Id(id);
		Optional<AudioCastAndCrew> audioCastandCrew = Audiocastandcrewrepository.findById(id);
		List<CastandCrewDTO> castAndCrewDTOList = new ArrayList<>();
		AudioCastAndCrew castandcrew = audioCastandCrew.get();
		List<Long> castAndCrewIds = castandcrew.getCastandcrewlist();
		for (Long ids : castAndCrewIds) {
			Optional<CastandCrew> castAndCrewOptional = CastandcrewRepository.findById(ids);
			if (castAndCrewOptional.isPresent()) {
				CastandCrew castAndCrew = castAndCrewOptional.get();
				// Create a DTO or simply use an object to hold the ID and Name
				CastandCrewDTO dto = new CastandCrewDTO(castAndCrew.getId(), castAndCrew.getName());
				castAndCrewDTOList.add(dto);
			} else {
				// Handle the case where the ID does not exist in the repository
				System.out.println("No CastandCrew found with ID: " + id);
			}

		}
		castAndCrewDTOList.forEach(System.out::println);
		AudiolistdetailsDTO dto = new AudiolistdetailsDTO();
		if (audioList.isPresent()) {
			Audiodescription audio = audioList.get();
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
			dto.setCastandCrew(castAndCrewDTOList);
		} else {
			return ResponseEntity.notFound().build();
		}
		audioTag.forEach(System.out::println);
		return ResponseEntity.ok(dto);
	}
}
