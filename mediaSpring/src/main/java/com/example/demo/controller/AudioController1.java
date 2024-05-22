package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.example.demo.compresser.ImageUtils;
import com.example.demo.fileservice.AudioFileService;
import com.example.demo.model.Addaudio1;
import com.example.demo.repository.AddAudioRepository;
import com.example.demo.repository.AddNewCategoriesRepository;
import com.example.demo.service.AudioService;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3001"})
@RestController
@RequestMapping("/api/v2/")
public class AudioController1 {

	@Autowired
	private  AudioService audioservice;
	
	@Autowired
    private AddAudioRepository audiorepository;
	

	
	@Autowired
    private AddNewCategoriesRepository addnewcategoriesrepository;
	
	@Autowired
    private AudioFileService fileService;
	
	 private final String audioStorageDirectory = "Audio/";
	 private static final String filename="Audio/data.xml";

	 
	 

	@PostMapping("/uploadaudio")
    public ResponseEntity<Addaudio1> uploadAudio(@RequestParam("category") Long categoryId,
    		                                    @RequestParam("audioFile") MultipartFile audioFile,
    		                                    @RequestParam("thumbnail") MultipartFile thumbnail,
    		                                    @RequestParam(value = "paid", required = false) boolean paid)
                                                {
        try {
            // Save audio with file using the service
            Addaudio1 savedAudio = audioservice.saveAudioWithFile(audioFile,thumbnail,categoryId,paid);
            
            return ResponseEntity.ok().body(savedAudio);
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
	
	@GetMapping("/{filename}/file")
    public ResponseEntity<Resource> getAudioFi(@PathVariable String filename) {
        Path filePath = Paths.get(audioStorageDirectory,filename);

        try {
            // Check if the file exists
            if (filePath.toFile().exists() && filePath.toFile().isFile()) {
                // Return the audio file as a resource
                Resource resource = new UrlResource(filePath.toUri());
                if (resource.exists() && resource.isReadable()) {
                    HttpHeaders headers = new HttpHeaders();
                    headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
                    headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
                    return ResponseEntity.ok()
                            .headers(headers)
                            .body(resource);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.notFound().build();
    }
	

 
	@GetMapping("/audio/{id}")
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
	
	
	@GetMapping("/audio/{id}/file")
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

   

    @GetMapping("/audio/list")
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
    
   
    
    
    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> serveAudioFile(@PathVariable String fileName) throws IOException {
        Path filePath = Paths.get(audioStorageDirectory).resolve(fileName);
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE)
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/GetAll")
	public ResponseEntity<List<Addaudio1>> getAllUser() {
	    List<Addaudio1> getUser = audiorepository.findAll();
	    return new ResponseEntity<>(getUser, HttpStatus.OK);
	}
    

    
    @GetMapping("/GetDetail/{id}")
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
    @GetMapping("/{id}/filename")
    public ResponseEntity<String> getAudioFilename(@PathVariable Long id) {
        try {
            String filename = audioservice.getAudioFilename(id);
            return ResponseEntity.ok().body(filename);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    

    
    @GetMapping("/thumbnail/{id}")
    public ResponseEntity<byte[]> getThumbnailImage(@PathVariable Long id) {
        try {
            byte[] thumbnailBytes = audioservice.getThumbnailBytes(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON); // Adjust the media type based on your image format

            // In a real application, you might want to set other headers like Content-Disposition

            return new ResponseEntity<>(thumbnailBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    

    
    @GetMapping("/GetAllThumbnail")
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
    
    @GetMapping("/GetThumbnailsById/{id}")
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


    @DeleteMapping("/audio/{id}")
    public ResponseEntity<String> deleteAudioById(@PathVariable Long id,String fileName) {
        try {
            // Call the service method to delete audio by ID
            boolean deleted = audioservice.deleteAudioById(id);
//            boolean audiodeleted = audioservice.deleteAudioFile(fileName);

            if (deleted) {
                return ResponseEntity.ok().body("Audio deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PatchMapping("/updateaudio/update/{audioId}")
    public ResponseEntity<Addaudio1> updateAudio(		
        @PathVariable Long audioId,
        @RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
        @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
        @RequestParam(value = "category", required = false) Long categoryId)
     {
        try {
            // Check if the audioId is valid
            if (!audioservice.existsById(audioId)) {
            	
            	System.out.println(audioId);
                return ResponseEntity.notFound().build();
                
            }
            // Handle update logic
            Addaudio1 updatedAudio = audioservice.updateAudioWithFile(audioId, audioFile, thumbnail, categoryId);
            System.out.println("updated successfully");
            updatedAudio.getAudioFile();
            return ResponseEntity.ok().body(updatedAudio);
           
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    
}
