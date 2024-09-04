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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
import com.VsmartEngine.MediaJungle.model.CastandCrew;
import com.VsmartEngine.MediaJungle.model.CastandCrewDTO;
import com.VsmartEngine.MediaJungle.model.Tag;
import com.VsmartEngine.MediaJungle.repository.AddAudiodescription;
import com.VsmartEngine.MediaJungle.repository.AudioCastandCrewRepository;
import com.VsmartEngine.MediaJungle.repository.AudioCategoriesRepository;
import com.VsmartEngine.MediaJungle.repository.AudioTagRepository;
import com.VsmartEngine.MediaJungle.repository.Audioimage;
import com.VsmartEngine.MediaJungle.repository.CastandcrewRepository;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class test {

	@Autowired
	private AddAudiodescription audio;

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
	private CastandcrewRepository CastandcrewRepository;

	@Autowired
	private testRepo testRepo;

	@Autowired
	private JavaMailSender sender;

	@PostMapping("/test")
	public ResponseEntity<?> testaudio(@RequestBody Audiodescription data,
			@RequestParam(value = "thumbnail", required = false) MultipartFile audio_thumbnail,
			@RequestParam(value = "Bannerthumbnail", required = false) MultipartFile banner_thumbnail,
			@RequestParam("castAndCrewIds") List<Long> castAndCrewIds, @RequestParam("category") List<Long> category,
			@RequestParam("tag") List<Long> tag, @RequestParam("audioFile") MultipartFile audioFile) {
		try {
			String audioFilePath = fileService.saveAudioFile(audioFile);
			data.setAudio_file_name(audioFilePath);
			Audiodescription savedData = audio.save(data);
			AudioCastAndCrew AudioCastAndCrew = new AudioCastAndCrew();
			;
			AudioCastAndCrew.setAudio_id(savedData.getId());
			AudioCastAndCrew.setCastandcrewlist(castAndCrewIds);
			Audiocastandcrewrepository.save(AudioCastAndCrew);
			Category.saveCategories(savedData.getId(), category);
			Category.savetags(savedData.getId(), tag);
			byte[] audiothumbnailBytes = ImageUtils.compressImage(audio_thumbnail.getBytes());
			byte[] bannerthumbnailBytes = ImageUtils.compressImage(banner_thumbnail.getBytes());

			Audioimages cast = new Audioimages();
			cast.setAudioId(savedData.getId());
			cast.setAudio_thumbnail(audiothumbnailBytes);
			cast.setBannerthumbnail(bannerthumbnailBytes);
			audioI.save(cast);
			System.out.println("Audio Title: ");

			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data");
		}
	}

	@PostMapping("/update")
	public ResponseEntity<?> audioupdate(@RequestBody Audiodescription data,
			@RequestParam(value = "thumbnail", required = false) MultipartFile audio_thumbnail,
			@RequestParam(value = "Bannerthumbnail", required = false) MultipartFile banner_thumbnail,
			@RequestParam("castAndCrewIds") List<Long> castAndCrewIds, @RequestParam("category") List<Long> category,
			@RequestParam("tag") List<Long> tag, @RequestParam("audio_id") Long id,
			@RequestParam(value = "audioFile", required = false) MultipartFile audioFile) {
		try {

			Optional<Audiodescription> audioList = audio.findById(id);
			Audiodescription audiodata = audioList.get();
			audiodata.setAudio_Duration(data.getAudio_Duration());
			audiodata.setAudio_title(data.getAudio_title());
			audiodata.setCertificate_name(data.getCertificate_name());
			audiodata.setCertificate_no(data.getCertificate_no());
			audiodata.setDescription(data.getDescription());
			audiodata.setMovie_name(data.getMovie_name());
			audiodata.setPaid(data.getPaid());
			audiodata.setProduction_company(data.getProduction_company());
			audiodata.setRating(data.getRating());
			System.out.println("audioFile!=null :" + (audioFile != null));
			if (audioFile != null) {
				String audioFilePath = fileService.saveAudioFile(audioFile);
				System.out.println("audioFilePath :" + (audioFilePath));
				audiodata.setAudio_file_name(audioFilePath);
			} else {
				audiodata.setAudio_file_name(data.getAudio_file_name());
			}

			audio.save(audiodata);

			List<Tag> audioTag = AudioTagRepository.findByAudio_Id(id);
			List<Long> audioTagIds = audioTag.stream().map(Tag::getTag_id) 
					.collect(Collectors.toList());

			List<Long> newTags = tag.stream().filter(tagId -> !audioTagIds.contains(tagId))
					.collect(Collectors.toList());
//		    	 	       missingTags.forEach(System.out::println);
			
			List<Long> removeTags = audioTagIds.stream().filter(tagId -> !tag.contains(tagId))
					.collect(Collectors.toList());
			
			if (!removeTags.isEmpty()) {
				removeTags.forEach(tagId -> {
				    AudioTagRepository.deletetagBytagId(tagId, id);
				});
			}
			
			System.out.println("!missingTags.isEmpty() :" + !newTags.isEmpty());
			if (!newTags.isEmpty()) {
				Category.savetags(id, newTags);
			}

			List<AddNewCategories> audioCategorie = AudioCategoriesRepository.findByCategorie_Id(id);
			List<Long> CategoryIds = audioCategorie.stream().map(AddNewCategories::getCategory_id) // Assuming Tag has a
																									// method getId()
																									// returning Long
					.collect(Collectors.toList());
			List<Long> missingCategory = category.stream().filter(categoryId -> !CategoryIds.contains(categoryId))
					.collect(Collectors.toList());
			
			List<Long> removeCategory = CategoryIds.stream().filter(categoryId -> !category.contains(categoryId))
					.collect(Collectors.toList());
			removeTags.forEach(System.out::println);
			
			if (!removeCategory.isEmpty()) {
				removeCategory.forEach(tagId -> {
					AudioCategoriesRepository.deletetagBycategotiesId(tagId, id);
				});
			}

			System.out.println("!missingCategory.isEmpty() :" + !missingCategory.isEmpty());
			if (!missingCategory.isEmpty()) {

				Category.saveCategories(id, missingCategory);
			}
			Optional<AudioCastAndCrew> audioCastandCrew = Audiocastandcrewrepository.findById(id);
			AudioCastAndCrew castandcrew = audioCastandCrew.get();
			castandcrew.setCastandcrewlist(castAndCrewIds);
			Audiocastandcrewrepository.save(castandcrew);

			Optional<Audioimages> audioThumbnail = audioI.findById(id);

			Audioimages audioImage = audioThumbnail.get();
			System.out.println("audio_thumbnail != null :" + (audio_thumbnail != null));

			if (audio_thumbnail != null) {
				byte[] audiothumbnailBytes = ImageUtils.compressImage(audio_thumbnail.getBytes());
				audioImage.setAudio_thumbnail(audiothumbnailBytes);
			}
			System.out.println("banner_thumbnail != null :" + (banner_thumbnail != null));
			if (banner_thumbnail != null) {
				byte[] bannerthumbnailBytes = ImageUtils.compressImage(banner_thumbnail.getBytes());
				audioImage.setBannerthumbnail(bannerthumbnailBytes);
			}
			System.out.println("banner_thumbnail != null || audio_thumbnail != nul :"
					+ (banner_thumbnail != null || audio_thumbnail != null));
			if (banner_thumbnail != null || audio_thumbnail != null) {
				audioI.save(audioImage);
			}
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data");
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

		Optional<testModel> editdata = testRepo.findById(id);
		if (editdata.isPresent()) {
			testModel testdata = editdata.get();
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
		message.setText("token \t" + combinedtoken + "\n" + "10 % coupon \t" + combinedtoken10 + "\n" + "20 % coupon \t"
				+ combinedtoken20);
		message.setSubject("Learnhub");
		sender.send(message);
	}

}
