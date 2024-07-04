package com.example.demo.service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.compresser.ImageUtils;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.CastandCrew;
import com.example.demo.model.UpdateModel;
import com.example.demo.model.VideoDescription;
import com.example.demo.model.Videos;
import com.example.demo.repository.AddVideoDescriptionRepository;
import com.example.demo.repository.CastandcrewRepository;
import com.example.demo.repository.VideoRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class VideoService implements VideoInterface   {
	
	@Autowired
	private VideoRepository videoRepository ;
	
	@Autowired
	private AddVideoDescriptionRepository videodescription ;
	
	@Autowired
	public FileServiceImplementation fileservice;
	
	@Autowired
	private CastandcrewRepository castandcrewrepository;

	@Override
	public Videos createPost(Videos videos) {
		if(videos.getTitle().isEmpty()) {
			throw new ResourceNotFoundException(false,"video is emplty");
		}
		try {
			Videos Video = videoRepository.save(videos);
			videos.setAddedDate(new Date());
//			videos.setVideoName("default.mp4");
			return videoRepository.save(Video);
//		}catch(IllegalArgumentException i) {
//			throw new ResourceNotFound();
		}catch(Exception e) {
			throw new ResourceNotFoundException(false,"some thing is wrong ");
		}
	}

	@Override
	public Videos getVideosById(Integer id) {
	Videos video = this.videoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(false,"Video not found"));
	return video ;
	}

	@Override
	public List<Videos> getAllVideos() {
	List<Videos> listOfVideo  = null ;
	try {
		listOfVideo = this.videoRepository.findAll();
		return listOfVideo ;
	}catch(Exception e) {
		throw new ResourceNotFoundException();
	}
	}

	@Override
	public Videos updatePost(Videos videos, Integer id) {
		Videos video = this.videoRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException(false,"Video not found"));
		
		video.setTitle(videos.getTitle());
		video.setDescription(videos.getDescription());
		video.setTags(videos.getTags());
		video.setAddedDate(new Date());
		Videos updateVideo =this.videoRepository.save(video);
		return updateVideo ;
	}
	
	@Override
	public Videos updatePost1(Videos videos) {
		Integer id=1;
		Videos video = this.videoRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException(false,"Video not found"));
		
		video.setTitle(videos.getTitle());
		video.setDescription(videos.getDescription());
		video.setTags(videos.getTags());
		video.setAddedDate(new Date());
		Videos updateVideo =this.videoRepository.save(video);
		return updateVideo ;
	}
	@Override
	public void deleteVideos(Integer id) {
	Videos video = this.videoRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException());
	this.videoRepository.delete(video);
		
	}

	@Override
	public UpdateModel updateModel(UpdateModel updateModel, int id) {
Videos video = this.videoRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException());
		updateModel.setId(id);
		video.setTitle(updateModel.getTitle());
		video.setDescription(updateModel.getDescription());
		video.setTags(updateModel.getTags());
		video.setAddedDate(new Date());
	this.videoRepository.save(video);
		return updateModel ;
	}
	
	
	public VideoDescription saveVideoDescriptio(String moviename, String description, String tags, String category,
			String certificate, String language, String duration, String year,MultipartFile thumbnail,String name,boolean paid) throws IOException {
        // Save the audio file to the server and get the file path
//        String audioFilePath = fileService.saveAudioFile(audioFile);
        byte[] thumbnailBytes =ImageUtils.compressImage(thumbnail.getBytes());
//        Optional<AddNewCategories> categoryOptional = addnewcategoriesrepository.findById(categoryId);
//        AddNewCategories category = categoryOptional.orElse(new AddNewCategories());
        // Create an AddAudio entity and set other fields
        VideoDescription newaudio = new VideoDescription();
        newaudio.setCategory(category);
        newaudio.setCertificate(certificate);
        newaudio.setDescription(description);
        newaudio.setDuration(duration);
        newaudio.setLanguage(language);
        newaudio.setMoviename(moviename);
        newaudio.setTags(tags);
        newaudio.setYear(year);
        newaudio.setThumbnail(thumbnailBytes);
        newaudio.setName(name);
        newaudio.setPaid(paid);
//        newaudio.setCategory(category);
//        newaudio.setFileName(audioFilePath);
//        newaudio.setThumbnail(thumbnailBytes);
     // Fetch CastandCrew entities based on IDs
//     			List<CastandCrew> castandCrewList = castandcrewlist.stream()
//     			.map(castandCrewId -> castandcrewrepository.findById(castandCrewId).orElse(null))
//     			.filter(castandCrew -> castandCrew != null)
//     			.collect(Collectors.toList());
//     			
//     			newaudio.setCastandcrewlist(castandCrewList);
        // Save the AddAudio entity to the database
        return videodescription.save(newaudio);
    }
	public VideoDescription saveVideoDescriptio(String moviename, String description, String tags, String category,
			String certificate, String language, String duration, String year,boolean paid,long id
			) throws IOException {
        Optional< VideoDescription> optionalAudio = videodescription.findById(id);
       

       if (optionalAudio.isPresent()) {
       	VideoDescription existingAudio = optionalAudio.get();
       	existingAudio.setMoviename(moviename);
       	existingAudio.setCategory(category);
       	existingAudio.setDescription(description);
       	existingAudio.setDuration(duration);
       	existingAudio.setLanguage(language);
       	existingAudio.setCertificate(certificate);
       	existingAudio.setTags(tags);
       	existingAudio.setPaid(paid);
       	
//       	List<CastandCrew> castandCrewList = castandcrewlist.stream()
//     			.map(castandCrewId -> castandcrewrepository.findById(castandCrewId).orElse(null))
//     			.filter(castandCrew -> castandCrew != null)
//     			.collect(Collectors.toList());
//       	existingAudio.setCastandcrewlist(castandCrewList);
       	
//          // Update audio details if needed
//           if (categoryId != null) {
//               Optional<AddNewCategories> categoryOptional = addnewcategoriesrepository.findById(categoryId);
//               AddNewCategories category = categoryOptional.orElseThrow(() -> new EntityNotFoundException("Category with ID " + categoryId + " not found"));
//               existingAudio.setCategory(category);
//           }
//           // Update the audio file if a new file is provided
//           if (audioFile != null && !audioFile.isEmpty()) {
//               String existingFilename = existingAudio.getFileName();
//               String audioFilePath = fileService.updateAudioFile(existingFilename, audioFile);
//               existingAudio.setFileName(audioFilePath);
//           }
//
//           // Update the thumbnail if a new file is provided
//           if (thumbnail != null && !thumbnail.isEmpty()) {
//               byte[] thumbnailBytes = ImageUtils.compressImage(thumbnail.getBytes());
//               existingAudio.setThumbnail(thumbnailBytes);
//           }

           // Save the updated audio entity within a transaction
           videodescription.save(existingAudio);
          System.out.println("video deatail saved successfully");

           return null;
       } else {
           throw new EntityNotFoundException("Audio with ID not found");
       }
   }
	
	
	
	
	public VideoDescription updatevideoWithFile(
//			Long audioId, MultipartFile audioFile, MultipartFile thumbnail, Long categoryId
			) throws IOException {
         Optional< VideoDescription> optionalAudio = videodescription.findById(5l);
        

        if (optionalAudio.isPresent()) {
        	VideoDescription existingAudio = optionalAudio.get();
        	existingAudio.setMoviename("gowtham");;

//           // Update audio details if needed
//            if (categoryId != null) {
//                Optional<AddNewCategories> categoryOptional = addnewcategoriesrepository.findById(categoryId);
//                AddNewCategories category = categoryOptional.orElseThrow(() -> new EntityNotFoundException("Category with ID " + categoryId + " not found"));
//                existingAudio.setCategory(category);
//            }
//            // Update the audio file if a new file is provided
//            if (audioFile != null && !audioFile.isEmpty()) {
//                String existingFilename = existingAudio.getFileName();
//                String audioFilePath = fileService.updateAudioFile(existingFilename, audioFile);
//                existingAudio.setFileName(audioFilePath);
//            }
//
//            // Update the thumbnail if a new file is provided
//            if (thumbnail != null && !thumbnail.isEmpty()) {
//                byte[] thumbnailBytes = ImageUtils.compressImage(thumbnail.getBytes());
//                existingAudio.setThumbnail(thumbnailBytes);
//            }

            // Save the updated audio entity within a transaction
        	videodescription.save(existingAudio);
           System.out.println("video deatail saved successfully");

            return null;
        } else {
            throw new EntityNotFoundException("Audio with ID not found");
        }
    }

	 
    public boolean deletevideoById(Long id) {
        try {
            // Check if the audio exists
            Optional<VideoDescription> optionalAudio = videodescription.findById(id);

            if (optionalAudio.isPresent()) {
            	VideoDescription audio = optionalAudio.get();

                // Delete the audio file
                boolean audioFileDeleted = fileservice.deleteAudioFile(audio.getName());

                // Delete the thumbnail file if applicable

                // Delete the audio record from the database
                videodescription.deleteById(id);
                

                return audioFileDeleted;
            } else {
                return false; // Audio not found
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Delete operation failed
        }
    }
    
    
//    @Transactional
//    public VideoDescription saveVideoDescription(VideoDescription videoDescription) {
//        return videodescription.save(videoDescription);
//    }
//
//    @Transactional
//    public List<CastandCrew> getCrewByIds(List<Long> crewIds) {
//        return castandcrewrepository.findAllById(crewIds);
//    }
//
//	
    
//    public VideoDescription saveVideoDescription(String moviename, String description, String tags,
//            String category, String certificate, String language,
//            String duration, String year, MultipartFile thumbnail,String name,
//            boolean paid, List<Long> castandcrewlist) throws IOException {
//
//			VideoDescription videoDescription = new VideoDescription();
//			videoDescription.setMoviename(moviename);
//			videoDescription.setDescription(description);
//			videoDescription.setTags(tags);
//			videoDescription.setCategory(category);
//			videoDescription.setCertificate(certificate);
//			videoDescription.setLanguage(language);
//			videoDescription.setDuration(duration);
//			videoDescription.setYear(year);
//			videoDescription.setPaid(paid);
//			videoDescription.setName(name);
//
//			// Process thumbnail bytes
//			if (!thumbnail.isEmpty()) {
//			byte[] thumbnailBytes = thumbnail.getBytes();
//			videoDescription.setThumbnail(thumbnailBytes);
//			}
//			
//			// Fetch CastandCrew entities based on IDs
//			List<CastandCrew> castandCrewList = castandcrewlist.stream()
//			.map(castandCrewId -> castandcrewrepository.findById(castandCrewId).orElse(null))
//			.filter(castandCrew -> castandCrew != null)
//			.collect(Collectors.toList());
//			
//			videoDescription.setCastandcrewlist(castandCrewList);
//			// Save the VideoDescription entity
//			return videodescription.save(videoDescription);
//	}
//			    
}

