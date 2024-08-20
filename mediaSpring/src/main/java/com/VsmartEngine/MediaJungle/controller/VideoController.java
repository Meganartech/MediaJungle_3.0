package com.VsmartEngine.MediaJungle.controller;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.compresser.ImageUtils;
import com.VsmartEngine.MediaJungle.model.AddUser;
import com.VsmartEngine.MediaJungle.model.Addaudio1;
import com.VsmartEngine.MediaJungle.model.FileModel;
import com.VsmartEngine.MediaJungle.model.VideoDescription;
import com.VsmartEngine.MediaJungle.model.Videos;
import com.VsmartEngine.MediaJungle.notification.service.NotificationService;
import com.VsmartEngine.MediaJungle.repository.AddUserRepository;
import com.VsmartEngine.MediaJungle.repository.AddVideoDescriptionRepository;
import com.VsmartEngine.MediaJungle.repository.VideoRepository;
import com.VsmartEngine.MediaJungle.service.FileService;
import com.VsmartEngine.MediaJungle.service.VideoService;
import com.VsmartEngine.MediaJungle.userregister.JwtUtil;
import com.VsmartEngine.MediaJungle.userregister.UserRegister;
import com.VsmartEngine.MediaJungle.userregister.UserRegisterRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;

//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.Files;


@Controller
public class VideoController {

	@Value("${project.video}")
	private String path;
	
	@Autowired
	private VideoService videoService;

//	@Autowired
//	private VideoInterface service;

	@Autowired
	private FileService fileSevice;

	@Autowired
	private VideoRepository videoRepository;

	@Autowired
	private AddVideoDescriptionRepository videodescriptionRepository;
	
	@Autowired
    private NotificationService notificationservice;
	
	@Autowired
	private JwtUtil jwtUtil; // Autowire JwtUtil
	
	@Autowired
	private AddUserRepository adduserrepository;
	
	@Autowired
    private UserRegisterRepository userregisterrepository;
	
	@Autowired
	private AddVideoDescriptionRepository videodescription ;

