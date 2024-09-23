package com.VsmartEngine.MediaJungle.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.model.FooterSettings;
import com.VsmartEngine.MediaJungle.repository.FooterSettingsRepository;

@RestController
@RequestMapping("/api/v2/footer-settings")
@CrossOrigin(origins = "http://localhost:3000")
public class FooterSettingsController {

    @Autowired
    private FooterSettingsRepository repository;

    private final String UPLOAD_DIR = "./uploads/";

    @PostMapping("/submit")
    public ResponseEntity<?> submitFooterSettings(
        @RequestParam("aboutUsHeaderScript") String aboutUsHeaderScript,
        @RequestParam("aboutUsBodyScript") String aboutUsBodyScript,
        @RequestParam("featureBox1HeaderScript") String featureBox1HeaderScript,
        @RequestParam("featureBox1BodyScript") String featureBox1BodyScript,
        @RequestParam("contactUsEmail") String contactUsEmail,
        @RequestParam("contactUsBodyScript") String contactUsBodyScript,
        @RequestParam("callUsPhoneNumber") String callUsPhoneNumber,
        @RequestParam("callUsBodyScript") String callUsBodyScript,
        @RequestParam("locationMapUrl") String locationMapUrl,
        @RequestParam("locationAddress") String locationAddress,
        @RequestParam("contactUsImage") MultipartFile contactUsImage,
        @RequestParam("appUrlPlaystore") String appUrlPlaystore,
        @RequestParam("appUrlAppStore") String appUrlAppStore,
        @RequestParam("copyrightInfo") String copyrightInfo
    ) {
        try {
            // Handle file upload
            String imagePath = null;
            if (!contactUsImage.isEmpty()) {
                imagePath = saveImage(contactUsImage);
            }

            // Create and save entity
            FooterSettings footerSettings = new FooterSettings();
            footerSettings.setAboutUsHeaderScript(aboutUsHeaderScript);
            footerSettings.setAboutUsBodyScript(aboutUsBodyScript);
            footerSettings.setFeatureBox1HeaderScript(featureBox1HeaderScript);
            footerSettings.setFeatureBox1BodyScript(featureBox1BodyScript);
            footerSettings.setContactUsEmail(contactUsEmail);
            footerSettings.setContactUsBodyScript(contactUsBodyScript);
            footerSettings.setCallUsPhoneNumber(callUsPhoneNumber);
            footerSettings.setCallUsBodyScript(callUsBodyScript);
            footerSettings.setLocationMapUrl(locationMapUrl);
            footerSettings.setLocationAddress(locationAddress);
            footerSettings.setContactUsImage(imagePath);
            footerSettings.setAppUrlPlaystore(appUrlPlaystore);
            footerSettings.setAppUrlAppStore(appUrlAppStore);
            footerSettings.setCopyrightInfo(copyrightInfo);
            
            repository.save(footerSettings);
            
            return ResponseEntity.ok("Form submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error submitting the form: " + e.getMessage());
        }
    }

    // Save image to disk and return file path
    private String saveImage(MultipartFile image) throws Exception {
        Path imagePath = Paths.get(UPLOAD_DIR + image.getOriginalFilename());
        Files.createDirectories(imagePath.getParent());
        Files.write(imagePath, image.getBytes());
        return imagePath.toString();
    }
}
