package com.VsmartEngine.MediaJungle.video;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.VsmartEngine.MediaJungle.compresser.ImageUtils;

import jakarta.transaction.Transactional;

@Controller
public class VideoImageController {
	
	@Autowired
	private VideoImageRepository videoimagerepository;
	
	
	public ResponseEntity<VideoImage> getThumbnailByVideoId(@PathVariable Long id) {
	    try {
	        Optional<VideoImage> videoOptional = videoimagerepository.findById(id);
	        if (videoOptional.isPresent()) {
	            VideoImage videoImage = videoOptional.get();

	            // Decompress and set the images
	            byte[] videoThumbnailByte = ImageUtils.decompressImage(videoImage.getVideoThumbnail());
	            byte[] trailerThumbnailByte = ImageUtils.decompressImage(videoImage.getTrailerThumbnail());
	            byte[] userBannerByte = ImageUtils.decompressImage(videoImage.getUserBanner());

	            videoImage.setVideoThumbnail(videoThumbnailByte);
	            videoImage.setTrailerThumbnail(trailerThumbnailByte);
	            videoImage.setUserBanner(userBannerByte);

	            return new ResponseEntity<>(videoImage, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}





}
