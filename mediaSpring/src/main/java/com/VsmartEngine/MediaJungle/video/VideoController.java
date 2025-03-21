package com.VsmartEngine.MediaJungle.video;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.VsmartEngine.MediaJungle.LogManagement;
import com.VsmartEngine.MediaJungle.compresser.ImageUtils;
import com.VsmartEngine.MediaJungle.ffmpeg.FFmpegService;
import com.VsmartEngine.MediaJungle.model.AddAd;
import com.VsmartEngine.MediaJungle.model.AddUser;
import com.VsmartEngine.MediaJungle.model.CastAndCrewModalDTO;
import com.VsmartEngine.MediaJungle.model.CastandCrew;
import com.VsmartEngine.MediaJungle.model.FileModel;
import com.VsmartEngine.MediaJungle.notification.service.NotificationService;
import com.VsmartEngine.MediaJungle.repository.AddAdRepository;
import com.VsmartEngine.MediaJungle.repository.AddNewCategoriesRepository;
import com.VsmartEngine.MediaJungle.repository.AddUserRepository;
import com.VsmartEngine.MediaJungle.repository.CastandcrewRepository;
import com.VsmartEngine.MediaJungle.service.FileService;
import com.VsmartEngine.MediaJungle.service.FileStorageService;
import com.VsmartEngine.MediaJungle.userregister.JwtUtil;
import com.VsmartEngine.MediaJungle.userregister.UserRegister;
import com.VsmartEngine.MediaJungle.userregister.UserRegisterRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.Files;



@Controller
public class VideoController {

	@Value("${project.video}")
	private String path;
	
	@Value("$project.testoutput}")
	private String testoutput;
	
	@Value("${project.videotrailer}")
	private String trailervideoPath;
	
	@Value("${file.upload-dir}")
	private String uploadDir;
	
	@Autowired
	private VideoService videoService;

	@Autowired
    private FileStorageService fileStorageService;
	
	@Autowired
	private FFmpegService ffmpegservice;

	@Autowired
	private FileService fileSevice;
	
	@Autowired VideoImageRepository videoimagerepository;

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
	
	@Autowired
	private CastandcrewRepository castandcrewrepository;
	
	@Autowired
	private AddNewCategoriesRepository addnewcategoriesrepository;
	
	@Autowired
    private AddAdRepository adRepository;

	private static final Logger logger = LoggerFactory.getLogger(VideoController.class);

//	public ResponseEntity<?> uploadVideoDescription(
//	        @RequestParam("videoTitle") String videoTitle,
//	        @RequestParam("mainVideoDuration") String mainVideoDuration,
//	        @RequestParam("trailerDuration") String trailerDuration,
//	        @RequestParam("rating") String rating,
//	        @RequestParam("language") String language,
//	        @RequestParam("certificateNumber") String certificateNumber,
//	        @RequestParam("videoAccessType") boolean videoAccessType,
//	        @RequestParam("description") String description,
//	        @RequestParam("productionCompany") String productionCompany,
//	        @RequestParam("certificateName") String certificateName,
//	        @RequestParam("castandcrewlist") List<Long> castandcrewlist,
//	        @RequestParam("taglist") List<Long> taglist,
//	        @RequestParam("categorylist") List<Long> categorylist,
//	        @RequestParam("videoThumbnail") MultipartFile videoThumbnail,
//	        @RequestParam("trailerThumbnail") MultipartFile trailerThumbnail,
//	        @RequestParam("userBanner") MultipartFile userBanner,
//	        @RequestParam("video") MultipartFile video,
//	        @RequestParam("trailervideo") MultipartFile trailervideo,
//	        @RequestParam("advertisementTimings") List<String> advertisementTimings,
////	        @RequestParam("date") String date, // Add this line to accept the date as a string
//	        @RequestHeader("Authorization") String token) {
//
//	    try {
//	        // Validate token
//	        if (!jwtUtil.validateToken(token)) {
//	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	        }
//	        String email = jwtUtil.getUsernameFromToken(token);
//	        Optional<AddUser> opUser = adduserrepository.findByUsername(email);
//
//	        if (opUser.isPresent()) {
//	            AddUser user = opUser.get();
//	            String username = user.getUsername();
//	            
//	            FileModel upload= fileSevice.uploadVideo(path, video);
//	        	String videoname=upload.getVideoFileName();
//	        	FileModel uploadtrailervideo = fileSevice.uploadTrailerVideo(trailervideoPath,trailervideo);
//	        	String trailervideoname = uploadtrailervideo.getVideotrailerfilename();   
//	        	 // Parse the date string into a LocalDate object
//	            LocalDate parsedDate = LocalDate.now();
//	            
//	            // Create and save VideoDescription
//	            VideoDescription newVideo = new VideoDescription();
//	            newVideo.setVideoTitle(videoTitle);
//	            newVideo.setMainVideoDuration(mainVideoDuration);
//	            newVideo.setTrailerDuration(trailerDuration);
//	            newVideo.setVideoAccessType(videoAccessType);
//	            newVideo.setTaglist(taglist);
//	            newVideo.setRating(rating);
//	            newVideo.setProductionCompany(productionCompany);
//	            newVideo.setDescription(description);
//	            newVideo.setCertificateNumber(certificateNumber);
//	            newVideo.setCertificateName(certificateName);
//	            newVideo.setCategorylist(categorylist);
//	            newVideo.setCastandcrewlist(castandcrewlist);
//	            newVideo.setVidofilename(videoname);
//	            newVideo.setVideotrailerfilename(trailervideoname);
//	            newVideo.setDate(parsedDate);
//	            newVideo.setAdvertisementTimings(advertisementTimings);
//	            newVideo.setLanguage(language);
//	        
//	            // Save and get the generated ID
//	            VideoDescription savedDescription = videodescriptionRepository.save(newVideo);
//	            long videoId = savedDescription.getId(); // Get the generated videoId
//
//	            // Create and save VideoImage
//	            VideoImage videoImage = new VideoImage();
//	            videoImage.setVideoId(videoId);
//	            byte[] videothumbnailBytes = ImageUtils.compressImage(videoThumbnail.getBytes());
//	            videoImage.setVideoThumbnail(videothumbnailBytes);
//	            byte[] trailerthumbnailBytes = ImageUtils.compressImage(trailerThumbnail.getBytes());
//	            videoImage.setTrailerThumbnail(trailerthumbnailBytes);
//	            byte[] userbannerBytes = ImageUtils.compressImage(userBanner.getBytes());
//	            videoImage.setUserBanner(userbannerBytes);
//
//	            // Save the VideoImage entity
//	            videoimagerepository.save(videoImage);
//
//	         // Prepare response map
//	            Map<String, Object> response = new HashMap<>();
//	            response.put("videoDescription", savedDescription);
//	            response.put("videoImage", videoImage);
//	            
//	            
//	            String movieName = savedDescription.getVideoTitle();
//	            String heading = movieName +" New Video Added!";
//	            String Description = savedDescription.getDescription();
//	            String link = "/MoviesPage";
//	            String detail = "Sit back, watch, and enjoy this movie.";
//	            
//	         // Create notification with optional file (thumbnail)
//	            Long notifyId = notificationservice.createNotification(username, email, heading, Description,link,detail,Optional.ofNullable(userBanner));
//	            if (notifyId != null) {
//	                Set<String> notiUserSet = new HashSet<>();
//	                // Fetch all admins from AddUser table
//	                List<AddUser> adminUsers = adduserrepository.findAll();
//	                for (AddUser admin : adminUsers) {
//	                    notiUserSet.add(admin.getEmail());
//	                }
//	                notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
//	                List<UserRegister> Users = userregisterrepository.findAll();
//	                for (UserRegister userss : Users) {
//	                    notiUserSet.add(userss.getEmail());
//	                }
//	                notificationservice.CommoncreateNotificationUser(notifyId, new ArrayList<>(notiUserSet));
//	                
//	            }
//	
//
//	            return ResponseEntity.ok().body(response);
//	        } else {
//	            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//	        }
//	    } catch (IOException e) {
//	        e.printStackTrace();
//	        logger.error("", e);
//	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//	    }
//	}
	
