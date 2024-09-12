package com.VsmartEngine.MediaJungle.video;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.VsmartEngine.MediaJungle.compresser.ImageUtils;

@Controller
public class VideoImageController {
	
	@Autowired
	private VideoImageRepository videoimagerepository;

	public ResponseEntity<Map<String, byte[]>> getVideoImagesByVideoId(@PathVariable Long id) {
	    try {
	        // Fetching the video images from the repository
	        Optional<VideoImage> videoImageOptional = videoimagerepository.findVideoById(id);

	        if (videoImageOptional.isPresent()) {
	            VideoImage videoImage = videoImageOptional.get();

	            // Decompressing the image bytes
	            byte[] decompressedVideoThumbnail = ImageUtils.decompressImage(videoImage.getVideoThumbnail());
	            byte[] decompressedTrailerThumbnail = ImageUtils.decompressImage(videoImage.getTrailerThumbnail());
	            byte[] decompressedUserBanner = ImageUtils.decompressImage(videoImage.getUserBanner());

	            // Prepare a map to hold the decompressed image data
	            Map<String, byte[]> imageMap = new HashMap<>();
	            imageMap.put("videoThumbnail", decompressedVideoThumbnail);
	            imageMap.put("trailerThumbnail", decompressedTrailerThumbnail);
	            imageMap.put("userBanner", decompressedUserBanner);

	            // Return the map as a response
	            return ResponseEntity.ok()
	                                 .contentType(MediaType.APPLICATION_JSON)
	                                 .body(imageMap);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    } catch (Exception e) {
	        e.printStackTrace();  // Replace with proper logging in production
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}


//	    public ResponseEntity<byte[]> getVideoThumbnail(@PathVariable long videoId) {
//	        Optional<byte[]> videoThumbnail = videoimagerepository.findVideoThumbnailByVideoId(videoId);
//	        try {
//	        if (videoThumbnail.isPresent()) {
//	        	byte[] decompressedVideoThumbnail = ImageUtils.decompressImage(videoThumbnail.get());
//	        	// Return the map as a response
//	            return ResponseEntity.ok()
//	                                 .contentType(MediaType.APPLICATION_JSON)
//	                                 .body(decompressedVideoThumbnail);
//	        }  else {
//	            return ResponseEntity.notFound().build();
//	        }
//	    } catch (Exception e) {
//	        e.printStackTrace();  // Replace with proper logging in production
//	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//	    }
//	}
	    
	    public ResponseEntity<Map<String, byte[]>> getVideoThumbnail(@PathVariable long videoId) {
//	        try {
//	            Optional<byte[]> videoThumbnail = videoimagerepository.findVideoThumbnailByVideoId(videoId);
//
//	            if (videoThumbnail.isPresent()) {
//	                // Decompress the image bytes
//	                byte[] decompressedVideoThumbnail = ImageUtils.decompressImage(videoThumbnail.get());
//
//	                // Encode the decompressed image to Base64
//	                String videoThumbnailBase64 = Base64.getEncoder().encodeToString(decompressedVideoThumbnail);
//
//	                Map<String, String> responseMap = new HashMap<>();
//	                responseMap.put("videoThumbnail", videoThumbnailBase64);
//
//	                // Return the map as a response
//	                return ResponseEntity.ok()
//	                                     .contentType(MediaType.APPLICATION_JSON)
//	                                     .body(responseMap);
//	            } else {
//	                return ResponseEntity.notFound().build();
//	            }
//	        } catch (Exception e) {
//	            e.printStackTrace();  // Replace with proper logging in production
//	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//	        }
	    	try {
		        // Fetching the video images from the repository
		        Optional<VideoImage> videoImageOptional = videoimagerepository.findVideoById(videoId);

		        if (videoImageOptional.isPresent()) {
		            VideoImage videoImage = videoImageOptional.get();

		            // Decompressing the image bytes
		            byte[] decompressedVideoThumbnail = ImageUtils.decompressImage(videoImage.getVideoThumbnail());
//		            byte[] decompressedTrailerThumbnail = ImageUtils.decompressImage(videoImage.getTrailerThumbnail());
//		            byte[] decompressedUserBanner = ImageUtils.decompressImage(videoImage.getUserBanner());

		            // Prepare a map to hold the decompressed image data
		            Map<String, byte[]> imageMap = new HashMap<>();
		            imageMap.put("videoThumbnail", decompressedVideoThumbnail);
//		            imageMap.put("trailerThumbnail", decompressedTrailerThumbnail);
//		            imageMap.put("userBanner", decompressedUserBanner);

		            // Return the map as a response
		            return ResponseEntity.ok()
		                                 .contentType(MediaType.APPLICATION_JSON)
		                                 .body(imageMap);
		        } else {
		            return ResponseEntity.notFound().build();
		        }
		    } catch (Exception e) {
		        e.printStackTrace();  // Replace with proper logging in production
		        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		    }

	    }





}
