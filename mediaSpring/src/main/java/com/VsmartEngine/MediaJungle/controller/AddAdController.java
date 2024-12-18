package com.VsmartEngine.MediaJungle.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.VsmartEngine.MediaJungle.service.AdService;
import com.VsmartEngine.MediaJungle.service.FileStorageService;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class AddAdController {

    @Autowired
    private AdService adService;

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
