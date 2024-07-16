package com.VsmartEngine.MediaJungle.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.compresser.ImageUtils;
import com.VsmartEngine.MediaJungle.model.AddNewCategories;
import com.VsmartEngine.MediaJungle.model.AddUser;
import com.VsmartEngine.MediaJungle.model.CastandCrew;
import com.VsmartEngine.MediaJungle.model.VideoDescription;
import com.VsmartEngine.MediaJungle.notification.service.NotificationService;
import com.VsmartEngine.MediaJungle.repository.AddUserRepository;
import com.VsmartEngine.MediaJungle.repository.CastandcrewRepository;
import com.VsmartEngine.MediaJungle.userregister.JwtUtil;
import com.VsmartEngine.MediaJungle.userregister.UserRegister;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class CastandcrewController {
	
	@Autowired
	private CastandcrewRepository castandcrewrepository;
	
	@Autowired
    private NotificationService notificationservice;
	
	@Autowired
	private JwtUtil jwtUtil; // Autowire JwtUtil
	
	@Autowired
	private AddUserRepository adduserrepository;
	
	@PostMapping("/addcastandcrew")
	public ResponseEntity<?> addCast(@RequestParam("image") MultipartFile image,
	                                 @RequestParam("name") String name,
	                                 @RequestHeader("Authorization") String token) throws IOException {
	    try {
	        if (!jwtUtil.validateToken(token)) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
	        }

	        String email = jwtUtil.getUsernameFromToken(token);
	        Optional<AddUser> opUser = adduserrepository.findByUsername(email);

	        if (opUser.isPresent()) {
	            AddUser user = opUser.get();
	            String username = user.getUsername();

	            byte[] thumbnailBytes = ImageUtils.compressImage(image.getBytes());

	            CastandCrew cast = new CastandCrew();
	            cast.setName(name);
	            cast.setImage(thumbnailBytes);

	            CastandCrew details = castandcrewrepository.save(cast);

	            Long castId = details.getId();
	            String Name = details.getName();
	            String heading = Name +" New castandcrew Added!";
	            // Create notification with optional file (thumbnail)
	            Long notifyId = notificationservice.createNotification(username, email, heading, Optional.ofNullable(image));

	            if (notifyId != null) {
	                Set<String> notiUserSet = new HashSet<>();

	                // Fetch all admins from AddUser table
	                List<AddUser> adminUsers = adduserrepository.findAll();
	                for (AddUser admin : adminUsers) {
	                    notiUserSet.add(admin.getEmail());
	                }
	                notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
	            }

	            return ResponseEntity.ok(details);
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
	        }
	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing image");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
	    }
	}

	
	
	
	@GetMapping("/GetAllcastandcrew")
    public ResponseEntity<List<CastandCrew>> getAllPCastandcrew() {
        List<CastandCrew> getcast = castandcrewrepository.findAll();
        for (CastandCrew cast : getcast) {
            byte[] images = ImageUtils.decompressImage(cast.getImage());
            cast.setImage(images);
        }
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
    public ResponseEntity<?> deletecast(@PathVariable Long Id,@RequestHeader("Authorization") String token) {
		try {
	        // Validate JWT token
	        if (!jwtUtil.validateToken(token)) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
	        }

	        // Extract username from token
	        String email = jwtUtil.getUsernameFromToken(token);
	        System.out.println("email: " + email);
	        Optional<AddUser> optionalUser = adduserrepository.findByUsername(email);

	        if (optionalUser.isPresent()) {
	            AddUser user = optionalUser.get();
	            String username = user.getUsername();
	            // Fetch category details before deletion
	            Optional<CastandCrew> optionalCast = castandcrewrepository.findById(Id);
	            if (optionalCast.isEmpty()) {
	                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Category not found"));
	            }
	            CastandCrew cast = optionalCast.get();
	            String name = cast.getName();
	            byte[] image = cast.getImage();
            // Assuming you have a method to delete a category by ID in your repository
        	castandcrewrepository.deleteById(Id);
        	// Create notification if category is deleted
            String heading = name + " Deleted in Castandcrew!";
            Long notifyId = notificationservice.createNotification(username, email, heading,image);
            if (notifyId != null) {
                Set<String> notiUserSet = new HashSet<>();
                // Fetch all admins from AddUser table
                List<AddUser> adminUsers = adduserrepository.findAll();
                for (AddUser admin : adminUsers) {
                    notiUserSet.add(admin.getEmail());
                }
                notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
            }
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        } else {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authorized"));
	        }
	    } catch (Exception e) {
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	@PatchMapping("/updatecastandcrew/{id}")
	public ResponseEntity<String> updateCast(
	        @PathVariable Long id,
	        @RequestParam(value = "image", required = false) MultipartFile image,
	        @RequestParam(value = "name", required = false) String name,
	        @RequestHeader("Authorization") String token) {
		try {
	        // Validate JWT token
	        if (!jwtUtil.validateToken(token)) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
	        }

	        // Extract email from token
	        String email = jwtUtil.getUsernameFromToken(token);
	        System.out.println("email: " + email);

	        // Fetch user details from repository
	        Optional<AddUser> opUser = adduserrepository.findByUsername(email);
	        if (!opUser.isPresent()) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
	        }

	        AddUser user = opUser.get();
	        String username = user.getUsername();
	        // Retrieve existing cast and crew data from the repository
	        CastandCrew existingCast = castandcrewrepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("not found"));

	        // Update image if provided
	        if (image != null && !image.isEmpty()) {
	            byte[] thumbnailBytes = ImageUtils.compressImage(image.getBytes());
	            existingCast.setImage(thumbnailBytes);
	        }
	       String Name = existingCast.getName();

	        // Update name if provided
	        if (name != null && !name.isEmpty()) {
	            existingCast.setName(name);
	        }
	        byte[] Image = existingCast.getImage();

	        // Save the updated entity
	        CastandCrew details = castandcrewrepository.save(existingCast);
	        
	        String heading =Name + " upadted in castandcrew";
 	        Long notifyId = notificationservice.createNotification(username, email, heading,Image);
             if (notifyId != null) {
                 Set<String> notiUserSet = new HashSet<>();
                 // Fetch all admins from AddUser table
                 List<AddUser> adminUsers = adduserrepository.findAll();
                 for (AddUser admin : adminUsers) {
                     notiUserSet.add(admin.getEmail());
                 }
                 notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
             }

	        return ResponseEntity.ok("Cast and crew updated successfully.");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating cast and crew.");
	    }
	}
	
	






}