package com.example.demo.mobile;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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

import com.example.demo.compresser.ImageUtils;
import com.example.demo.fileservice.AudioFileService;
import com.example.demo.model.Addaudio1;
import com.example.demo.model.VideoDescription;
import com.example.demo.repository.AddAudioRepository;
import com.example.demo.repository.AddNewCategoriesRepository;
import com.example.demo.repository.AddVideoDescriptionRepository;
import com.example.demo.repository.VideoRepository;
import com.example.demo.service.AudioService;
import com.example.demo.userregister.JwtUtil;
import com.example.demo.userregister.TokenBlacklist;
import com.example.demo.userregister.UserRegister;
import com.example.demo.userregister.UserRegisterRepository;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class MobileAppController {
	
	@Autowired
    private UserRegisterRepository userregisterrepository;
	
	@Autowired
    private JwtUtil jwtUtil; // Autowire JwtUtil

    @Autowired
    private TokenBlacklist tokenBlacklist;
    
   
	
	@PostMapping("/register/mobile")
    public ResponseEntity<UserRegister> registerMobile(@RequestParam("username") String username,
                                                       @RequestParam("email") String email,
                                                       @RequestParam("password") String password,
                                                       @RequestParam("mobnum") String mobnum,
                                                       @RequestParam("confirmPassword") String confirmPassword,
                                                       @RequestParam(value = "profile", required = false) MultipartFile profile) throws IOException {
        if (!password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(null);
        }

        UserRegister newRegister = new UserRegister();
        newRegister.setUsername(username);
        newRegister.setEmail(email);
        newRegister.setPassword(password);
        newRegister.setConfirmPassword(confirmPassword);
        newRegister.setMobnum(mobnum);

        if (profile != null && !profile.isEmpty()) {
            byte[] thumbnailBytes = ImageUtils.compressImage(profile.getBytes());
            newRegister.setProfile(thumbnailBytes);
        }

        UserRegister savedUser = userregisterrepository.save(newRegister);
        return ResponseEntity.ok(savedUser);
    }
	
	@GetMapping("/GetUserById/mobile/{id}")
    public ResponseEntity<UserRegister> getUserByIdmobile(@PathVariable Long id) {
        Optional<UserRegister> userOptional = userregisterrepository.findById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/UpdateUser/mobile/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable Long userId,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "mobnum", required = false) String mobnum,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "confirmPassword", required = false) String confirmPassword,
            @RequestParam(value = "profile", required = false) MultipartFile profile) {

        try {
            // Retrieve existing user data from the repository
            Optional<UserRegister> optionalUserRegister = userregisterrepository.findById(userId);
            if (!optionalUserRegister.isPresent()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            UserRegister existingUser = optionalUserRegister.get();

            // Apply partial updates to the existing user data if provided
            if (username != null) {
                existingUser.setUsername(username);
            }
            if (email != null) {
                existingUser.setEmail(email);
            }
            if (mobnum != null) {
                existingUser.setMobnum(mobnum);
            }
//            if (password != null) {
//                if (!password.equals(confirmPassword)) {
//                    return new ResponseEntity<>("Passwords do not match", HttpStatus.BAD_REQUEST);
//                }
//                // Encrypt the password before saving
//                String encryptedPassword = passwordEncoder.encode(password);
//                existingUser.setPassword(encryptedPassword);
//                existingUser.setConfirmPassword(encryptedPassword); // Assuming this is required
//            }
            
            if (password != null) {
	            existingUser.setPassword(password);
	        }

	        if (confirmPassword!= null) {
	            existingUser.setConfirmPassword(confirmPassword);
	        }
            if (profile != null && !profile.isEmpty()) {
                byte[] thumbnailBytes = ImageUtils.compressImage(profile.getBytes());
                existingUser.setProfile(thumbnailBytes);
            }

            // Save the updated user data back to the repository
            userregisterrepository.save(existingUser);

            return new ResponseEntity<>("User details updated successfully", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error processing profile image", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating user details", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    @PostMapping("/mobile/login")
    public ResponseEntity<?> mobilelogin(@RequestBody Map<String, String> loginRequest) {
        
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        Optional<UserRegister> userOptional = userregisterrepository.findByEmail(email);
        
        if (!userOptional.isPresent()) {
            // User with the provided email doesn't exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"User not found\"}");
        }

        UserRegister user = userOptional.get();

        // Check if the password matches (you should use proper password hashing)
        if (!user.getPassword().equals(password)) {
            // Incorrect password
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Incorrect password\"}");
        }

        // Generate JWT token
        String jwtToken = jwtUtil.generateToken(email); // Use jwtUtil
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", jwtToken);
        responseBody.put("message", "Login successful");
        String name=user.getUsername();
      String Email=user.getEmail();
      String pword=user.getPassword();
      long userId = user.getId();
        responseBody.put("name", user.getUsername());
        responseBody.put("email", user.getEmail());
        responseBody.put("password", user.getPassword()); // Consider removing password from the response for security reasons
        responseBody.put("userId", user.getId());
        
        System.out.println(name);
      System.out.println(jwtToken);
      System.out.println(userId);
      System.out.println(Email);
      System.out.println(pword);
        
        // Successful login
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    @PostMapping("/mobile/logout")
    public ResponseEntity<String> mobilelogout(@RequestHeader("Authorization") String token) {
        // Extract the token from the Authorization header
        // Check if the token is valid (e.g., not expired)
        // Blacklist the token to invalidate it
        tokenBlacklist.blacklistToken(token);
        System.out.println("Logged out successfully");
        // Respond with a success message
        return ResponseEntity.ok().body("Logged out successfully");
    }
    
    @PostMapping("/mobile/forgetPassword")
    public ResponseEntity<?> resetPasswordmobile(@RequestBody Map<String, String> loginRequest) {
        // Finding the user by email
    	
    	String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        String confirmpassword = loginRequest.get("confirmPassword");
        Optional<UserRegister> userOptional = userregisterrepository.findByEmail(email);

        // If the user doesn't exist, return 404 Not Found
        if (!userOptional.isPresent()) {
            System.out.println("User not found: " + email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        UserRegister user = userOptional.get();

        // If passwords do not match, return 400 Bad Request
        if (!password.equals(confirmpassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match");
        }

        // Assuming you have a method to hash the password
        user.setPassword(password);
        user.setConfirmPassword(confirmpassword);
        // Do not set confirmPassword in the entity, it's used only for validation

        userregisterrepository.save(user);

        return ResponseEntity.ok("Password reset successfully");
    }
    
    
 //-------------------------------------Audio-----------------------
    
    @Autowired
	private  AudioService audioservice;
	
	@Autowired
    private AddAudioRepository audiorepository;
	
	@Autowired
    private AddNewCategoriesRepository addnewcategoriesrepository;
	
	@Autowired
    private AudioFileService fileService;
	
	private final String audioStorageDirectory = "Audio/";
	
    
    @GetMapping("/mobile/GetAll")
	public ResponseEntity<List<Addaudio1>> getAllUsermobile() {
	    List<Addaudio1> getUser = audiorepository.findAll();
	    return new ResponseEntity<>(getUser, HttpStatus.OK);
	}
    
    
    @GetMapping("/mobile/{filename}/file")
	public ResponseEntity<Resource> getAudioFimobile(@PathVariable String filename, HttpServletRequest request) {
	    if (filename != null) {
	        Path filePath = Paths.get(audioStorageDirectory, filename);
	        System.out.println("filePath" + filePath);

	        try {
	            // Check if the file exists
	            if (filePath.toFile().exists() && filePath.toFile().isFile()) {
	                // Return the audio file as a resource
	                Resource resource = new UrlResource(filePath.toUri());
	                if (resource.exists() && resource.isReadable()) {
	                    HttpHeaders headers = new HttpHeaders();
	                    String mimeType = Files.probeContentType(filePath);
	                    if (mimeType == null) {
	                        mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
	                    }
	                    headers.add(HttpHeaders.CONTENT_TYPE, mimeType);

	                    // Set Content-Disposition to "inline" to stream the video inline
	                    headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline");

	                    // Define the initial chunk size (5 MB)
	                    final long INITIAL_CHUNK_SIZE = 2 * 1024 * 1024; // 2 MB
	                    long fileSize = Files.size(filePath);

	                    // Get the Range header from the request
	                    String rangeHeader = request.getHeader(HttpHeaders.RANGE);

	                    if (rangeHeader != null) {
	                        // Handle range request from the client
	                        String[] ranges = rangeHeader.replace("bytes=", "").split("-");
	                        long rangeStart = Long.parseLong(ranges[0]);
	                        long rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;

	                        // Calculate the content length
	                        long contentLength = rangeEnd - rangeStart + 1;

	                        System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);
	                        // Create a RandomAccessFile to read the specified range
	                        try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
	                            file.seek(rangeStart);
	                            byte[] buffer = new byte[(int) contentLength];
	                            file.readFully(buffer);

	                            // Create a ByteArrayResource to hold the requested range of bytes
	                            ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);

	                            // Set the Content-Range header
	                            headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileSize));

	                            // Return a 206 Partial Content response
	                            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
	                                    .headers(headers)
	                                    .contentLength(contentLength)
	                                    .body(byteArrayResource);
	                        }
	                    } else {
	                        // No range header, send the initial 5 MB chunk
	                        long rangeStart = 0;
	                        long rangeEnd = Math.min(INITIAL_CHUNK_SIZE - 1, fileSize - 1);
	                        long contentLength = rangeEnd - rangeStart + 1;
	                        System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);

	                        // Create a RandomAccessFile to read the specified range
	                        try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
	                            file.seek(rangeStart);
	                            byte[] buffer = new byte[(int) contentLength];
	                            file.readFully(buffer);

	                            // Create a ByteArrayResource to hold the requested range of bytes
	                            ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);

	                            // Set the Content-Range header
	                            headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileSize));

	                            // Return a 206 Partial Content response
	                            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
	                                    .headers(headers)
	                                    .contentLength(contentLength)
	                                    .body(byteArrayResource);
	                        }
	                    }
	                }
	            } else {
	                System.out.println("file is null");
	            }
	        } catch (Exception e) {
	            // Handle exceptions
	            e.printStackTrace();
	        }

	        // Return a 404 Not Found response if the file does not exist
	        return ResponseEntity.notFound().build();
	    } else {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	    }
	}

	
    @GetMapping("/mobile/audio/{id}")
	public ResponseEntity<Addaudio1> getAudioByIdmobile(@PathVariable Long id) {
	    try {
	        // Retrieve audio details by ID using the service
	        Addaudio1 audio = audiorepository.findById(id).orElse(null);

	        if (audio != null) {
	            return ResponseEntity.ok().body(audio);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.badRequest().build();
	    }
	}

    //-----------------------------video-----------------------
    
    
    @Autowired
	private VideoRepository videoRepository;
    
    @Autowired
	private AddVideoDescriptionRepository videodescriptionRepository;
    
    @Value("${project.video}")
	private String path;
    
    
    @GetMapping(value = "/mobile/videogetall")
    public ResponseEntity<List<VideoDescription>> videogetallmobile() {
        try {
            List<VideoDescription> videoDetails = videodescriptionRepository.findAll();
            System.out.println("All video passed");
            if (!videoDetails.isEmpty()) {
                return new ResponseEntity<>(videoDetails, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/mobile/GetvideoDetail/{id}")
    public ResponseEntity<VideoDescription> getVideoDetailmobile(@PathVariable Long id) {
        try {
            Optional<VideoDescription> audioDetail = videodescriptionRepository.findById(id);
            
            
            if (audioDetail.isPresent()) {
            	System.out.println(audioDetail.get());
                return new ResponseEntity<>(audioDetail.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    
    @GetMapping(value = "/mobile/play/{id}")
	 private ResponseEntity<?> getVideomobile(@PathVariable Long id, HttpServletRequest request) {
       try {

           Optional<VideoDescription> optionalLesson = videodescriptionRepository.findById(id);
           if (!optionalLesson.isPresent()) {
               return ResponseEntity.notFound().build();
           }
           
           

           String filename =optionalLesson.get().getName();
  
           if (filename != null) {
           	Path filePath = Paths.get(path, filename);
           	System.out.println("filePath"+ filePath);
   		    try {
   		        if (filePath.toFile().exists() && filePath.toFile().isFile()) {
   		            Resource resource = new UrlResource(filePath.toUri());
   		            if (resource.exists() && resource.isReadable()) {
   		                HttpHeaders headers = new HttpHeaders();

   		                // Set the Content-Type based on the file's extension
   		                String mimeType = Files.probeContentType(filePath);
   		                if (mimeType == null) {
   		                    mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
   		                }
   		                headers.add(HttpHeaders.CONTENT_TYPE, mimeType);

   		                // Set Content-Disposition to "inline" to stream the video inline
   		                headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline");

   		                // Define the initial chunk size (5 MB)
   		                final long INITIAL_CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
   		                long fileSize = Files.size(filePath);

   		                // Get the Range header from the request
   		                String rangeHeader = request.getHeader(HttpHeaders.RANGE);

   		                if (rangeHeader != null) {
   		                    // Handle range request from the client
   		                    String[] ranges = rangeHeader.replace("bytes=", "").split("-");
   		                    long rangeStart = Long.parseLong(ranges[0]);
   		                    long rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;

   		                    // Calculate the content length
   		                    long contentLength = rangeEnd - rangeStart + 1;

   		                    System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);
   		                    // Create a RandomAccessFile to read the specified range
   		                    try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
   		                        file.seek(rangeStart);
   		                        byte[] buffer = new byte[(int) contentLength];
   		                        file.readFully(buffer);

   		                        // Create a ByteArrayResource to hold the requested range of bytes
   		                        ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);

   		                        // Set the Content-Range header
   		                        headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileSize));
   		                        System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);

   		                        // Return a 206 Partial Content response
   		                        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
   		                                .headers(headers)
   		                                .contentLength(contentLength)
   		                                .body(byteArrayResource);
   		                    }
   		                } else {
   		                    // No range header, send the initial 5 MB chunk
   		                    long rangeStart = 0;
   		                    long rangeEnd = Math.min(INITIAL_CHUNK_SIZE - 1, fileSize - 1);
   		                    long contentLength = rangeEnd - rangeStart + 1;
		                    System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);

   		                    // Create a RandomAccessFile to read the specified range
   		                    try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
   		                        file.seek(rangeStart);
   		                        byte[] buffer = new byte[(int) contentLength];
   		                        file.readFully(buffer);

   		                        // Create a ByteArrayResource to hold the requested range of bytes
   		                        ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);

   		                        // Set the Content-Range header
   		                        headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileSize));

   		                        // Return a 206 Partial Content response
   		                        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
   		                                .headers(headers)
   		                                .contentLength(contentLength)
   		                                .body(byteArrayResource);
   		                    }
   		                }
   		            }
   		        }else {

		            	System.out.println("file is null");
   		        }
   		    } catch (Exception e) {
   		        // Handle exceptions
   		        e.printStackTrace();
   		    }

   		    // Return a 404 Not Found response if the file does not exist
   		    return ResponseEntity.notFound().build();

           } else {
               return ResponseEntity.ok(filename);
           }
       } catch (Exception e) {
           // Log the exception (you can use a proper logging library)
           e.printStackTrace();
           // Return an internal server error response
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
       
   }
    
    //-------------------------favorite audio---------------------------
    
    @Autowired
    private favouriteRepository favouriterepository;
    

    @PostMapping("/mobile/favourite/audio")
    public ResponseEntity<String> createOrder(@RequestBody Map<String, Long> requestData) {
        try {
            Long audioId = requestData.get("audioId");
            Long userId = requestData.get("userId");

            if (audioId == null || userId == null) {
                return new ResponseEntity<>("Invalid request data", HttpStatus.BAD_REQUEST);
            }

            Optional<Addaudio1> audioOptional = audiorepository.findById(audioId);
            if (audioOptional.isPresent()) {
                Addaudio1 audio = audioOptional.get();

                favourite ordertable = new favourite();
               
                ordertable.setAudioId(audioId);
                ordertable.setUserId(userId);
                favouriterepository.save(ordertable);
                
                Long favaudio = ordertable.getAudioId();
                Long userid = ordertable.getUserId();
                
                Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
                Optional<Addaudio1> optionalAudio = audiorepository.findById(favaudio);
                
                if (optionalUser.isPresent() && optionalAudio.isPresent()) {
                    UserRegister user = optionalUser.get();
                    Addaudio1 favvaudio = optionalAudio.get();

                    // Check if the user is already enrolled in the course
                    if (user.getFavoriteAudios().contains(favvaudio)) {
                        return ResponseEntity.badRequest().body("User is already add this audio in favourite");
                    }
                    
                    user.getFavoriteAudios().add(audio);
                    userregisterrepository.save(user);
     
                    return ResponseEntity.ok("Favourite audio added successfully");
                } else {
                    // If a user or course with the specified ID doesn't exist, return 404
                    String errorMessage = "";
                    if (!optionalUser.isPresent()) {
                        errorMessage += "User with ID " + userId + " not found. ";
                    }
                    if (!optionalAudio.isPresent()) {
                        errorMessage += "audio with ID " + favaudio+ " not found. ";
                    }
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage.trim());
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating payment ID: " + e.getMessage());
        }
    }
    
    
    @GetMapping("/mobile/{userId}/UserAudios")
    public ResponseEntity<List<Addaudio1>> getAudioForUsermobile(@PathVariable Long userId) {
        Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
        if (optionalUser.isPresent()) {
            UserRegister user = optionalUser.get();
            Set<Addaudio1> favoriteAudiosSet = user.getFavoriteAudios();
            List<Addaudio1> audios = new ArrayList<>(favoriteAudiosSet);

            for (Addaudio1 audio : audios) {
                byte[] images = ImageUtils.decompressImage(audio.getThumbnail());
                audio.setCategory(null);
                audio.setThumbnail(images);
                audio.setUsers(null);
            }
            
            // Thumbnails set for all audios, now return the response
            return ResponseEntity.ok(audios);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    
    //----------------------------favourite video ---------------------------------
    
    @PostMapping("/mobile/favourite/video")
    public ResponseEntity<String> createfavouritevidfeo(@RequestBody Map<String, Long> requestData) {
        try {
            Long videoId = requestData.get("videoId");
            Long userId = requestData.get("userId");

            if (videoId == null || userId == null) {
                return new ResponseEntity<>("Invalid request data", HttpStatus.BAD_REQUEST);
            }

            Optional<VideoDescription> videoOptional = videodescriptionRepository.findById(videoId);
            if (videoOptional.isPresent()) {
                VideoDescription video = videoOptional.get();

                favourite ordertable = new favourite();
               
                ordertable.setAudioId(videoId);
                ordertable.setUserId(userId);
                favouriterepository.save(ordertable);
                
                Long favvideo = ordertable.getVideoId();
                Long userid = ordertable.getUserId();
                
                Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
                Optional<VideoDescription> optionalVideo = videodescriptionRepository.findById(favvideo);
                
                if (optionalUser.isPresent() && optionalVideo.isPresent()) {
                    UserRegister user = optionalUser.get();
                    VideoDescription favVideo = optionalVideo.get();

                    // Check if the user is already added this video to favorites
                    if (user.getFavoriteVideos().contains(favVideo)) {
                        return ResponseEntity.badRequest().body("User has already added this video to favorites");
                    }
                    
                    user.getFavoriteVideos().add(video); // Add the video object, not favVideo
                    userregisterrepository.save(user);
     
                    return ResponseEntity.ok("Favorite video added successfully");
                } else {
                    // If a user or video with the specified ID doesn't exist, return 404
                    String errorMessage = "";
                    if (!optionalUser.isPresent()) {
                        errorMessage += "User with ID " + userId + " not found. ";
                    }
                    if (!optionalVideo.isPresent()) {
                        errorMessage += "Video with ID " + favvideo+ " not found. ";
                    }
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage.trim());
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating favorite video: " + e.getMessage());
        }
    }

    @GetMapping("/mobile/{userId}/UserVideos")
    public ResponseEntity<List<VideoDescription>> getForVideoUser(@PathVariable Long userId) {
        Optional<UserRegister> optionalUser = userregisterrepository.findById(userId);
        if (optionalUser.isPresent()) {
            UserRegister user = optionalUser.get();
            
            Set<VideoDescription> favoriteVideosSet = user.getFavoriteVideos();
            List<VideoDescription> videos = new ArrayList<>(favoriteVideosSet);


            for (VideoDescription vid : videos) {
                byte[] images = ImageUtils.decompressImage(vid.getThumbnail());
                vid.setCategory(null);
                vid.setTags(null);
                vid.setCertificate(null);
                vid.setLanguage(null);
                vid.setThumbnail(images);
                vid.setUsers(null);
            }
            
            // Thumbnails set for all audios, now return the response
            return ResponseEntity.ok(videos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    




}
