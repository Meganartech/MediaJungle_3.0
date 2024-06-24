package com.example.demo.controller;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

import com.example.demo.compresser.ImageUtils;
import com.example.demo.model.CastandCrew;
import com.example.demo.model.VideoDescription;
import com.example.demo.repository.CastandcrewRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class CastandcrewController {
	
	@Autowired
	private CastandcrewRepository castandcrewrepository;
	
	@PostMapping("/addcastandcrew")
	public ResponseEntity<CastandCrew> addcast(@RequestParam("image") MultipartFile image,
			@RequestParam("name") String name) throws IOException{
		byte[] thumbnailBytes =ImageUtils.compressImage(image.getBytes());
		CastandCrew cast = new CastandCrew();
		cast.setName(name);
		cast.setImage(thumbnailBytes);
		CastandCrew details = castandcrewrepository.save(cast);
		return ResponseEntity.ok(details);		
	}
	
	@GetMapping("/GetAllcastandcrew")
    public ResponseEntity<List<CastandCrew>> getAllPCastandcrew() {
        List<CastandCrew> getcast = castandcrewrepository.findAll();
        return new ResponseEntity<>(getcast, HttpStatus.OK);
    }
	
	@GetMapping("/getcast/{id}")
    public ResponseEntity<CastandCrew> getcast(@PathVariable Long id) {
        try {
            Optional<CastandCrew> castDetail = castandcrewrepository.findById(id);
            if (castDetail.isPresent()) {
            	// Assuming decompressImage returns the raw thumbnail data
                return new ResponseEntity<>(castDetail.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
	
	@GetMapping("/GetAllcastthumbnail")
    public ResponseEntity<List<byte[]>> getcastthumbnail() {
        List<CastandCrew> getcastthumbnail = castandcrewrepository.findAll();
        
        for (CastandCrew cast : getcastthumbnail) {
            byte[] images = ImageUtils.decompressImage(cast.getImage());
            cast.setImage(images);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getcastthumbnail .stream().map(CastandCrew::getImage).collect(Collectors.toList()));
    }
	
    @GetMapping("/GetThumbnailsforcast/{id}")
    public ResponseEntity<List<String>> getThumbnailsById(@PathVariable Long id) {
        try {
            Optional<CastandCrew> castOptional = castandcrewrepository.findById(id);

            if (castOptional.isPresent()) {
                CastandCrew cast = castOptional.get();

                // Assuming decompressImage returns the raw thumbnail data
                byte[] thumbnailData = ImageUtils.decompressImage(cast.getImage());

                // Convert the byte array to Base64
                String base64Thumbnail = Base64.getEncoder().encodeToString(thumbnailData);

                // Return a list with a single Base64-encoded thumbnail
                return ResponseEntity.ok(Collections.singletonList(base64Thumbnail));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
	
	
	@DeleteMapping("/Deletecastandcrew/{Id}")
    public ResponseEntity<Void> deletecast(@PathVariable Long Id) {
        try {
            // Assuming you have a method to delete a category by ID in your repository
        	castandcrewrepository.deleteById(Id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
	@PatchMapping("/updatecastandcrew/{id}")
	public ResponseEntity<String> updateCast(
	        @PathVariable Long id,
	        @RequestParam(value = "image", required = false) MultipartFile image,
	        @RequestParam(value = "name", required = false) String name) {
	    try {
	        // Retrieve existing cast and crew data from the repository
	        CastandCrew existingCast = castandcrewrepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("not found"));

	        // Update image if provided
	        if (image != null && !image.isEmpty()) {
	            byte[] thumbnailBytes = ImageUtils.compressImage(image.getBytes());
	            existingCast.setImage(thumbnailBytes);
	        }

	        // Update name if provided
	        if (name != null && !name.isEmpty()) {
	            existingCast.setName(name);
	        }

	        // Save the updated entity
	        castandcrewrepository.save(existingCast);

	        return ResponseEntity.ok("Cast and crew updated successfully.");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating cast and crew.");
	    }
	}



}