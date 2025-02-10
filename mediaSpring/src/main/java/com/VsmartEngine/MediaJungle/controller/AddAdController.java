package com.VsmartEngine.MediaJungle.controller;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.Random;

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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.model.AddAd;
import com.VsmartEngine.MediaJungle.repository.AddAdRepository;
import com.VsmartEngine.MediaJungle.service.AdService;
import com.VsmartEngine.MediaJungle.service.FileStorageService;
import com.VsmartEngine.MediaJungle.video.VideoDescription;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class AddAdController {

    @Autowired
    private AdService adService;
    
    @Value("${file.upload-dir}")
	private String uploadDir;
    
    @Autowired
    private AddAdRepository adRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/AddAds")
    public ResponseEntity<?> addAd(
            @RequestParam("adName") String adName,
            @RequestParam(value = "certificateNumber", required = false) String certificateNumber,
            @RequestParam(value = "certificateName", required = false) String certificateName,
            @RequestParam(value = "numberOfViews", required = false) Integer numberOfViews,
            @RequestParam(value = "rollType", required = false) String rollType,
            @RequestParam(value = "videoFile", required = false) MultipartFile videoFile) {
        try {
            String videoFilePath = videoFile != null ? fileStorageService.storeFile(videoFile) : null;

            AddAd ad = new AddAd();
            ad.setAdName(adName);
            ad.setCertificateNumber(certificateNumber);
            ad.setCertificateName(certificateName);
            ad.setViews(numberOfViews);
            ad.setRollType(rollType);
            ad.setVideoFilePath(videoFilePath);

            AddAd savedAd = adService.saveAd(ad);
            return ResponseEntity.ok(savedAd);
        }catch (IOException e) {
            e.printStackTrace(); // or use a logger to log the exception
            return ResponseEntity.status(500).body("Error uploading video: " + e.getMessage());
        }

    }
    
//    @GetMapping("/getadvideo/{id}")
//    public ResponseEntity<?> getAdVideo(@PathVariable Long id, HttpServletRequest request) {
//   	 try {
//
//            Optional<AddAd> optionalLesson = adRepository.findById(id);
//            if (!optionalLesson.isPresent()) {
//                return ResponseEntity.notFound().build();
//            }
//            String filename =optionalLesson.get().getVideoFilePath();
//
//            if (filename != null) {
//            	Path filePath = Paths.get(uploadDir, filename);
//            	System.out.println("filePath"+ filePath);
//    		    try {
//    		        if (filePath.toFile().exists() && filePath.toFile().isFile()) {
//    		            Resource resource = new UrlResource(filePath.toUri());
//    		            if (resource.exists() && resource.isReadable()) {
//    		                HttpHeaders headers = new HttpHeaders();
//
//    		                // Set the Content-Type based on the file's extension
//    		                String mimeType = Files.probeContentType(filePath);
//    		                if (mimeType == null) {
//    		                    mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
//    		                }
//    		                headers.add(HttpHeaders.CONTENT_TYPE, mimeType);
//
//    		                // Set Content-Disposition to "inline" to stream the video inline
//    		                headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline");
//
//    		                // Define the initial chunk size (5 MB)
//    		                final long INITIAL_CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
//    		                long fileSize = Files.size(filePath);
//
//    		                // Get the Range header from the request
//    		                String rangeHeader = request.getHeader(HttpHeaders.RANGE);
//
//    		                if (rangeHeader != null) {
//    		                    // Handle range request from the client
//    		                    String[] ranges = rangeHeader.replace("bytes=", "").split("-");
//    		                    long rangeStart = Long.parseLong(ranges[0]);
//    		                    long rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;
//
//    		                    // Calculate the content length
//    		                    long contentLength = rangeEnd - rangeStart + 1;
//
//    		                    System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);
//    		                    // Create a RandomAccessFile to read the specified range
//    		                    try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
//    		                        file.seek(rangeStart);
//    		                        byte[] buffer = new byte[(int) contentLength];
//    		                        file.readFully(buffer);
//
//    		                        // Create a ByteArrayResource to hold the requested range of bytes
//    		                        ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);
//
//    		                        // Set the Content-Range header
//    		                        headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileSize));
//    		                        System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);
//
//    		                        // Return a 206 Partial Content response
//    		                        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
//    		                                .headers(headers)
//    		                                .contentLength(contentLength)
//    		                                .body(byteArrayResource);
//    		                    }
//    		                } else {
//    		                    // No range header, send the initial 5 MB chunk
//    		                    long rangeStart = 0;
//    		                    long rangeEnd = Math.min(INITIAL_CHUNK_SIZE - 1, fileSize - 1);
//    		                    long contentLength = rangeEnd - rangeStart + 1;
//   		                    System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);
//
//    		                    // Create a RandomAccessFile to read the specified range
//    		                    try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
//    		                        file.seek(rangeStart);
//    		                        byte[] buffer = new byte[(int) contentLength];
//    		                        file.readFully(buffer);
//
//    		                        // Create a ByteArrayResource to hold the requested range of bytes
//    		                        ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);
//
//    		                        // Set the Content-Range header
//    		                        headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileSize));
//
//    		                        // Return a 206 Partial Content response
//    		                        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
//    		                                .headers(headers)
//    		                                .contentLength(contentLength)
//    		                                .body(byteArrayResource);
//    		                    }
//    		                }
//    		            }
//    		        }else {
//
//   		            	System.out.println("file is null");
//    		        }
//    		    } catch (Exception e) {
//    		        // Handle exceptions
//    		        e.printStackTrace();
//    		    }
//
//    		    // Return a 404 Not Found response if the file does not exist
//    		    return ResponseEntity.notFound().build();
//
//            } else {
//                return ResponseEntity.ok(filename);
//            }
//        } catch (Exception e) {
//            // Log the exception (you can use a proper logging library)
//            e.printStackTrace();
//            // Return an internal server error response
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//        
//    }
    
    @GetMapping("/getadvideo")
    public ResponseEntity<?> getAdVideo(HttpServletRequest request) {
        try {
            // Fetch all ads from the repository
            List<AddAd> ads = adRepository.findAll();
            if (ads.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Randomly select an ad for playback, or you can implement sequential selection logic
            AddAd selectedAd = ads.get(new Random().nextInt(ads.size()));

            String filename = selectedAd.getVideoFilePath();
            if (filename != null) {
                Path filePath = Paths.get(uploadDir, filename);
                System.out.println("filePath: " + filePath);

                try {
                    if (filePath.toFile().exists() && filePath.toFile().isFile()) {
                        Resource resource = new UrlResource(filePath.toUri());
                        if (resource.exists() && resource.isReadable()) {
                            HttpHeaders headers = new HttpHeaders();
                            
                            // Set Content-Type based on file's extension
                            String mimeType = Files.probeContentType(filePath);
                            if (mimeType == null) {
                                mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                            }
                            headers.add(HttpHeaders.CONTENT_TYPE, mimeType);

                            // Set Content-Disposition to inline for streaming
                            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline");

                            String rangeHeader = request.getHeader(HttpHeaders.RANGE);
                            long fileSize = Files.size(filePath);

                            if (rangeHeader != null) {
                                // Handle range request from the client
                                String[] ranges = rangeHeader.replace("bytes=", "").split("-");
                                long rangeStart = Long.parseLong(ranges[0]);
                                long rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;

                                long contentLength = rangeEnd - rangeStart + 1;
                                System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);

                                try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
                                    file.seek(rangeStart);
                                    byte[] buffer = new byte[(int) contentLength];
                                    file.readFully(buffer);

                                    // Create ByteArrayResource to hold the requested range of bytes
                                    ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);

                                    // Set Content-Range header for partial content
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
                                long rangeEnd = Math.min(5 * 1024 * 1024 - 1, fileSize - 1); // 5 MB chunk
                                long contentLength = rangeEnd - rangeStart + 1;
                                System.out.println("Range Start: " + rangeStart + ", Range End: " + rangeEnd + ", Content Length: " + contentLength);

                                try (RandomAccessFile file = new RandomAccessFile(filePath.toFile(), "r")) {
                                    file.seek(rangeStart);
                                    byte[] buffer = new byte[(int) contentLength];
                                    file.readFully(buffer);

                                    // Create ByteArrayResource to hold the requested range of bytes
                                    ByteArrayResource byteArrayResource = new ByteArrayResource(buffer);

                                    // Set Content-Range header
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
                        System.out.println("File not found: " + filename);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                // If file does not exist or is not valid
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok("No video file available for this ad.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @GetMapping("/GetAllAds")
    public ResponseEntity<List<AddAd>> getAllAds() {
        return ResponseEntity.ok(adService.getAllAds());
    }
    @GetMapping("/GetAdById/{id}")
    public ResponseEntity<AddAd> getAdById(@PathVariable Long id) {
        AddAd ad = adService.getAdById(id)
                         .orElseThrow(() -> new RuntimeException("Ad not found with ID: " + id));
        return ResponseEntity.ok(ad);
    }


    @PatchMapping("/editAd/{id}")
    public ResponseEntity<?> updateAd(
            @PathVariable Long id,
            @RequestParam(value = "adName", required = false) String adName,
            @RequestParam(value = "certificateNumber", required = false) String certificateNumber,
            @RequestParam(value = "certificateName", required = false) String certificateName,
            @RequestParam(value = "numberOfViews", required = false) Integer numberOfViews,
            @RequestParam(value = "rollType", required = false) String rollType,
            @RequestParam(value = "videoFile", required = false) MultipartFile videoFile) {

        try {
            AddAd ad = adService.getAdById(id).orElseThrow(() -> new RuntimeException("Ad not found with id " + id));

            // Update the fields if they are provided (null checks)
            if (adName != null) ad.setAdName(adName);
            if (certificateNumber != null) ad.setCertificateNumber(certificateNumber);
            if (certificateName != null) ad.setCertificateName(certificateName);
            if (numberOfViews != null) ad.setViews(numberOfViews);
            if (rollType != null) ad.setRollType(rollType);

            // Handle video file upload
            if (videoFile != null) {
                String videoFilePath = fileStorageService.storeFile(videoFile);
                ad.setVideoFilePath(videoFilePath); // Update video file path if new file is uploaded
            }

            AddAd updatedAd = adService.updateAd(id, ad); // Update the ad in the database
            return ResponseEntity.ok(updatedAd);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Ad not found with id " + id);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading video: " + e.getMessage());
        }
    }
    @DeleteMapping("/deleteAd/{id}")
    public ResponseEntity<String> deleteAd(@PathVariable Long id) {
        try {
            adService.deleteAdById(id);
            return ResponseEntity.ok("Ad deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
