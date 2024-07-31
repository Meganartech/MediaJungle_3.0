package com.VsmartEngine.MediaJungle.controller;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.DirectoryStream;
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
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.compresser.ImageUtils;
import com.VsmartEngine.MediaJungle.fileservice.AudioFileService;
import com.VsmartEngine.MediaJungle.model.AddUser;
import com.VsmartEngine.MediaJungle.model.Addaudio1;
import com.VsmartEngine.MediaJungle.notification.service.NotificationService;
import com.VsmartEngine.MediaJungle.repository.AddAudioRepository;
import com.VsmartEngine.MediaJungle.repository.AddNewCategoriesRepository;
import com.VsmartEngine.MediaJungle.repository.AddUserRepository;
import com.VsmartEngine.MediaJungle.service.AudioService;
import com.VsmartEngine.MediaJungle.userregister.JwtUtil;
import com.VsmartEngine.MediaJungle.userregister.UserRegisterRepository;

import jakarta.servlet.http.HttpServletRequest;


@Controller
public class AudioController1 {

	@Autowired
	private  AudioService audioservice;
	
	@Autowired
    private AddAudioRepository audiorepository;
	
    @Autowired
    private NotificationService notificationservice;
	
	@Autowired
    private AddNewCategoriesRepository addnewcategoriesrepository;
	
	@Autowired
    private AudioFileService fileService;
	
	@Autowired
	private JwtUtil jwtUtil; // Autowire JwtUtil
	
	@Autowired
	private AddUserRepository adduserrepository;
	
	 @Autowired
	    private UserRegisterRepository userregisterrepository;

	
	 private final String audioStorageDirectory = "Audio/";
	 private static final String filename="Audio/data.xml";

	 
	 


	 public ResponseEntity<Addaudio1> uploadAudio(@RequestParam("category") Long categoryId,
	                                              @RequestParam("audioFile") MultipartFile audioFile,
	                                              @RequestParam("thumbnail") MultipartFile thumbnail,
	                                              @RequestParam(value = "paid", required = false) boolean paid,
	                                              @RequestHeader("Authorization") String token) {
	     try {
	         if (!jwtUtil.validateToken(token)) {
	             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	         }

	         String email = jwtUtil.getUsernameFromToken(token);
	         System.out.println("email: " + email);
	         Optional<AddUser> opUser = adduserrepository.findByUsername(email);

	         if (opUser.isPresent()) {
	             AddUser user = opUser.get();
	             String username = user.getUsername();

	             // Save audio with file using the service
	             Addaudio1 savedAudio = audioservice.saveAudioWithFile(audioFile, thumbnail, categoryId, paid);
	             Long audioId = savedAudio.getId();
	             String songName = savedAudio.getSongname();
	             String heading = "New Audio Added!";

	             // Create notification with optional file (thumbnail)
	             Long notifyId = notificationservice.createNotification(username, email, heading, Optional.ofNullable(thumbnail));
	             if (notifyId != null) {
	                 Set<String> notiUserSet = new HashSet<>();
	                 // Fetch all admins from AddUser table
	                 List<AddUser> adminUsers = adduserrepository.findAll();
	                 for (AddUser admin : adminUsers) {
	                     notiUserSet.add(admin.getEmail());
	                 }
	                 notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));

	                 
	             }

	             return ResponseEntity.ok().body(savedAudio);
	         } else {
	             return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	         }
	     } catch (IOException e) {
	         e.printStackTrace();
	         return ResponseEntity.badRequest().build();
	     }
	 }


	
