package com.example.demo;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.controller.AddUserController;
import com.example.demo.controller.AudioController1;
import com.example.demo.controller.CastandcrewController;
import com.example.demo.model.AddUser;
import com.example.demo.model.Addaudio1;
import com.example.demo.model.CastandCrew;
import com.example.demo.model.UserListWithStatus;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class FrontController {

	@Autowired
	public AddUserController AddUserController;

	@Autowired
	private AudioController1 AudioController;

	@Autowired
	private CastandcrewController CastandcrewController;

	@PostMapping("/AddUser")
	public ResponseEntity<?> AddUser(@RequestBody AddUser data) {

		return AddUserController.AddUser(data);
	}

	@PostMapping("/login/admin")
	public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {

		return AddUserController.login(loginRequest);
	}

	@GetMapping("/GetUserId/{userId}")
	public ResponseEntity<UserListWithStatus> getUser(@PathVariable Long userId) {

		return AddUserController.getUser(userId);
	}

	@DeleteMapping("/DeleteUser/{UserId}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long UserId) {

		return AddUserController.deleteUser(UserId);

	}

	@PatchMapping("/UpdateUser/{userId}")
	public ResponseEntity<String> updateUserDetails(@PathVariable Long userId, @RequestBody AddUser updatedUserData) {

		return AddUserController.updateUserDetails(userId, updatedUserData);
	}

	@PostMapping("/uploadaudio")
	public ResponseEntity<Addaudio1> uploadAudio(@RequestParam("category") Long categoryId,
			@RequestParam("audioFile") MultipartFile audioFile, @RequestParam("thumbnail") MultipartFile thumbnail,
			@RequestParam(value = "paid", required = false) boolean paid) {

		return AudioController.updateAudio(categoryId, audioFile, thumbnail, categoryId);
	}

	@GetMapping("/{filename}/file")
	public ResponseEntity<Resource> getAudioFi(@PathVariable String filename, HttpServletRequest request) {

		return AudioController.getAudioFi(filename, request);
	}

	@GetMapping("/audio/{id}")
	public ResponseEntity<Addaudio1> getAudioById(@PathVariable Long id) {

		return AudioController.getAudioById(id);
	}

	@GetMapping("/audio/{id}/file")
	public ResponseEntity<Resource> getAudioFile(@PathVariable String id) throws IOException {

		return AudioController.getAudioFile(id);
	}

	@GetMapping("/audio/list")
	public ResponseEntity<List<String>> listAudioFiles() throws IOException {

		return AudioController.listAudioFiles();
	}

	@GetMapping("/GetAll")
	public ResponseEntity<List<Addaudio1>> getAllUser() {

		return AudioController.getAllUser();

	}

	@GetMapping("/GetDetail/{id}")
	public ResponseEntity<Addaudio1> getAudioDetail(@PathVariable Long id) {

		return AudioController.getAudioDetail(id);

	}

	@GetMapping("/{id}/filename")
	public ResponseEntity<String> getAudioFilename(@PathVariable Long id) {

		return AudioController.getAudioFilename(id);
	}

	@GetMapping("/GetAllThumbnail")
	public ResponseEntity<List<byte[]>> getAllThumbnail() {

		return AudioController.getAllThumbnail();

	}

	@GetMapping("/GetThumbnailsById/{id}")
	public ResponseEntity<List<String>> getAudioThumbnailsById(@PathVariable Long id) {

		return AudioController.getThumbnailsById(id);
	}

	@DeleteMapping("/audio/{id}")
	public ResponseEntity<String> deleteAudioById(@PathVariable Long id, String fileName) {

		return AudioController.deleteAudioById(id, fileName);

	}

	@PatchMapping("/updateaudio/update/{audioId}")
	public ResponseEntity<Addaudio1> updateAudio(@PathVariable Long audioId,
			@RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
			@RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
			@RequestParam(value = "category", required = false) Long categoryId) {

		return AudioController.updateAudio(audioId, audioFile, thumbnail, categoryId);
	}
    
	@PostMapping("/addcastandcrew")
	public ResponseEntity<CastandCrew> addcast(@RequestParam("image") MultipartFile image,
			@RequestParam("name") String name) throws IOException{
		
		return CastandcrewController.addcast(image, name);
	}
	
	@GetMapping("/GetAllcastandcrew")
    public ResponseEntity<List<CastandCrew>> getAllPCastandcrew() {
		
		return CastandcrewController.getAllPCastandcrew();
	}
	
	@GetMapping("/getcast/{id}")
    public ResponseEntity<CastandCrew> getcast(@PathVariable Long id) {
	
		return CastandcrewController.getcast(id);
	}
	
	@GetMapping("/GetAllcastthumbnail")
    public ResponseEntity<List<byte[]>> getcastthumbnail() {
       
		return CastandcrewController.getcastthumbnail();
	}
	
	 @GetMapping("/GetThumbnailsforcast/{id}")
	    public ResponseEntity<List<String>> getCastThumbnailsById(@PathVariable Long id) {
		 
		 return CastandcrewController.getThumbnailsById(id);
		 
	 }
        
	 @DeleteMapping("/Deletecastandcrew/{Id}")
	    public ResponseEntity<Void> deletecast(@PathVariable Long Id) {
		 
		 return CastandcrewController.deletecast(Id);
	 }
	 
	 public ResponseEntity<String> updateCast(
		        @PathVariable Long id,
		        @RequestParam(value = "image", required = false) MultipartFile image,
		        @RequestParam(value = "name", required = false) String name) {
		 
		 return CastandcrewController.updateCast(id, image, name);
	 }
	
}
