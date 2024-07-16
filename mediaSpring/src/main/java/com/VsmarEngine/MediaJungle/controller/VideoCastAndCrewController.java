package com.VsmarEngine.MediaJungle.controller;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.VsmarEngine.MediaJungle.compresser.ImageUtils;
import com.VsmarEngine.MediaJungle.model.CastandCrew;
import com.VsmarEngine.MediaJungle.model.VideoCastAndCrew;
import com.VsmarEngine.MediaJungle.model.VideoDescription;
import com.VsmarEngine.MediaJungle.repository.AddVideoDescriptionRepository;
import com.VsmarEngine.MediaJungle.repository.CastandcrewRepository;
import com.VsmarEngine.MediaJungle.repository.VideoCastandCrewRepository;


@Controller

public class VideoCastAndCrewController {
	
	@Autowired
	private VideoCastandCrewRepository videocastandcrewrepository;
	
	@Autowired
	private AddVideoDescriptionRepository videodescriptionRepository;
	
	@Autowired
	private CastandcrewRepository castandcrewrepository;
	


    public ResponseEntity<?> saveVideoCastAndCrew(
            @RequestParam("videoId") long videoId,
            @RequestParam("castAndCrewIds") List<Long> castAndCrewIds) {

        try {
            Optional<VideoDescription> videoDescription = videodescriptionRepository.findById(videoId);

            if (!videoDescription.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            for (Long castAndCrewId : castAndCrewIds) {
                Optional<CastandCrew> castAndCrew = castandcrewrepository.findById(castAndCrewId);

                if (!castAndCrew.isPresent()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                }

                VideoCastAndCrew videoCastAndCrew = new VideoCastAndCrew();
                videoCastAndCrew.setVideoDescription(videoDescription.get());
                videoCastAndCrew.setCastAndCrew(castAndCrew.get());
               


                videocastandcrewrepository.save(videoCastAndCrew);
            }

            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    

    public ResponseEntity<List<VideoCastAndCrew>> getAllPCastvideo() {
        List<VideoCastAndCrew> getcast = videocastandcrewrepository.findAll();

        for (VideoCastAndCrew videoCastAndCrew : getcast) {
            if (videoCastAndCrew.getCastAndCrew().getImage() != null) {
                // Assuming decompressImage returns the raw thumbnail data
                byte[] thumbnailData = ImageUtils.decompressImage(videoCastAndCrew.getCastAndCrew().getImage());

                // Convert the byte array to Base64
                String base64Thumbnail = Base64.getEncoder().encodeToString(thumbnailData);

                // Set the Base64 image string
                videoCastAndCrew.setCastAndCrewImage(base64Thumbnail);
            }
        }

        return new ResponseEntity<>(getcast, HttpStatus.OK);
    }
	

    public ResponseEntity<VideoCastAndCrew> getcastvideoById(@PathVariable Long Id) {
        Optional<VideoCastAndCrew> langOptional = videocastandcrewrepository.findById(Id);
        if (langOptional.isPresent()) {
            VideoCastAndCrew lang = langOptional.get();
            
            // Assuming decompressImage returns the raw thumbnail data
            byte[] thumbnailData = ImageUtils.decompressImage(lang.getCastAndCrew().getImage());

            // Convert the byte array to Base64
            String base64Thumbnail = Base64.getEncoder().encodeToString(thumbnailData);

            // Set the Base64 image string
            lang.setCastAndCrewImage(base64Thumbnail);

            return new ResponseEntity<>(lang, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
	

	    public ResponseEntity<List<VideoCastAndCrew>> getCastVideo(@PathVariable Long videoId) {
	        List<VideoCastAndCrew> castAndCrewList = videocastandcrewrepository.findByVideoDescriptionId(videoId);
	        if (castAndCrewList.isEmpty()) {
	            return ResponseEntity.notFound().build();
	        } else {
	            return ResponseEntity.ok(castAndCrewList);
	        }
	    }
}