//	-------------------------------------------licensefile--------------------------------------------
//	@PostMapping("/uploadfile")
//    public ResponseEntity<Addaudio1> upload(@RequestParam("audioFile") MultipartFile audioFile)
//      {
//        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//		
//        try {
//            // Save audio with file using the service 
//        	 Addaudio1 savedAudio = audioservice.saveFile(audioFile);
//            DocumentBuilder builder = factory.newDocumentBuilder();
//    		
//    		
//			Document document = builder.parse(new File(filename));
//			
//			Element rootElement=document.getDocumentElement();
//			System.out.println("Root Element ="+rootElement.getNodeName());
//			 NodeList personList = rootElement.getElementsByTagName("data");
//	            for (int i = 0; i < personList.getLength(); i++) {
//	                Element person = (Element) personList.item(i);
//	                // Get the <name> element inside each <person> element
//	                Element product = (Element) person.getElementsByTagName("product_name").item(0);
//	                Element company = (Element) person.getElementsByTagName("company_name").item(0);
//	                Element version_name = (Element) person.getElementsByTagName("version").item(0);
//	                Element key_name = (Element) person.getElementsByTagName("key").item(0);
//	                Element type_name = (Element) person.getElementsByTagName("type").item(0);
//	                Element validity_date = (Element) person.getElementsByTagName("validity").item(0);
//	                // Get the text content of the <name> element
//	                String product_name = product.getTextContent();
//	                String company_name = company.getTextContent();
//	                String version = version_name.getTextContent();
//	                String key = key_name.getTextContent();
//	                String type = type_name.getTextContent();
//	                String validity = validity_date.getTextContent();
//	                
//	                audioservice.licensedetails(product_name, company_name, key, validity);
//	                
//	                
//	                System.out.println("product_name:" + product_name+" company_name: "+company_name+" version: "+version+" key: "+key+" type: "+type+" validity: "+validity);
//	            }
//
//               
//	            
//            return ResponseEntity.ok().body(savedAudio);
//        } catch (ParserConfigurationException |SAXException|IOException  e) {
//            e.printStackTrace();
//            return ResponseEntity.badRequest().build();
//        }
//    }
	

	public ResponseEntity<Resource> getAudioFi(@PathVariable String filename, HttpServletRequest request) {
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
	                    final long INITIAL_CHUNK_SIZE = 2 * 1024 * 1024; // 5 MB
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
	

 

	public ResponseEntity<Addaudio1> getAudioById(@PathVariable Long id) {
	    try {
	        // Retrieve audio details by ID using the service
	        Addaudio1 audio = audioservice.getAudioById(id);

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
	
	

	public ResponseEntity<Resource> getAudioFile(@PathVariable String id) throws IOException {
	    Path audioFolder = Paths.get(audioStorageDirectory);
	    Path audioFilePath = audioFolder.resolve(id); // Assumes ID directly corresponds to filename

	    // Check if the file exists
	    if (Files.exists(audioFilePath) && Files.isRegularFile(audioFilePath)) {
	        // Return the audio file as a response
	        Resource resource = new UrlResource(audioFilePath.toUri());
	        if (resource.exists() && resource.isReadable()) {
	            return ResponseEntity.ok()
	                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE)
	                    .body(resource);
	        }
	    }

	    // No matching file found for the given ID or file not readable
	    return ResponseEntity.notFound().build();
	}

   


    public ResponseEntity<List<String>> listAudioFiles() throws IOException {
        Path audioFolder = Paths.get(audioStorageDirectory);

        if (Files.exists(audioFolder) && Files.isDirectory(audioFolder)) {
            try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(audioFolder)) {
                List<String> audioFiles = new ArrayList<>();

                for (Path path : directoryStream) {
                    if (Files.isRegularFile(path)) {
                        audioFiles.add(path.getFileName().toString());
                    }
                }

                return ResponseEntity.ok(audioFiles);
                
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    

    

	public ResponseEntity<List<Addaudio1>> getAllUser() {
	    List<Addaudio1> getUser = audiorepository.findAll();
	    return new ResponseEntity<>(getUser, HttpStatus.OK);
	}
    

    

    public ResponseEntity<Addaudio1> getAudioDetail(@PathVariable Long id) {
        try {
            Optional<Addaudio1> audioDetail = audiorepository.findById(id);
            
            
            if (audioDetail.isPresent()) {
                return new ResponseEntity<>(audioDetail.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    

    public ResponseEntity<String> getAudioFilename(@PathVariable Long id) {
        try {
            String filename = audioservice.getAudioFilename(id);
            return ResponseEntity.ok().body(filename);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
        

    public ResponseEntity<List<byte[]>> getAllThumbnail() {
        List<Addaudio1> getAudio = audiorepository.findAll();
        
        for (Addaudio1 audio : getAudio) {
            byte[] images = ImageUtils.decompressImage(audio.getThumbnail());
            audio.setThumbnail(images);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getAudio.stream().map(Addaudio1::getThumbnail).collect(Collectors.toList()));
    }
    

    public ResponseEntity<List<String>> getThumbnailsById(@PathVariable Long id) {
        try {
            Optional<Addaudio1> audioOptional = audiorepository.findById(id);

            if (audioOptional.isPresent()) {
                Addaudio1 audio = audioOptional.get();

                // Assuming decompressImage returns the raw thumbnail data
                byte[] thumbnailData = ImageUtils.decompressImage(audio.getThumbnail());

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



    public ResponseEntity<Map<String, String>> deleteAudioById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
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

                // Fetch audio details before deletion
                Optional<Addaudio1> optionalAudio = audiorepository.findById(id);
                if (optionalAudio.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Audio not found"));
                }
                Addaudio1 audio = optionalAudio.get();
                byte[] image = audio.getThumbnail();

                // Delete audio by ID
                boolean deleted = audioservice.deleteAudioById(id);
                if (!deleted) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Audio deletion failed"));
                }

                // Create notification if audio is deleted
                String heading = "Audio Deleted!";
                Long notifyId = notificationservice.createNotification(username, email, heading, image);
                if (notifyId != null) {
                    Set<String> notiUserSet = new HashSet<>();
                    // Fetch all admins from AddUser table
                    List<AddUser> adminUsers = adduserrepository.findAll();
                    for (AddUser admin : adminUsers) {
                        notiUserSet.add(admin.getEmail());
                    }
                    notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
                }

                return ResponseEntity.ok(Map.of("message", "Audio deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "User not authorized"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "An error occurred"));
        }
    }


    

    public ResponseEntity<?> updateAudio(		
        @PathVariable Long audioId,
        @RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
        @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
        @RequestParam(value = "category", required = false) Long categoryId,
        @RequestHeader("Authorization") String token)
     {
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

            // Check if the audioId is valid
            if (!audioservice.existsById(audioId)) {
            	
            	System.out.println(audioId);
                return ResponseEntity.notFound().build();
                
            }
            // Handle update logic
            Addaudio1 updatedAudio = audioservice.updateAudioWithFile(audioId, audioFile, thumbnail, categoryId);
            System.out.println("updated successfully");
            updatedAudio.getAudioFile();
            byte[] image = updatedAudio.getThumbnail();
            // Create notification for the user who updated the setting
 	        String heading = "Audio details Updated!";
 	        Long notifyId = notificationservice.createNotification(username, email, heading, image);
             if (notifyId != null) {
                 Set<String> notiUserSet = new HashSet<>();
                 // Fetch all admins from AddUser table
                 List<AddUser> adminUsers = adduserrepository.findAll();
                 for (AddUser admin : adminUsers) {
                     notiUserSet.add(admin.getEmail());
                 }
                 notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
             }
            return ResponseEntity.ok().body(updatedAudio);
           
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    
}