	public ResponseEntity<VideoDescription> uploadVideoDescription(
            @RequestParam("videoTitle") String videoTitle,
            @RequestParam("mainVideoDuration") String mainVideoDuration,
            @RequestParam("trailerDuration") String trailerDuration,
            @RequestParam("rating") String rating,
            @RequestParam("certificateNumber") String certificateNumber,
            @RequestParam("videoAccessType") boolean videoAccessType,
            @RequestParam("description") String description,
            @RequestParam("productionCompany") String productionCompany,
            @RequestParam("certificateName") List<Long> certificateName,
            @RequestParam("castandcrewlist") List<Long> castandcrewlist,
            @RequestParam("taglist") List<Long> taglist,
            @RequestParam("categorylist") List<Long> categorylist,
            @RequestParam("videoThumbnail") MultipartFile videoThumbnail,
            @RequestParam("trailerThumbnail") MultipartFile trailerThumbnail,
            @RequestParam("userBanner") MultipartFile userBanner,
            @RequestHeader("Authorization") String token) {

        try {
            // Validate token
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String email = jwtUtil.getUsernameFromToken(token);
            System.out.println("email: " + email);
            Optional<AddUser> opUser = adduserrepository.findByUsername(email);

            if (opUser.isPresent()) {
                AddUser user = opUser.get();
                String username = user.getUsername();

                // Save video description
                VideoDescription savedDescription = videoService.saveVideoDescriptio(
                        videoTitle, mainVideoDuration, trailerDuration, rating, certificateNumber, videoAccessType,
                        description, productionCompany, certificateName, castandcrewlist, taglist, categorylist,
                        videoThumbnail, trailerThumbnail, userBanner);

                return ResponseEntity.ok().body(savedDescription);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
	
	@GetMapping("/video/getall")
	public ResponseEntity<List<VideoDescription>> getAllVideo() {
	    List<VideoDescription> getUser = videodescription.findAll();
	    return new ResponseEntity<>(getUser, HttpStatus.OK);
	}
	
//    public ResponseEntity<VideoDescription> uploadVideoDescription(
//            @RequestParam("moviename") String moviename,
//            @RequestParam("description") String description,
//            @RequestParam("tags") String tags,
//            @RequestParam("category") String category,
//            @RequestParam("certificate") String certificate,
//            @RequestParam("language") String language,
//            @RequestParam("duration") String duration,
//            @RequestParam("year") String year,
//            @RequestParam("thumbnail") MultipartFile thumbnail,
//            @RequestParam("video") MultipartFile video,
//            @RequestParam(value = "paid", required = false, defaultValue = "false") boolean paid,
//            @RequestHeader("Authorization") String token){
//
//        try {
//        	 if (!jwtUtil.validateToken(token)) {
//	             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	         }
//
//	         String email = jwtUtil.getUsernameFromToken(token);
//	         System.out.println("email: " + email);
//	         Optional<AddUser> opUser = adduserrepository.findByUsername(email);
//
//	         if (opUser.isPresent()) {
//	             AddUser user = opUser.get();
//	             String username = user.getUsername();
//        	
//        	FileModel upload= fileSevice.uploadVideo(path, video);
//        	String name=upload.getVideoFileName();
//            VideoDescription savedDescription = videoService.saveVideoDescriptio(
//                    moviename, description, tags, category, certificate, language,
//                    duration, year, thumbnail,name, paid);
//            Long videoId = savedDescription.getId();
//            String movieName = savedDescription.getMoviename();
//            String heading = movieName +" New Video Added!";
//            String Description = savedDescription.getDescription();
//            String link = "/MoviesPage";
//            String detail = "Sit back, watch, and enjoy this movie.";
//            
//         // Create notification with optional file (thumbnail)
//            Long notifyId = notificationservice.createNotification(username, email, heading, Description,link,detail,Optional.ofNullable(thumbnail));
//            if (notifyId != null) {
//                Set<String> notiUserSet = new HashSet<>();
//                // Fetch all admins from AddUser table
//                List<AddUser> adminUsers = adduserrepository.findAll();
//                for (AddUser admin : adminUsers) {
//                    notiUserSet.add(admin.getEmail());
//                }
//                notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
//                List<UserRegister> Users = userregisterrepository.findAll();
//                for (UserRegister userss : Users) {
//                    notiUserSet.add(userss.getEmail());
//                }
//                notificationservice.CommoncreateNotificationUser(notifyId, new ArrayList<>(notiUserSet));
//                
//            }
//
//            return ResponseEntity.ok().body(savedDescription);
//	         } else {
//	             return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//	         }
//	     } catch (IOException e) {
//	         e.printStackTrace();
//	         return ResponseEntity.badRequest().build();
//	     }
//	 }
//
//	
//	
//	
//
//	public ResponseEntity<VideoDescription> updatedescription(
//	        @RequestParam("Movie_name") String moviename,
//	        @RequestParam("description") String description,
//	        @RequestParam("tags") String tags,
//	        @RequestParam("category") String category,
//	        @RequestParam("certificate") String certificate,
//	        @RequestParam("Language") String language,
//	        @RequestParam("Duration") String duration,
//	        @RequestParam("Year") String year,
//	        @RequestParam(value = "paid", required = false) boolean paid,
//	        @RequestParam("id") long id,
//	        @RequestHeader("Authorization") String token) {
//	    try {
//	        // Validate JWT token
//	        if (!jwtUtil.validateToken(token)) {
//	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	        }
//
//	        // Extract username from token
//	        String email = jwtUtil.getUsernameFromToken(token);
//	        Optional<AddUser> opUser = adduserrepository.findByUsername(email);
//
//	        if (opUser.isPresent()) {
//	            AddUser user = opUser.get();
//	            String username = user.getUsername();
//
//	            // Update video description
//	            VideoDescription updatedescription = videoService.saveVideoDescription(
//	                    moviename, description, tags, category, certificate, language, duration, year, paid, id);
//
//	            // Create notification with optional file (thumbnail)
//	            byte[] thumb = updatedescription.getThumbnail();
//	            String heading = moviename + " Video Updated!";
//	            Long notifyId = notificationservice.createNotification(username, email, heading, thumb);
//
//	            if (notifyId != null) {
//	                // Notify all admins
//	                Set<String> notiUserSet = adduserrepository.findAll().stream()
//	                        .map(AddUser::getEmail)
//	                        .collect(Collectors.toSet());
//	                notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
//	            }
//
//	            return ResponseEntity.ok().body(updatedescription);
//	        } else {
//	            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//	        }
//	    } catch (EntityNotFoundException e) {
//	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//	    } catch (IOException e) {
//	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//	    } catch (Exception e) {
//	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//	    }
//	}
//	
//	
//	
//	//Update DataModel of Video .
//
//			public Videos uploadingVideo(@RequestParam("video") MultipartFile video) throws IOException
//			{
////			try {
////				service.updateModel(updateModel, id);
////				return new ResponseEntity<UpdateModel>(updateModel, HttpStatus.OK);	
////				}catch(Exception e) {
////					throw new ResourceNotFound();
////				}
////				throws IOExceptions{}
//				Integer id=1;
//			
//					Videos v=videoService.getVideosById(id);
//					FileModel fileModel= fileSevice.uploadVideo(path, video);
//					v.setVideoName(fileModel.getVideoFileName());
//					Videos finallyUpload= videoService.updatePost1(v);	
//					
//					return finallyUpload;
//	}
//
//			//4.To play video .
////			@GetMapping(value = "/play/{id}", produces = MediaType.ALL_VALUE)
////			public void downloadImage(@PathVariable Long id, HttpServletResponse response) throws IOException {
////				Optional<VideoDescription> video = videodescriptionRepository.findById(id);
////				InputStream resource = this.fileSevice.getVideoFIle(path, video.get().getName(), id);
////				response.setContentType(MediaType.ALL_VALUE);
////				StreamUtils.copy(resource, response.getOutputStream());
////			}
//			
//
//			 public ResponseEntity<?> getVideo(@PathVariable Long id, HttpServletRequest request) {
//		        try {
//
//		            Optional<VideoDescription> optionalLesson = videodescriptionRepository.findById(id);
//		            if (!optionalLesson.isPresent()) {
//		                return ResponseEntity.notFound().build();
//		            }
//		            
//		            
//
//		            String filename =optionalLesson.get().getName();
//		   
//		            if (filename != null) {
//		            	Path filePath = Paths.get(path, filename);
//		            	System.out.println("filePath"+ filePath);
//		    		    try {
//		    		        if (filePath.toFile().exists() && filePath.toFile().isFile()) {
//		    		            Resource resource = new UrlResource(filePath.toUri());
//		    		            if (resource.exists() && resource.isReadable()) {
//		    		                HttpHeaders headers = new HttpHeaders();
//
//		    		                // Set the Content-Type based on the file's extension
//		    		                String mimeType = Files.probeContentType(filePath);
//		    		                if (mimeType == null) {
//		    		                    mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
//		    		                }
//		    		                headers.add(HttpHeaders.CONTENT_TYPE, mimeType);
//
//		    		                // Set Content-Disposition to "inline" to stream the video inline
//		    		                headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline");
//
//		    		                // Define the initial chunk size (5 MB)
//		    		                final long INITIAL_CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
//		    		                long fileSize = Files.size(filePath);
//
//		    		                // Get the Range header from the request
//		    		                String rangeHeader = request.getHeader(HttpHeaders.RANGE);
//
//		    		                if (rangeHeader != null) {
//		    		                    // Handle range request from the client
//		    		                    String[] ranges = rangeHeader.replace("bytes=", "").split("-");
//		    		                    long rangeStart = Long.parseLong(ranges[0]);
//		    		                    long rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;
//
//		    		                    // Calculate the content length
//		    		                    long contentLength = rangeEnd - rangeStart + 1;
//
//		    		                    System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);
//		    		                    // Create a RandomAccessFile to read the specified range
//		    		                    try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
//		    		                        file.seek(rangeStart);
//		    		                        byte[] buffer = new byte[(int) contentLength];
//		    		                        file.readFully(buffer);
//
//		    		                        // Create a ByteArrayResource to hold the requested range of bytes
//		    		                        ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);
//
//		    		                        // Set the Content-Range header
//		    		                        headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileSize));
//		    		                        System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);
//
//		    		                        // Return a 206 Partial Content response
//		    		                        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
//		    		                                .headers(headers)
//		    		                                .contentLength(contentLength)
//		    		                                .body(byteArrayResource);
//		    		                    }
//		    		                } else {
//		    		                    // No range header, send the initial 5 MB chunk
//		    		                    long rangeStart = 0;
//		    		                    long rangeEnd = Math.min(INITIAL_CHUNK_SIZE - 1, fileSize - 1);
//		    		                    long contentLength = rangeEnd - rangeStart + 1;
//	    		                    System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);
//
//		    		                    // Create a RandomAccessFile to read the specified range
//		    		                    try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
//		    		                        file.seek(rangeStart);
//		    		                        byte[] buffer = new byte[(int) contentLength];
//		    		                        file.readFully(buffer);
//
//		    		                        // Create a ByteArrayResource to hold the requested range of bytes
//		    		                        ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);
//
//		    		                        // Set the Content-Range header
//		    		                        headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileSize));
//
//		    		                        // Return a 206 Partial Content response
//		    		                        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
//		    		                                .headers(headers)
//		    		                                .contentLength(contentLength)
//		    		                                .body(byteArrayResource);
//		    		                    }
//		    		                }
//		    		            }
//		    		        }else {
//
//				            	System.out.println("file is null");
//		    		        }
//		    		    } catch (Exception e) {
//		    		        // Handle exceptions
//		    		        e.printStackTrace();
//		    		    }
//
//		    		    // Return a 404 Not Found response if the file does not exist
//		    		    return ResponseEntity.notFound().build();
//
//		            } else {
//		                return ResponseEntity.ok(filename);
//		            }
//		        } catch (Exception e) {
//		            // Log the exception (you can use a proper logging library)
//		            e.printStackTrace();
//		            // Return an internal server error response
//		            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//		        }
//		        
//		    }
//		
//		
//	
//			//4.To get all video  .
//
//			public ResponseEntity<String> updateById() throws IOException {
//				videoService.updatevideoWithFile();
////			    
//			    return new ResponseEntity<>( HttpStatus.OK);
//			}
//			
//
//			    public ResponseEntity<List<VideoDescription>> videogetall() {
//			        try {
//			            List<VideoDescription> videoDetails = videodescriptionRepository.findAll();
//			            System.out.println("All video passed");
//			            
//			            
//			            if (!videoDetails.isEmpty()) {
//			            	System.out.println("videoDetails availables");
//			                return new ResponseEntity<>(videoDetails, HttpStatus.OK);
//			            } else {
//			                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//			            }
//			        } catch (Exception e) {
//			            return new ResponseEntity<>(HttpStatus.BAD_REQUEST );
//			        }
//			    }
//			 
//			 
//			    public ResponseEntity<List<byte[]>> getAllThumbnail() {
//			        List<VideoDescription> getVideo = videodescriptionRepository.findAll();
//			       
//			        for (VideoDescription video : getVideo) {
//			            byte[] images = ImageUtils.decompressImage(video.getThumbnail());
//			            video.setThumbnail(images);
//			        }
//
//			        return ResponseEntity.ok()
//			                .contentType(MediaType.APPLICATION_JSON)
//			                .body(getVideo.stream().map(VideoDescription::getThumbnail).collect(Collectors.toList()));
//			    }
//			 
//
//			    
//			 public ResponseEntity<?> deleteVideoById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
//			     try {
//			         // Validate JWT token
//			         if (!jwtUtil.validateToken(token)) {
//			             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
//			         }
//
//			         // Extract username from token
//			         String email = jwtUtil.getUsernameFromToken(token);
//			         Optional<AddUser> optionalUser = adduserrepository.findByUsername(email);
//
//			         if (optionalUser.isPresent()) {
//			             AddUser user = optionalUser.get();
//			             String username = user.getUsername();
//
//			             // Check if video exists
//			             Optional<VideoDescription> optionalVideo = videodescriptionRepository.findById(id);
//			             if (optionalVideo.isEmpty()) {
//			                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Video not found"));
//			             }
//
//			             VideoDescription video = optionalVideo.get();
//			             String name = video.getMoviename();
//			             byte[] thumbnail = video.getThumbnail();
//
//			             // Delete video by ID
//			             boolean deleted = videoService.deletevideoById(id);
//
//			             // Create notification
//			             String heading = name + " Video Deleted!";
//			             Long notifyId = notificationservice.createNotification(username, email, heading, thumbnail);
//
//			             if (notifyId != null) {
//			                 // Notify all admins
//			                 Set<String> notiUserSet = adduserrepository.findAll().stream()
//			                         .map(AddUser::getEmail)
//			                         .collect(Collectors.toSet());
//			                 notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
//			             }
//
//			             if (deleted) {
//			                 return ResponseEntity.ok().body("Video deleted successfully");
//			             } else {
//			                 return ResponseEntity.notFound().build();
//			             }
//			         } else {
//			             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
//			         }
//			     } catch (Exception e) {
//			         e.printStackTrace();
//			         return ResponseEntity.badRequest().build();
//			     }
//			 }
//
//			 
//			 
//			 
//			 
//			 
//			 
//			
//
//			    public ResponseEntity<VideoDescription> getAudioDetail(@PathVariable Long id) {
//			        try {
//			            Optional<VideoDescription> audioDetail = videodescriptionRepository.findById(id);
//			            
//			            
//			            if (audioDetail.isPresent()) {
//			            	System.out.println(audioDetail.get());
//			                return new ResponseEntity<>(audioDetail.get(), HttpStatus.OK);
//			            } else {
//			                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//			            }
//			        } catch (Exception e) {
//			            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//			        }
//			    }
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//
//			 
//    public ResponseEntity<List<String>> getThumbnailsById(@PathVariable Long id) {
//        try {
//            Optional<VideoDescription> audioOptional = videodescriptionRepository.findById(id);
//
//            if (audioOptional.isPresent()) {
//                VideoDescription audio = audioOptional.get();
//
//                // Assuming decompressImage returns the raw thumbnail data
//                byte[] thumbnailData = ImageUtils.decompressImage(audio.getThumbnail());
//
//                // Convert the byte array to Base64
//                String base64Thumbnail = Base64.getEncoder().encodeToString(thumbnailData);
//
//                // Return a list with a single Base64-encoded thumbnail
//                return ResponseEntity.ok(Collections.singletonList(base64Thumbnail));
//            } else {
//                return ResponseEntity.notFound().build();
//            }
//        } catch (Exception e) {
//            e.printStackTrace(); // Log the exception for debugging
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
//
//
//	    public ResponseEntity<List<byte[]>> getAllThumbnaill() {
//	        List<VideoDescription> getAudio = videodescriptionRepository.findAll();
//	        
//	        for (VideoDescription audio : getAudio) {
//	            byte[] images = ImageUtils.decompressImage(audio.getThumbnail());
//	            audio.setThumbnail(images);
//	        }
//
//	        return ResponseEntity.ok()
//	                .contentType(MediaType.APPLICATION_JSON)
//	                .body(getAudio.stream().map(VideoDescription::getThumbnail).collect(Collectors.toList()));
//	    }
//	    
//			
		
}
		
		

