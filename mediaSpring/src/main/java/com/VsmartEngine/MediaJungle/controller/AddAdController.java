package com.VsmartEngine.MediaJungle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.model.AddAd;
import com.VsmartEngine.MediaJungle.service.AdService;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class AddAdController {

    @Autowired
    private AdService adService;

    // Add new Ad
    @PostMapping("/AddAds")
    public ResponseEntity<String> addAd(@RequestParam("adName") String adName,
                                        @RequestParam("certificateNumber") String certificateNumber,
                                        @RequestParam("certificateName") String certificateName,
                                        @RequestParam("numberOfViews") Integer views,
                                        @RequestParam("rollType") String rollType,
                                        @RequestParam("videoFile") MultipartFile videoFile) {
        try {
        	System.out.println("Received ad data: " + adName + ", " + certificateName + ", " + certificateNumber + ", " + rollType + ", " + views);

            AddAd ad = new AddAd();
            ad.setAdName(adName);
            ad.setCertificateNumber(certificateNumber);
            ad.setCertificateName(certificateName);
            ad.setViews(views);
            ad.setRollType(rollType);
            ad.setVideoFile(videoFile.getBytes());

            adService.addAd(ad);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error occurred while inserting Ad");
        }
    }

    // Edit an existing Ad
    @PatchMapping("/editad/{id}")
    public ResponseEntity<String> updateAd(@PathVariable Long id,
                                           @RequestBody AddAd adDetails) {
        try {
            adService.updateAd(id, adDetails);
            return ResponseEntity.ok("Ad details successfully updated");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating ad");
        }
    }
    
    // Get Ad by ID
    @GetMapping("/GetadById/{id}")
    public ResponseEntity<AddAd> getAdById(@PathVariable Long id) {
        try {
            AddAd ad = adService.getAdById(id);
            return ResponseEntity.ok(ad);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }
    }
}
