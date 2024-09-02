package com.VsmartEngine.MediaJungle.fileservice;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile; 

@Service
public class AudioFileService {

    @Value("${upload.audio.directory}")
    private String audioUploadDirectory;

    public String saveAudioFile(MultipartFile audioFile) throws IOException {
        // Generate a unique file name (you can use other strategies)
        String uniqueFileName = System.currentTimeMillis() + "_" + audioFile.getOriginalFilename();

        // Define the file path where the audio file will be stored
        String filePath = Paths.get(audioUploadDirectory).resolve(uniqueFileName).toString();
        String modifiedPath = filePath.replace("Audio\\", "");
        System.out.println(modifiedPath);


        // Save the file to the server
        Files.copy(audioFile.getInputStream(), Path.of(filePath), StandardCopyOption.REPLACE_EXISTING);

        return modifiedPath;   
        
    }
    public String savFile(MultipartFile audioFile) throws IOException {
        // Generate a unique file name (you can use other strategies)
        String uniqueFileName =audioFile.getOriginalFilename();
        System.out.println("audioFile.getOriginalFilename()");
        System.out.println(audioFile.getOriginalFilename());
        
        // Define the file path where the audio file will be stored
        String filePath = Paths.get(audioUploadDirectory).resolve(uniqueFileName).toString();
//        String modifiedPath = filePath.replace("Audio\\", "");
//        System.out.println(modifiedPath);


        // Save the file to the server
        Files.copy(audioFile.getInputStream(), Path.of(filePath), StandardCopyOption.REPLACE_EXISTING);

        return "modifiedPath";   
        
    }
    
    
    public boolean deleteAudioFile(String fileName) {
    	Path filePath = Paths.get(audioUploadDirectory,fileName);
    	
        System.out.println("Deleting file: " + filePath.toString());
        System.out.println("Absolute Path: " + filePath.toAbsolutePath().toString());
        try {
            boolean deleted = Files.deleteIfExists(filePath);

            if (deleted) {
                System.out.println("File deleted successfully");
            } else {
                System.out.println("File does not exist or deletion failed");
            }

            return deleted; // Return the result to the caller
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error occurred while deleting the file");
            return false; // Return false in case of an exception
        }
    }
    
    
    
    

  
    public String updateAudioFile(String existingFileName, MultipartFile newAudioFile) throws IOException {
    	String uniqueFileName = System.currentTimeMillis() + "_" + newAudioFile.getOriginalFilename();
        // Define the file path for the existing audio file
        String existingFilePath = audioUploadDirectory+existingFileName;
        System.out.println(existingFilePath);
        String filePath = Paths.get(audioUploadDirectory).resolve(uniqueFileName).toString();
        String modifiedPath = filePath.replace("Audio\\", "");
        System.out.println("update"+modifiedPath);
        
        

        // Check if the existing file is present
        
        if (Files.exists(Path.of(existingFilePath))) {
            // Save the updated file to the same location with the existing file name
            Files.copy(newAudioFile.getInputStream(), Path.of(filePath), StandardCopyOption.REPLACE_EXISTING);
         // Delete the existing file
          Files.deleteIfExists(Path.of(existingFilePath));
            return modifiedPath;
        } else {
            // Handle the case where the existing file is not present
            throw new FileNotFoundException("Existing file not found: " + existingFileName);    
        }
        
    }
    
    
    
    
    
   
    
    


}

