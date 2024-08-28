package com.VsmartEngine.MediaJungle.video;

import java.util.Base64;
import java.util.Optional;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.VsmartEngine.MediaJungle.compresser.ImageUtils;
import com.VsmartEngine.MediaJungle.model.CastandCrew;

import jakarta.transaction.Transactional;

@Controller
public class VideoImageController {
	
	@Autowired
	private VideoImageRepository videoimagerepository;
	
	
	
//	public ResponseEntity<VideoImage> getThumbnailByVideoId(@PathVariable Long id) {
//	    try {
//	        return videoimagerepository.findById(id)
//	            .map(videoImage -> {
//	                // Decompress and set the images
//	                videoImage.setVideoThumbnail(ImageUtils.decompressImage(videoImage.getVideoThumbnail()));
////	                videoImage.setTrailerThumbnail(ImageUtils.decompressImage(videoImage.getTrailerThumbnail()));
////	                videoImage.setUserBanner(ImageUtils.decompressImage(videoImage.getUserBanner()));
//	                return new ResponseEntity<>(videoImage, HttpStatus.OK);
//	            })
//	            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
//	    } catch (Exception e) {
//	        // Log the exception (optional)
//	        e.printStackTrace();  // Replace with a proper logging mechanism
//	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//	    }
//	}
	
//	public ResponseEntity<VideoImage> getThumbnailByVideoId(@PathVariable Long id) {
//	try {
//        Optional<VideoImage> castDetail = videoimagerepository.findByVideoId(id);
//        if (castDetail.isPresent()) {
//        	// Assuming decompressImage returns the raw thumbnail data
//            return new ResponseEntity<>(castDetail.get(), HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    } catch (Exception e) {
//        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//    }
//	}
	

//	@GetMapping("/videoimage/{id}")
//	public ResponseEntity<List<String>> getThumbnailByVideoId(@PathVariable Long id) {
//	    try {
//	        Optional<VideoImage> videoImage = videoimagerepository.findByVideoId(id);
//	        if (videoImage.isPresent()) {
//	            VideoImage image = videoImage.get();
//	            // Assuming decompressImage returns the raw thumbnail data
//	            byte[] thumbnailData = ImageUtils.decompressImage(image.getVideoThumbnail());
//
//	            // Convert the byte array to Base64
//	            String base64Thumbnail = Base64.getEncoder().encodeToString(thumbnailData);
//
//	         // Return a list with a single Base64-encoded thumbnail
//                return ResponseEntity.ok(Collections.singletonList(base64Thumbnail));
//            } else {
//	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//	        }
//	    } catch (Exception e) {
//	        // Log the exception (optional)
//	        e.printStackTrace();  // Replace with proper logging in production
//	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//	    }
//	}
	
	
	public ResponseEntity<byte[]> getVideoThumbnailByVideoId(@PathVariable Long id) {
	    try {
	        Optional<byte[]> videoThumbnailOptional = videoimagerepository.findVideoThumbnailByVideoId(id);
	        
	        if (videoThumbnailOptional.isPresent()) {
	            byte[] thumbnailBytes = videoThumbnailOptional.get();
	            byte[] decompressedThumbnailBytes = ImageUtils.decompressImage(thumbnailBytes);
	            
	            return ResponseEntity.ok()
	                                 .contentType(MediaType.IMAGE_JPEG) // Or the correct media type
	                                 .body(decompressedThumbnailBytes);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    } catch (Exception e) {
	    	e.printStackTrace();  // Replace with proper logging in production
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}









}
