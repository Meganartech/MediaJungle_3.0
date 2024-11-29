package com.VsmartEngine.MediaJungle.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.model.FooterSettings;
import com.VsmartEngine.MediaJungle.repository.FooterSettingsRepository;

@RestController
@RequestMapping("/api/v2/footer-settings")
@CrossOrigin(origins = "*")
    public class FooterSettingsController {

        @Autowired
        private FooterSettingsRepository repository;

        private final String UPLOAD_DIR = "src/main/resources/static/uploads/";

        @PostMapping("/submit")
        public ResponseEntity<?> submitFooterSettings(
            @RequestParam("aboutUsHeaderScript") String aboutUsHeaderScript,
            @RequestParam("aboutUsBodyScript") String aboutUsBodyScript,
            @RequestParam("featureBox1HeaderScript") String featureBox1HeaderScript,
            @RequestParam("featureBox1BodyScript") String featureBox1BodyScript,
            @RequestParam("featureBox2HeaderScript") String featureBox2HeaderScript,
            @RequestParam("featureBox2BodyScript") String featureBox2BodyScript,
            @RequestParam("aboutUsImage") MultipartFile aboutUsImage,  // Updated to handle aboutUsImage
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
                // Handle file uploads
                String aboutUsImagePath = null;
                String contactUsImagePath = null;

                // Create and save entity
                FooterSettings footerSettings = new FooterSettings();
                footerSettings.setAboutUsHeaderScript(aboutUsHeaderScript);
                footerSettings.setAboutUsBodyScript(aboutUsBodyScript);
                footerSettings.setFeatureBox1HeaderScript(featureBox1HeaderScript);
                footerSettings.setFeatureBox1BodyScript(featureBox1BodyScript);
                footerSettings.setFeatureBox2HeaderScript(featureBox2HeaderScript);
                footerSettings.setFeatureBox2BodyScript(featureBox2BodyScript);
                footerSettings.setAboutUsImage(extractImageBytes(aboutUsImage)); // Save aboutUs image path
                footerSettings.setContactUsEmail(contactUsEmail);
                footerSettings.setContactUsBodyScript(contactUsBodyScript);
                footerSettings.setCallUsPhoneNumber(callUsPhoneNumber);
                footerSettings.setCallUsBodyScript(callUsBodyScript);
                footerSettings.setLocationMapUrl(locationMapUrl);
                footerSettings.setLocationAddress(locationAddress);
                footerSettings.setContactUsImage(extractImageBytes(contactUsImage)); // Save contactUs image path
                footerSettings.setAppUrlPlaystore(appUrlPlaystore);
                footerSettings.setAppUrlAppStore(appUrlAppStore);
                footerSettings.setCopyrightInfo(copyrightInfo);
                
                repository.save(footerSettings);
                
                return ResponseEntity.ok("Form submitted successfully!");
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error submitting the form: " + e.getMessage());
            }
        }

        
        @PostMapping("/update")
        public ResponseEntity<?> updateFooterSettings(
                @RequestParam("id") Long id,  // FooterSettings ID to be updated
                @RequestParam("aboutUsHeaderScript") String aboutUsHeaderScript,
                @RequestParam("aboutUsBodyScript") String aboutUsBodyScript,
                @RequestParam("featureBox1HeaderScript") String featureBox1HeaderScript,
                @RequestParam("featureBox1BodyScript") String featureBox1BodyScript,
                @RequestParam("featureBox2HeaderScript") String featureBox2HeaderScript,
                @RequestParam("featureBox2BodyScript") String featureBox2BodyScript,
                @RequestParam("aboutUsImage") MultipartFile aboutUsImage,
                @RequestParam("contactUsEmail") String contactUsEmail,
                @RequestParam("contactUsBodyScript") String contactUsBodyScript,
                @RequestParam("callUsPhoneNumber") String callUsPhoneNumber,
                @RequestParam("callUsBodyScript") String callUsBodyScript,
                @RequestParam("locationMapUrl") String locationMapUrl,
                @RequestParam("locationAddress") String locationAddress,
                @RequestParam("contactUsImage") MultipartFile contactUsImage,
                @RequestParam("appUrlPlaystore") String appUrlPlaystore,
                @RequestParam("appUrlAppStore") String appUrlAppStore,
                @RequestParam("copyrightInfo") String copyrightInfo) {
            try {
                // Find the existing FooterSettings record by id
                FooterSettings footerSettings = repository.findById(id).orElse(null);
                
                if (footerSettings == null) {
                    return ResponseEntity.status(404).body("FooterSettings not found with id: " + id);
                }

                // Update the fields
                footerSettings.setAboutUsHeaderScript(aboutUsHeaderScript);
                footerSettings.setAboutUsBodyScript(aboutUsBodyScript);
                footerSettings.setFeatureBox1HeaderScript(featureBox1HeaderScript);
                footerSettings.setFeatureBox1BodyScript(featureBox1BodyScript);
                footerSettings.setFeatureBox2HeaderScript(featureBox2HeaderScript);
                footerSettings.setFeatureBox2BodyScript(featureBox2BodyScript);
                footerSettings.setAboutUsImage(extractImageBytes(aboutUsImage)); // Update aboutUs image
                footerSettings.setContactUsEmail(contactUsEmail);
                footerSettings.setContactUsBodyScript(contactUsBodyScript);
                footerSettings.setCallUsPhoneNumber(callUsPhoneNumber);
                footerSettings.setCallUsBodyScript(callUsBodyScript);
                footerSettings.setLocationMapUrl(locationMapUrl);
                footerSettings.setLocationAddress(locationAddress);
                footerSettings.setContactUsImage(extractImageBytes(contactUsImage)); // Update contactUs image
                footerSettings.setAppUrlPlaystore(appUrlPlaystore);
                footerSettings.setAppUrlAppStore(appUrlAppStore);
                footerSettings.setCopyrightInfo(copyrightInfo);

                // Save the updated record to the database
                repository.save(footerSettings);

                return ResponseEntity.ok("FooterSettings updated successfully!");
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error updating the FooterSettings: " + e.getMessage());
            }
        }
        @GetMapping
        public ResponseEntity<?> getFooterSettings() {
            try {
                // Fetch the first footer settings record
                FooterSettings footerSettings = repository.findFirstFooterSettings();
                
                if (footerSettings == null) {
                    return ResponseEntity.status(404).body("No FooterSettings found");
                }

                return ResponseEntity.ok(footerSettings);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error retrieving footer settings: " + e.getMessage());
            }
        }
        private byte[] extractImageBytes(MultipartFile image) throws Exception {
            if (image != null && !image.isEmpty()) {
                System.out.println("File received: " + image.getOriginalFilename() + ", Size: " + image.getSize());
                return image.getBytes(); // Convert the image to a byte array
            }
            return null; // Handle the case where no image is provided
        }


    }