	public ResponseEntity<?> uploadVideoDescription(
            @RequestParam("videoTitle") String videoTitle,
            @RequestParam("mainVideoDuration") String mainVideoDuration,
            @RequestParam("trailerDuration") String trailerDuration,
            @RequestParam("rating") String rating,
            @RequestParam("language") String language,
            @RequestParam("certificateNumber") String certificateNumber,
            @RequestParam("videoAccessType") boolean videoAccessType,
            @RequestParam("description") String description,
            @RequestParam("productionCompany") String productionCompany,
            @RequestParam("certificateName") String certificateName,
            @RequestParam("castandcrewlist") List<Long> castandcrewlist,
            @RequestParam("taglist") List<Long> taglist,
            @RequestParam("categorylist") List<Long> categorylist,
            @RequestParam("videoThumbnail") MultipartFile videoThumbnail,
            @RequestParam("trailerThumbnail") MultipartFile trailerThumbnail,
            @RequestParam("userBanner") MultipartFile userBanner,
            @RequestParam("video") MultipartFile video,
            @RequestParam("trailervideo") MultipartFile trailervideo,
            @RequestParam("advertisementTimings") List<String> advertisementTimings,
            @RequestHeader("Authorization") String token) {

        try {
            // Validate token
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            String email = jwtUtil.getUsernameFromToken(token);
            Optional<AddUser> opUser = adduserrepository.findByUsername(email);

            if (opUser.isPresent()) {
                AddUser user = opUser.get();
                String username = user.getUsername();
                
             // ✅ Generate a unique hash-based folder name
                String hashValue = UUID.randomUUID().toString().replace("-", "");
                Path videoFolder = Paths.get(path, hashValue);
                Path dashFolder = videoFolder.resolve("dash");

                // ✅ Create directories if they don’t exist
                Files.createDirectories(videoFolder);
                Files.createDirectories(dashFolder);

                // Upload the main video and trailer
                FileModel upload = fileSevice.uploadVideo(videoFolder.toString(), video);
                String videoname = upload.getVideoFileName();
                FileModel uploadtrailervideo = fileSevice.uploadTrailerVideo(trailervideoPath, trailervideo);
                String trailervideoname = uploadtrailervideo.getVideotrailerfilename();
                
                System.out.println("videopath "+videoFolder.toString());
                System.out.println("testoutput" + dashFolder.toString());   
                
                try {
                	ffmpegservice.generateDASH(videoFolder.resolve(videoname).toString(), dashFolder.toString());
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}  // Generate DASH files for the uploaded video
                // Create and save VideoDescription
                VideoDescription newVideo = new VideoDescription();
                newVideo.setVideoTitle(videoTitle);
                newVideo.setMainVideoDuration(mainVideoDuration);
                newVideo.setTrailerDuration(trailerDuration);
                newVideo.setVideoAccessType(videoAccessType);
                newVideo.setTaglist(taglist);
                newVideo.setRating(rating);
                newVideo.setProductionCompany(productionCompany);
                newVideo.setDescription(description);
                newVideo.setCertificateNumber(certificateNumber);
                newVideo.setCertificateName(certificateName);
                newVideo.setCategorylist(categorylist);
                newVideo.setCastandcrewlist(castandcrewlist);
                newVideo.setVidofilename(videoname);
                newVideo.setVideotrailerfilename(trailervideoname);
                newVideo.setFoldername(videoFolder.toString());
                newVideo.setDate(LocalDate.now());
                newVideo.setAdvertisementTimings(advertisementTimings);
                newVideo.setLanguage(language);

                // Set the path to the generated DASH manifest file
//                String dashManifestPath = "/videos/output/manifest.mpd";  // Set path to your generated manifest file
//                newVideo.setDashManifestPath(dashManifestPath);

                // Save and get the generated ID
                VideoDescription savedDescription = videodescriptionRepository.save(newVideo);
                long videoId = savedDescription.getId(); // Get the generated videoId

                // Create and save VideoImage (thumbnails)
                VideoImage videoImage = new VideoImage();
                videoImage.setVideoId(videoId);
                byte[] videothumbnailBytes = ImageUtils.compressImage(videoThumbnail.getBytes());
                videoImage.setVideoThumbnail(videothumbnailBytes);
                byte[] trailerthumbnailBytes = ImageUtils.compressImage(trailerThumbnail.getBytes());
                videoImage.setTrailerThumbnail(trailerthumbnailBytes);
                byte[] userbannerBytes = ImageUtils.compressImage(userBanner.getBytes());
                videoImage.setUserBanner(userbannerBytes);

                // Save the VideoImage entity
                videoimagerepository.save(videoImage);

                // Prepare response map
                Map<String, Object> response = new HashMap<>();
                response.put("videoDescription", savedDescription);
                response.put("videoImage", videoImage);

                // Send notification about the new video
                String movieName = savedDescription.getVideoTitle();
                String heading = movieName + " New Video Added!";
                String Description = savedDescription.getDescription();
                String link = "/MoviesPage";
                String detail = "Sit back, watch, and enjoy this movie.";

                // Create notification with optional file (thumbnail)
                Long notifyId = notificationservice.createNotification(username, email, heading, description, link, detail, Optional.ofNullable(userBanner));
                if (notifyId != null) {
                    Set<String> notiUserSet = new HashSet<>();
                    // Fetch all admins from AddUser table
                    List<AddUser> adminUsers = adduserrepository.findAll();
                    for (AddUser admin : adminUsers) {
                        notiUserSet.add(admin.getEmail());
                    }
                    notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
                    List<UserRegister> Users = userregisterrepository.findAll();
                    for (UserRegister userss : Users) {
                        notiUserSet.add(userss.getEmail());
                    }
                    notificationservice.CommoncreateNotificationUser(notifyId, new ArrayList<>(notiUserSet));
                }

                return ResponseEntity.ok().body(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.error("", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
	

	public ResponseEntity<List<VideoDescription>> getAllVideo() {
	    List<VideoDescription> getUser = videodescription.findAll();
	    return new ResponseEntity<>(getUser, HttpStatus.OK);
	}
	

	 public ResponseEntity<VideoDescription> getVideoDetailById(@PathVariable Long id) {
	        try {
	            Optional<VideoDescription> videoDetail = videodescriptionRepository.findById(id);
	            if (videoDetail.isPresent()) {
	            	System.out.println(videoDetail.get());
	                return new ResponseEntity<>(videoDetail.get(), HttpStatus.OK);
	            } else {
	                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	            }
	        } catch (Exception e) {
	        	logger.error("", e);
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	    }
	 

public ResponseEntity<List<Integer>> getVideoAdvertisementTiming(@PathVariable Long id) {
    try {
        // Retrieve the video description from the repository
        Optional<VideoDescription> videoDetail = videodescriptionRepository.findById(id);
        
        // Check if the video exists
        if (videoDetail.isPresent()) {
            // Get advertisement timings as List<String> (e.g., "00:10:00")
            List<String> advertisementTimings = videoDetail.get().getAdvertisementTimings();
            
            // Convert advertisement timings to seconds and collect as a List<Integer>
            List<Integer> adTimingsInSeconds = advertisementTimings.stream()
                .map(this::convertToSeconds) // Convert each time to seconds
                .collect(Collectors.toList());
            
            // Return the advertisement timings in seconds as part of the response
            return new ResponseEntity<>(adTimingsInSeconds, HttpStatus.OK);
        } else {
            // Return 404 if the video is not found
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    } catch (Exception e) {
        // Log the exception (optional)
        e.printStackTrace();
        logger.error("", e);
        // Return 400 if there is any exception
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}

// Helper method to convert "HH:mm:ss" format to total seconds
private int convertToSeconds(String time) {
    String[] parts = time.split(":");
    
    // Parse hours, minutes, and seconds
    int hours = Integer.parseInt(parts[0]);
    int minutes = Integer.parseInt(parts[1]);
    int seconds = Integer.parseInt(parts[2]);
    
    // Convert to total seconds
    return hours * 3600 + minutes * 60 + seconds;
}

	
	
	 public ResponseEntity<?> getVideo(@PathVariable Long id, HttpServletRequest request) {
	 try {

         Optional<VideoDescription> optionalLesson = videodescriptionRepository.findById(id);
         if (!optionalLesson.isPresent()) {
             return ResponseEntity.notFound().build();
         }
         String filename =optionalLesson.get().getVidofilename();
         //-----new-----
         String folder = optionalLesson.get().getFoldername();
         //---end----
         
         if (filename != null) {
//         	Path filePath = Paths.get(path, filename);
        	 Path filePath = Paths.get(folder,filename);
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
 		       logger.error("", e);
 		    }

 		    // Return a 404 Not Found response if the file does not exist
 		    return ResponseEntity.notFound().build();

         } else {
             return ResponseEntity.ok(filename);
         }
     } catch (Exception e) {
         // Log the exception (you can use a proper logging library)
         e.printStackTrace();
         logger.error("", e);
         // Return an internal server error response
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
     }
     
 }
	 

	 
	 public ResponseEntity<Resource> getVideoSegment(@PathVariable Long id, @PathVariable String filename) {
		    try {
		        Optional<VideoDescription> optionalVideo = videodescriptionRepository.findById(id);
		        if (!optionalVideo.isPresent()) {
		            return ResponseEntity.notFound().build();
		        }

		        // Get the folder path from database
		        String folder = optionalVideo.get().getFoldername();
		        Path videoDirectory = Paths.get(folder, "dash").toAbsolutePath().normalize();
		        Path filePath = videoDirectory.resolve(filename).normalize();

		        // Debugging
		        System.out.println("Requested file: " + filePath);

		        // Prevent Path Traversal Attacks
		        if (!filePath.startsWith(videoDirectory)) {
		            System.out.println("Forbidden access attempt: " + filePath);
		            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		        }

		        // Load the file as a resource
		        Resource resource = new UrlResource(filePath.toUri());
		        if (!resource.exists() || !resource.isReadable()) {
		            System.out.println("File not found: " + filePath);
		            return ResponseEntity.notFound().build();
		        }

		        // Determine Content-Type
		        String contentType = Files.probeContentType(filePath);
		        if (contentType == null) {
		            if (filename.endsWith(".mpd")) {
		                contentType = "application/dash+xml"; // MPD files
		            } else if (filename.endsWith(".m4s")) {
		                contentType = "application/octet-stream"; // Video segments
		            } else {
		                contentType = "video/mp4"; // Default for videos
		            }
		        }

		        HttpHeaders headers = new HttpHeaders();
		        headers.add(HttpHeaders.CONTENT_TYPE, contentType);

		        return ResponseEntity.ok().headers(headers).body(resource);
		    } catch (Exception e) {
		        e.printStackTrace();
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		    }
		}

//	 private long videoStartTime = 0; // Track the video start time
//
//	    public ResponseEntity<?> getVideo(@PathVariable Long id, HttpServletRequest request) {
//	        try {
//	            // Fetch video description from the repository
//	            VideoDescription videoDescription = videodescriptionRepository.findById(id)
//	                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Video not found"));
//
//	            String filename = videoDescription.getVidofilename();
//	            List<String> adTimings = videoDescription.getAdvertisementTimings();
//	            System.out.println("Ad timings: " + adTimings);
//	            String mainVideoDuration = videoDescription.getMainVideoDuration();
//	            System.out.println("Main video duration: " + mainVideoDuration);
//
//	            if (filename == null || mainVideoDuration == null) {
//	                return ResponseEntity.badRequest().body("Video metadata is incomplete");
//	            }
//
//	            // Convert main video duration to seconds
//	            long totalDurationInSeconds = convertTimeToSeconds(mainVideoDuration);
//	            long simulatedCurrentTime = calculateSimulatedCurrentTime(totalDurationInSeconds);
//
//	            System.out.println("Simulated Playback Time: " + simulatedCurrentTime);
//
//	            // Path to the main video file
//	            Path videoFilePath = Paths.get(path, filename);
//	            if (!Files.exists(videoFilePath)) {
//	                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video file not found");
//	            }
//
//	            // Check if current playback time matches an advertisement timing
//	            for (String adTime : adTimings) {
//	                long adTimeInSeconds = convertTimeToSeconds(adTime);
//	                long tolerance = 5; // Tolerance of 5 seconds
//	                System.out.println("Ad time in seconds: " + adTimeInSeconds);
//
//	                if (Math.abs(simulatedCurrentTime - adTimeInSeconds) <= tolerance) {
//	                    // Fetch the first ad from the repository
//	                    Optional<AddAd> optionalAd = adRepository.findFirstByOrderByCreatedAtAsc();
//	                    if (optionalAd.isPresent()) {
//	                        AddAd ad = optionalAd.get();
//	                        String adFilename = ad.getVideoFilePath();
//	                        Path adFilePath = Paths.get(uploadDir, adFilename);
//	                        if (Files.exists(adFilePath)) {
//	                            System.out.println("Playing ad video at time: " + simulatedCurrentTime);
//	                            // Play the ad video
//	                            ResponseEntity<?> adResponse = serveVideoChunk(adFilePath, request);
//
//	                            // After the ad finishes, serve the original video from where it stopped
//	                            long resumeTime = simulatedCurrentTime; // Resume from where the ad was triggered
//	                            System.out.println("Resuming original video at time: " + resumeTime);
//	                            return serveVideoChunk(videoFilePath, request);
//	                        } else {
//	                            System.err.println("Ad video file not found: " + adFilePath);
//	                        }
//	                    }
//	                }
//	            }
//
//	            // Serve the main video if no ad is triggered
//	            return serveVideoChunk(videoFilePath, request);
//
//	        } catch (Exception e) {
//	            e.printStackTrace();
//	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
//	        }
//	    }
//
//	    // Helper method to convert time in "HH:mm:ss" format to seconds
//	    private long convertTimeToSeconds(String time) {
//	        String[] parts = time.split(":");
//	        return Integer.parseInt(parts[0]) * 3600 + Integer.parseInt(parts[1]) * 60 + Integer.parseInt(parts[2]);
//	    }
//
//	    // Helper method to calculate simulated playback time
//	    private long calculateSimulatedCurrentTime(long totalDurationInSeconds) {
//	        long currentTimeMillis = System.currentTimeMillis();
//	        long startTimeMillis = getVideoStartTime(); // Retrieve the video start time
//	        long elapsedTimeInSeconds = (currentTimeMillis - startTimeMillis) / 1000;
//
//	        // Simulate playback time based on elapsed time (looping if needed)
//	        return elapsedTimeInSeconds % totalDurationInSeconds;
//	    }
//
//	    // Method to retrieve the video start time
//	    private long getVideoStartTime() {
//	        if (videoStartTime == 0) {
//	            videoStartTime = System.currentTimeMillis(); // Initialize when the video starts
//	        }
//	        return videoStartTime;
//	    }
//
//	    // Serve video chunks for streaming
//	    private ResponseEntity<?> serveVideoChunk(Path filePath, HttpServletRequest request) throws IOException {
//	        String rangeHeader = request.getHeader(HttpHeaders.RANGE);
//	        long fileSize = Files.size(filePath);
//	        HttpHeaders headers = new HttpHeaders();
//
//	        if (rangeHeader != null) {
//	            String[] ranges = rangeHeader.replace("bytes=", "").split("-");
//	            long rangeStart = Long.parseLong(ranges[0]);
//	            long rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;
//	            long contentLength = rangeEnd - rangeStart + 1;
//
//	            try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
//	                file.seek(rangeStart);
//	                byte[] buffer = new byte[(int) contentLength];
//	                file.readFully(buffer);
//
//	                ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);
//	                headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileSize));
//
//	                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
//	                        .headers(headers)
//	                        .contentLength(contentLength)
//	                        .body(byteArrayResource);
//	            }
//	        } else {
//	            return ResponseEntity.ok().body("Range header missing");
//	        }
//	    }
		
	
		
	 
//	 public ResponseEntity<?> getVideo(@PathVariable Long id, HttpServletRequest request) {
//		    try {
//		        Optional<VideoDescription> optionalLesson = videodescriptionRepository.findById(id);
//		        if (!optionalLesson.isPresent()) {
//		            return ResponseEntity.notFound().build();
//		        }
//
//		        VideoDescription videoDescription = optionalLesson.get();
//		        String filename = videoDescription.getVidofilename();
//
//		        if (filename != null) {
//		            Path filePath = Paths.get(path, filename);
//		            System.out.println("filePath: " + filePath);
//
//		            if (filePath.toFile().exists() && filePath.toFile().isFile()) {
//		                Resource videoResource = new UrlResource(filePath.toUri());
//		                if (videoResource.exists() && videoResource.isReadable()) {
//		                    HttpHeaders headers = new HttpHeaders();
//		                    String mimeType = Files.probeContentType(filePath);
//		                    if (mimeType == null) {
//		                        mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
//		                    }
//		                    headers.add(HttpHeaders.CONTENT_TYPE, mimeType);
//		                    headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline");
//
//		                    long fileSize = Files.size(filePath);
//		                    String rangeHeader = request.getHeader(HttpHeaders.RANGE);
//		                    long rangeStart = 0;
//		                    long rangeEnd = Math.min(5 * 1024 * 1024 - 1, fileSize - 1);
//		                    if (rangeHeader != null) {
//		                        String[] ranges = rangeHeader.replace("bytes=", "").split("-");
//		                        rangeStart = Long.parseLong(ranges[0]);
//		                        rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;
//		                    }
//
//		                    long contentLength = rangeEnd - rangeStart + 1;
//		                    long currentTimeSeconds = (rangeStart * videoDurationInSeconds) / fileSize;
//
//		                    // Check for matching advertisement timings
//		                    for (String adTime : videoDescription.getAdvertisementTimings()) {
//		                        long adTimeSeconds = parseTimeToSeconds(adTime);
//		                        if (currentTimeSeconds >= (adTimeSeconds - 30) && currentTimeSeconds <= (adTimeSeconds + 30)) {
//		                            // Serve the advertisement video if current time is within the range
//		                            System.out.println("Serving advertisement at timing: " + adTime);
//
//		                            // Replace with the actual ad file path
//		                            String adFilePath = "path_to_ad_video"; // Update this with your ad video path
//		                            Path adPath = Paths.get(adFilePath);
//		                            if (adPath.toFile().exists()) {
//		                                // Serve the advertisement as a resource
//		                                Resource adResource = fileStorageService.getFile(adPath.toFile().getName());
//		                                headers.setContentLength(Files.size(adPath));
//		                                headers.set(HttpHeaders.CONTENT_TYPE, Files.probeContentType(adPath));
//
//		                                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
//		                                        .headers(headers)
//		                                        .body(adResource);
//		                            }
//		                        }
//		                    }
//
//		                    // Serve the main video content after handling the ad
//		                    try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
//		                        file.seek(rangeStart);
//		                        byte[] buffer = new byte[(int) contentLength];
//		                        file.readFully(buffer);
//
//		                        ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);
//		                        headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileSize));
//		                        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
//		                                .headers(headers)
//		                                .contentLength(contentLength)
//		                                .body(byteArrayResource);
//		                    }
//		                }
//		            }
//		        }
//
//		        return ResponseEntity.notFound().build();
//		    } catch (Exception e) {
//		        e.printStackTrace();
//		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//		    }
//		}
//
//		// Helper method to convert time string to seconds
//		private long parseTimeToSeconds(String time) {
//		    String[] parts = time.split(":");
//		    long hours = Long.parseLong(parts[0]);
//		    long minutes = Long.parseLong(parts[1]);
//		    long seconds = Long.parseLong(parts[2]);
//		    return hours * 3600 + minutes * 60 + seconds;
//		}
//
//		// Helper method to get total video duration in seconds
//		private long getVideoDurationInSeconds(String duration) {
//		    return parseTimeToSeconds(duration);
//		}

		
	 public ResponseEntity<?> getVideotrailer(@PathVariable Long id, HttpServletRequest request) {
		    try {
		    	 Optional<VideoDescription> optionalLesson = videodescriptionRepository.findById(id);
		         if (!optionalLesson.isPresent()) {
		             return ResponseEntity.notFound().build();
		         }
		         String filename =optionalLesson.get().getVideotrailerfilename();
		        if (filename != null) {
		            Path filePath = Paths.get(trailervideoPath, filename);
		            System.out.println("filePath: " + filePath);
		            if (Files.exists(filePath) && Files.isRegularFile(filePath)) {
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

		                    long rangeStart = 0;
		                    long rangeEnd = Math.min(INITIAL_CHUNK_SIZE - 1, fileSize - 1);
		                    if (rangeHeader != null) {
		                        // Handle range request from the client
		                        String[] ranges = rangeHeader.replace("bytes=", "").split("-");
		                        rangeStart = Long.parseLong(ranges[0]);
		                        rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;
		                    }
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
		            } else {
		                System.out.println("File not found or is not a regular file.");
		            }
		            // Return a 404 Not Found response if the file does not exist
		            return ResponseEntity.notFound().build();
		        } else {
		            return ResponseEntity.ok("Filename is null.");
		        }
		    } catch (Exception e) {
		        // Log the exception
		        e.printStackTrace();
		        logger.error("", e);
		        // Return an internal server error response
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		    }
		}
	 
	 
	 public ResponseEntity<?> updateVideoDescription(
	         @PathVariable("videoId") Long videoId,
	         @RequestParam(value = "videoTitle", required = false) String videoTitle,
	         @RequestParam(value = "mainVideoDuration", required = false) String mainVideoDuration,
	         @RequestParam(value = "trailerDuration", required = false) String trailerDuration,
	         @RequestParam(value = "rating", required = false) String rating,
	         @RequestParam(value= "language",required = false) String language,
	         @RequestParam(value = "certificateNumber", required = false) String certificateNumber,
	         @RequestParam(value = "videoAccessType", required = false) Boolean videoAccessType,
	         @RequestParam(value = "description", required = false) String description,
	         @RequestParam(value = "productionCompany", required = false) String productionCompany,
	         @RequestParam(value = "certificateName", required = false) String certificateName,
	         @RequestParam(value = "castandcrewlist", required = false) List<Long> castandcrewlist,
	         @RequestParam(value = "taglist", required = false) List<Long> taglist,
	         @RequestParam(value = "categorylist", required = false) List<Long> categorylist,
	         @RequestParam(value = "videoThumbnail", required = false) MultipartFile videoThumbnail,
	         @RequestParam(value = "trailerThumbnail", required = false) MultipartFile trailerThumbnail,
	         @RequestParam(value = "userBanner", required = false) MultipartFile userBanner,
	         @RequestParam(value = "video", required = false) MultipartFile video,
	         @RequestParam(value = "trailervideo", required = false) MultipartFile trailervideo,
	         @RequestParam(value = "advertisementTimings", required = false) List<String> advertisementTimings,
	         @RequestHeader("Authorization") String token) {

	     try {
	         // Validate token
	         if (!jwtUtil.validateToken(token)) {
	             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	         }
	         String email = jwtUtil.getUsernameFromToken(token);
	         Optional<AddUser> opUser = adduserrepository.findByUsername(email);

	         if (opUser.isPresent()) {
	             AddUser user = opUser.get();

	             // Fetch existing VideoDescription
	             Optional<VideoDescription> optionalVideoDescription = videodescriptionRepository.findById(videoId);
	             if (!optionalVideoDescription.isPresent()) {
	                 return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	             }

	             VideoDescription videoDescription = optionalVideoDescription.get();

	             // Handle video file update
	             if (video != null) {
	                 String existingVideoFileName = videoDescription.getVidofilename();
	                 if (existingVideoFileName != null) {
	                     fileSevice.deleteVideoFile(existingVideoFileName);
	                 }

	                 // Upload new video file
	                 FileModel upload = fileSevice.uploadVideo(path, video);
	                 videoDescription.setVidofilename(upload.getVideoFileName());
	             }

	             // Handle trailer video file update
	             if (trailervideo != null) {
	                 // Delete existing trailer video file if it exists
	                 String existingTrailerFileName = videoDescription.getVideotrailerfilename();
	                 if (existingTrailerFileName != null) {
	                     fileSevice.deletetrailerFile(existingTrailerFileName);
	                 }

	                 // Upload new trailer video file
	                 FileModel uploadtrailervideo = fileSevice.uploadTrailerVideo(trailervideoPath, trailervideo);
	                 videoDescription.setVideotrailerfilename(uploadtrailervideo.getVideotrailerfilename());
	             }

	             // Update VideoDescription fields if provided
	             if (videoTitle != null) videoDescription.setVideoTitle(videoTitle);
	             if (mainVideoDuration != null) videoDescription.setMainVideoDuration(mainVideoDuration);
	             if (trailerDuration != null) videoDescription.setTrailerDuration(trailerDuration);
	             if (rating != null) videoDescription.setRating(rating);
	             if (language != null) videoDescription.setLanguage(language);
	             if (certificateNumber != null) videoDescription.setCertificateNumber(certificateNumber);
	             if (videoAccessType != null) videoDescription.setVideoAccessType(videoAccessType);
	             if (description != null) videoDescription.setDescription(description);
	             if (productionCompany != null) videoDescription.setProductionCompany(productionCompany);
	             if (certificateName != null) videoDescription.setCertificateName(certificateName);
	             if (castandcrewlist != null) videoDescription.setCastandcrewlist(castandcrewlist);
	             if (taglist != null) videoDescription.setTaglist(taglist);
	             if (categorylist != null) videoDescription.setCategorylist(categorylist);
	             if (advertisementTimings != null) videoDescription.setAdvertisementTimings(advertisementTimings);
	             

	             // Save updated VideoDescription
	             VideoDescription updatedVideoDescription = videodescriptionRepository.save(videoDescription);

	             // Fetch existing VideoImage and update if needed
	             Optional<VideoImage> optionalVideoImage = videoimagerepository.findVideoById(videoId);
	             VideoImage videoImage;
	             if (optionalVideoImage.isPresent()) {
	                 videoImage = optionalVideoImage.get();
	             } else {
	                 videoImage = new VideoImage();
	                 videoImage.setVideoId(videoId);
	             }

	             if (videoThumbnail != null) {
	                 byte[] videothumbnailBytes = ImageUtils.compressImage(videoThumbnail.getBytes());
	                 videoImage.setVideoThumbnail(videothumbnailBytes);
	             }
	             if (trailerThumbnail != null) {
	                 byte[] trailerthumbnailBytes = ImageUtils.compressImage(trailerThumbnail.getBytes());
	                 videoImage.setTrailerThumbnail(trailerthumbnailBytes);
	             }
	             if (userBanner != null) {
	                 byte[] userbannerBytes = ImageUtils.compressImage(userBanner.getBytes());
	                 videoImage.setUserBanner(userbannerBytes);
	             }

	             // Save updated VideoImage
	             videoimagerepository.save(videoImage);

	             // Prepare response map
	             Map<String, Object> response = new HashMap<>();
	             response.put("videoDescription", updatedVideoDescription);
	             response.put("videoImage", videoImage);

	             return ResponseEntity.ok().body(response);
	         } else {
	             return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	         }
	     } catch (IOException e) {
	         e.printStackTrace();
	         logger.error("", e);
	         return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	     }
	 }


	 
	 
	    public ResponseEntity<?> deleteVideoDescription(@PathVariable("videoId") Long videoId,
	                                                    @RequestHeader("Authorization") String token) {
	        try {
	            // Validate token
	            if (!jwtUtil.validateToken(token)) {
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	            }
	            String email = jwtUtil.getUsernameFromToken(token);
	            Optional<AddUser> opUser = adduserrepository.findByUsername(email);

	            if (opUser.isPresent()) {
	                AddUser user = opUser.get();

	                // Fetch VideoDescription
	                Optional<VideoDescription> optionalVideoDescription = videodescriptionRepository.findById(videoId);
	                if (!optionalVideoDescription.isPresent()) {
	                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	                }

	                VideoDescription videoDescription = optionalVideoDescription.get();

	                // Delete video file if it exists
	                String videoFileName = videoDescription.getVidofilename();
	                if (videoFileName != null) {
	                    fileSevice.deleteVideoFile(videoFileName);
	                }

	                // Delete trailer video file if it exists
	                String trailerFileName = videoDescription.getVideotrailerfilename();
	                if (trailerFileName != null) {
	                    fileSevice.deletetrailerFile(trailerFileName);
	                }

	                // Delete VideoDescription and VideoImage
	                videodescriptionRepository.deleteById(videoId);
	                videoimagerepository.deleteByVideoId(videoId);

	                // Prepare response
	                return ResponseEntity.ok().build();
	            } else {
	                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	            }
	        } catch (IOException e) {
	            e.printStackTrace();
	            logger.error("", e);
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	        }
	    }
	    
	    
	    public ResponseEntity<?> deleteMultiplevideos(
	            @RequestHeader("Authorization") String token, 
	            @RequestBody List<Long> videoIds
	    ) {
	        try {
	            // Validate the JWT token
	            if (!jwtUtil.validateToken(token)) {
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                        .body("{\"message\": \"Invalid or expired token.\"}");
	            }

	            String email = jwtUtil.getUsernameFromToken(token);
	            Optional<AddUser> opUser = adduserrepository.findByUsername(email);

	            if (opUser.isPresent()) {
	                AddUser user = opUser.get();

	                // Lists to keep track of operation results
	                List<Long> notFoundVideoIds = new ArrayList<>();
	                List<Long> deletedVideoIds = new ArrayList<>();

	                // Process each video ID for deletion
	                for (Long videoId : videoIds) {
	                    Optional<VideoDescription> optionalVideoDescription = videodescriptionRepository.findById(videoId);
	                    if (optionalVideoDescription.isPresent()) {
	                        VideoDescription videoDescription = optionalVideoDescription.get();

	                        // Delete video file if it exists
	                        String videoFileName = videoDescription.getVidofilename();
	                        if (videoFileName != null) {
	                            try {
	                                fileSevice.deleteVideoFile(videoFileName);
	                            } catch (IOException e) {
	                                // Log and continue deleting other videos
	                                e.printStackTrace();
	                                logger.error("", e);
	                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                                        .body("{\"message\": \"Error deleting video file for video ID " + videoId + ".\"}");
	                            }
	                        }

	                        // Delete trailer video file if it exists
	                        String trailerFileName = videoDescription.getVideotrailerfilename();
	                        if (trailerFileName != null) {
	                            try {
	                                fileSevice.deletetrailerFile(trailerFileName);
	                            } catch (IOException e) {
	                                // Log and continue deleting other videos
	                                e.printStackTrace();
	                                logger.error("", e);
	                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                                        .body("{\"message\": \"Error deleting trailer file for video ID " + videoId + ".\"}");
	                            }
	                        }

	                        // Delete VideoDescription and related VideoImage
	                        videodescriptionRepository.deleteById(videoId);
	                        videoimagerepository.deleteByVideoId(videoId);

	                        // Record successful deletion
	                        deletedVideoIds.add(videoId);
	                    } else {
	                        // Record not found video ID
	                        notFoundVideoIds.add(videoId);
	                    }
	                }

	                // Prepare response based on the results
	                if (!notFoundVideoIds.isEmpty()) {
	                    // Partial success: some videos were not found
	                    return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
	                            .body("{\"message\": \"Some videos not found.\", \"deletedVideoIds\": " 
	                                  + deletedVideoIds.toString() + ", \"notFoundVideoIds\": " + notFoundVideoIds.toString() + "}");
	                }

	                // All videos deleted successfully
	                return ResponseEntity.ok("{\"message\": \"Videos deleted successfully.\", \"deletedVideoIds\": " + deletedVideoIds.toString() + "}");
	            } else {
	                // User not found
	                return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                        .body("{\"message\": \"User not authorized.\"}");
	            }
	        } catch (Exception e) {
	            // Handle general exceptions
	            e.printStackTrace();
	            logger.error("", e);
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body("{\"message\": \"An error occurred while deleting videos.\"}");
	        }
	    }
	    

	    
	    public List<Long> getVideoImagesByCategory(@RequestParam Long categoryId) {
	        // Retrieve all videos from the repository
	        List<VideoDescription> videos = videodescriptionRepository.findAll();
	        // Collect video IDs where the category ID is present
	        List<Long> videoIds = new ArrayList<>();
	       
	        for (VideoDescription video : videos) {
	            if (video.getCategorylist().contains(categoryId)) {
	                videoIds.add(video.getId());
	            }
	        }
	        System.out.println(videoIds);
	        return videoIds;
	    }
	    
	    
	    public ResponseEntity<VideoScreenDTO> getVideoScreenDetails(Long videoId, Long categoryId) {
	        // Step 1: Fetch the video by videoId
	        Optional<VideoDescription> videoOpt = videodescriptionRepository.findById(videoId);
	        
	        if (!videoOpt.isPresent()) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Handle case when video is not found
	        }
	        
	        VideoDescription video = videoOpt.get();
	        
	        
	        // Step 2: Fetch the cast and crew details based on castAndCrewList
	        List<Long> castAndCrewIds = video.getCastandcrewlist(); // Assuming this is a list of Long IDs
	        List<CastAndCrewModalDTO> castAndCrewDetails = new ArrayList<>();

	        for (Long castAndCrewId : castAndCrewIds) {
	            Optional<CastandCrew> castAndCrewOpt = castandcrewrepository.findById(castAndCrewId);
	            if (castAndCrewOpt.isPresent()) {
	                CastandCrew castAndCrew = castAndCrewOpt.get();
	                // Map CastAndCrew to CastAndCrewModalDTO
	                CastAndCrewModalDTO castAndCrewDTO = new CastAndCrewModalDTO(
	                    castAndCrew.getId(),
	                    castAndCrew.getName(),
	                    castAndCrew.getDescription()
	                );
	                castAndCrewDetails.add(castAndCrewDTO);
	            }
	        }
	        
	        List<Long> categoryIds = video.getCategorylist(); // Assuming this is a list of Long IDs
	        List<String> categoryValues = addnewcategoriesrepository.findcategoryByIds( categoryIds);
	        
	        // Step 3: Fetch full video descriptions and filter them by categoryId
	        List<VideoDescription> matchingVideos = videodescriptionRepository.findAll()
	                .stream()
	                .filter(v -> v.getCategorylist().contains(categoryId))
	                .collect(Collectors.toList());

	        // Step 4: Build the VideoScreenDTO response
	        VideoScreenDTO videoScreenDTO = new VideoScreenDTO(
	            video.getId(),
	            video.getVideoTitle(),
	            video.getMainVideoDuration(),
	            video.isVideoAccessType(),
	            categoryValues,
	            castAndCrewDetails,
	            video.getDescription(),
	            matchingVideos
	        );
	        // Step 5: Return the VideoScreenDTO with all video and cast/crew details
	        return ResponseEntity.ok(videoScreenDTO);
	    }

	    public ResponseEntity<?> getUserAccess(@RequestParam("userI") Long userId){
	        // Step 1: Fetch the user by userId
	        Optional<UserRegister> userOpt = userregisterrepository.findById(userId);
	        if (!userOpt.isPresent()) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"); // Handle case when user is not found
	        }

	        UserRegister user = userOpt.get();

	        // Step 2: Check if the user has a subscription
	        if (user.getPaymentId() != null && user.getPaymentId().getExpiryDate() != null) {
	            LocalDate expiryDate = user.getPaymentId().getExpiryDate(); // Use directly as LocalDate

	            // Check if expiry date is after the current date
	            if (expiryDate.isAfter(LocalDate.now())) {
	                return ResponseEntity.ok("Access granted"); // Subscription is active
	            }
	        }

	        // If subscription is not active or expired
	        return ResponseEntity.ok("Not Paid");
	    }



	    
//	    public List<VideoDescriptionDTO> getVideoImagesByCategory(@RequestParam String categoryId) {
//	        List<VideoDescriptionDTO> videoThumbnails = new ArrayList<>();
//	       
//	        List<Long> videoIds = videodescriptionRepository.findVideoIdsByCategoryId(categoryId); 
//	        System.out.println(videoIds);
//	        // Retrieve video images by the video IDs
////	        if (!videoIds.isEmpty()) {
////	            List<VideoImage> videoImages = videoimagerepository.findByVideoIdIn(videoIds);
////	            for (VideoImage videoImage : videoImages) {
////	                videoThumbnails.add(new VideoDescriptionDTO(videoImage.getVideoId(), ImageUtils.decompressImage(videoImage.getVideoThumbnail())));
////	            }
////	        }
//	        return videoThumbnails;
//	    }

//	    public List<VideoDescriptionDTO> getVideoImagesByCategory(@RequestParam Long categoryId) {
//	        List<VideoDescriptionDTO> videoThumbnails = new ArrayList<>();
//
//	        // Retrieve video IDs where the category ID is present using the repository query
//	        List<Long> videoIds = videodescriptionRepository.findVideoIdsByCategory(categoryId);
//
//	        // Retrieve video images by the video IDs
//	        if (!videoIds.isEmpty()) {
//	            List<VideoImage> videoImages = videoimagerepository.findByVideoIdIn(videoIds);
//	            for (VideoImage videoImage : videoImages) {
//	                videoThumbnails.add(new VideoDescriptionDTO(videoImage.getVideoId(), 
//	                    ImageUtils.decompressImage(videoImage.getVideoThumbnail())));
//	            }
//	        }
//
//	        return videoThumbnails;
//	    }

	    
	    	
	
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
////			    public ResponseEntity<List<VideoDescription>> videogetall() {
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
		
		

